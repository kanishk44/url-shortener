const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  longUrl: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
  },
  customAlias: {
    type: String,
    unique: true,
    sparse: true,
  },
  topic: {
    type: String,
    enum: ["acquisition", "activation", "retention", null, ""],
    default: null,
    set: (v) => (v === "" ? null : v), // Convert empty string to null
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastAccessed: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("Url", urlSchema);
