export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
  landing_time?: string;
}

const UTM_STORAGE_KEY = "cosmos_utm_tracking";

export function captureUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const existing = getStoredUtmParams();

    const utmSource = urlParams.get("utm_source");
    const utmMedium = urlParams.get("utm_medium");
    const utmCampaign = urlParams.get("utm_campaign");
    const utmTerm = urlParams.get("utm_term");
    const utmContent = urlParams.get("utm_content");

    if (utmSource || utmMedium || utmCampaign) {
      const newUtm: UtmParams = {
        utm_source: utmSource || undefined,
        utm_medium: utmMedium || undefined,
        utm_campaign: utmCampaign || undefined,
        utm_term: utmTerm || undefined,
        utm_content: utmContent || undefined,
        referrer: document.referrer || "direct",
        landing_time: new Date().toISOString(),
      };
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(newUtm));
      return newUtm;
    }

    return existing;
  } catch (e) {
    return {};
  }
}

export function getStoredUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    return {};
  }
}

