import React, { useEffect, useState, useRef } from "react";
import { getSiteSettings } from "../../utils/siteSettings";
import "./AdSenseSlot.css";

/**
 * Google's official web AdSense test publisher ID and slot.
 * In development mode, these are used so you can verify ad placements
 * without needing real AdSense approval.
 *
 * NOTE: Google does NOT provide official "test" ad unit IDs for web AdSense
 * the way they do for AdMob (mobile apps). For web, the correct approach is:
 * - Use `data-adtest="on"` attribute on the <ins> tag
 * - This tells Google to serve non-billable test ads
 * - Test ads only show on domains registered in your AdSense account
 *
 * On localhost, real Google ads will NOT load at all (Google blocks them).
 * So in development mode, we show clearly labeled test placeholders instead.
 */
const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

export default function AdSenseSlot({
  slot = "",
  className = "",
  fallbackText = "Ad Slot",
  showFallback = false,
  format = "auto",
  layout = "",
  layoutKey = "",
}) {
  const settings = getSiteSettings();
  const enabled = Boolean(settings.adsenseEnabled);
  const testMode = Boolean(settings.adsenseTestMode);
  const clientId = settings.adsensePublisherId?.trim();
  const slotId = slot?.trim();
  const [loading, setLoading] = useState(true);
  const adRef = useRef(null);
  const pushAttempted = useRef(false);

  // Determine if we should show test placeholders
  // Show test placeholders when:
  // 1. Test mode is explicitly enabled in admin dashboard, OR
  // 2. Running in development environment (localhost)
  // We check this regardless of the "enabled" flag so Test Mode works forcefully!
  const shouldShowTestAd = testMode || IS_DEVELOPMENT;

  // Only load real Google ads in production with test mode OFF
  const shouldLoadRealAds = enabled && !testMode && !IS_DEVELOPMENT && clientId && slotId;

  useEffect(() => {
    // If showing test ads, no need to load Google script
    if (shouldShowTestAd) {
      setLoading(false);
      return;
    }

    if (!shouldLoadRealAds) {
      setLoading(false);
      return;
    }

    // Prevent duplicate pushes
    if (pushAttempted.current) {
      setLoading(false);
      return;
    }

    const existingScript = Array.from(document.scripts).find((script) =>
      script.src.includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js")
    );

    const pushAd = () => {
      if (pushAttempted.current) return;
      pushAttempted.current = true;
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      } catch (e) {
        console.warn("AdSense push failed:", e);
      }
    };

    if (!existingScript) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
      script.addEventListener("load", pushAd);
      script.addEventListener("error", () => {
        console.warn("AdSense script failed to load");
        setLoading(false);
      });
    } else {
      setTimeout(pushAd, 150);
    }

    const loader = window.setTimeout(() => setLoading(false), 2500);
    return () => window.clearTimeout(loader);
  }, [shouldShowTestAd, shouldLoadRealAds, clientId, slotId]);

  // If neither are enabled and not dev, show fallback or nothing
  if (!enabled && !testMode && !IS_DEVELOPMENT) {
    return showFallback ? (
      <div className={`adsense-slot-fallback ${className}`}>{fallbackText}</div>
    ) : null;
  }

  // === TEST MODE or DEVELOPMENT: Show visible custom placeholder ===
  // This prevents the blank white box issue on localhost!
  if (shouldShowTestAd) {
    const envLabel = IS_DEVELOPMENT ? "Development Mode" : "Test Mode (Admin)";
    return (
      <div className={`adsense-test-ad ${className}`}>
        <div className="adsense-test-ad-inner">
          <div className="adsense-test-ad-badge">TEST AD</div>
          <div className="adsense-test-ad-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 3v18" />
            </svg>
          </div>
          <div className="adsense-test-ad-label">
            Google AdSense Placeholder
          </div>
          <div className="adsense-test-ad-info">
            {slotId ? (
              <>Slot ID: <code>{slotId}</code></>
            ) : (
              <span style={{ color: "#c0392b" }}>⚠ No slot ID configured</span>
            )}
          </div>
          <div className="adsense-test-ad-meta">
            {clientId ? (
              <>Publisher: <code>{clientId}</code></>
            ) : (
              <span style={{ color: "#c0392b" }}>⚠ No publisher ID configured</span>
            )}
          </div>
          <div className="adsense-test-ad-env">
            {envLabel}
          </div>
          <div className="adsense-test-ad-hint">
            {IS_DEVELOPMENT ? (
              <>
                Running on <strong>localhost</strong>. Google blocks real ads here.
                <br />This beautiful placeholder prevents ugly white blank boxes!
              </>
            ) : (
              <>
                <strong>Test Mode</strong> is ON in Admin Dashboard.
                <br />Disable it to load real Google AdSense ads on production.
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // === PRODUCTION: No valid IDs configured ===
  if (!clientId || !slotId) {
    return showFallback ? (
      <div className={`adsense-slot-fallback ${className}`}>Ad IDs Missing</div>
    ) : null;
  }

  // === PRODUCTION MODE: Load real Google AdSense ad ===
  return (
    <div className={`adsense-slot-wrapper ${className}`} ref={adRef}>
      {loading && (
        <div className="adsense-slot-skeleton" aria-hidden="true">
          <div className="adsense-slot-skeleton-top"></div>
          <div className="adsense-slot-skeleton-line"></div>
          <div className="adsense-slot-skeleton-line short"></div>
        </div>
      )}
      <ins
        className="adsbygoogle adsense-slot-ins"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
        {...(layout ? { "data-ad-layout": layout } : {})}
        {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
      />
    </div>
  );
}
