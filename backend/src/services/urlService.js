const crypto = require("crypto");
const Url = require("../models/Url");

class UrlService {
  static generateShortCode(length = 6) {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString("hex")
      .slice(0, length);
  }

  static async createShortUrl({ longUrl, customAlias, topic, userId }) {
    try {
      // Validate URL
      const urlObject = new URL(longUrl);
      if (!urlObject.protocol.includes("http")) {
        throw new Error("Invalid URL format");
      }

      // Check if custom alias is available
      if (customAlias) {
        const existingUrl = await Url.findOne({ customAlias });
        if (existingUrl) {
          throw new Error("Custom alias already in use");
        }
      }

      // Generate short code if no custom alias
      const shortCode = customAlias || this.generateShortCode();

      // Create new URL document
      const url = new Url({
        longUrl,
        shortCode,
        customAlias,
        topic,
        user: userId,
      });

      await url.save();
      return url;
    } catch (error) {
      console.error("Error in createShortUrl:", error);
      if (
        error.message === "Invalid URL format" ||
        error.message === "Custom alias already in use"
      ) {
        throw error;
      }
      throw new Error(`Error creating short URL: ${error.message}`);
    }
  }

  static async getUrlByShortCode(shortCode) {
    const url = await Url.findOne({
      $or: [{ shortCode }, { customAlias: shortCode }],
    });

    if (!url) {
      throw new Error("URL not found");
    }

    // Update click count and last accessed
    url.clicks += 1;
    url.lastAccessed = new Date();
    await url.save();

    return url;
  }

  static async getUserUrls(userId) {
    try {
      const urls = await Url.find({ user: userId })
        .sort({ createdAt: -1 })
        .lean();

      return urls.map((url) => ({
        shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
        shortCode: url.shortCode,
        longUrl: url.longUrl,
        topic: url.topic,
        createdAt: url.createdAt,
        clicks: url.clicks,
      }));
    } catch (error) {
      console.error("Error fetching user URLs:", error);
      throw new Error("Failed to fetch user URLs");
    }
  }
}

module.exports = UrlService;
