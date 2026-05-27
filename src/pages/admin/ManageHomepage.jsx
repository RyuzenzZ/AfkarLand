// ManageHomepage.jsx — AFKAR LAND Admin Panel v2
// ─────────────────────────────────────────────────────────────────────────────
// ✅ Redesigned: sidebar nav, compact premium UI, semua 11 section aktif
// ✅ Firestore: simpan ke 'homepage_settings/main' → real-time di semua halaman
// ✅ Cloudinary: semua field gambar bisa upload via widget
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import {
  FiSave, FiPlus, FiTrash2, FiEye, FiImage,
  FiGlobe, FiLayout, FiHome, FiLink, FiInfo,
  FiCheckCircle, FiBriefcase, FiPhone, FiUser,
  FiUpload, FiX, FiMenu, FiChevronLeft,
} from 'react-icons/fi';
import {
  LayoutDashboard, Palette, Smartphone, FileText,
  Megaphone, HelpCircle, Navigation, AlignJustify,
  BarChart3, ImageIcon, Building2,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ── ⚙️  CLOUDINARY CONFIG ────────────────────────────────────────────────────
const CLOUDINARY_CLOUD_NAME    = 'dyrf9qkk0';
const CLOUDINARY_UPLOAD_PRESET = 'articles_upload';
const CLOUDINARY_DEFAULT_FOLDER = 'afkar-land';
const SETTINGS_CACHE_KEY = 'afkar_site_settings_v1';
// ─────────────────────────────────────────────────────────────────────────────

// ── Sidebar navigation groups ────────────────────────────────────────────────
const NAV = [
  {
    group: 'KONTEN BERANDA',
    items: [
      { id: 'hero',      icon: FiHome,        label: 'Hero Banner'    },
      { id: 'konten',    icon: FileText,       label: 'Teks Beranda'   },
      { id: 'statistik', icon: BarChart3,      label: 'Statistik'      },
    ],
  },
  {
    group: 'HALAMAN',
    items: [
      { id: 'about',  icon: Building2,   label: 'Tentang Kami' },
      { id: 'career', icon: FiBriefcase, label: 'Karir'         },
      { id: 'kontak', icon: FiPhone,     label: 'Kontak'        },
      { id: 'faq',    icon: HelpCircle,  label: 'FAQ'           },
    ],
  },
  {
    group: 'VISUAL & SISTEM',
    items: [
      { id: 'pages',    icon: ImageIcon,      label: 'Gambar Halaman' },
      { id: 'branding', icon: Palette,        label: 'Branding & Logo' },
      { id: 'navbar',   icon: Navigation,     label: 'Navbar'          },
      { id: 'footer',   icon: AlignJustify,   label: 'Footer & Sosmed' },
    ],
  },
];

// ── Page list untuk tab Gambar Per Halaman ──────────────────────────────────
const PAGE_LIST = [
  { key: 'home',     label: 'Beranda'       },
  { key: 'about',    label: 'Tentang Kami'  },
  { key: 'projects', label: 'Proyek'        },
  { key: 'career',   label: 'Karir'         },
  { key: 'blog',     label: 'Artikel / Blog'},
  { key: 'contact',  label: 'Kontak'        },
  { key: 'faq',      label: 'FAQ'           },
];

// ── Default state ─────────────────────────────────────────────────────────────
const DEFAULT = {
  branding: {
    logoUrl: '', logoAlt: 'AFKAR LAND',
    siteName: 'AFKAR LAND',
    tagline: 'Properti Syariah Terbaik di Sulawesi',
    faviconUrl: '', primaryColor: '#dc2626',
  },
  navbar: {
    logoUrl: '',
    links: [
      { label: 'Beranda',      path: '/'             },
      { label: 'Tentang Kami', path: '/tentang-kami' },
      { label: 'Proyek',       path: '/proyek'        },
      { label: 'Artikel',      path: '/artikel'       },
      { label: 'Karir',        path: '/karir'         },
      { label: 'Kontak',       path: '/kontak'        },
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
    badge: 'Developer Property Syariah Terpercaya',
    judul: 'Hunian Syariah Modern\nuntuk Masa Depan Keluarga Anda',
    subjudul: 'AFKAR LAND menghadirkan kawasan property syariah premium tanpa riba, tanpa bank, tanpa bunga, dan tanpa sita dengan konsep hunian modern islami di Indonesia Timur.',
    ctaUtama: 'Lihat Project Kami', ctaUtamaLink: '/proyek',
    ctaKedua: 'Jadwalkan Survey Lokasi', ctaKeduaLink: '/kontak',
  },
  statistik: [
    { label: 'Unit Terjual', value: '500+' },
    { label: 'Proyek Aktif', value: '4'    },
    { label: 'Kota Jangkauan', value: '8+' },
    { label: 'Kepuasan Klien', value: '98%'},
  ],
  konten: {
    tentangParagraf1: 'AFKAR LAND adalah perusahaan pengembang property syariah modern yang berfokus menghadirkan kawasan hunian nyaman, berkualitas, dan bernilai investasi tinggi.',
    tentangParagraf2: 'Kami hadir untuk memberikan solusi kepemilikan rumah tanpa riba melalui sistem transaksi syariah yang aman, transparan, dan sesuai prinsip Islam.',
    pilarSyariah: ['Tanpa Bank', 'Tanpa Bunga', 'Tanpa Denda', 'Tanpa Sita', 'Tanpa BI Checking', 'Tanpa Penalti', 'Tanpa Asuransi'],
    ctaPenutupJudul:    'Siap Memiliki Hunian Syariah Impian Anda?',
    ctaPenutupSubjudul: 'Konsultasikan kebutuhan property Anda bersama tim konsultan profesional AFKAR LAND sekarang juga.',
    trustSubjudul: 'AfkarLand berkomitmen untuk menghadirkan dan mengembangkan proyek properti syariah di seluruh wilayah sulawesi.',
  },
  about: {
    heroBadge: 'Tentang AFKAR LAND',
    heroJudul: 'Membangun Hunian Syariah dengan Amanah',
    heroSubjudul: 'AFKAR LAND adalah perusahaan pengembang properti syariah yang berkomitmen menghadirkan hunian nyaman, berkualitas, dan sesuai prinsip Islam tanpa riba.',
    heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80',
    ctaUtamaLabel: 'Lihat Proyek', ctaUtamaLink: '/proyek',
    companyImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
    companyJudul: 'Berawal dari Sebuah Tujuan yang Baik',
    companyParagraf1: 'AFKAR LAND hadir untuk membantu masyarakat memiliki hunian yang nyaman dengan proses yang lebih aman, transparan, dan sesuai prinsip syariah.',
    companyParagraf2: 'Kami percaya bahwa rumah bukan hanya tempat tinggal, tetapi tempat tumbuhnya keluarga, pendidikan anak, dan keberkahan kehidupan.',
    founderImage: '/images/ustadz.png',
    founderNama: 'Ustadz Haris Amrin',
    founderJabatan: 'Founder AFKAR LAND',
    founderKutipan: 'Kami ingin menghadirkan lingkungan yang nyaman, islami, dan membawa keberkahan bagi setiap keluarga.',
    ctaJudul: 'Temukan Hunian Syariah Pilihan Anda',
    ctaSubjudul: 'Jelajahi berbagai proyek property syariah AFKAR LAND yang dirancang untuk kenyamanan dan masa depan keluarga Anda.',
    ctaLink: '/proyek', ctaLabel: 'Lihat Semua Proyek',
  },
  career: {
    heroJudul:        'Tumbuh Bersama AFKAR LAND',
    heroSubjudul:     'Bangun karir cemerlang di industri properti sambil mengumpulkan amal jariyah melalui sistem kerja yang profesional dan islami.',
    heroImage:        'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80',
    budayaImage:      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80',
    hrPortalLink:     'https://sites.google.com/view/afkar-rekrutmen/',
    hrdWaNumber:      '6285355355323',
    hrdNama:          'Pak Abdi',
    rekrutmenPeriode: '13 Mei – 25 Mei 2026',
    rekrutmenTahun:   '2026',
    rekrutmenLokasi:  'Makassar & Wotu',
    flyerImage:       '/lowongan/open-recruitment.jpg',
    posisi: [
      { title: 'Marketing Executive', prioritas: true,  emoji: '📣', jobdesk: ['Mencari & mengelola calon pembeli (leads)', 'Follow up database & komunikasi calon konsumen', 'Closing penjualan & membuat laporan harian'] },
      { title: 'Teknik',              prioritas: true,  emoji: '🔧', jobdesk: ['Merencanakan & mengawasi pelaksanaan proyek', 'Membuat gambar kerja, RAB & time schedule', 'Koordinasi kontraktor, vendor & tim terkait'] },
      { title: 'Sales Leader',        prioritas: false, emoji: '🏆', jobdesk: ['Memimpin & mengelola tim sales', 'Menyusun strategi penjualan & rencana kerja'] },
    ],
  },
  contact: {
    heroJudul:    'Kami Siap Membantu',
    heroSubjudul: 'Tinggalkan pesan atau kunjungi kantor pemasaran kami untuk informasi lebih lanjut.',
    waNumber:     '6285705218281',
    emailAddress: 'Afkargroupindonesia@gmail.com',
    alamat:       'Makassar, Sulawesi Selatan, Indonesia',
    mapsEmbed:    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d478.6!2d119.5068271!3d-5.1308482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbefd83f4ba7a69%3A0x84a26c0292a6dff1!2sAFKAR%20MADANI%20ESTATE!5e0!3m2!1sid!2sid!4v1716301234567!5m2!1sid!2sid',
    jamSenin:     '09.00 – 17.00',
    jamSabtu:     '09.00 – 16.00',
    jamMinggu:    'By Confirmation',
  },
  footer: {
    description: 'Membangun hunian berkualitas dengan prinsip syariah untuk keluarga Indonesia.',
    phone: '+62 812-3456-7890', email: 'info@afkarland.com',
    address: 'Makassar, Sulawesi Selatan',
    instagram: '', facebook: '', youtube: '', tiktok: '',
    copyright: '© 2025 AFKAR LAND. All rights reserved.',
  },
  faq: [
    { pertanyaan: 'Apakah produk AFKAR LAND bersertifikat syariah?', jawaban: 'Ya, semua produk kami telah melalui kajian syariah dan bebas dari riba.' },
    { pertanyaan: 'Bagaimana cara pemesanan unit?', jawaban: 'Anda bisa mengisi formulir booking di halaman detail proyek atau menghubungi tim kami.' },
  ],
};

// ── Cloudinary upload ─────────────────────────────────────────────────────────
const openCloudinaryWidget = (onSuccess, folder = CLOUDINARY_DEFAULT_FOLDER) => {
  if (!window.cloudinary) {
    toast.error('Upload widget belum siap. Refresh halaman dan coba lagi.');
    return;
  }
  window.cloudinary.createUploadWidget(
    {
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
      sources: ['local', 'url', 'camera'],
      multiple: false,
      folder,
      resourceType: 'image',
      clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
      maxImageFileSize: 8000000,
      styles: {
        palette: { window: '#FFFFFF', link: '#DC2626', action: '#DC2626', complete: '#10B981' },
      },
    },
    (error, result) => {
      if (error) { toast.error('Upload gagal: ' + (error.message || 'Error')); return; }
      if (result?.event === 'success') {
        onSuccess(result.info.secure_url);
        toast.success('✅ Gambar berhasil diupload!');
      }
    }
  ).open();
};

// ── Shared UI primitives ──────────────────────────────────────────────────────
const ic = 'w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 caret-gray-900 focus:border-red-400 outline-none text-sm transition-colors';

const Row = ({ children, cols = 2 }) => (
  <div className={`grid gap-3 ${cols === 1 ? '' : cols === 3 ? 'grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>{children}</div>
);

const F = ({ label, hint, span, children }) => (
  <div className={span === 2 ? 'md:col-span-2' : ''}>
    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
    {hint && <p className="text-[11px] text-gray-400 mb-1.5">{hint}</p>}
    {children}
  </div>
);

const Card = ({ title, icon, accent, children }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    {accent && <div className={`h-0.5 ${accent}`} />}
    <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2.5">
      <span className="text-red-500 flex-shrink-0">{icon}</span>
      <span className="font-bold text-gray-800 text-sm">{title}</span>
    </div>
    <div className="p-4 space-y-3">{children}</div>
  </div>
);

const ImgField = ({ label, hint, value, onChange, folder, previewH = 'h-28' }) => (
  <F label={label} hint={hint}>
    <div className="flex gap-2 mb-2">
      <input className={`${ic} flex-1`} value={value || ''} onChange={e => onChange(e.target.value)} placeholder="URL gambar atau upload →"/>
      <button type="button" onClick={() => openCloudinaryWidget(onChange, folder)}
        className="flex items-center gap-1 px-3 py-2 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg text-sky-600 text-xs font-bold transition-colors shrink-0">
        <FiUpload size={12}/> Upload
      </button>
    </div>
    {value && (
      <div className="relative group">
        <img src={value} alt="preview" className={`w-full ${previewH} object-cover rounded-lg border border-gray-100`} onError={e => { e.target.style.display = 'none'; }}/>
        <button type="button" onClick={() => onChange('')}
          className="absolute top-1.5 right-1.5 p-1 bg-black/60 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
          <FiX size={11}/>
        </button>
      </div>
    )}
  </F>
);

const AddBtn = ({ onClick, label }) => (
  <button onClick={onClick} className="flex items-center gap-1.5 w-full justify-center px-4 py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors">
    <FiPlus size={14}/> {label}
  </button>
);

// ── Indicator dot — shows if a section has data ───────────────────────────────
const hasSectionData = (id, data) => {
  if (id === 'hero')      return !!data.hero?.judul;
  if (id === 'konten')    return !!data.konten?.tentangParagraf1;
  if (id === 'statistik') return data.statistik?.length > 0;
  if (id === 'about')     return !!data.about?.heroJudul;
  if (id === 'career')    return !!data.career?.heroJudul;
  if (id === 'kontak')    return !!data.contact?.waNumber;
  if (id === 'faq')       return data.faq?.length > 0;
  if (id === 'pages')     return Object.values(data.pages || {}).some(p => p.heroImage);
  if (id === 'branding')  return !!data.branding?.logoUrl;
  if (id === 'navbar')    return data.navbar?.links?.length > 0;
  if (id === 'footer')    return !!data.footer?.phone;
  return false;
};

// ════════════════════════════════════════════════════════════════════════════
export default function ManageHomepage() {
  const [data,       setData]       = useState(DEFAULT);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [active,     setActive]     = useState('hero');
  const [activePage, setActivePage] = useState('home');
  const [sideOpen,   setSideOpen]   = useState(true);

  // ── Load Cloudinary widget ─────────────────────────────────────────────────
  useEffect(() => {
    if (window.cloudinary || document.getElementById('cld-widget')) return;
    const s = document.createElement('script');
    s.id = 'cld-widget'; s.async = true;
    s.src = 'https://upload-widget.cloudinary.com/global/all.js';
    document.head.appendChild(s);
  }, []);

  // ── Load from Firestore ────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'homepage_settings', 'main'));
        if (snap.exists()) {
          const s = snap.data();
          setData(prev => ({
            ...prev, ...s,
            branding:  { ...prev.branding,  ...s.branding  },
            navbar:    { ...prev.navbar,    ...s.navbar, links: s.navbar?.links || prev.navbar.links },
            pages:     { ...prev.pages,     ...s.pages     },
            hero:      { ...prev.hero,      ...s.hero      },
            footer:    { ...prev.footer,    ...s.footer    },
            konten:    { ...prev.konten,    ...s.konten    },
            about:     { ...prev.about,     ...s.about     },
            career:    { ...prev.career,    ...s.career, posisi: s.career?.posisi || prev.career.posisi },
            contact:   { ...prev.contact,   ...s.contact   },
            statistik: s.statistik || prev.statistik,
            faq:       s.faq       || prev.faq,
          }));
        }
      } catch { /* pakai default */ }
      finally { setLoading(false); }
    })();
  }, []);

  // ── Save all to Firestore ──────────────────────────────────────────────────
  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'homepage_settings', 'main'), data, { merge: true });
      try {
        window.localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(data));
      } catch {
        // Firestore is the source of truth; cache only prevents stale first paint.
      }
      toast.success('✅ Semua perubahan disimpan dan langsung tampil di web!');
    } catch {
      toast.error('Gagal menyimpan. Cek koneksi dan coba lagi.');
    } finally { setSaving(false); }
  };

  // ── Setters ────────────────────────────────────────────────────────────────
  const set  = (key, field, val) => setData(d => ({ ...d, [key]: { ...d[key], [field]: val } }));
  const setPageField = (pg, k, v) =>
    setData(d => ({ ...d, pages: { ...d.pages, [pg]: { ...d.pages[pg], [k]: v } } }));

  const setBranding = (k, v) => set('branding', k, v);
  const setNavbar   = (k, v) => set('navbar',   k, v);
  const setHero     = (k, v) => set('hero',     k, v);
  const setFooter   = (k, v) => set('footer',   k, v);
  const setKonten   = (k, v) => set('konten',   k, v);
  const setAbout    = (k, v) => set('about',    k, v);
  const setCareer   = (k, v) => set('career',   k, v);
  const setContact  = (k, v) => set('contact',  k, v);

  const setStat    = (i, k, v) => setData(d => { const s=[...d.statistik]; s[i]={...s[i],[k]:v}; return {...d,statistik:s}; });
  const addStat    = ()        => setData(d => ({ ...d, statistik: [...d.statistik, { label: '', value: '' }] }));
  const removeStat = (i)       => setData(d => ({ ...d, statistik: d.statistik.filter((_,x)=>x!==i) }));

  const setFaq     = (i, k, v) => setData(d => { const f=[...d.faq]; f[i]={...f[i],[k]:v}; return {...d,faq:f}; });
  const addFaq     = ()        => setData(d => ({ ...d, faq: [...d.faq, { pertanyaan: '', jawaban: '' }] }));
  const removeFaq  = (i)       => setData(d => ({ ...d, faq: d.faq.filter((_,x)=>x!==i) }));

  const setNavLink    = (i,k,v) => setData(d => { const l=[...d.navbar.links]; l[i]={...l[i],[k]:v}; return {...d,navbar:{...d.navbar,links:l}}; });
  const addNavLink    = ()      => setData(d => ({ ...d, navbar: { ...d.navbar, links: [...d.navbar.links, { label:'', path:'' }] } }));
  const removeNavLink = (i)     => setData(d => ({ ...d, navbar: { ...d.navbar, links: d.navbar.links.filter((_,x)=>x!==i) } }));

  const setPilar    = (i,v) => setData(d => { const p=[...(d.konten.pilarSyariah||[])]; p[i]=v; return {...d,konten:{...d.konten,pilarSyariah:p}}; });
  const addPilar    = ()    => setData(d => ({ ...d, konten: { ...d.konten, pilarSyariah: [...(d.konten.pilarSyariah||[]), ''] } }));
  const removePilar = (i)   => setData(d => ({ ...d, konten: { ...d.konten, pilarSyariah: (d.konten.pilarSyariah||[]).filter((_,x)=>x!==i) } }));

  const setPosisi    = (i,k,v) => setData(d => { const p=[...d.career.posisi]; p[i]={...p[i],[k]:v}; return {...d,career:{...d.career,posisi:p}}; });
  const addPosisi    = ()      => setData(d => ({ ...d, career: { ...d.career, posisi: [...d.career.posisi, { title:'', prioritas:false, emoji:'💼', jobdesk:[''] }] } }));
  const removePosisi = (i)     => setData(d => ({ ...d, career: { ...d.career, posisi: d.career.posisi.filter((_,x)=>x!==i) } }));
  const setJobdesk    = (pi,ji,v) => setData(d => { const p=[...d.career.posisi]; const jd=[...p[pi].jobdesk]; jd[ji]=v; p[pi]={...p[pi],jobdesk:jd}; return {...d,career:{...d.career,posisi:p}}; });
  const addJobdesk    = (pi)      => setData(d => { const p=[...d.career.posisi]; p[pi]={...p[pi],jobdesk:[...p[pi].jobdesk,'']}; return {...d,career:{...d.career,posisi:p}}; });
  const removeJobdesk = (pi,ji)   => setData(d => { const p=[...d.career.posisi]; p[pi]={...p[pi],jobdesk:p[pi].jobdesk.filter((_,x)=>x!==ji)}; return {...d,career:{...d.career,posisi:p}}; });

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400 text-sm animate-pulse">
      Memuat pengaturan website...
    </div>
  );

  const currentSection = NAV.flatMap(g => g.items).find(i => i.id === active);

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-full min-h-screen bg-gray-50 font-sans">

      {/* ── SIDEBAR ─────────────────────────────────────────────────────────── */}
      <aside className={`${sideOpen ? 'w-56' : 'w-14'} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-200 overflow-hidden shadow-sm`}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-3 py-3.5 border-b border-gray-100">
          {sideOpen && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[9px] font-black">AL</span>
              </div>
              <span className="text-gray-900 font-black text-xs tracking-widest">AFKAR CMS</span>
            </div>
          )}
          <button onClick={() => setSideOpen(o => !o)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors ml-auto">
            {sideOpen ? <FiChevronLeft size={15}/> : <FiMenu size={15}/>}
          </button>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {NAV.map(group => (
            <div key={group.group} className="mb-4">
              {sideOpen && (
                <p className="px-2 pb-1 text-[9px] font-extrabold text-gray-300 uppercase tracking-widest">{group.group}</p>
              )}
              {!sideOpen && <div className="border-t border-gray-100 my-2"/>}
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = active === item.id;
                  const hasData = hasSectionData(item.id, data);
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActive(item.id)}
                      title={!sideOpen ? item.label : undefined}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all text-left
                        ${isActive
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}
                    >
                      <Icon size={15} className="flex-shrink-0"/>
                      {sideOpen && (
                        <>
                          <span className="text-xs font-medium truncate">{item.label}</span>
                          {hasData && !isActive && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"/>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar footer: Preview button */}
        <div className="p-2 border-t border-gray-100">
          <a href="/" target="_blank" rel="noreferrer"
            className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors ${!sideOpen ? 'justify-center' : ''}`}>
            <FiEye size={14}/>
            {sideOpen && <span className="text-xs font-medium">Preview Web</span>}
          </a>
        </div>
      </aside>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="font-black text-gray-900 text-base leading-tight">
              {currentSection?.label || 'Manajemen Website'}
            </h1>
            <p className="text-[11px] text-gray-400 mt-0.5">Simpan → langsung tampil di semua halaman publik</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
              Firestore aktif
            </div>
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-lg font-bold text-xs shadow-sm transition-colors"
            >
              <FiSave size={13}/> {saving ? 'Menyimpan...' : 'Simpan & Publish'}
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* ── HERO ─────────────────────────────────────────────────────────── */}
          {active === 'hero' && (<>
            <Card title="Hero Banner — Halaman Beranda" icon={<FiHome size={14}/>} accent="bg-gradient-to-r from-red-600 to-red-400">
              <Row>
                <F label="Badge / Label Kecil"><input className={ic} value={data.hero.badge} onChange={e => setHero('badge', e.target.value)} placeholder="Developer Property Syariah Terpercaya"/></F>
                <F label="Judul Utama (\\n untuk baris baru)"><input className={ic} value={data.hero.judul} onChange={e => setHero('judul', e.target.value)} placeholder="Hunian Syariah Modern\n..."/></F>
                <F label="Sub-judul" span={2}><textarea className={ic} rows={2} value={data.hero.subjudul} onChange={e => setHero('subjudul', e.target.value)}/></F>
                <F label="Teks Tombol Utama"><input className={ic} value={data.hero.ctaUtama} onChange={e => setHero('ctaUtama', e.target.value)}/></F>
                <F label="Link Tombol Utama"><input className={ic} value={data.hero.ctaUtamaLink} onChange={e => setHero('ctaUtamaLink', e.target.value)} placeholder="/proyek"/></F>
                <F label="Teks Tombol Kedua"><input className={ic} value={data.hero.ctaKedua} onChange={e => setHero('ctaKedua', e.target.value)}/></F>
                <F label="Link Tombol Kedua"><input className={ic} value={data.hero.ctaKeduaLink} onChange={e => setHero('ctaKeduaLink', e.target.value)} placeholder="/kontak"/></F>
              </Row>
            </Card>

            {/* Hero live preview */}
            <div className="bg-gray-900 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 to-transparent pointer-events-none"/>
              <div className="relative z-10 text-center max-w-md mx-auto">
                {data.hero.badge && <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest mb-2">· {data.hero.badge} ·</p>}
                <h2 className="text-white text-xl font-black leading-tight mb-2">
                  {(data.hero.judul || 'Judul Hero').split('\n').map((l, i) => (
                    <span key={i}>{i > 0 && <br/>}<span className={i > 0 ? 'text-red-400' : ''}>{l}</span></span>
                  ))}
                </h2>
                {data.hero.subjudul && <p className="text-gray-400 text-xs mb-3">{data.hero.subjudul.slice(0, 100)}…</p>}
                <div className="flex gap-2 justify-center">
                  <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg">{data.hero.ctaUtama || 'CTA Utama'}</span>
                  <span className="border border-white/20 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg">{data.hero.ctaKedua || 'CTA Kedua'}</span>
                </div>
              </div>
              <span className="absolute top-2 right-2 text-[9px] bg-white/10 text-gray-400 px-2 py-0.5 rounded-md">Live Preview</span>
            </div>
          </>)}

          {/* ── KONTEN BERANDA ────────────────────────────────────────────────── */}
          {active === 'konten' && (<>
            <Card title="Teks Tentang AFKAR LAND" icon={<FileText size={14}/>}>
              <F label="Paragraf 1"><textarea className={ic} rows={3} value={data.konten.tentangParagraf1} onChange={e => setKonten('tentangParagraf1', e.target.value)}/></F>
              <F label="Paragraf 2"><textarea className={ic} rows={3} value={data.konten.tentangParagraf2} onChange={e => setKonten('tentangParagraf2', e.target.value)}/></F>
            </Card>

            <Card title="7 Pilar Transaksi Syariah" icon={<FiCheckCircle size={14}/>}>
              <div className="space-y-2">
                {(data.konten.pilarSyariah || []).map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 w-4 shrink-0">{i+1}</span>
                    <input className={`${ic} flex-1`} value={p} onChange={e => setPilar(i, e.target.value)} placeholder="Tanpa Bank"/>
                    <button onClick={() => removePilar(i)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><FiTrash2 size={12}/></button>
                  </div>
                ))}
                <AddBtn onClick={addPilar} label="Tambah Pilar"/>
              </div>
            </Card>

            <Card title="Section Trust & CTA Penutup" icon={<Megaphone size={14}/>}>
              <F label="Sub-judul Section Trust"><textarea className={ic} rows={2} value={data.konten.trustSubjudul} onChange={e => setKonten('trustSubjudul', e.target.value)}/></F>
              <Row>
                <F label="Judul CTA Penutup"><input className={ic} value={data.konten.ctaPenutupJudul} onChange={e => setKonten('ctaPenutupJudul', e.target.value)}/></F>
                <F label="Sub-judul CTA Penutup"><textarea className={ic} rows={2} value={data.konten.ctaPenutupSubjudul} onChange={e => setKonten('ctaPenutupSubjudul', e.target.value)}/></F>
              </Row>
            </Card>
          </>)}

          {/* ── STATISTIK ─────────────────────────────────────────────────────── */}
          {active === 'statistik' && (
            <Card title="Statistik Perusahaan" icon={<BarChart3 size={14}/>}>
              <div className="space-y-2">
                {data.statistik.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                    <input className={`${ic} w-24`} value={s.value} onChange={e => setStat(i,'value',e.target.value)} placeholder="500+"/>
                    <input className={`${ic} flex-1`} value={s.label} onChange={e => setStat(i,'label',e.target.value)} placeholder="Unit Terjual"/>
                    <button onClick={() => removeStat(i)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><FiTrash2 size={12}/></button>
                  </div>
                ))}
                <AddBtn onClick={addStat} label="Tambah Statistik"/>
              </div>
              {/* Preview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-900 rounded-xl p-4 mt-2">
                {data.statistik.filter(s => s.value||s.label).map((s,i) => (
                  <div key={i} className="text-center">
                    <div className="text-red-500 font-black text-xl">{s.value}</div>
                    <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{s.label}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* ── TENTANG KAMI ─────────────────────────────────────────────────── */}
          {active === 'about' && (<>
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 flex items-center gap-2.5">
              <span className="text-base shrink-0">ℹ️</span>
              <p className="text-xs text-blue-700">Perubahan ini langsung tampil di halaman <strong>/tentang-kami</strong> setelah disimpan.</p>
            </div>

            <Card title="Hero — Halaman Tentang Kami" icon={<FiInfo size={14}/>} accent="bg-gradient-to-r from-blue-500 to-blue-400">
              <Row>
                <F label="Badge Kecil"><input className={ic} value={data.about.heroBadge} onChange={e => setAbout('heroBadge', e.target.value)}/></F>
                <F label="Judul Hero"><input className={ic} value={data.about.heroJudul} onChange={e => setAbout('heroJudul', e.target.value)}/></F>
                <F label="Sub-judul Hero" span={2}><textarea className={ic} rows={2} value={data.about.heroSubjudul} onChange={e => setAbout('heroSubjudul', e.target.value)}/></F>
              </Row>
              <ImgField label="Gambar Hero" value={data.about.heroImage} onChange={v => setAbout('heroImage', v)} folder="afkar-land/about"/>
              <Row>
                <F label="Label Tombol CTA"><input className={ic} value={data.about.ctaUtamaLabel} onChange={e => setAbout('ctaUtamaLabel', e.target.value)}/></F>
                <F label="Link Tombol CTA"><input className={ic} value={data.about.ctaUtamaLink} onChange={e => setAbout('ctaUtamaLink', e.target.value)} placeholder="/proyek"/></F>
              </Row>
            </Card>

            <Card title="Section Perusahaan" icon={<Building2 size={14}/>}>
              <ImgField label="Foto Perusahaan" value={data.about.companyImage} onChange={v => setAbout('companyImage', v)} folder="afkar-land/about"/>
              <F label="Judul Section"><input className={ic} value={data.about.companyJudul} onChange={e => setAbout('companyJudul', e.target.value)}/></F>
              <F label="Paragraf 1"><textarea className={ic} rows={2} value={data.about.companyParagraf1} onChange={e => setAbout('companyParagraf1', e.target.value)}/></F>
              <F label="Paragraf 2"><textarea className={ic} rows={2} value={data.about.companyParagraf2} onChange={e => setAbout('companyParagraf2', e.target.value)}/></F>
            </Card>

            <Card title="Founder / Testimoni" icon={<FiUser size={14}/>}>
              <Row>
                <ImgField label="Foto Founder" value={data.about.founderImage} onChange={v => setAbout('founderImage', v)} folder="afkar-land/about" previewH="h-20"/>
                <div className="space-y-3">
                  <F label="Nama"><input className={ic} value={data.about.founderNama} onChange={e => setAbout('founderNama', e.target.value)}/></F>
                  <F label="Jabatan"><input className={ic} value={data.about.founderJabatan} onChange={e => setAbout('founderJabatan', e.target.value)}/></F>
                </div>
              </Row>
              <F label="Kutipan"><textarea className={ic} rows={2} value={data.about.founderKutipan} onChange={e => setAbout('founderKutipan', e.target.value)}/></F>
            </Card>

            <Card title="CTA Penutup About" icon={<Megaphone size={14}/>}>
              <Row>
                <F label="Judul CTA"><input className={ic} value={data.about.ctaJudul} onChange={e => setAbout('ctaJudul', e.target.value)}/></F>
                <F label="Link Tombol"><input className={ic} value={data.about.ctaLink} onChange={e => setAbout('ctaLink', e.target.value)}/></F>
                <F label="Sub-judul CTA" span={2}><textarea className={ic} rows={2} value={data.about.ctaSubjudul} onChange={e => setAbout('ctaSubjudul', e.target.value)}/></F>
              </Row>
            </Card>
          </>)}

          {/* ── KARIR ─────────────────────────────────────────────────────────── */}
          {active === 'career' && (<>
            <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-2.5 flex items-center gap-2.5">
              <span className="text-base shrink-0">💼</span>
              <p className="text-xs text-orange-700">Perubahan langsung tampil di <strong>/karir</strong> setelah disimpan. Pastikan <code className="bg-orange-100 px-1 rounded">Career.jsx</code> sudah menggunakan <code className="bg-orange-100 px-1 rounded">useSiteSettings</code>.</p>
            </div>

            <Card title="Hero — Halaman Karir" icon={<FiBriefcase size={14}/>} accent="bg-gradient-to-r from-orange-500 to-orange-400">
              <Row>
                <F label="Judul Hero"><input className={ic} value={data.career.heroJudul} onChange={e => setCareer('heroJudul', e.target.value)}/></F>
                <F label="Sub-judul Hero"><textarea className={ic} rows={2} value={data.career.heroSubjudul} onChange={e => setCareer('heroSubjudul', e.target.value)}/></F>
              </Row>
              <Row>
                <ImgField label="Gambar Hero" value={data.career.heroImage} onChange={v => setCareer('heroImage', v)} folder="afkar-land/career"/>
                <ImgField label="Gambar Budaya Kerja" value={data.career.budayaImage} onChange={v => setCareer('budayaImage', v)} folder="afkar-land/career"/>
              </Row>
            </Card>

            <Card title="Info Rekrutmen & Kontak HRD" icon={<FiPhone size={14}/>}>
              <Row>
                <F label="No. WA HRD (628xxx)" hint="Untuk tombol Lamar Sekarang"><input className={ic} value={data.career.hrdWaNumber} onChange={e => setCareer('hrdWaNumber', e.target.value)} placeholder="6285355355323"/></F>
                <F label="Nama PIC HRD"><input className={ic} value={data.career.hrdNama} onChange={e => setCareer('hrdNama', e.target.value)} placeholder="Pak Abdi"/></F>
                <F label="Periode Rekrutmen"><input className={ic} value={data.career.rekrutmenPeriode} onChange={e => setCareer('rekrutmenPeriode', e.target.value)} placeholder="13 Mei – 25 Mei 2026"/></F>
                <F label="Tahun Rekrutmen"><input className={ic} value={data.career.rekrutmenTahun} onChange={e => setCareer('rekrutmenTahun', e.target.value)} placeholder="2026"/></F>
                <F label="Lokasi Penempatan"><input className={ic} value={data.career.rekrutmenLokasi} onChange={e => setCareer('rekrutmenLokasi', e.target.value)} placeholder="Makassar & Wotu"/></F>
                <F label="Link Portal Rekrutmen" span={2}><input className={ic} value={data.career.hrPortalLink} onChange={e => setCareer('hrPortalLink', e.target.value)} placeholder="https://sites.google.com/..."/></F>
              </Row>
              <ImgField label="Flyer Lowongan" value={data.career.flyerImage} onChange={v => setCareer('flyerImage', v)} folder="afkar-land/career" previewH="h-40"/>
            </Card>

            <Card title="Preview Tampilan Karir" icon={<FiBriefcase size={14}/>} accent="bg-gradient-to-r from-orange-400 to-yellow-400">
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-[#080808]">
                {/* Mini browser chrome */}
                <div className="bg-gray-900 px-3 py-1.5 flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500/70"/>
                    <span className="w-2 h-2 rounded-full bg-yellow-500/70"/>
                    <span className="w-2 h-2 rounded-full bg-green-500/70"/>
                  </div>
                  <div className="flex-1 bg-gray-700 rounded px-2 py-0.5 text-[9px] text-gray-400 font-mono">afkarland.com/karir</div>
                </div>
                {/* Hero preview */}
                <div className="relative h-28 bg-gray-900 overflow-hidden">
                  {data.career.heroImage
                    ? <img src={data.career.heroImage} alt="hero" className="w-full h-full object-cover opacity-60" onError={e=>{e.target.style.display='none'}}/>
                    : <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800"/>
                  }
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <span className="text-[9px] border border-red-500/40 bg-red-500/10 text-red-400 font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-1">Karir & Peluang</span>
                    <p className="font-extrabold text-base text-center px-4 drop-shadow">{data.career.heroJudul || 'Judul Hero Karir'}</p>
                  </div>
                </div>
                {/* Flyer + info row */}
                <div className="flex gap-3 p-3 bg-[#111]">
                  {data.career.flyerImage
                    ? <img src={data.career.flyerImage} alt="flyer" className="w-16 h-20 object-cover rounded-lg border border-white/10 shrink-0" onError={e=>{e.target.style.display='none'}}/>
                    : <div className="w-16 h-20 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <span className="text-gray-500 text-[9px] text-center leading-tight px-1">Belum ada flyer</span>
                      </div>
                  }
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <p className="text-white text-xs font-extrabold leading-tight">Open Recruitment {data.career.rekrutmenTahun || '2026'}</p>
                    <p className="text-white/40 text-[9px]">📅 {data.career.rekrutmenPeriode || '—'}</p>
                    <p className="text-white/40 text-[9px]">📍 {data.career.rekrutmenLokasi || '—'}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(data.career.posisi||[]).slice(0,3).map((p,i) => (
                        <span key={i} className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${p.prioritas ? 'bg-red-900/40 border-red-500/30 text-red-400' : 'bg-white/5 border-white/10 text-white/40'}`}>
                          {p.emoji} {p.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Budaya image row */}
                {data.career.budayaImage && (
                  <div className="relative h-16 overflow-hidden">
                    <img src={data.career.budayaImage} alt="budaya" className="w-full h-full object-cover opacity-50" onError={e=>{e.target.style.display='none'}}/>
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white/60 text-[9px] font-bold uppercase tracking-widest">Section Budaya Kerja</span>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-gray-400 mt-2">Preview ini menampilkan gambaran halaman /karir setelah data disimpan.</p>
            </Card>

            <Card title="Daftar Posisi Lowongan" icon={<FiPlus size={14}/>}>
              <div className="space-y-3">
                {(data.career.posisi || []).map((pos, pi) => (
                  <div key={pi} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 border-b border-gray-100">
                      <input className="w-9 px-1.5 py-1 rounded-lg bg-white border border-gray-200 text-center text-xs text-gray-900 placeholder:text-gray-400 caret-gray-900 outline-none"
                        value={pos.emoji} onChange={e => setPosisi(pi,'emoji',e.target.value)}/>
                      <input className="flex-1 px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-sm font-bold text-gray-900 placeholder:text-gray-400 caret-gray-900 outline-none focus:border-red-400"
                        value={pos.title} onChange={e => setPosisi(pi,'title',e.target.value)} placeholder="Nama Posisi"/>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 cursor-pointer">
                        <input type="checkbox" checked={pos.prioritas||false} onChange={e => setPosisi(pi,'prioritas',e.target.checked)} className="w-3.5 h-3.5 accent-red-600"/>
                        Prioritas
                      </label>
                      <button onClick={() => removePosisi(pi)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><FiTrash2 size={13}/></button>
                    </div>
                    <div className="p-3 space-y-1.5">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tanggung Jawab</p>
                      {(pos.jobdesk||[]).map((jd, ji) => (
                        <div key={ji} className="flex items-center gap-2">
                          <span className="text-gray-300 text-xs">•</span>
                          <input className={`${ic} flex-1`} value={jd} onChange={e => setJobdesk(pi,ji,e.target.value)} placeholder="Tanggung jawab..."/>
                          <button onClick={() => removeJobdesk(pi,ji)} className="p-1.5 text-red-300 hover:bg-red-50 rounded-lg"><FiTrash2 size={11}/></button>
                        </div>
                      ))}
                      <button onClick={() => addJobdesk(pi)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors mt-1">
                        <FiPlus size={11}/> Tambah item
                      </button>
                    </div>
                  </div>
                ))}
                <AddBtn onClick={addPosisi} label="Tambah Posisi Baru"/>
              </div>
              {/* Badge preview */}
              {(data.career.posisi||[]).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {data.career.posisi.map((p,i) => (
                    <span key={i} className={`text-xs font-bold px-2.5 py-1 rounded-lg border
                      ${p.prioritas ? 'bg-red-50 text-red-700 border-red-100' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                      {p.emoji} {p.title||'—'}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          </>)}

          {/* ── KONTAK ─────────────────────────────────────────────────────────── */}
          {active === 'kontak' && (<>
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 flex items-center gap-2.5">
              <span className="shrink-0">📞</span>
              <p className="text-xs text-green-700">Perubahan langsung tampil di <strong>/kontak</strong>. Pastikan <code className="bg-green-100 px-1 rounded">Contact.jsx</code> menggunakan <code className="bg-green-100 px-1 rounded">useSiteSettings</code>.</p>
            </div>

            <Card title="Hero — Halaman Kontak" icon={<FiPhone size={14}/>} accent="bg-gradient-to-r from-green-500 to-green-400">
              <F label="Judul Hero"><input className={ic} value={data.contact.heroJudul} onChange={e => setContact('heroJudul', e.target.value)} placeholder="Kami Siap Membantu"/></F>
              <F label="Sub-judul Hero"><textarea className={ic} rows={2} value={data.contact.heroSubjudul} onChange={e => setContact('heroSubjudul', e.target.value)}/></F>
            </Card>

            <Card title="Informasi Kontak" icon={<FiInfo size={14}/>}>
              <Row>
                <F label="No. WA (628xxx)" hint="Tombol Chat WhatsApp"><input className={ic} value={data.contact.waNumber} onChange={e => setContact('waNumber', e.target.value)} placeholder="6285705218281"/></F>
                <F label="Email Resmi"><input className={ic} value={data.contact.emailAddress} onChange={e => setContact('emailAddress', e.target.value)} placeholder="info@afkarland.com"/></F>
                <F label="Alamat Kantor" span={2}><input className={ic} value={data.contact.alamat} onChange={e => setContact('alamat', e.target.value)} placeholder="Makassar, Sulawesi Selatan, Indonesia"/></F>
              </Row>
            </Card>

            <Card title="Jam Operasional" icon={<span className="text-sm">🕒</span>}>
              <div className="grid grid-cols-3 gap-3">
                <F label="Senin – Jumat"><input className={ic} value={data.contact.jamSenin} onChange={e => setContact('jamSenin', e.target.value)} placeholder="09.00 – 17.00"/></F>
                <F label="Sabtu"><input className={ic} value={data.contact.jamSabtu} onChange={e => setContact('jamSabtu', e.target.value)} placeholder="09.00 – 16.00"/></F>
                <F label="Minggu"><input className={ic} value={data.contact.jamMinggu} onChange={e => setContact('jamMinggu', e.target.value)} placeholder="By Confirmation"/></F>
              </div>
            </Card>

            <Card title="Google Maps Embed" icon={<span className="text-sm">📍</span>}>
              <F label="URL Embed" hint="Google Maps → Share → Embed a map → salin URL dari src='...'">
                <textarea className={ic} rows={2} value={data.contact.mapsEmbed} onChange={e => setContact('mapsEmbed', e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..."/>
              </F>
              {data.contact.mapsEmbed && (
                <div className="rounded-xl overflow-hidden border border-gray-200 h-40 mt-1">
                  <iframe src={data.contact.mapsEmbed} width="100%" height="100%" style={{border:0}} loading="lazy" title="Maps Preview"/>
                </div>
              )}
            </Card>
          </>)}

          {/* ── FAQ ───────────────────────────────────────────────────────────── */}
          {active === 'faq' && (<>
            <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-2.5 flex items-center gap-2.5">
              <span className="shrink-0">❓</span>
              <p className="text-xs text-violet-700">Perubahan langsung tampil di halaman FAQ. Pastikan komponen FAQ menggunakan <code className="bg-violet-100 px-1 rounded">useSiteSettings</code>.</p>
            </div>

            <Card title="FAQ — Pertanyaan Umum" icon={<HelpCircle size={14}/>}>
              <div className="space-y-3">
                {data.faq.map((item, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">#{i+1}</span>
                      <button onClick={() => removeFaq(i)} className="p-1 text-red-400 hover:bg-red-50 rounded-lg"><FiTrash2 size={12}/></button>
                    </div>
                    <input className={ic} value={item.pertanyaan} onChange={e => setFaq(i,'pertanyaan',e.target.value)} placeholder="Pertanyaan..."/>
                    <textarea className={ic} rows={2} value={item.jawaban} onChange={e => setFaq(i,'jawaban',e.target.value)} placeholder="Jawaban..."/>
                  </div>
                ))}
                <AddBtn onClick={addFaq} label="Tambah FAQ"/>
              </div>
              {/* FAQ Accordion Preview */}
              {data.faq.length > 0 && (
                <div className="mt-4 rounded-xl overflow-hidden border border-gray-200">
                  <div className="bg-gray-900 px-4 py-2 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Preview FAQ di Website</span>
                    <span className="text-[9px] bg-white/10 text-gray-400 px-2 py-0.5 rounded-md">{data.faq.length} pertanyaan</span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {data.faq.slice(0,3).map((item,i) => (
                      <div key={i} className="px-4 py-3 bg-white flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-gray-800 line-clamp-1">{item.pertanyaan || '(pertanyaan kosong)'}</span>
                        <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-gray-500">+</span>
                      </div>
                    ))}
                    {data.faq.length > 3 && (
                      <div className="px-4 py-2 bg-gray-50 text-center text-[10px] text-gray-400">+{data.faq.length - 3} pertanyaan lainnya</div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </>)}

          {/* ── GAMBAR PER HALAMAN ─────────────────────────────────────────────── */}
          {active === 'pages' && (
            <div className="space-y-4">
              {/* Status semua halaman — grid thumbnail */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {PAGE_LIST.map(p => {
                  const pg = data.pages[p.key] || {};
                  const isActive = activePage === p.key;
                  return (
                    <button key={p.key} onClick={() => setActivePage(p.key)}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all group ${isActive ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-100 hover:border-gray-300'}`}
                    >
                      {/* Mini browser chrome */}
                      <div className={`px-1.5 py-1 flex items-center gap-1 ${isActive ? 'bg-red-600' : 'bg-gray-800'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 opacity-70"/>
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 opacity-70"/>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 opacity-70"/>
                      </div>
                      {/* Thumbnail */}
                      <div className="h-14 bg-gray-100 relative">
                        {pg.heroImage
                          ? <img src={pg.heroImage} alt={p.label} className="w-full h-full object-cover" onError={e=>{e.target.style.display='none'}}/>
                          : <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <ImageIcon size={16} className="text-gray-300"/>
                            </div>
                        }
                        {pg.heroImage && <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><span className="text-white text-[9px] font-bold">Edit</span></div>}
                      </div>
                      {/* Label */}
                      <div className={`px-1 py-1 text-center ${isActive ? 'bg-red-50' : 'bg-white'}`}>
                        <p className={`text-[9px] font-bold truncate ${isActive ? 'text-red-600' : 'text-gray-500'}`}>{p.label}</p>
                        {pg.heroImage
                          ? <span className="text-[8px] text-emerald-500 font-bold">✓ Gambar</span>
                          : <span className="text-[8px] text-gray-300">Belum ada</span>
                        }
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Editor halaman aktif */}
              {PAGE_LIST.filter(p => p.key === activePage).map(p => {
                const pg = data.pages[p.key] || {};
                return (
                  <Card key={p.key} title={`Hero — ${p.label}`} icon={<ImageIcon size={14}/>}>
                    {/* Mini browser preview — full width */}
                    <div className="rounded-xl overflow-hidden border border-gray-200 mb-4 shadow-sm">
                      {/* Browser chrome bar */}
                      <div className="bg-gray-800 px-3 py-1.5 flex items-center gap-2">
                        <div className="flex gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70"/>
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"/>
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500/70"/>
                        </div>
                        <div className="flex-1 bg-gray-700 rounded-md px-2 py-0.5 text-[10px] text-gray-400 font-mono truncate">
                          afkarland.com{p.key === 'home' ? '/' : `/${p.key}`}
                        </div>
                        <span className="text-[9px] text-gray-500">Preview</span>
                      </div>
                      {/* Hero preview */}
                      <div className="relative h-36 bg-gray-900">
                        {pg.heroImage
                          ? <img src={pg.heroImage} alt="preview" className="w-full h-full object-cover" onError={e=>{e.target.style.display='none'}}/>
                          : <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                              <ImageIcon size={28} className="text-gray-600"/>
                              <p className="text-gray-500 text-xs">Belum ada gambar — upload di bawah</p>
                            </div>
                        }
                        {pg.heroImage && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col items-center justify-center text-white px-4">
                            {/* Simulasi navbar */}
                            <div className="absolute top-0 left-0 right-0 bg-red-600/90 px-3 py-1.5 flex items-center gap-2">
                              <div className="w-4 h-4 bg-white rounded-full"/>
                              <span className="text-white text-[9px] font-extrabold tracking-widest">{data.branding.siteName}</span>
                            </div>
                            <h3 className="font-extrabold text-lg text-center drop-shadow mt-4">{pg.heroTitle || p.label}</h3>
                            {pg.heroSubtitle && <p className="text-xs text-white/80 text-center mt-1 max-w-xs drop-shadow">{pg.heroSubtitle}</p>}
                          </div>
                        )}
                      </div>
                    </div>

                    <ImgField
                      label="Hero / Banner Image"
                      hint="Resolusi minimal 1920×600px. Gambar ini tampil sebagai latar bagian atas halaman."
                      value={pg.heroImage || ''}
                      onChange={v => setPageField(p.key,'heroImage',v)}
                      folder={`afkar-land/pages/${p.key}`}
                      previewH="h-0"
                    />
                    <Row>
                      <F label="Judul Halaman">
                        <input className={ic} value={pg.heroTitle||''} onChange={e => setPageField(p.key,'heroTitle',e.target.value)} placeholder={`Judul ${p.label}`}/>
                      </F>
                      <F label="Sub-judul">
                        <input className={ic} value={pg.heroSubtitle||''} onChange={e => setPageField(p.key,'heroSubtitle',e.target.value)} placeholder="Deskripsi singkat"/>
                      </F>
                    </Row>
                  </Card>
                );
              })}
            </div>
          )}

          {/* ── BRANDING & LOGO ─────────────────────────────────────────────────── */}
          {active === 'branding' && (<>
            <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-2.5 flex items-center gap-2.5">
              <span className="shrink-0">🎨</span>
              <p className="text-xs text-purple-700">Branding diterapkan di seluruh website. Pastikan <code className="bg-purple-100 px-1 rounded">Navbar.jsx</code> &amp; <code className="bg-purple-100 px-1 rounded">Footer.jsx</code> menggunakan <code className="bg-purple-100 px-1 rounded">useSiteSettings</code>.</p>
            </div>

            <Card title="Logo Utama Website" icon={<Palette size={14}/>}>
              <Row>
                <ImgField label="Logo Utama (PNG/SVG transparan)" hint="Digunakan di seluruh website." value={data.branding.logoUrl} onChange={v => setBranding('logoUrl', v)} folder="afkar-land/branding"/>
                <div className="space-y-3">
                  <F label="Alt Text Logo"><input className={ic} value={data.branding.logoAlt} onChange={e => setBranding('logoAlt', e.target.value)} placeholder="AFKAR LAND"/></F>
                  <F label="Nama Site (teks fallback)"><input className={ic} value={data.branding.siteName} onChange={e => setBranding('siteName', e.target.value)} placeholder="AFKAR LAND"/></F>
                  <F label="Tagline"><input className={ic} value={data.branding.tagline} onChange={e => setBranding('tagline', e.target.value)} placeholder="Properti Syariah Terbaik di Sulawesi"/></F>
                </div>
              </Row>
            </Card>

            <Card title="Favicon & Warna Brand" icon={<FiGlobe size={14}/>}>
              <Row>
                <ImgField label="Favicon (.ico atau .png 32×32)" value={data.branding.faviconUrl} onChange={v => setBranding('faviconUrl', v)} folder="afkar-land/branding"/>
                <F label="Warna Utama Brand">
                  <div className="flex items-center gap-2 mt-1">
                    <input type="color" value={data.branding.primaryColor} onChange={e => setBranding('primaryColor', e.target.value)} className="w-10 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5"/>
                    <input className={`${ic} flex-1`} value={data.branding.primaryColor} onChange={e => setBranding('primaryColor', e.target.value)} placeholder="#dc2626"/>
                    <div className="w-9 h-9 rounded-lg border border-gray-100 flex-shrink-0" style={{ backgroundColor: data.branding.primaryColor }}/>
                  </div>
                </F>
              </Row>
            </Card>

            {/* Live Branding Preview */}
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              {/* Mini browser chrome */}
              <div className="bg-gray-800 px-3 py-1.5 flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500/70"/>
                  <span className="w-2 h-2 rounded-full bg-yellow-500/70"/>
                  <span className="w-2 h-2 rounded-full bg-green-500/70"/>
                </div>
                <div className="flex-1 bg-gray-700 rounded px-2 py-0.5 text-[9px] text-gray-400 font-mono">afkarland.com</div>
                <span className="text-[9px] text-gray-500">Live Preview</span>
              </div>
              {/* Simulated Navbar */}
              <div className="flex items-center gap-3 px-4 py-2.5" style={{ backgroundColor: data.branding.primaryColor || '#dc2626' }}>
                <div className="w-7 h-7 bg-white rounded-full overflow-hidden flex items-center justify-center shrink-0">
                  {data.branding.logoUrl
                    ? <img src={data.branding.logoUrl} alt="logo" className="w-full h-full object-cover" onError={e=>{e.target.style.display='none'}}/>
                    : <span className="text-[8px] font-black text-red-600">AL</span>
                  }
                </div>
                <span className="text-white font-extrabold text-sm tracking-widest">{data.branding.siteName || 'SITE NAME'}</span>
                <div className="ml-auto flex gap-4">
                  {(data.navbar.links || []).slice(0,4).map((l,i) => (
                    <span key={i} className="text-white/80 text-[9px] font-bold uppercase tracking-wider">{l.label}</span>
                  ))}
                </div>
              </div>
              {/* Simulated Hero area */}
              <div className="h-20 flex flex-col items-center justify-center gap-1" style={{ backgroundColor: data.branding.primaryColor ? data.branding.primaryColor + '18' : '#fef2f2' }}>
                <p className="text-xs font-bold text-gray-500">{data.branding.tagline || 'Tagline website Anda'}</p>
                <div className="flex gap-1.5">
                  <span className="text-[9px] px-2 py-0.5 rounded text-white font-bold" style={{ backgroundColor: data.branding.primaryColor || '#dc2626' }}>Tombol Utama</span>
                  <span className="text-[9px] px-2 py-0.5 rounded border font-bold text-gray-500 border-gray-300">Tombol Kedua</span>
                </div>
              </div>
              {data.branding.faviconUrl && (
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
                  <img src={data.branding.faviconUrl} alt="favicon" className="w-4 h-4 rounded object-cover" onError={e=>{e.target.style.display='none'}}/>
                  <span className="text-[10px] text-gray-500">Tab · {data.branding.siteName}</span>
                </div>
              )}
            </div>
          </>)}

          {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
          {active === 'navbar' && (<>
            <div className="bg-gray-900/5 border border-gray-200 rounded-xl px-4 py-2.5 flex items-center gap-2.5">
              <Navigation size={14} className="text-gray-500 shrink-0"/>
              <p className="text-xs text-gray-600">Perubahan langsung update Navbar di semua halaman. Pastikan <code className="bg-gray-100 px-1 rounded">Navbar.jsx</code> menggunakan <code className="bg-gray-100 px-1 rounded">useSiteSettings</code>.</p>
            </div>

            <Card title="Teks & Ikon Navbar" icon={<FiLayout size={14}/>}>
  <Row>
    {/* Logo/Ikon */}
    <ImgField
      label="Ikon / Logo Navbar"
      hint="Format PNG/SVG transparan. Kosongkan untuk pakai logo branding utama."
      value={data.navbar.logoUrl}
      onChange={v => setNavbar('logoUrl', v)}
      folder="afkar-land/branding"
    />

    {/* Teks nama site */}
    <div className="space-y-3">
      <F label="Teks Nama Site" hint="Tampil di sebelah ikon di navbar.">
        <input
          className={ic}
          value={data.branding.siteName}
          onChange={e => setBranding('siteName', e.target.value)}
          placeholder="AFKAR LAND"
        />
      </F>
      <F label="Alt Text Logo">
        <input
          className={ic}
          value={data.branding.logoAlt}
          onChange={e => setBranding('logoAlt', e.target.value)}
          placeholder="AFKAR LAND"
        />
      </F>
    </div>
  </Row>

  {/* Live preview navbar */}
  <div className="rounded-xl overflow-hidden border border-gray-200 mt-1">
    <div className="bg-gray-800 px-3 py-1.5 flex items-center gap-2">
      <div className="flex gap-1">
        <span className="w-2 h-2 rounded-full bg-red-500/70"/>
        <span className="w-2 h-2 rounded-full bg-yellow-500/70"/>
        <span className="w-2 h-2 rounded-full bg-green-500/70"/>
      </div>
      <div className="flex-1 bg-gray-700 rounded px-2 py-0.5 text-[9px] text-gray-400 font-mono">afkarland.com</div>
    </div>
    <div
      className="flex items-center gap-3 px-4 py-2.5"
      style={{ backgroundColor: data.branding.primaryColor || '#dc2626' }}
    >
      <div className="w-8 h-8 bg-white rounded-full overflow-hidden flex items-center justify-center shrink-0">
        {(data.navbar.logoUrl || data.branding.logoUrl)
          ? <img
              src={data.navbar.logoUrl || data.branding.logoUrl}
              alt="logo"
              className="w-full h-full object-cover"
              onError={e => { e.target.style.display = 'none'; }}
            />
          : <span className="text-[8px] font-black text-red-600">AL</span>
        }
      </div>
      <span className="text-white font-extrabold text-sm tracking-widest">
        {data.branding.siteName || 'NAMA SITE'}
      </span>
      <div className="ml-auto flex gap-4">
        {(data.navbar.links || []).slice(0, 4).map((l, i) => (
          <span key={i} className="text-white/70 text-[9px] font-bold uppercase tracking-wider">{l.label}</span>
        ))}
      </div>
    </div>
  </div>
</Card>
          </>)}

          {/* ── FOOTER & SOSMED ─────────────────────────────────────────────────── */}
          {active === 'footer' && (<>
            <div className="bg-gray-900/5 border border-gray-200 rounded-xl px-4 py-2.5 flex items-center gap-2.5">
              <AlignJustify size={14} className="text-gray-500 shrink-0"/>
              <p className="text-xs text-gray-600">Pastikan <code className="bg-gray-100 px-1 rounded">Footer.jsx</code> menggunakan <code className="bg-gray-100 px-1 rounded">useSiteSettings</code> agar perubahan tampil di web.</p>
            </div>

            <Card title="Informasi Footer" icon={<FiInfo size={14}/>}>
              <F label="Deskripsi Footer"><textarea className={ic} rows={2} value={data.footer.description} onChange={e => setFooter('description', e.target.value)}/></F>
              <Row>
                <F label="Telepon / WhatsApp"><input className={ic} value={data.footer.phone} onChange={e => setFooter('phone', e.target.value)} placeholder="+62 812-3456-7890"/></F>
                <F label="Email"><input className={ic} value={data.footer.email} onChange={e => setFooter('email', e.target.value)} placeholder="info@afkarland.com"/></F>
                <F label="Alamat" span={2}><input className={ic} value={data.footer.address} onChange={e => setFooter('address', e.target.value)} placeholder="Makassar, Sulawesi Selatan"/></F>
                <F label="Teks Copyright" span={2}><input className={ic} value={data.footer.copyright} onChange={e => setFooter('copyright', e.target.value)} placeholder="© 2025 AFKAR LAND."/></F>
              </Row>
            </Card>

            <Card title="Media Sosial" icon={<Smartphone size={14}/>}>
              <Row>
                {[
                  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/afkarland' },
                  { key: 'facebook',  label: 'Facebook',  placeholder: 'https://facebook.com/afkarland'  },
                  { key: 'youtube',   label: 'YouTube',   placeholder: 'https://youtube.com/@afkarland'  },
                  { key: 'tiktok',    label: 'TikTok',    placeholder: 'https://tiktok.com/@afkarland'   },
                ].map(s => (
                  <F key={s.key} label={s.label}>
                    <input className={ic} value={data.footer[s.key]||''} onChange={e => setFooter(s.key, e.target.value)} placeholder={s.placeholder}/>
                  </F>
                ))}
              </Row>
            </Card>
          </>)}

        </div>{/* end scrollable */}
      </main>
    </div>
  );
}
