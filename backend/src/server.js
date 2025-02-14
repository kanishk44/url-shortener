const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();
require("./config/passport");

const authRoutes = require("./routes/auth");
const urlRoutes = require("./routes/url");
const UrlService = require("./services/urlService");
const AnalyticsService = require("./services/analyticsService");

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["set-cookie"],
  })
);

app.use(express.json());
app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "lax",
      path: "/",
    },
    proxy: true,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/api/url", urlRoutes);

// Handle redirect at root level
app.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await UrlService.getUrlByShortCode(shortCode);

    // Track the visit asynchronously
    AnalyticsService.trackVisit({
      urlId: url._id,
      req,
    });

    res.redirect(url.longUrl);
  } catch (error) {
    console.error("Error in URL redirect:", error);
    res.status(404).json({ error: "URL not found" });
  }
});

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
