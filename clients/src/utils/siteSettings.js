import { useEffect, useState } from "react";

const KEY = "AIVISTA_SITE_SETTINGS";
const GUEST_KEY = "AIVISTA_GUEST_ID";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const defaults = {
  websiteName: "AITECHACADEMY",
  websiteDomain: "aitechacademy.online",
  facebook: "",
  instagram: "",
  twitter: "",
  linkedin: "",
  youtube: "",
  github: "",
  adsenseEnabled: false,
  adsensePublisherId: "",
  adsenseBannerSlot: "",
  adsenseSidebarSlot: "",
  adsenseInfeedSlot: "",
  adsenseInArticleSlot: "",
  adsenseFooterSlot: "",
  adsenseTestMode: false
};

export function getSiteSettings() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

export function saveSiteSettings(settings) {
  const next = { ...defaults, ...settings };
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("site-settings-updated"));
}

export async function loadSiteSettings() {
  try {
    const response = await fetch(`${API_URL}/site-settings`);
    const data = await response.json();
    if (data?.settings) {
      saveSiteSettings(data.settings);
      return data.settings;
    }
  } catch (error) {
    console.error("Unable to load site settings", error);
  }
  return getSiteSettings();
}

export function useSiteSettings() {
  const [settings, setSettings] = useState(getSiteSettings());

  useEffect(() => {
    const refreshSettings = () => setSettings(getSiteSettings());
    window.addEventListener("site-settings-updated", refreshSettings);

    let active = true;
    loadSiteSettings().then((loadedSettings) => {
      if (active && loadedSettings) {
        setSettings((current) => ({ ...current, ...loadedSettings }));
      }
    });

    return () => {
      active = false;
      window.removeEventListener("site-settings-updated", refreshSettings);
    };
  }, []);

  return settings;
}

export function getGuestId() {
  try {
    let guestId = localStorage.getItem(GUEST_KEY);
    if (!guestId) {
      guestId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(GUEST_KEY, guestId);
    }
    return guestId;
  } catch {
    return "anonymous";
  }
}
