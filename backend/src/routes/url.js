const express = require("express");
const router = express.Router();
const UrlService = require("../services/urlService");
const AnalyticsService = require("../services/analyticsService");
const { shortenLimiter } = require("../middleware/rateLimiter");
const { isAuthenticated } = require("../middleware/auth");

// Create short URL
router.post("/shorten", isAuthenticated, shortenLimiter, async (req, res) => {
  try {
    const { longUrl, customAlias, topic } = req.body;

    // Add validation
    if (!longUrl) {
      return res.status(400).json({ error: "Long URL is required" });
    }

    // Log for debugging
    console.log("Request body:", req.body);
    console.log("User:", req.user);

    const url = await UrlService.createShortUrl({
      longUrl,
      customAlias,
      topic,
      userId: req.user._id,
    });

    const shortUrl = `${process.env.BASE_URL}/${url.shortCode}`;

    res.json({
      shortUrl,
      shortCode: url.shortCode,
      longUrl: url.longUrl,
      topic: url.topic,
      createdAt: url.createdAt,
    });
  } catch (error) {
    console.error("Error in URL shortening:", error); // Add error logging
    if (
      error.message === "Invalid URL format" ||
      error.message === "Custom alias already in use"
    ) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Error creating short URL" });
  }
});

// Get analytics for a URL
router.get("/:shortCode/analytics", isAuthenticated, async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await UrlService.getUrlByShortCode(shortCode);

    // Check if user owns the URL
    if (url.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized access to analytics" });
    }

    const analytics = await AnalyticsService.getUrlAnalytics(url._id);
    res.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// Get analytics for a specific topic
router.get("/topic/:topic/analytics", isAuthenticated, async (req, res) => {
  try {
    const { topic } = req.params;
    const userId = req.user._id;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const analytics = await AnalyticsService.getTopicAnalytics(topic, userId);
    res.json(analytics);
  } catch (error) {
    console.error("Error fetching topic analytics:", error);
    res.status(500).json({ error: "Failed to fetch topic analytics" });
  }
});

// Get overall analytics
router.get("/overall/analytics", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    const analytics = await AnalyticsService.getOverallAnalytics(userId);
    res.json(analytics);
  } catch (error) {
    console.error("Error fetching overall analytics:", error);
    res.status(500).json({ error: "Failed to fetch overall analytics" });
  }
});

// Get user's URLs
router.get("/user/urls", isAuthenticated, async (req, res) => {
  try {
    const urls = await UrlService.getUserUrls(req.user._id);
    res.json(urls);
  } catch (error) {
    console.error("Error fetching user URLs:", error);
    res.status(500).json({ error: "Failed to fetch URLs" });
  }
});

module.exports = router;
