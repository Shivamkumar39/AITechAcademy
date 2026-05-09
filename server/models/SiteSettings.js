const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    websiteName: { type: String, trim: true, default: "AITECHACADEMY" },
    websiteDomain: { type: String, trim: true, default: "aitechacademy.online" },
    facebook: { type: String, trim: true, default: "" },
    instagram: { type: String, trim: true, default: "" },
    twitter: { type: String, trim: true, default: "" },
    linkedin: { type: String, trim: true, default: "" },
    youtube: { type: String, trim: true, default: "" },
    github: { type: String, trim: true, default: "" },
    adsenseEnabled: { type: Boolean, default: false },
    adsensePublisherId: { type: String, trim: true, default: "" },
    adsenseBannerSlot: { type: String, trim: true, default: "" },
    adsenseSidebarSlot: { type: String, trim: true, default: "" },
    adsenseInfeedSlot: { type: String, trim: true, default: "" },
    adsenseInArticleSlot: { type: String, trim: true, default: "" },
    adsenseFooterSlot: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);
