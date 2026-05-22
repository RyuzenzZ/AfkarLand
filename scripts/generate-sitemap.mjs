import fs from 'node:fs/promises';
import path from 'node:path';
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
const defaultSiteUrl = 'https://afkarland.com';

const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/tentang-kami', priority: '0.8', changefreq: 'monthly' },
  { path: '/proyek', priority: '0.9', changefreq: 'weekly' },
  { path: '/artikel', priority: '0.8', changefreq: 'weekly' },
  { path: '/karir', priority: '0.6', changefreq: 'monthly' },
  { path: '/kontak', priority: '0.7', changefreq: 'monthly' },
  { path: '/faq', priority: '0.6', changefreq: 'monthly' },
];

function normalizeSiteUrl(siteUrl) {
  return (siteUrl || defaultSiteUrl).replace(/\/$/, '');
}

function toDateString(value) {
  if (!value) return new Date().toISOString();
  if (typeof value.toDate === 'function') return value.toDate().toISOString();
  if (typeof value.seconds === 'number') return new Date(value.seconds * 1000).toISOString();
  return new Date(value).toISOString();
}

function getSlug(data) {
  return data.slug || data.id || data.namaSlug || data.slugUrl || '';
}

function shouldIndex(data) {
  const status = String(data.status || data.visibility || '').toLowerCase();
  return !['draft', 'nonaktif', 'arsip', 'hidden'].includes(status);
}

async function fetchDynamicRoutes(env) {
  const required = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_APP_ID',
  ];

  if (required.some(key => !env[key])) return [];

  try {
    const app = initializeApp({
      apiKey: env.VITE_FIREBASE_API_KEY,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: env.VITE_FIREBASE_APP_ID,
    });
    const db = getFirestore(app);
    const [projectsSnap, articlesSnap] = await Promise.all([
      getDocs(collection(db, 'projects')),
      getDocs(collection(db, 'articles')),
    ]);

    const projectRoutes = projectsSnap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(shouldIndex)
      .map(item => ({
        path: `/proyek/${getSlug(item) || item.id}`,
        priority: '0.85',
        changefreq: 'weekly',
        lastmod: toDateString(item.updatedAt || item.createdAt),
      }));

    const articleRoutes = articlesSnap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(shouldIndex)
      .map(item => ({
        path: `/artikel/${getSlug(item) || item.id}`,
        priority: '0.75',
        changefreq: 'monthly',
        lastmod: toDateString(item.updatedAt || item.createdAt),
      }));

    return [...projectRoutes, ...articleRoutes];
  } catch (error) {
    console.warn(`Sitemap dynamic routes skipped: ${error.message}`);
    return [];
  }
}

function buildSitemap(siteUrl, routes) {
  const items = routes
    .map(route => `  <url>
    <loc>${siteUrl}${route.path}</loc>
    <lastmod>${route.lastmod || new Date().toISOString()}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>
`;
}

function buildRobots(siteUrl) {
  return `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: ${siteUrl}/sitemap.xml
`;
}

const env = process.env;
const siteUrl = normalizeSiteUrl(env.VITE_SITE_URL || env.VITE_PUBLIC_SITE_URL || env.SITE_URL);
const dynamicRoutes = await fetchDynamicRoutes(env);
const routeMap = new Map([...staticRoutes, ...dynamicRoutes].map(route => [route.path, route]));
const routes = Array.from(routeMap.values()).sort((a, b) => a.path.localeCompare(b.path));

await fs.mkdir(publicDir, { recursive: true });
await Promise.all([
  fs.writeFile(path.join(publicDir, 'sitemap.xml'), buildSitemap(siteUrl, routes)),
  fs.writeFile(path.join(publicDir, 'robots.txt'), buildRobots(siteUrl)),
]);

console.log(`Generated sitemap.xml and robots.txt with ${routes.length} routes.`);
