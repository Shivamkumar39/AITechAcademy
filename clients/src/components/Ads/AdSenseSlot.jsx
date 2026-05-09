import React, { useEffect, useState } from "react";
import { useSiteSettings } from "../../utils/siteSettings";
import "./AdSenseSlot.css";

export default function AdSenseSlot({ slot = "", className = "", fallbackText = "Ad Slot", showFallback = false }) {
  const settings = useSiteSettings();
  const enabled = Boolean(settings.adsenseEnabled);
  const clientId = settings.adsensePublisherId?.trim();
  const slotId = slot?.trim();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled || !clientId || !slotId) {
      setLoading(false);
      return;
    }

    const existingScript = Array.from(document.scripts).find((script) =>
      script.src.includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js")
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
      script.addEventListener("load", () => {
        try {
          window.adsbygoogle = window.adsbygoogle || [];
          window.adsbygoogle.push({});
        } catch {}
      });
    } else {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      } catch {}
    }

    const loader = window.setTimeout(() => setLoading(false), 1300);
    return () => window.clearTimeout(loader);
  }, [enabled, clientId, slotId]);

  if (!enabled || !clientId || !slotId) {
    return showFallback ? <div className={`adsense-slot-fallback ${className}`}>{fallbackText}</div> : null;
  }

  return (
    <div className={`adsense-slot-wrapper ${className}`}>
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
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
