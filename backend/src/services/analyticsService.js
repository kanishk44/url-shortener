const Analytics = require("../models/Analytics");
const geoip = require("geoip-lite");
const UAParser = require("ua-parser-js");
const crypto = require("crypto");
const Url = require("../models/Url");

class AnalyticsService {
  static generateFingerprint(req) {
    // Create a unique fingerprint based on IP and user agent
    const data = `${req.ip}-${req.headers["user-agent"]}`;
    return crypto.createHash("md5").update(data).digest("hex");
  }

  static async trackVisit({ urlId, req }) {
    try {
      const parser = new UAParser(req.headers["user-agent"]);
      const userAgent = parser.getResult();

      const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.connection.remoteAddress;

      const geo = geoip.lookup(ip);
      const userFingerprint = this.generateFingerprint(req);

      const analytics = new Analytics({
        url: urlId,
        timestamp: new Date(),
        userAgent: req.headers["user-agent"],
        ipAddress: ip,
        country: geo?.country,
        city: geo?.city,
        browser: userAgent.browser.name,
        os: userAgent.os.name,
        device: userAgent.device.type || "desktop",
        referrer: req.headers.referer || req.headers.referrer,
        language: req.headers["accept-language"]?.split(",")[0],
        userFingerprint,
      });

      await analytics.save();
      return analytics;
    } catch (error) {
      console.error("Error tracking visit:", error);
      // Don't throw error to prevent blocking the redirect
      return null;
    }
  }

  static async getUrlAnalytics(urlId) {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // Get all visits
      const visits = await Analytics.find({
        url: urlId,
        timestamp: { $gte: sevenDaysAgo },
      }).sort({ timestamp: -1 });

      // Get unique users count
      const uniqueUsers = await Analytics.distinct("userFingerprint", {
        url: urlId,
        timestamp: { $gte: sevenDaysAgo },
      });

      // Prepare summary data
      const summary = {
        totalClicks: visits.length,
        uniqueUsers: uniqueUsers.length,
        clicksByDate: {},
        osType: {},
        deviceType: {},
      };

      // Process visits for detailed statistics
      const osStats = new Map();
      const deviceStats = new Map();

      visits.forEach((visit) => {
        // Group by date
        const date = visit.timestamp.toISOString().split("T")[0];
        summary.clicksByDate[date] = (summary.clicksByDate[date] || 0) + 1;

        // OS statistics
        if (!osStats.has(visit.os)) {
          osStats.set(visit.os, new Set());
        }
        osStats.get(visit.os).add(visit.userFingerprint);

        // Device statistics
        if (!deviceStats.has(visit.device)) {
          deviceStats.set(visit.device, new Set());
        }
        deviceStats.get(visit.device).add(visit.userFingerprint);
      });

      // Convert OS statistics
      summary.osType = Array.from(osStats.entries()).map(([osName, users]) => ({
        osName,
        uniqueClicks: users.size,
        uniqueUsers: users.size,
      }));

      // Convert device statistics
      summary.deviceType = Array.from(deviceStats.entries()).map(
        ([deviceName, users]) => ({
          deviceName: deviceName || "desktop",
          uniqueClicks: users.size,
          uniqueUsers: users.size,
        })
      );

      // Convert clicksByDate to array format
      summary.clicksByDate = Object.entries(summary.clicksByDate)
        .map(([date, clicks]) => ({ date, clicks }))
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 7); // Keep only last 7 days

      return {
        summary,
        recentVisits: visits.slice(0, 10).map((visit) => ({
          timestamp: visit.timestamp,
          browser: visit.browser,
          os: visit.os,
          device: visit.device,
          country: visit.country,
          city: visit.city,
        })),
      };
    } catch (error) {
      console.error("Error getting analytics:", error);
      throw new Error("Failed to retrieve analytics data");
    }
  }

  static async getTopicAnalytics(topic, userId) {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // Get all URLs for this topic and user
      const urls = await Url.find({ topic, user: userId });
      const urlIds = urls.map((url) => url._id);

      // Get all analytics for these URLs
      const analytics = await Analytics.find({
        url: { $in: urlIds },
        timestamp: { $gte: sevenDaysAgo },
      }).sort({ timestamp: -1 });

      // Get unique users across all URLs
      const uniqueUsers = await Analytics.distinct("userFingerprint", {
        url: { $in: urlIds },
        timestamp: { $gte: sevenDaysAgo },
      });

      // Prepare summary data
      const summary = {
        totalClicks: analytics.length,
        uniqueUsers: uniqueUsers.length,
        clicksByDate: {},
      };

      // Process analytics for clicksByDate
      analytics.forEach((visit) => {
        const date = visit.timestamp.toISOString().split("T")[0];
        summary.clicksByDate[date] = (summary.clicksByDate[date] || 0) + 1;
      });

      // Convert clicksByDate to array format
      summary.clicksByDate = Object.entries(summary.clicksByDate)
        .map(([date, clicks]) => ({ date, clicks }))
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 7);

      // Get per-URL statistics
      const urlStats = await Promise.all(
        urls.map(async (url) => {
          const urlAnalytics = await Analytics.find({
            url: url._id,
            timestamp: { $gte: sevenDaysAgo },
          });

          const urlUniqueUsers = await Analytics.distinct("userFingerprint", {
            url: url._id,
            timestamp: { $gte: sevenDaysAgo },
          });

          return {
            shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
            shortCode: url.shortCode,
            longUrl: url.longUrl,
            totalClicks: urlAnalytics.length,
            uniqueUsers: urlUniqueUsers.length,
            createdAt: url.createdAt,
          };
        })
      );

      return {
        topic,
        summary,
        urls: urlStats,
      };
    } catch (error) {
      console.error("Error getting topic analytics:", error);
      throw new Error("Failed to retrieve topic analytics");
    }
  }

  static async getOverallAnalytics(userId) {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // Get all URLs created by the user
      const urls = await Url.find({ user: userId });
      const urlIds = urls.map((url) => url._id);

      // Get all analytics for these URLs
      const analytics = await Analytics.find({
        url: { $in: urlIds },
        timestamp: { $gte: sevenDaysAgo },
      }).sort({ timestamp: -1 });

      // Get unique users across all URLs
      const uniqueUsers = await Analytics.distinct("userFingerprint", {
        url: { $in: urlIds },
        timestamp: { $gte: sevenDaysAgo },
      });

      // Prepare summary data
      const summary = {
        totalUrls: urls.length,
        totalClicks: analytics.length,
        uniqueUsers: uniqueUsers.length,
        clicksByDate: {},
        osType: {},
        deviceType: {},
      };

      // Process visits for detailed statistics
      const osStats = new Map();
      const deviceStats = new Map();

      analytics.forEach((visit) => {
        // Group by date
        const date = visit.timestamp.toISOString().split("T")[0];
        summary.clicksByDate[date] = (summary.clicksByDate[date] || 0) + 1;

        // OS statistics
        if (!osStats.has(visit.os)) {
          osStats.set(visit.os, new Set());
        }
        osStats.get(visit.os).add(visit.userFingerprint);

        // Device statistics
        if (!deviceStats.has(visit.device)) {
          deviceStats.set(visit.device, new Set());
        }
        deviceStats.get(visit.device).add(visit.userFingerprint);
      });

      // Convert OS statistics
      summary.osType = Array.from(osStats.entries()).map(([osName, users]) => ({
        osName,
        uniqueClicks: users.size,
        uniqueUsers: users.size,
      }));

      // Convert device statistics
      summary.deviceType = Array.from(deviceStats.entries()).map(
        ([deviceName, users]) => ({
          deviceName: deviceName || "desktop",
          uniqueClicks: users.size,
          uniqueUsers: users.size,
        })
      );

      // Convert clicksByDate to array format
      summary.clicksByDate = Object.entries(summary.clicksByDate)
        .map(([date, clicks]) => ({ date, clicks }))
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 7); // Keep only last 7 days

      return summary;
    } catch (error) {
      console.error("Error getting overall analytics:", error);
      throw new Error("Failed to retrieve overall analytics");
    }
  }
}

module.exports = AnalyticsService;
