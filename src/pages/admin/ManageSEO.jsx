// ManageSEO.jsx - AFKAR LAND Admin Panel
// Kelola SEO halaman publik, Google Search Console, dan Google Analytics.

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiGlobe,
  FiSave,
  FiSearch,
  FiSettings,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const PAGES = [
  { id: 'home', label: 'Homepage', path: '/' },
  { id: 'tentang', label: 'Tentang Kami', path: '/tentang-kami' },
  { id: 'proyek', label: 'Daftar Proyek', path: '/proyek' },
  { id: 'proyekDetail', label: 'Detail Proyek', path: '/proyek/:slug' },
  { id: 'artikel', label: 'Artikel', path: '/artikel' },
  { id: 'artikelDetail', label: 'Detail Artikel', path: '/artikel/:slug' },
  { id: 'karir', label: 'Karir', path: '/karir' },
  { id: 'kontak', label: 'Kontak', path: '/kontak' },
  { id: 'faq', label: 'FAQ', path: '/faq' },
];

const DEFAULT_SEO = {
  metaTitle: '',
  metaDescription: '',
  keywords: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  canonical: '',
  robots: 'index, follow',
};

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

const SEO_CACHE_KEY = 'afkar_seo_settings_v1';

const MAX = {
  metaTitle: 60,
  metaDescription: 160,
  ogTitle: 70,
  ogDescription: 200,
};

const inputCls = 'w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 caret-gray-900 focus:border-red-400 outline-none text-sm transition-colors';

const Field = ({ label, hint, children }) => (
  <div>
    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">{label}</label>
    {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
    {children}
  </div>
);

const CharCount = ({ value, max }) => {
  const len = (value || '').length;
  const pct = len / max;
  return (
    <span className={`text-[11px] font-bold ${pct > 1 ? 'text-red-500' : pct > 0.85 ? 'text-amber-500' : 'text-gray-300'}`}>
      {len}/{max}
    </span>
  );
};

const ScoreBar = ({ score }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
        style={{ width: `${score}%` }}
      />
    </div>
    <span className={`text-xs font-black ${score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
      {score}%
    </span>
  </div>
);

function buildCanonical(globalSettings, page) {
  if (!globalSettings.siteUrl || !page?.path || page.path.includes(':')) return '';
  return `${globalSettings.siteUrl.replace(/\/$/, '')}${page.path}`;
}

function normalizeSavedData(saved) {
  return {
    ...saved,
    global: { ...DEFAULT_GLOBAL, ...(saved?.global || {}) },
  };
}

export default function ManageSEO() {
  const [activePage, setActivePage] = useState(PAGES[0].id);
  const [seoData, setSeoData] = useState({ global: DEFAULT_GLOBAL });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const globalSettings = { ...DEFAULT_GLOBAL, ...(seoData.global || {}) };
  const activeConfig = PAGES.find(p => p.id === activePage);
  const current = { ...DEFAULT_SEO, ...(seoData[activePage] || {}) };

  const setPageField = (key, val) => {
    setSeoData(data => ({
      ...data,
      [activePage]: {
        ...DEFAULT_SEO,
        ...(data[activePage] || {}),
        [key]: val,
      },
    }));
  };

  const setGlobalField = (key, val) => {
    setSeoData(data => ({
      ...data,
      global: {
        ...DEFAULT_GLOBAL,
        ...(data.global || {}),
        [key]: val,
      },
    }));
  };

  useEffect(() => {
    const fetchAll = async () => {
      const snap = await getDoc(doc(db, 'seo_settings', 'pages'));
      setSeoData(normalizeSavedData(snap.exists() ? snap.data() : {}));
      setLoading(false);
    };

    fetchAll().catch(() => {
      toast.error('Gagal memuat pengaturan SEO.');
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'seo_settings', 'pages'), seoData, { merge: true });
      try {
        window.localStorage.setItem(SEO_CACHE_KEY, JSON.stringify(seoData));
      } catch {
        // SEO cache only avoids stale first paint; Firestore remains source of truth.
      }
      toast.success('Pengaturan SEO disimpan.');
    } catch {
      toast.error('Gagal menyimpan SEO.');
    } finally {
      setSaving(false);
    }
  };

  const calcScore = (seo) => {
    if (!seo) return 0;
    let score = 0;
    if (seo.metaTitle && seo.metaTitle.length >= 30 && seo.metaTitle.length <= 60) score += 25;
    else if (seo.metaTitle) score += 10;
    if (seo.metaDescription && seo.metaDescription.length >= 80 && seo.metaDescription.length <= 160) score += 25;
    else if (seo.metaDescription) score += 10;
    if (seo.keywords) score += 10;
    if (seo.ogTitle || seo.metaTitle) score += 10;
    if (seo.ogDescription || seo.metaDescription) score += 10;
    if (seo.ogImage) score += 15;
    if (seo.canonical) score += 5;
    return Math.min(score, 100);
  };

  if (loading) {
    return <div className="p-8 text-gray-400 animate-pulse">Memuat data SEO...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">SEO Manager</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Atur meta tag, preview Google, Search Console, Analytics, dan canonical URL dari admin.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-60"
        >
          <FiSave size={15} /> {saving ? 'Menyimpan...' : 'Simpan SEO'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
          <p className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest px-2 mb-3">Konfigurasi</p>
          <button
            onClick={() => setActivePage('global')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all text-left mb-2 ${
              activePage === 'global' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="font-medium truncate">Google & Hosting</span>
            <FiSettings size={14} />
          </button>

          <p className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest px-2 mb-3 mt-4">Pilih Halaman</p>
          <div className="space-y-1">
            {PAGES.map(page => {
              const score = calcScore(seoData[page.id]);
              return (
                <button
                  key={page.id}
                  onClick={() => setActivePage(page.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                    activePage === page.id ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium truncate">{page.label}</span>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full shrink-0 ml-2 ${
                    activePage === page.id ? 'bg-white/20 text-white'
                      : score >= 80 ? 'bg-emerald-100 text-emerald-600'
                        : score >= 50 ? 'bg-amber-100 text-amber-600'
                          : 'bg-red-100 text-red-500'
                  }`}
                  >
                    {score}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {activePage === 'global' ? (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                  <FiGlobe size={14} className="text-red-500" /> Domain & Google
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="URL Website Hosting" hint="Dipakai untuk canonical URL dan preview. Contoh: https://afkarland.com">
                    <input
                      className={inputCls}
                      value={globalSettings.siteUrl}
                      onChange={e => setGlobalField('siteUrl', e.target.value)}
                      placeholder="https://domain-anda.com"
                    />
                  </Field>
                  <Field label="Nama Website">
                    <input
                      className={inputCls}
                      value={globalSettings.siteName}
                      onChange={e => setGlobalField('siteName', e.target.value)}
                      placeholder="AFKAR LAND"
                    />
                  </Field>
                </div>

                <Field label="Google Search Console Verification" hint="Masukkan content dari meta tag google-site-verification, bukan seluruh tag HTML.">
                  <input
                    className={inputCls}
                    value={globalSettings.googleSiteVerification}
                    onChange={e => setGlobalField('googleSiteVerification', e.target.value)}
                    placeholder="contoh: AbCdEfGhIjKlMn..."
                  />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Google Analytics Measurement ID" hint="Format umum: G-XXXXXXXXXX">
                    <input
                      className={inputCls}
                      value={globalSettings.googleAnalyticsId}
                      onChange={e => setGlobalField('googleAnalyticsId', e.target.value)}
                      placeholder="G-XXXXXXXXXX"
                    />
                  </Field>
                  <Field label="Google Tag Manager ID" hint="Opsional. Format umum: GTM-XXXXXXX">
                    <input
                      className={inputCls}
                      value={globalSettings.googleTagManagerId}
                      onChange={e => setGlobalField('googleTagManagerId', e.target.value)}
                      placeholder="GTM-XXXXXXX"
                    />
                  </Field>
                </div>

                <Field label="Tracker Utama Website" hint="Pilih salah satu agar pageview dan event tidak tercatat dobel.">
                  <select
                    className={inputCls}
                    value={globalSettings.trackingProvider}
                    onChange={e => setGlobalField('trackingProvider', e.target.value)}
                  >
                    <option value="ga">Google Analytics langsung</option>
                    <option value="gtm">Google Tag Manager</option>
                  </select>
                </Field>

                <Field label="Default OG Image" hint="Gambar fallback untuk share WhatsApp/Facebook jika halaman belum punya OG image.">
                  <input
                    className={inputCls}
                    value={globalSettings.defaultOgImage}
                    onChange={e => setGlobalField('defaultOgImage', e.target.value)}
                    placeholder="https://domain-anda.com/og-image.jpg"
                  />
                </Field>

                <label className="flex items-start justify-between gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer">
                  <div>
                    <div className="font-bold text-gray-800 text-sm">Izinkan halaman diindeks Google</div>
                    <p className="text-xs text-gray-500 mt-1">
                      Matikan sementara jika website belum siap tampil di hasil pencarian.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={globalSettings.enableIndexing}
                    onChange={e => setGlobalField('enableIndexing', e.target.checked)}
                    className="mt-1 h-5 w-5 accent-red-600"
                  />
                </label>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <p className="text-sm font-bold text-amber-800">Catatan Search Console</p>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  Untuk verifikasi Google yang paling stabil setelah hosting, gunakan DNS TXT di pengaturan domain.
                  Field meta verification ini tetap dipasang otomatis di head halaman, tetapi beberapa metode verifikasi Google
                  bisa meminta tag tersedia pada HTML awal.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3 gap-4">
                  <h3 className="font-bold text-gray-800 text-sm">
                    Skor SEO - {activeConfig?.label}
                  </h3>
                  <span className="text-xs text-gray-400">{activeConfig?.path}</span>
                </div>
                <ScoreBar score={calcScore(current)} />
                <div className="mt-3 flex gap-4 text-xs text-gray-400 flex-wrap">
                  {[
                    { label: 'Meta Title', ok: current.metaTitle.length >= 30 && current.metaTitle.length <= 60 },
                    { label: 'Meta Desc', ok: current.metaDescription.length >= 80 && current.metaDescription.length <= 160 },
                    { label: 'Keywords', ok: !!current.keywords },
                    { label: 'OG Image', ok: !!current.ogImage || !!globalSettings.defaultOgImage },
                    { label: 'Canonical', ok: !!current.canonical || !!buildCanonical(globalSettings, activeConfig) },
                  ].map(item => (
                    <span key={item.label} className={`flex items-center gap-1 ${item.ok ? 'text-emerald-600' : 'text-gray-300'}`}>
                      {item.ok ? <FiCheckCircle size={12} /> : <FiAlertCircle size={12} />} {item.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                  <FiSearch size={14} className="text-red-500" /> Meta Tags
                </h3>
                <Field label="Meta Title">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-400">Ideal 30-60 karakter</span>
                    <CharCount value={current.metaTitle} max={MAX.metaTitle} />
                  </div>
                  <input
                    className={inputCls}
                    value={current.metaTitle}
                    onChange={e => setPageField('metaTitle', e.target.value)}
                    placeholder="AFKAR LAND - Properti Syariah Terbaik di Sulawesi"
                  />
                </Field>
                <Field label="Meta Description">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-400">Ideal 80-160 karakter</span>
                    <CharCount value={current.metaDescription} max={MAX.metaDescription} />
                  </div>
                  <textarea
                    className={inputCls}
                    rows={3}
                    value={current.metaDescription}
                    onChange={e => setPageField('metaDescription', e.target.value)}
                    placeholder="Temukan hunian syariah berkualitas dari AFKAR LAND dengan proses aman, transparan, dan profesional."
                  />
                </Field>
                <Field label="Kata Kunci">
                  <input
                    className={inputCls}
                    value={current.keywords}
                    onChange={e => setPageField('keywords', e.target.value)}
                    placeholder="properti syariah, rumah makassar, kavling sulawesi"
                  />
                </Field>
                <Field label="Canonical URL" hint="Kosongkan untuk memakai domain hosting + path halaman secara otomatis.">
                  <input
                    className={inputCls}
                    value={current.canonical}
                    onChange={e => setPageField('canonical', e.target.value)}
                    placeholder={buildCanonical(globalSettings, activeConfig) || 'https://domain-anda.com/path'}
                  />
                </Field>
                <Field label="Robots">
                  <select
                    className={inputCls}
                    value={current.robots}
                    onChange={e => setPageField('robots', e.target.value)}
                  >
                    <option value="index, follow">Index, follow</option>
                    <option value="noindex, nofollow">Noindex, nofollow</option>
                    <option value="noindex, follow">Noindex, follow</option>
                  </select>
                </Field>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                  <FiGlobe size={14} className="text-red-500" /> Open Graph
                </h3>
                <Field label="OG Title">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-400">Kosongkan untuk memakai Meta Title</span>
                    <CharCount value={current.ogTitle} max={MAX.ogTitle} />
                  </div>
                  <input
                    className={inputCls}
                    value={current.ogTitle}
                    onChange={e => setPageField('ogTitle', e.target.value)}
                    placeholder="AFKAR LAND - Hunian Syariah Pilihan Keluarga"
                  />
                </Field>
                <Field label="OG Description">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-400">Kosongkan untuk memakai Meta Description</span>
                    <CharCount value={current.ogDescription} max={MAX.ogDescription} />
                  </div>
                  <textarea
                    className={inputCls}
                    rows={2}
                    value={current.ogDescription}
                    onChange={e => setPageField('ogDescription', e.target.value)}
                    placeholder="Wujudkan hunian impian bersama AFKAR LAND."
                  />
                </Field>
                <Field label="OG Image URL">
                  <input
                    className={inputCls}
                    value={current.ogImage}
                    onChange={e => setPageField('ogImage', e.target.value)}
                    placeholder={globalSettings.defaultOgImage || 'https://domain-anda.com/og-image.jpg'}
                  />
                  {(current.ogImage || globalSettings.defaultOgImage) && (
                    <img
                      src={current.ogImage || globalSettings.defaultOgImage}
                      alt="OG Preview"
                      className="mt-3 w-full max-w-xs rounded-xl border border-gray-100 object-cover h-32"
                    />
                  )}
                </Field>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
                  <FiSearch size={14} className="text-red-500" /> Preview Hasil Google
                </h3>
                <div className="bg-white border border-gray-100 rounded-xl p-4 max-w-lg">
                  <div className="text-xs text-gray-400 mb-1">
                    {(current.canonical || buildCanonical(globalSettings, activeConfig) || `${globalSettings.siteUrl || 'https://domain-anda.com'}${activeConfig?.path || ''}`)}
                  </div>
                  <div className="text-blue-700 text-lg font-medium leading-tight hover:underline cursor-pointer">
                    {current.metaTitle || 'Meta Title belum diisi...'}
                  </div>
                  <div className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {current.metaDescription || 'Meta description belum diisi. Tambahkan deskripsi menarik untuk meningkatkan klik dari Google.'}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
