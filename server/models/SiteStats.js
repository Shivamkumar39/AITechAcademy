const mongoose = require("mongoose");

const siteStatsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    totalVisits: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteStats", siteStatsSchema);
