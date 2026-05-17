// ManageHomepage.jsx — AFKAR LAND Admin Panel
// Edit REAL-TIME: Logo, Gambar per Halaman, Navbar, Footer, Branding, Hero, Statistik, FAQ
// Semua perubahan tersimpan ke Firestore & langsung tampil di web publik

import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import {
  FiSave, FiPlus, FiTrash2, FiEye, FiImage,
  FiGlobe, FiLayout, FiHome, FiLink, FiInfo,
} from 'react-icons/fi';
import { LayoutDashboard, Palette, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';

// ── Komponen bantu ──────────────────────────────────────────────
const SectionCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">{icon}</div>
      <h2 className="font-heading font-bold text-gray-800 text-sm">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Field = ({ label, hint, children }) => (
  <div>
    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">{label}</label>
    {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
    {children}
  </div>
);

const inputCls  = "w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-400 outline-none text-sm transition-colors";
const labelCls  = "block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider";

// Preview gambar kecil
const ImgPreview = ({ url }) => url ? (
  <img
    src={url} alt="preview"
    className="mt-2 w-full h-32 object-cover rounded-xl border border-gray-100"
    onError={e => { e.target.style.display = 'none'; }}
  />
) : null;

// ── Daftar halaman untuk edit gambar ───────────────────────────
const PAGE_LIST = [
  { key: 'home',     label: '🏠 Beranda' },
  { key: 'about',    label: 'ℹ️ Tentang Kami' },
  { key: 'projects', label: '🏢 Proyek' },
  { key: 'career',   label: '💼 Karir' },
  { key: 'blog',     label: '📰 Artikel / Blog' },
  { key: 'contact',  label: '📞 Kontak' },
  { key: 'faq',      label: '❓ FAQ' },
];

// ── Default data ────────────────────────────────────────────────
const DEFAULT = {
  branding: {
    logoUrl:  '',
    logoAlt:  'AFKAR GROUP INDONESIA',
    siteName: 'AFKAR GROUP INDONESIA',
    tagline:  'Properti Syariah Terbaik di Sulawesi',
    faviconUrl: '',
    primaryColor: '#dc2626',
  },
  navbar: {
    logoUrl: '',
    links: [
      { label: 'Beranda',      path: '/' },
      { label: 'Tentang Kami', path: '/tentang-kami' },
      { label: 'Proyek',       path: '/proyek' },
      { label: 'Artikel',      path: '/artikel' },
      { label: 'Karir',        path: '/karir' },
      { label: 'Kontak',       path: '/kontak' },
    ],
  },
  pages: {
    home:     { heroImage: '', heroTitle: '',               heroSubtitle: '' },
    about:    { heroImage: '', heroTitle: 'Tentang Kami',   heroSubtitle: '' },
    projects: { heroImage: '', heroTitle: 'Proyek Kami',    heroSubtitle: '' },
    career:   { heroImage: '', heroTitle: 'Karir',          heroSubtitle: '' },
    blog:     { heroImage: '', heroTitle: 'Artikel & Blog', heroSubtitle: '' },
    contact:  { heroImage: '', heroTitle: 'Hubungi Kami',   heroSubtitle: '' },
    faq:      { heroImage: '', heroTitle: 'FAQ',            heroSubtitle: '' },
  },
  hero: {
    judul:        'Properti Syariah Terbaik di Sulawesi',
    subjudul:     'Bersama AFKAR GROUP INDONESIA, wujudkan hunian impian dengan prinsip syariah yang amanah.',
    ctaUtama:     'Lihat Proyek Kami',
    ctaUtamaLink: '/proyek',
    ctaKedua:     'Hubungi Kami',
    ctaKeduaLink: '/kontak',
    badge:        'Amanah dalam kebaikan',
  },
  statistik: [
    { label: 'Unit Terjual',   value: '500+' },
    { label: 'Proyek Aktif',   value: '4'    },
    { label: 'Kota Jangkauan', value: '8+'   },
    { label: 'Kepuasan Klien', value: '98%'  },
  ],
  footer: {
    description: 'Membangun hunian berkualitas dengan prinsip syariah untuk keluarga Indonesia.',
    phone:       '+62 812-3456-7890',
    email:       'info@afkarland.com',
    address:     'Makassar, Sulawesi Selatan',
    instagram:   '',
    facebook:    '',
    youtube:     '',
    copyright:   '© 2025 AFKAR GROUP INDONESIA. All rights reserved.',
  },
  faq: [
    { pertanyaan: 'Apakah produk AFKAR LAND bersertifikat syariah?', jawaban: 'Ya, semua produk kami telah melalui kajian syariah dan bebas dari riba.' },
    { pertanyaan: 'Bagaimana cara pemesanan unit?',                   jawaban: 'Anda bisa mengisi formulir booking di halaman detail proyek atau menghubungi tim kami.' },
  ],
};

// ── Komponen utama ──────────────────────────────────────────────
export default function ManageHomepage() {
  const [data, setData]           = useState(DEFAULT);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [activeTab, setActiveTab] = useState('branding');
  const [activePage, setActivePage] = useState('home');

  const TABS = [
    { id: 'branding',  label: '🎨 Branding & Logo'      },
    { id: 'pages',     label: '🖼️ Gambar Per Halaman'   },
    { id: 'navbar',    label: '🔗 Navbar'                },
    { id: 'hero',      label: '🏠 Hero Banner'           },
    { id: 'statistik', label: '📊 Statistik'             },
    { id: 'footer',    label: '📋 Footer'                },
    { id: 'faq',       label: '❓ FAQ'                   },
  ];

  // ── Ambil data dari Firestore ───────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDoc(doc(db, 'homepage_settings', 'main'));
        if (snap.exists()) {
          // Merge dengan default agar field baru tidak undefined
          const saved = snap.data();
          setData(prev => ({
            ...prev,
            ...saved,
            branding:  { ...prev.branding,  ...saved.branding  },
            navbar:    { ...prev.navbar,    ...saved.navbar    },
            pages:     { ...prev.pages,     ...saved.pages     },
            hero:      { ...prev.hero,      ...saved.hero      },
            footer:    { ...prev.footer,    ...saved.footer    },
            statistik: saved.statistik || prev.statistik,
            faq:       saved.faq       || prev.faq,
          }));
        }
      } catch { /* pakai default */ }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  // ── Simpan ke Firestore ─────────────────────────────────────
  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'homepage_settings', 'main'), data, { merge: true });
      toast.success('✅ Perubahan disimpan dan langsung tampil di web!');
    } catch {
      toast.error('Gagal menyimpan.');
    } finally {
      setSaving(false);
    }
  };

  // ── Setter helpers ──────────────────────────────────────────
  const setBranding = (k, v) => setData(d => ({ ...d, branding: { ...d.branding, [k]: v } }));
  const setNavbar   = (k, v) => setData(d => ({ ...d, navbar:   { ...d.navbar,   [k]: v } }));
  const setHero     = (k, v) => setData(d => ({ ...d, hero:     { ...d.hero,     [k]: v } }));
  const setFooter   = (k, v) => setData(d => ({ ...d, footer:   { ...d.footer,   [k]: v } }));
  const setPageField = (page, k, v) =>
    setData(d => ({ ...d, pages: { ...d.pages, [page]: { ...d.pages[page], [k]: v } } }));

  const setStat    = (i, k, v) => setData(d => { const s = [...d.statistik]; s[i] = { ...s[i], [k]: v }; return { ...d, statistik: s }; });
  const addStat    = () => setData(d => ({ ...d, statistik: [...d.statistik, { label: '', value: '' }] }));
  const removeStat = (i) => setData(d => ({ ...d, statistik: d.statistik.filter((_, x) => x !== i) }));

  const setFaq     = (i, k, v) => setData(d => { const f = [...d.faq]; f[i] = { ...f[i], [k]: v }; return { ...d, faq: f }; });
  const addFaq     = () => setData(d => ({ ...d, faq: [...d.faq, { pertanyaan: '', jawaban: '' }] }));
  const removeFaq  = (i) => setData(d => ({ ...d, faq: d.faq.filter((_, x) => x !== i) }));

  const setNavLink = (i, k, v) =>
    setData(d => { const l = [...d.navbar.links]; l[i] = { ...l[i], [k]: v }; return { ...d, navbar: { ...d.navbar, links: l } }; });
  const addNavLink    = () => setData(d => ({ ...d, navbar: { ...d.navbar, links: [...d.navbar.links, { label: '', path: '' }] } }));
  const removeNavLink = (i) => setData(d => ({ ...d, navbar: { ...d.navbar, links: d.navbar.links.filter((_, x) => x !== i) } }));

  if (loading) return <div className="p-8 text-gray-400 animate-pulse">Memuat pengaturan website...</div>;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Manajemen Website</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Semua perubahan langsung tampil di web setelah disimpan — tanpa perlu deploy ulang.
          </p>
        </div>
        <div className="flex gap-3">
          <a href="/" target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <FiEye size={15}/> Preview Web
          </a>
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-60 shadow-sm">
            <FiSave size={15}/> {saving ? 'Menyimpan...' : 'Simpan & Publish'}
          </button>
        </div>
      </div>

      {/* INFO BANNER */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"/>
        <p className="text-sm text-emerald-700 font-medium">
          Real-time aktif — perubahan tersimpan ke Firebase dan langsung terbaca oleh semua halaman publik.
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-1.5 flex-wrap bg-gray-100 p-1.5 rounded-2xl w-fit">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap
              ${activeTab === tab.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: BRANDING ── */}
      {activeTab === 'branding' && (
        <div className="space-y-4">
          <SectionCard title="Logo Utama Website" icon={<Palette size={16}/>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Field label="URL Logo (format PNG/SVG transparan)"
                  hint="Gunakan link dari Firebase Storage, Cloudinary, atau hosting gambar lain.">
                  <input className={inputCls} value={data.branding.logoUrl}
                    onChange={e => setBranding('logoUrl', e.target.value)}
                    placeholder="https://storage.googleapis.com/..." />
                </Field>
                <ImgPreview url={data.branding.logoUrl}/>
              </div>
              <div className="space-y-4">
                <Field label="Alt Text Logo">
                  <input className={inputCls} value={data.branding.logoAlt}
                    onChange={e => setBranding('logoAlt', e.target.value)}
                    placeholder="AFKAR GROUP INDONESIA" />
                </Field>
                <Field label="Nama Site (teks fallback jika logo tidak ada)">
                  <input className={inputCls} value={data.branding.siteName}
                    onChange={e => setBranding('siteName', e.target.value)}
                    placeholder="AFKAR GROUP INDONESIA" />
                </Field>
                <Field label="Tagline">
                  <input className={inputCls} value={data.branding.tagline}
                    onChange={e => setBranding('tagline', e.target.value)}
                    placeholder="Properti Syariah Terbaik di Sulawesi" />
                </Field>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Favicon & Warna Brand" icon={<FiGlobe size={16}/>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Field label="URL Favicon (.ico atau .png 32x32)">
                  <input className={inputCls} value={data.branding.faviconUrl}
                    onChange={e => setBranding('faviconUrl', e.target.value)}
                    placeholder="https://..." />
                </Field>
                <ImgPreview url={data.branding.faviconUrl}/>
              </div>
              <Field label="Warna Utama Brand">
                <div className="flex items-center gap-3 mt-1">
                  <input type="color" value={data.branding.primaryColor}
                    onChange={e => setBranding('primaryColor', e.target.value)}
                    className="w-14 h-10 rounded-xl border border-gray-200 cursor-pointer p-1"/>
                  <input className={inputCls} value={data.branding.primaryColor}
                    onChange={e => setBranding('primaryColor', e.target.value)}
                    placeholder="#dc2626" />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Catatan: warna ini perlu dipakai via CSS variable di public pages.
                </p>
              </Field>
            </div>
          </SectionCard>

          {/* Preview mini logo di navbar */}
          {data.branding.logoUrl && (
            <div className="bg-gray-900 rounded-2xl p-4 flex items-center gap-3">
              <img src={data.branding.logoUrl} alt={data.branding.logoAlt} className="h-8 object-contain"/>
              <span className="text-white font-bold text-sm">{data.branding.siteName}</span>
              <span className="ml-auto text-xs text-gray-400">Preview navbar</span>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: GAMBAR PER HALAMAN ── */}
      {activeTab === 'pages' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar pilih halaman */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 h-fit">
            <p className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest px-2 mb-3">Pilih Halaman</p>
            <div className="space-y-1">
              {PAGE_LIST.map(p => (
                <button key={p.key} onClick={() => setActivePage(p.key)}
                  className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm transition-all text-left font-medium
                    ${activePage === p.key ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                  {p.label}
                  {data.pages[p.key]?.heroImage && (
                    <span className="ml-auto text-[10px] opacity-60">✓ Gambar</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Form edit halaman */}
          <div className="lg:col-span-3 space-y-4">
            {PAGE_LIST.filter(p => p.key === activePage).map(p => (
              <SectionCard key={p.key} title={`Pengaturan — ${p.label}`} icon={<FiImage size={16}/>}>
                <div className="space-y-5">
                  <div>
                    <label className={labelCls}>Hero / Banner Image URL</label>
                    <p className="text-xs text-gray-400 mb-2">
                      Gambar latar belakang bagian atas halaman {p.label}. Gunakan gambar beresolusi tinggi (min. 1920×600).
                    </p>
                    <input className={inputCls}
                      value={data.pages[p.key]?.heroImage || ''}
                      onChange={e => setPageField(p.key, 'heroImage', e.target.value)}
                      placeholder="https://storage.googleapis.com/..." />
                    <ImgPreview url={data.pages[p.key]?.heroImage}/>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Judul Halaman (Hero Title)</label>
                      <input className={inputCls}
                        value={data.pages[p.key]?.heroTitle || ''}
                        onChange={e => setPageField(p.key, 'heroTitle', e.target.value)}
                        placeholder={`Judul untuk halaman ${p.label}`} />
                    </div>
                    <div>
                      <label className={labelCls}>Sub-judul (Hero Subtitle)</label>
                      <input className={inputCls}
                        value={data.pages[p.key]?.heroSubtitle || ''}
                        onChange={e => setPageField(p.key, 'heroSubtitle', e.target.value)}
                        placeholder="Deskripsi singkat halaman" />
                    </div>
                  </div>

                  {/* Preview mini */}
                  {data.pages[p.key]?.heroImage && (
                    <div className="relative rounded-2xl overflow-hidden h-40 border border-gray-200">
                      <img src={data.pages[p.key].heroImage} alt="preview"
                        className="w-full h-full object-cover"
                        onError={e => { e.target.style.display = 'none'; }}/>
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                        <div className="text-lg font-bold">{data.pages[p.key].heroTitle || p.label}</div>
                        {data.pages[p.key].heroSubtitle && (
                          <div className="text-sm opacity-80 mt-1">{data.pages[p.key].heroSubtitle}</div>
                        )}
                      </div>
                      <span className="absolute top-2 right-2 text-[10px] bg-black/60 text-white px-2 py-1 rounded-lg">Preview</span>
                    </div>
                  )}
                </div>
              </SectionCard>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: NAVBAR ── */}
      {activeTab === 'navbar' && (
        <div className="space-y-4">
          <SectionCard title="Logo di Navbar" icon={<FiLayout size={16}/>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Field label="URL Logo Navbar (bisa berbeda dengan logo utama)">
                  <input className={inputCls} value={data.navbar.logoUrl}
                    onChange={e => setNavbar('logoUrl', e.target.value)}
                    placeholder="Kosongkan untuk pakai logo branding utama" />
                </Field>
                <ImgPreview url={data.navbar.logoUrl}/>
              </div>
              <div className="flex items-center justify-center">
                <div className="bg-gray-900 rounded-2xl px-6 py-4 flex items-center gap-3 w-full">
                  {(data.navbar.logoUrl || data.branding.logoUrl) ? (
                    <img src={data.navbar.logoUrl || data.branding.logoUrl}
                      alt="logo" className="h-7 object-contain"/>
                  ) : (
                    <span className="text-white font-bold text-sm">{data.branding.siteName}</span>
                  )}
                  <span className="ml-auto text-xs text-gray-400">Preview</span>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Link Menu Navbar" icon={<FiLink size={16}/>}>
            <div className="space-y-3 mb-4">
              {data.navbar.links.map((link, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-300 w-5 shrink-0">{i + 1}</span>
                  <input className={inputCls} value={link.label}
                    onChange={e => setNavLink(i, 'label', e.target.value)}
                    placeholder="Label menu (contoh: Beranda)" />
                  <input className={inputCls} value={link.path}
                    onChange={e => setNavLink(i, 'path', e.target.value)}
                    placeholder="Path (contoh: /proyek)" />
                  <button onClick={() => removeNavLink(i)}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg shrink-0">
                    <FiTrash2 size={14}/>
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addNavLink}
              className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors w-full justify-center">
              <FiPlus size={15}/> Tambah Menu
            </button>
          </SectionCard>
        </div>
      )}

      {/* ── TAB: HERO ── */}
      {activeTab === 'hero' && (
        <SectionCard title="Hero Banner — Tampilan Utama Beranda" icon={<FiHome size={16}/>}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Judul Utama">
              <input className={inputCls} value={data.hero.judul}
                onChange={e => setHero('judul', e.target.value)}
                placeholder="Properti Syariah Terbaik..." />
            </Field>
            <Field label="Badge / Label Kecil">
              <input className={inputCls} value={data.hero.badge}
                onChange={e => setHero('badge', e.target.value)}
                placeholder="Amanah dalam kebaikan" />
            </Field>
            <div className="md:col-span-2">
              <Field label="Sub-judul / Deskripsi">
                <textarea className={inputCls} rows={3} value={data.hero.subjudul}
                  onChange={e => setHero('subjudul', e.target.value)} />
              </Field>
            </div>
            <Field label="Teks CTA Utama">
              <input className={inputCls} value={data.hero.ctaUtama}
                onChange={e => setHero('ctaUtama', e.target.value)}
                placeholder="Lihat Proyek Kami" />
            </Field>
            <Field label="Link CTA Utama">
              <input className={inputCls} value={data.hero.ctaUtamaLink}
                onChange={e => setHero('ctaUtamaLink', e.target.value)}
                placeholder="/proyek" />
            </Field>
            <Field label="Teks CTA Kedua">
              <input className={inputCls} value={data.hero.ctaKedua}
                onChange={e => setHero('ctaKedua', e.target.value)}
                placeholder="Hubungi Kami" />
            </Field>
            <Field label="Link CTA Kedua">
              <input className={inputCls} value={data.hero.ctaKeduaLink}
                onChange={e => setHero('ctaKeduaLink', e.target.value)}
                placeholder="/kontak" />
            </Field>
          </div>
        </SectionCard>
      )}

      {/* ── TAB: STATISTIK ── */}
      {activeTab === 'statistik' && (
        <SectionCard title="Statistik Perusahaan" icon={<LayoutDashboard size={16}/>}>
          <div className="space-y-3">
            {data.statistik.map((stat, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <input className={inputCls} value={stat.value}
                    onChange={e => setStat(i, 'value', e.target.value)} placeholder="500+" />
                  <input className={inputCls} value={stat.label}
                    onChange={e => setStat(i, 'label', e.target.value)} placeholder="Unit Terjual" />
                </div>
                <button onClick={() => removeStat(i)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg shrink-0">
                  <FiTrash2 size={15}/>
                </button>
              </div>
            ))}
            <button onClick={addStat}
              className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors w-full justify-center">
              <FiPlus size={15}/> Tambah Statistik
            </button>
          </div>
        </SectionCard>
      )}

      {/* ── TAB: FOOTER ── */}
      {activeTab === 'footer' && (
        <div className="space-y-4">
          <SectionCard title="Informasi Footer" icon={<FiInfo size={16}/>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <Field label="Deskripsi Footer">
                  <textarea className={inputCls} rows={2} value={data.footer.description}
                    onChange={e => setFooter('description', e.target.value)}
                    placeholder="Deskripsi singkat perusahaan..." />
                </Field>
              </div>
              <Field label="Nomor Telepon / WhatsApp">
                <input className={inputCls} value={data.footer.phone}
                  onChange={e => setFooter('phone', e.target.value)}
                  placeholder="+62 812-3456-7890" />
              </Field>
              <Field label="Email">
                <input className={inputCls} value={data.footer.email}
                  onChange={e => setFooter('email', e.target.value)}
                  placeholder="info@afkarland.com" />
              </Field>
              <div className="md:col-span-2">
                <Field label="Alamat Kantor">
                  <input className={inputCls} value={data.footer.address}
                    onChange={e => setFooter('address', e.target.value)}
                    placeholder="Makassar, Sulawesi Selatan" />
                </Field>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Media Sosial" icon={<Smartphone size={16}/>}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Instagram URL">
                <input className={inputCls} value={data.footer.instagram}
                  onChange={e => setFooter('instagram', e.target.value)}
                  placeholder="https://instagram.com/afkarland" />
              </Field>
              <Field label="Facebook URL">
                <input className={inputCls} value={data.footer.facebook}
                  onChange={e => setFooter('facebook', e.target.value)}
                  placeholder="https://facebook.com/afkarland" />
              </Field>
              <Field label="YouTube URL">
                <input className={inputCls} value={data.footer.youtube}
                  onChange={e => setFooter('youtube', e.target.value)}
                  placeholder="https://youtube.com/@afkarland" />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Teks Copyright">
                <input className={inputCls} value={data.footer.copyright}
                  onChange={e => setFooter('copyright', e.target.value)}
                  placeholder="© 2025 AFKAR GROUP INDONESIA. All rights reserved." />
              </Field>
            </div>
          </SectionCard>
        </div>
      )}

      {/* ── TAB: FAQ ── */}
      {activeTab === 'faq' && (
        <SectionCard title="FAQ — Pertanyaan Umum" icon={<span className="text-sm">❓</span>}>
          <div className="space-y-4">
            {data.faq.map((item, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase">FAQ #{i + 1}</span>
                  <button onClick={() => removeFaq(i)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg">
                    <FiTrash2 size={13}/>
                  </button>
                </div>
                <input className={inputCls} value={item.pertanyaan}
                  onChange={e => setFaq(i, 'pertanyaan', e.target.value)}
                  placeholder="Pertanyaan..." />
                <textarea className={inputCls} rows={2} value={item.jawaban}
                  onChange={e => setFaq(i, 'jawaban', e.target.value)}
                  placeholder="Jawaban..." />
              </div>
            ))}
            <button onClick={addFaq}
              className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors w-full justify-center">
              <FiPlus size={15}/> Tambah FAQ
            </button>
          </div>
        </SectionCard>
      )}

      {/* TOMBOL SIMPAN BAWAH */}
      <div className="sticky bottom-4 flex justify-end">
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-sm transition-colors disabled:opacity-60 shadow-xl shadow-red-900/20">
          <FiSave size={16}/> {saving ? 'Menyimpan...' : '💾 Simpan & Publish ke Web'}
        </button>
      </div>

    </div>
  );
}