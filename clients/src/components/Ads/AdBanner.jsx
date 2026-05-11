import React from "react";
import { useSiteSettings } from "../../utils/siteSettings";
import AdSenseSlot from "./AdSenseSlot";

/**
 * AdBanner - Top/header banner ad component.
 * Uses the adsenseBannerSlot from admin dashboard settings.
 * Supports test mode - shows visible test ad when test mode is ON.
 */
export default function AdBanner({ className = "", fallbackText = "Advertisement" }) {
  const settings = useSiteSettings();
  const slot = settings.adsenseBannerSlot?.trim();
  const enabled = Boolean(settings.adsenseEnabled);
  const testMode = Boolean(settings.adsenseTestMode);

  const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

  // If neither adsense nor test mode is enabled and not in dev, render nothing
  if (!enabled && !testMode && !IS_DEVELOPMENT) {
    return null;
  }

  // If no slot ID and no publisher ID is configured, render nothing
  if (!slot && !settings.adsensePublisherId?.trim()) {
    return null;
  }

  return (
    <div className={`ad-banner ${className}`.trim()}>
      <AdSenseSlot
        slot={slot}
        className="ad-banner-slot"
        fallbackText={fallbackText}
        showFallback
        format="auto"
        minHeight="100px"
      />
    </div>
  );
}
