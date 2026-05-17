// ManageSEO.jsx — AFKAR LAND Admin Panel
// Kelola meta title, description, OG tags, dan kata kunci per halaman website

import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { FiSave, FiSearch, FiGlobe, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

// Halaman website yang SEO-nya bisa dikelola
const PAGES = [
  { id: 'home',         label: '🏠 Homepage',        path: '/'            },
  { id: 'proyek',       label: '🏢 Halaman Proyek',   path: '/proyek'      },
  { id: 'tentang',      label: 'ℹ️ Tentang Kami',     path: '/tentang'     },
  { id: 'layanan',      label: '⚙️ Layanan',          path: '/layanan'     },
  { id: 'kontak',       label: '📞 Kontak',           path: '/kontak'      },
  { id: 'karir',        label: '💼 Karir',            path: '/karir'       },
  { id: 'blog',         label: '📰 Blog / Artikel',   path: '/blog'        },
];

const DEFAULT_SEO = {
  metaTitle: '', metaDescription: '', keywords: '',
  ogTitle: '', ogDescription: '', ogImage: '', canonical: '',
};

const MAX = { metaTitle: 60, metaDescription: 160, ogTitle: 70, ogDescription: 200 };

const inputCls = "w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-400 outline-none text-sm transition-colors";

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

export default function ManageSEO() {
  const [activePage, setActivePage] = useState(PAGES[0].id);
  const [seoData, setSeoData]       = useState({});   // { pageId: {...seo fields} }
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);

  const current = seoData[activePage] || { ...DEFAULT_SEO };
  const setField = (key, val) => setSeoData(d => ({ ...d, [activePage]: { ...(d[activePage] || DEFAULT_SEO), [key]: val } }));

  useEffect(() => {
    const fetchAll = async () => {
      const snap = await getDoc(doc(db, 'seo_settings', 'pages'));
      if (snap.exists()) setSeoData(snap.data());
      setLoading(false);
    };
    fetchAll().catch(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'seo_settings', 'pages'), seoData, { merge: true });
      toast.success('Pengaturan SEO disimpan!');
    } catch { toast.error('Gagal menyimpan SEO.'); }
    finally { setSaving(false); }
  };

  // Hitung SEO score sederhana
  const calcScore = (seo) => {
    if (!seo) return 0;
    let s = 0;
    if (seo.metaTitle && seo.metaTitle.length >= 30 && seo.metaTitle.length <= 60) s += 25;
    else if (seo.metaTitle) s += 10;
    if (seo.metaDescription && seo.metaDescription.length >= 80 && seo.metaDescription.length <= 160) s += 25;
    else if (seo.metaDescription) s += 10;
    if (seo.keywords) s += 15;
    if (seo.ogTitle) s += 15;
    if (seo.ogImage) s += 15;
    if (seo.canonical) s += 5;
    return Math.min(s, 100);
  };

  if (loading) return <div className="p-8 text-gray-400 animate-pulse">Memuat data SEO...</div>;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">SEO Manager</h1>
          <p className="text-gray-500 mt-1 text-sm">Optimalkan setiap halaman website untuk mesin pencari Google.</p>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-60">
          <FiSave size={15}/> {saving ? 'Menyimpan...' : 'Simpan SEO'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SIDEBAR HALAMAN */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
          <p className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest px-2 mb-3">Pilih Halaman</p>
          <div className="space-y-1">
            {PAGES.map(p => {
              const score = calcScore(seoData[p.id]);
              return (
                <button key={p.id} onClick={() => setActivePage(p.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all text-left
                    ${activePage === p.id ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <span className="font-medium truncate">{p.label}</span>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full shrink-0 ml-2
                    ${activePage === p.id ? 'bg-white/20 text-white'
                    : score >= 80 ? 'bg-emerald-100 text-emerald-600'
                    : score >= 50 ? 'bg-amber-100 text-amber-600'
                    : 'bg-red-100 text-red-500'}`}>
                    {score}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FORM SEO */}
        <div className="lg:col-span-3 space-y-4">
          {/* SEO Score */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800 text-sm">
                Skor SEO — {PAGES.find(p => p.id === activePage)?.label}
              </h3>
              <span className="text-xs text-gray-400">{PAGES.find(p => p.id === activePage)?.path}</span>
            </div>
            <ScoreBar score={calcScore(current)} />
            <div className="mt-3 flex gap-4 text-xs text-gray-400 flex-wrap">
              {[
                { label: 'Meta Title', ok: current.metaTitle?.length >= 30 && current.metaTitle?.length <= 60 },
                { label: 'Meta Desc',  ok: current.metaDescription?.length >= 80 },
                { label: 'Keywords',   ok: !!current.keywords },
                { label: 'OG Title',   ok: !!current.ogTitle },
                { label: 'OG Image',   ok: !!current.ogImage },
              ].map(item => (
                <span key={item.label} className={`flex items-center gap-1 ${item.ok ? 'text-emerald-600' : 'text-gray-300'}`}>
                  {item.ok ? <FiCheckCircle size={12}/> : <FiAlertCircle size={12}/>} {item.label}
                </span>
              ))}
            </div>
          </div>

          {/* Meta Tags */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <FiSearch size={14} className="text-red-500"/> Meta Tags
            </h3>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Meta Title</label>
                <CharCount value={current.metaTitle} max={MAX.metaTitle}/>
              </div>
              <input className={inputCls} value={current.metaTitle} onChange={e => setField('metaTitle', e.target.value)}
                placeholder="AFKAR LAND — Properti Syariah Terbaik di Sulawesi" />
              <p className="text-xs text-gray-400 mt-1">Ideal: 30–60 karakter. Tampil di tab browser & hasil Google.</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Meta Description</label>
                <CharCount value={current.metaDescription} max={MAX.metaDescription}/>
              </div>
              <textarea className={inputCls} rows={3} value={current.metaDescription} onChange={e => setField('metaDescription', e.target.value)}
                placeholder="Temukan hunian syariah berkualitas dari AFKAR LAND. Unit tersedia di Sulawesi dengan berbagai tipe dan harga terjangkau." />
              <p className="text-xs text-gray-400 mt-1">Ideal: 80–160 karakter. Tampil di bawah judul di hasil Google.</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Kata Kunci (Keywords)</label>
              <input className={inputCls} value={current.keywords} onChange={e => setField('keywords', e.target.value)}
                placeholder="properti syariah, rumah makassar, kavling sulawesi, AFKAR LAND" />
              <p className="text-xs text-gray-400 mt-1">Pisahkan dengan koma. Contoh: properti syariah, rumah makassar.</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Canonical URL</label>
              <input className={inputCls} value={current.canonical} onChange={e => setField('canonical', e.target.value)}
                placeholder="https://afkarland.com/proyek" />
            </div>
          </div>

          {/* Open Graph */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <FiGlobe size={14} className="text-red-500"/> Open Graph (WhatsApp / Facebook Preview)
            </h3>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">OG Title</label>
                <CharCount value={current.ogTitle} max={MAX.ogTitle}/>
              </div>
              <input className={inputCls} value={current.ogTitle} onChange={e => setField('ogTitle', e.target.value)}
                placeholder="AFKAR LAND — Hunian Syariah Pilihan Keluarga" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">OG Description</label>
                <CharCount value={current.ogDescription} max={MAX.ogDescription}/>
              </div>
              <textarea className={inputCls} rows={2} value={current.ogDescription} onChange={e => setField('ogDescription', e.target.value)}
                placeholder="Wujudkan hunian impian bersama AFKAR GROUP INDONESIA..." />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">OG Image URL</label>
              <input className={inputCls} value={current.ogImage} onChange={e => setField('ogImage', e.target.value)}
                placeholder="https://afkarland.com/og-image.jpg (1200×630 px)" />
              {current.ogImage && (
                <img src={current.ogImage} alt="OG Preview" className="mt-3 w-full max-w-xs rounded-xl border border-gray-100 object-cover h-32"
                  onError={e => { e.target.style.display = 'none'; }}/>
              )}
              <p className="text-xs text-gray-400 mt-1">Ukuran ideal: 1200 × 630 piksel.</p>
            </div>
          </div>

          {/* SERP Preview */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
              <FiSearch size={14} className="text-red-500"/> Preview Hasil Google
            </h3>
            <div className="bg-white border border-gray-100 rounded-xl p-4 max-w-lg">
              <div className="text-xs text-gray-400 mb-1">
                afkarland.com{PAGES.find(p => p.id === activePage)?.path}
              </div>
              <div className="text-blue-700 text-lg font-medium leading-tight hover:underline cursor-pointer">
                {current.metaTitle || 'Meta Title belum diisi...'}
              </div>
              <div className="text-sm text-gray-600 mt-1 leading-relaxed">
                {current.metaDescription || 'Meta description belum diisi. Tambahkan deskripsi menarik untuk meningkatkan klik dari Google.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}