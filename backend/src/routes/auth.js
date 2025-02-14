const express = require("express");
const passport = require("passport");
const router = express.Router();

// Google OAuth routes
router.get(
  "/google",
  (req, res, next) => {
    req.session.returnTo = req.headers.referer;
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: true,
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    const returnTo = req.session.returnTo || "http://localhost:5173/callback";
    delete req.session.returnTo;
    res.redirect(returnTo);
  }
);

// Check authentication status
router.get("/status", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      isAuthenticated: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        displayName: req.user.displayName,
        profilePicture: req.user.profilePicture,
      },
    });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

// Auth check endpoint
router.get("/check", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      authenticated: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        displayName: req.user.displayName,
      },
    });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

module.exports = router;
