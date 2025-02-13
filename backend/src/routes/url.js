const express = require("express");
const router = express.Router();
const UrlService = require("../services/urlService");
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

// Update the redirect route
router.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await UrlService.getUrlByShortCode(shortCode);
    res.redirect(url.longUrl);
  } catch (error) {
    console.error("Error in URL redirect:", error); // Add error logging
    res.status(404).json({ error: "URL not found" });
  }
});

module.exports = router;
