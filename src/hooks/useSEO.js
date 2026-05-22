import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const DEFAULT_GLOBAL = {
  siteUrl: '',
  siteName: 'AFKAR LAND',
  defaultOgImage: '',
  googleSiteVerification: '',
  googleAnalyticsId: '',
  googleTagManagerId: '',
  trackingProvider: 'ga',
  enableIndexing: true,
};

const DEFAULT_PAGE = {
  metaTitle: 'AFKAR LAND - Developer Properti Syariah',
  metaDescription: 'AFKAR LAND menghadirkan properti syariah modern, aman, transparan, dan profesional untuk keluarga Indonesia.',
  keywords: 'AFKAR LAND, properti syariah, rumah syariah, developer properti',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  canonical: '',
  robots: 'index, follow',
};

const ROUTE_TO_PAGE = [
  { match: pathname => pathname === '/', key: 'home' },
  { match: pathname => pathname === '/tentang-kami', key: 'tentang' },
  { match: pathname => pathname === '/proyek', key: 'proyek' },
  { match: pathname => pathname.startsWith('/proyek/'), key: 'proyekDetail' },
  { match: pathname => pathname === '/artikel', key: 'artikel' },
  { match: pathname => pathname.startsWith('/artikel/'), key: 'artikelDetail' },
  { match: pathname => pathname === '/karir', key: 'karir' },
  { match: pathname => pathname === '/kontak', key: 'kontak' },
  { match: pathname => pathname === '/faq', key: 'faq' },
];

function resolvePageKey(pathname) {
  return ROUTE_TO_PAGE.find(route => route.match(pathname))?.key || 'home';
}

function upsertMeta(selector, attrs) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attrs).forEach(([key, value]) => {
    if (value !== undefined && value !== null) element.setAttribute(key, value);
  });
}

function upsertLink(rel, href) {
  if (!href) return;
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

function normalizeSiteUrl(siteUrl) {
  return (siteUrl || '').replace(/\/$/, '');
}

function buildAbsoluteUrl(siteUrl, pathname) {
  const baseUrl = normalizeSiteUrl(siteUrl);
  return baseUrl ? `${baseUrl}${pathname}` : window.location.href;
}

function buildPageTrackingData(pathname, title, canonical) {
  return {
    page_path: pathname,
    page_title: title,
    page_location: canonical,
  };
}

function installGoogleAnalytics(measurementId, pageData) {
  const safeId = (measurementId || '').trim().replace(/[^A-Za-z0-9_-]/g, '');
  if (!safeId) return;
  window.__afkarTrackingProvider = 'ga';

  if (window.__afkarGaId === safeId) {
    window.gtag?.('config', safeId, pageData);
    return;
  }

  document.querySelectorAll('[data-afkar-ga]').forEach(node => node.remove());

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(safeId)}`;
  script.dataset.afkarGa = 'true';
  document.head.appendChild(script);

  const inline = document.createElement('script');
  inline.dataset.afkarGa = 'true';
  inline.text = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${safeId}', ${JSON.stringify(pageData)});
`;
  document.head.appendChild(inline);
  window.__afkarGaId = safeId;
}

function removeGoogleAnalytics() {
  document.querySelectorAll('[data-afkar-ga]').forEach(node => node.remove());
  window.__afkarGaId = '';
  window.gtag = undefined;
}

function pushGoogleTagManagerPageView(containerId, pageData) {
  const safeId = (containerId || '').trim().replace(/[^A-Za-z0-9_-]/g, '');
  if (!safeId) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'afkar_page_view',
    page_path: pageData.page_path,
    page_title: pageData.page_title,
    page_location: pageData.page_location,
  });
}

function installGoogleTagManager(containerId, pageData) {
  const safeId = (containerId || '').trim().replace(/[^A-Za-z0-9_-]/g, '');
  if (!safeId) return;
  window.__afkarTrackingProvider = 'gtm';

  if (window.__afkarGtmId === safeId) {
    pushGoogleTagManagerPageView(safeId, pageData);
    return;
  }

  document.querySelectorAll('[data-afkar-gtm]').forEach(node => node.remove());

  const script = document.createElement('script');
  script.dataset.afkarGtm = 'true';
  script.text = `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${safeId}');
`;
  document.head.appendChild(script);
  window.__afkarGtmId = safeId;
  pushGoogleTagManagerPageView(safeId, pageData);
}

function removeGoogleTagManager() {
  document.querySelectorAll('[data-afkar-gtm]').forEach(node => node.remove());
  window.__afkarGtmId = '';
}

function applySEO(config, pathname) {
  const global = { ...DEFAULT_GLOBAL, ...(config.global || {}) };
  const trackingProvider = global.trackingProvider === 'gtm' ? 'gtm' : 'ga';
  const pageKey = resolvePageKey(pathname);
  const page = { ...DEFAULT_PAGE, ...(config[pageKey] || {}) };

  const title = page.metaTitle || DEFAULT_PAGE.metaTitle;
  const description = page.metaDescription || DEFAULT_PAGE.metaDescription;
  const canonical = page.canonical || buildAbsoluteUrl(global.siteUrl, pathname);
  const ogTitle = page.ogTitle || title;
  const ogDescription = page.ogDescription || description;
  const ogImage = page.ogImage || global.defaultOgImage;
  const robots = global.enableIndexing ? page.robots : 'noindex, nofollow';

  document.title = title;
  const pageTrackingData = buildPageTrackingData(pathname, title, canonical);
  upsertMeta('meta[name="description"]', { name: 'description', content: description });
  upsertMeta('meta[name="keywords"]', { name: 'keywords', content: page.keywords || DEFAULT_PAGE.keywords });
  upsertMeta('meta[name="robots"]', { name: 'robots', content: robots });
  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
  upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: global.siteName || DEFAULT_GLOBAL.siteName });
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: ogTitle });
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: ogDescription });
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
  upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: ogImage ? 'summary_large_image' : 'summary' });
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: ogTitle });
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: ogDescription });
  if (ogImage) {
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: ogImage });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: ogImage });
  }
  if (global.googleSiteVerification) {
    upsertMeta('meta[name="google-site-verification"]', {
      name: 'google-site-verification',
      content: global.googleSiteVerification,
    });
  }
  upsertLink('canonical', canonical);
  if (trackingProvider === 'gtm') {
    removeGoogleAnalytics();
    installGoogleTagManager(global.googleTagManagerId, pageTrackingData);
  } else {
    removeGoogleTagManager();
    installGoogleAnalytics(global.googleAnalyticsId, pageTrackingData);
  }
}

export function useSEO() {
  const location = useLocation();

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'seo_settings', 'pages'),
      (snap) => applySEO(snap.exists() ? snap.data() : {}, location.pathname),
      () => applySEO({}, location.pathname)
    );

    return () => unsub();
  }, [location.pathname]);
}
