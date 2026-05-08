const KEY = "AIVISTA_SITE_SETTINGS";

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
  adsenseFooterSlot: ""
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
