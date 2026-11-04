/**
 * Affiliate tracking for YGIA Shopify referrals — Christos Solonos.
 *
 * Links tag every click so Kostas can see the sale came from this promo site.
 * Purchase emails must be set up ON Shopify (see kostas-email-setup.html).
 */
window.YGIA_AFFILIATE = {
  id: "christos-solonos",
  name: "Christos Solonos",
  // Ask Kostas to create this discount code in Shopify → Discounts.
  // When set (e.g. "CHRISTOS"), it auto-applies and proves the sale is yours.
  discountCode: "",
  source: "christos-solonos",
  medium: "affiliate",
  campaign: "ygia-promo-site",
};

window.ygiaAffiliateUrl = function ygiaAffiliateUrl(rawUrl, content) {
  const cfg = window.YGIA_AFFILIATE || {};
  try {
    const url = new URL(rawUrl, window.location.href);
    if (!/(^|\.)ygianaturalhealth\.com$/i.test(url.hostname)) {
      return rawUrl;
    }
    url.searchParams.set("ref", cfg.id || "christos-solonos");
    url.searchParams.set("ref_name", cfg.name || "Christos Solonos");
    url.searchParams.set("utm_source", cfg.source || "christos-solonos");
    url.searchParams.set("utm_medium", cfg.medium || "affiliate");
    url.searchParams.set("utm_campaign", cfg.campaign || "ygia-promo-site");
    url.searchParams.set("utm_term", "christos-solonos");
    if (content) url.searchParams.set("utm_content", String(content).slice(0, 64));
    if (cfg.discountCode) url.searchParams.set("discount", cfg.discountCode);
    return url.toString();
  } catch {
    return rawUrl;
  }
};

window.ygiaLogClick = function ygiaLogClick(payload) {
  try {
    const key = "ygia_affiliate_clicks";
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    list.unshift({
      at: new Date().toISOString(),
      affiliate: (window.YGIA_AFFILIATE && window.YGIA_AFFILIATE.name) || "Christos Solonos",
      ...payload,
    });
    localStorage.setItem(key, JSON.stringify(list.slice(0, 500)));
  } catch {
    /* ignore private mode */
  }
};
