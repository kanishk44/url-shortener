const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  url: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Url",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  userAgent: String,
  ipAddress: String,
  country: String,
  city: String,
  browser: String,
  os: String,
  device: String,
  referrer: String,
  language: String,
  userFingerprint: {
    type: String,
    required: true,
  },
});

analyticsSchema.index({ url: 1, userFingerprint: 1 });

module.exports = mongoose.model("Analytics", analyticsSchema);
