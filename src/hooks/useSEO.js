import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { selectLatestProject } from '../utils/projectData';

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

const SEO_CACHE_KEY = 'afkar_seo_settings_v1';

function readCachedSEO() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(SEO_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeCachedSEO(config) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SEO_CACHE_KEY, JSON.stringify(config || {}));
  } catch {
    // Cache is only used to avoid stale SEO on first paint.
  }
}

const ROUTE_TO_PAGE = [
  { match: pathname => pathname === '/', key: 'home' },
  { match: pathname => pathname === '/tentang-kami', key: 'tentang' },
  { match: pathname => pathname === '/proyek', key: 'proyek' },
  { match: pathname => pathname.startsWith('/proyek/'), key: 'proyekDetail' },
  { match: pathname => pathname === '/layanan', key: 'layanan' },
  { match: pathname => pathname === '/galeri', key: 'galeri' },
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

function removeHeadElement(selector) {
  document.head.querySelectorAll(selector).forEach(element => element.remove());
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

function buildAbsoluteAssetUrl(siteUrl, url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  const baseUrl = normalizeSiteUrl(siteUrl);
  return baseUrl ? `${baseUrl}${url.startsWith('/') ? url : `/${url}`}` : url;
}

function compactText(value = '', max = 160) {
  return String(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
    .trim();
}

function timestampToIso(value) {
  if (!value) return '';
  if (typeof value.toDate === 'function') return value.toDate().toISOString();
  if (typeof value.seconds === 'number') return new Date(value.seconds * 1000).toISOString();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}

function getSlugFromPath(pathname, prefix) {
  if (!pathname.startsWith(prefix)) return '';
  return decodeURIComponent(pathname.slice(prefix.length).split('/')[0] || '');
}

function interpolateTemplate(value, tokens) {
  if (!value) return '';
  return String(value).replace(/\{(\w+)\}/g, (_, key) => tokens[key] ?? '');
}

function mergePageSEO(basePage, dynamicPage, tokens, configuredPage = {}) {
  if (!dynamicPage) return basePage;
  const merged = { ...basePage };

  Object.entries(dynamicPage).forEach(([key, value]) => {
    const baseValue = basePage[key];
    const configuredValue = configuredPage[key];
    if (typeof baseValue === 'string' && baseValue.includes('{')) {
      merged[key] = interpolateTemplate(baseValue, tokens) || value;
    } else if (!configuredValue || ['schema', 'ogType'].includes(key)) {
      merged[key] = value || baseValue;
    }
  });

  merged.robots = configuredPage.robots || dynamicPage.robots || basePage.robots;
  merged.schema = dynamicPage.schema;
  merged.ogType = dynamicPage.ogType;
  return merged;
}

function buildProjectSEO(project, global, pathname) {
  if (!project) {
    return {
      page: { robots: 'noindex, nofollow' },
      tokens: {},
    };
  }

  const title = `${project.name} - Proyek Properti Syariah AFKAR LAND`;
  const description = compactText(
    project.desc || project.about || project.tagline || `${project.name} adalah proyek properti syariah AFKAR LAND di ${project.location || project.city || 'Indonesia'}.`,
    160
  );
  const canonical = buildAbsoluteUrl(global.siteUrl, `/proyek/${project.slug || getSlugFromPath(pathname, '/proyek/')}`);
  const image = buildAbsoluteAssetUrl(global.siteUrl, project.image || project.gallery?.[0] || global.defaultOgImage);
  const keywords = [
    project.name,
    project.location,
    project.city,
    project.area,
    'properti syariah',
    'rumah syariah',
    'AFKAR LAND',
  ].filter(Boolean).join(', ');

  return {
    page: {
      metaTitle: title,
      metaDescription: description,
      keywords,
      ogTitle: project.name,
      ogDescription: description,
      ogImage: image,
      canonical,
      robots: 'index, follow',
      ogType: 'product',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: project.name,
        description,
        image: image || undefined,
        url: canonical,
        brand: {
          '@type': 'Brand',
          name: global.siteName || DEFAULT_GLOBAL.siteName,
        },
        category: 'Properti Syariah',
        areaServed: project.location || project.city || undefined,
        dateModified: timestampToIso(project.updatedAt || project.createdAt) || undefined,
      },
    },
    tokens: {
      title: project.name || '',
      name: project.name || '',
      project: project.name || '',
      location: project.location || project.city || '',
      category: 'Proyek',
      description,
      siteName: global.siteName || DEFAULT_GLOBAL.siteName,
    },
  };
}

function buildArticleSEO(article, global, pathname) {
  if (!article) {
    return {
      page: { robots: 'noindex, nofollow' },
      tokens: {},
    };
  }

  const title = `${article.judul} - Artikel AFKAR LAND`;
  const description = compactText(article.ringkasan || article.excerpt || article.konten || article.judul, 160);
  const canonical = buildAbsoluteUrl(global.siteUrl, `/artikel/${article.slug || getSlugFromPath(pathname, '/artikel/')}`);
  const image = buildAbsoluteAssetUrl(global.siteUrl, article.thumbnail || article.image || global.defaultOgImage);
  const isPublished = String(article.status || '').toLowerCase() === 'published';

  return {
    page: {
      metaTitle: title,
      metaDescription: description,
      keywords: [article.judul, article.kategori, 'artikel properti syariah', 'AFKAR LAND'].filter(Boolean).join(', '),
      ogTitle: article.judul,
      ogDescription: description,
      ogImage: image,
      canonical,
      robots: isPublished ? 'index, follow' : 'noindex, nofollow',
      ogType: 'article',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.judul,
        description,
        image: image || undefined,
        url: canonical,
        articleSection: article.kategori || undefined,
        datePublished: timestampToIso(article.createdAt) || undefined,
        dateModified: timestampToIso(article.updatedAt || article.createdAt) || undefined,
        author: {
          '@type': 'Organization',
          name: global.siteName || DEFAULT_GLOBAL.siteName,
        },
        publisher: {
          '@type': 'Organization',
          name: global.siteName || DEFAULT_GLOBAL.siteName,
        },
      },
    },
    tokens: {
      title: article.judul || '',
      name: article.judul || '',
      article: article.judul || '',
      category: article.kategori || 'Artikel',
      description,
      siteName: global.siteName || DEFAULT_GLOBAL.siteName,
    },
  };
}

function resolveDynamicSEO(dynamicContent, global, pathname) {
  if (pathname.startsWith('/proyek/')) {
    if (!Object.prototype.hasOwnProperty.call(dynamicContent, 'project')) return { page: null, tokens: {} };
    return buildProjectSEO(dynamicContent.project, global, pathname);
  }
  if (pathname.startsWith('/artikel/')) {
    if (!Object.prototype.hasOwnProperty.call(dynamicContent, 'article')) return { page: null, tokens: {} };
    return buildArticleSEO(dynamicContent.article, global, pathname);
  }
  return { page: null, tokens: {} };
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

function applySEO(config, pathname, dynamicContent = {}) {
  const global = { ...DEFAULT_GLOBAL, ...(config.global || {}) };
  const trackingProvider = global.trackingProvider === 'gtm' ? 'gtm' : 'ga';
  const pageKey = resolvePageKey(pathname);
  const rawConfiguredPage = config[pageKey] || {};
  const configuredPage = { ...DEFAULT_PAGE, ...rawConfiguredPage };
  const dynamicSEO = resolveDynamicSEO(dynamicContent, global, pathname);
  const page = mergePageSEO(configuredPage, dynamicSEO.page, dynamicSEO.tokens, rawConfiguredPage);

  const title = page.metaTitle || DEFAULT_PAGE.metaTitle;
  const description = page.metaDescription || DEFAULT_PAGE.metaDescription;
  const canonical = page.canonical || buildAbsoluteUrl(global.siteUrl, pathname);
  const ogTitle = page.ogTitle || title;
  const ogDescription = page.ogDescription || description;
  const ogImage = buildAbsoluteAssetUrl(global.siteUrl, page.ogImage || global.defaultOgImage);
  const robots = global.enableIndexing ? page.robots : 'noindex, nofollow';

  document.title = title;
  const pageTrackingData = buildPageTrackingData(pathname, title, canonical);
  upsertMeta('meta[name="description"]', { name: 'description', content: description });
  upsertMeta('meta[name="keywords"]', { name: 'keywords', content: page.keywords || DEFAULT_PAGE.keywords });
  upsertMeta('meta[name="robots"]', { name: 'robots', content: robots });
  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: page.ogType || 'website' });
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
  } else {
    removeHeadElement('meta[property="og:image"], meta[name="twitter:image"]');
  }
  if (global.googleSiteVerification) {
    upsertMeta('meta[name="google-site-verification"]', {
      name: 'google-site-verification',
      content: global.googleSiteVerification,
    });
  } else {
    removeHeadElement('meta[name="google-site-verification"]');
  }
  upsertLink('canonical', canonical);
  removeHeadElement('script[type="application/ld+json"][data-afkar-seo-schema]');
  if (page.schema) {
    const schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.dataset.afkarSeoSchema = 'true';
    schema.textContent = JSON.stringify(page.schema);
    document.head.appendChild(schema);
  }
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
  const [seoConfig, setSeoConfig] = useState(() => readCachedSEO());
  const [dynamicContent, setDynamicContent] = useState({});

  useEffect(() => {
    let unsub = () => {};
    let mounted = true;

    Promise.all([
      import('../config/firebaseConfig'),
      import('firebase/firestore'),
    ]).then(([{ db }, { doc, onSnapshot }]) => {
      if (!mounted) return;
      unsub = onSnapshot(
        doc(db, 'seo_settings', 'pages'),
        (snap) => {
          const nextConfig = snap.exists() ? snap.data() : {};
          setSeoConfig(nextConfig);
          writeCachedSEO(nextConfig);
        },
        () => setSeoConfig(readCachedSEO())
      );
    }).catch(() => {
      if (mounted) setSeoConfig(readCachedSEO());
    });

    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  useEffect(() => {
    let unsub = () => {};
    let mounted = true;
    const pathname = location.pathname;
    const projectSlug = getSlugFromPath(pathname, '/proyek/');
    const articleSlug = getSlugFromPath(pathname, '/artikel/');

    setDynamicContent({});

    if (!projectSlug && !articleSlug) {
      return () => {};
    }

    Promise.all([
      import('../config/firebaseConfig'),
      import('firebase/firestore'),
    ]).then(([{ db }, { collection, onSnapshot, query, where }]) => {
      if (!mounted) return;
      const collectionName = projectSlug ? 'projects' : 'articles';
      const slug = projectSlug || articleSlug;
      const q = query(collection(db, collectionName), where('slug', '==', slug));
      unsub = onSnapshot(
        q,
        (snap) => {
          if (!mounted) return;
          const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          if (projectSlug) {
            setDynamicContent({ project: selectLatestProject(docs) });
          } else {
            const latestArticle = docs.sort((a, b) => {
              const aTime = a.updatedAt?.toMillis?.() || a.createdAt?.toMillis?.() || 0;
              const bTime = b.updatedAt?.toMillis?.() || b.createdAt?.toMillis?.() || 0;
              return bTime - aTime;
            })[0] || null;
            setDynamicContent({ article: latestArticle });
          }
        },
        () => setDynamicContent(projectSlug ? { project: null } : { article: null })
      );
    }).catch(() => {
      if (mounted) setDynamicContent(projectSlug ? { project: null } : { article: null });
    });

    return () => {
      mounted = false;
      unsub();
    };
  }, [location.pathname]);

  useEffect(() => {
    applySEO(seoConfig, location.pathname, dynamicContent);
  }, [seoConfig, location.pathname, dynamicContent]);
}
