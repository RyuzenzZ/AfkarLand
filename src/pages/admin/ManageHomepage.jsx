// ManageHomepage.jsx — AFKAR LAND Admin Panel (UPDATED)
// ─────────────────────────────────────────────────────────────────────────────
// Tab baru: ℹ️ Tentang Kami | 💼 Karir | 📞 Kontak
// Semua perubahan ke Firestore 'homepage_settings/main' → langsung tampil di
// web publik via useWebsiteSettings (onSnapshot real-time).
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import {
  FiSave, FiPlus, FiTrash2, FiEye, FiImage,
  FiGlobe, FiLayout, FiHome, FiLink, FiInfo,
  FiArrowRight, FiCheckCircle, FiUser, FiBriefcase, FiPhone,
} from 'react-icons/fi';
import { LayoutDashboard, Palette, Smartphone, FileText, Megaphone } from 'lucide-react';
import toast from 'react-hot-toast';

// ── Komponen bantu ──────────────────────────────────────────────────────────
const SectionCard = ({ title, icon, children, accent }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    {accent && <div className={`h-1 ${accent}`}/>}
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

const inputCls = "w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-400 outline-none text-sm transition-colors";
const labelCls = "block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider";

const ImgPreview = ({ url }) => url ? (
  <img src={url} alt="preview"
    className="mt-2 w-full h-32 object-cover rounded-xl border border-gray-100"
    onError={e => { e.target.style.display = 'none'; }}/>
) : null;

// ── Halaman untuk edit gambar ───────────────────────────────────────────────
const PAGE_LIST = [
  { key: 'home',     label: '🏠 Beranda'        },
  { key: 'about',    label: 'ℹ️ Tentang Kami'   },
  { key: 'projects', label: '🏢 Proyek'          },
  { key: 'career',   label: '💼 Karir'           },
  { key: 'blog',     label: '📰 Artikel / Blog'  },
  { key: 'contact',  label: '📞 Kontak'          },
  { key: 'faq',      label: '❓ FAQ'             },
];

// ── Default data (harus sinkron dengan useWebsiteSettings.js) ──────────────
const DEFAULT = {
  branding: {
    logoUrl: '', logoAlt: 'AFKAR GROUP INDONESIA', siteName: 'AFKAR GROUP INDONESIA',
    tagline: 'Properti Syariah Terbaik di Sulawesi', faviconUrl: '', primaryColor: '#dc2626',
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
    home:     { heroImage: '', heroTitle: '',                heroSubtitle: '' },
    about:    { heroImage: '', heroTitle: 'Tentang Kami',    heroSubtitle: '' },
    projects: { heroImage: '', heroTitle: 'Proyek Kami',     heroSubtitle: '' },
    career:   { heroImage: '', heroTitle: 'Karir',           heroSubtitle: '' },
    blog:     { heroImage: '', heroTitle: 'Artikel & Blog',  heroSubtitle: '' },
    contact:  { heroImage: '', heroTitle: 'Hubungi Kami',    heroSubtitle: '' },
    faq:      { heroImage: '', heroTitle: 'FAQ',             heroSubtitle: '' },
  },
  hero: {
    badge: 'Developer Property Syariah Terpercaya',
    judul: 'Hunian Syariah Modern\nuntuk Masa Depan Keluarga Anda',
    subjudul: 'AFKAR LAND menghadirkan kawasan property syariah premium tanpa riba, tanpa bank, tanpa bunga, dan tanpa sita dengan konsep hunian modern islami di Indonesia Timur.',
    ctaUtama: 'Lihat Project Kami', ctaUtamaLink: '/proyek',
    ctaKedua: 'Jadwalkan Survey Lokasi', ctaKeduaLink: '/kontak',
  },
  statistik: [
    { label: 'Unit Terjual', value: '500+' }, { label: 'Proyek Aktif', value: '4' },
    { label: 'Kota Jangkauan', value: '8+' }, { label: 'Kepuasan Klien', value: '98%' },
  ],
  konten: {
    tentangParagraf1: 'AFKAR LAND adalah perusahaan pengembang property syariah modern yang berfokus menghadirkan kawasan hunian nyaman, berkualitas, dan bernilai investasi tinggi.',
    tentangParagraf2: 'Kami hadir untuk memberikan solusi kepemilikan rumah tanpa riba melalui sistem transaksi syariah yang aman, transparan, dan sesuai prinsip Islam.',
    pilarSyariah: ['Tanpa Bank', 'Tanpa Bunga', 'Tanpa Denda', 'Tanpa Sita', 'Tanpa BI Checking', 'Tanpa Penalti', 'Tanpa Asuransi'],
    ctaPenutupJudul: 'Siap Memiliki Hunian Syariah Impian Anda?',
    ctaPenutupSubjudul: 'Konsultasikan kebutuhan property Anda bersama tim konsultan profesional AFKAR LAND sekarang juga. Gratis tanpa komitmen!',
    trustSubjudul: 'AfkarLand berkomitmen untuk menghadirkan dan mengembangkan proyek properti syariah di seluruh wilayah sulawesi.',
  },
  // ── BARU: Halaman Tentang Kami ──────────────────────────────────────────────
  about: {
    heroBadge:        'Tentang AFKAR LAND',
    heroJudul:        'Membangun Hunian Syariah dengan Amanah',
    heroSubjudul:     'AFKAR LAND adalah perusahaan pengembang properti syariah yang berkomitmen menghadirkan hunian nyaman, berkualitas, dan sesuai prinsip Islam tanpa riba.',
    heroImage:        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80',
    ctaUtamaLabel:    'Lihat Proyek',
    ctaUtamaLink:     '/proyek',
    companyImage:     'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
    companyJudul:     'Berawal dari Sebuah Tujuan yang Baik',
    companyParagraf1: 'AFKAR LAND hadir untuk membantu masyarakat memiliki hunian yang nyaman dengan proses yang lebih aman, transparan, dan sesuai prinsip syariah.',
    companyParagraf2: 'Kami percaya bahwa rumah bukan hanya tempat tinggal, tetapi tempat tumbuhnya keluarga, pendidikan anak, dan keberkahan kehidupan.',
    founderImage:     '/images/ustadz.png',
    founderNama:      'Ustadz Haris Amrin',
    founderJabatan:   'Founder AFKAR LAND',
    founderKutipan:   'Kami ingin menghadirkan lingkungan yang nyaman, islami, dan membawa keberkahan bagi setiap keluarga.',
    ctaJudul:         'Temukan Hunian Syariah Pilihan Anda',
    ctaSubjudul:      'Jelajahi berbagai proyek property syariah AFKAR LAND yang dirancang untuk kenyamanan dan masa depan keluarga Anda.',
    ctaLink:          '/proyek',
    ctaLabel:         'Lihat Semua Proyek',
  },
  // ── BARU: Halaman Karir ─────────────────────────────────────────────────────
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
      { title: 'Marketing Executive', prioritas: true, emoji: '📣', jobdesk: ['Mencari & mengelola calon pembeli (leads)', 'Follow up database & komunikasi calon konsumen', 'Presentasi produk & mengajak survey lokasi', 'Closing penjualan & membuat laporan harian'] },
      { title: 'Teknik', prioritas: true, emoji: '🔧', jobdesk: ['Merencanakan & mengawasi pelaksanaan proyek', 'Membuat gambar kerja, RAB & time schedule', 'Mengontrol kualitas, kuantitas & progres lapangan', 'Koordinasi kontraktor, vendor & tim terkait'] },
      { title: 'Sales Leader', prioritas: false, emoji: '🏆', jobdesk: ['Memimpin & mengelola tim sales', 'Menyusun strategi penjualan & rencana kerja', 'Memantau kinerja tim & coaching', 'Membuat laporan penjualan & evaluasi tim'] },
      { title: 'Marketing Communications', prioritas: false, emoji: '📱', jobdesk: ['Menyusun & eksekusi strategi komunikasi pemasaran', 'Mengelola konten berbagai channel komunikasi', 'Menulis materi promosi & press release', 'Monitoring & analisa performa konten & kampanye'] },
      { title: 'Admin Sales', prioritas: false, emoji: '📋', jobdesk: ['Mengelola data & dokumen penjualan', 'Membuat penawaran harga, PO & invoice', 'Memastikan kelengkapan dokumen sales', 'Membuat laporan penjualan & administrasi'] },
    ],
  },
  // ── BARU: Halaman Kontak ────────────────────────────────────────────────────
  contact: {
    heroJudul:    'Kami Siap Membantu',
    heroSubjudul: 'Tinggalkan pesan atau kunjungi kantor pemasaran kami untuk informasi lebih lanjut mengenai project property syariah AFKAR LAND.',
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
    phone: '+62 812-3456-7890', email: 'info@afkarland.com', address: 'Makassar, Sulawesi Selatan',
    instagram: '', facebook: '', youtube: '', tiktok: '',
    copyright: '© 2025 AFKAR GROUP INDONESIA. All rights reserved.',
  },
  faq: [
    { pertanyaan: 'Apakah produk AFKAR LAND bersertifikat syariah?', jawaban: 'Ya, semua produk kami telah melalui kajian syariah dan bebas dari riba.' },
    { pertanyaan: 'Bagaimana cara pemesanan unit?',                   jawaban: 'Anda bisa mengisi formulir booking di halaman detail proyek atau menghubungi tim kami.' },
  ],
};

export default function ManageHomepage() {
  const [data, setData]             = useState(DEFAULT);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [activeTab, setActiveTab]   = useState('hero');
  const [activePage, setActivePage] = useState('home');

  const TABS = [
    { id: 'hero',      label: '🏠 Hero Banner'          },
    { id: 'konten',    label: '📝 Konten Beranda'        },
    { id: 'statistik', label: '📊 Statistik'             },
    { id: 'about',     label: 'ℹ️ Tentang Kami'         },
    { id: 'career',    label: '💼 Karir'                 },
    { id: 'kontak',    label: '📞 Kontak'                },
    { id: 'pages',     label: '🖼️ Gambar Per Halaman'   },
    { id: 'branding',  label: '🎨 Branding & Logo'       },
    { id: 'navbar',    label: '🔗 Navbar'                },
    { id: 'footer',    label: '📋 Footer & Sosmed'       },
    { id: 'faq',       label: '❓ FAQ'                   },
  ];

  // ── Load dari Firestore ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDoc(doc(db, 'homepage_settings', 'main'));
        if (snap.exists()) {
          const saved = snap.data();
          setData(prev => ({
            ...prev, ...saved,
            branding:  { ...prev.branding,  ...saved.branding  },
            navbar:    { ...prev.navbar,    ...saved.navbar    },
            pages:     { ...prev.pages,     ...saved.pages     },
            hero:      { ...prev.hero,      ...saved.hero      },
            footer:    { ...prev.footer,    ...saved.footer    },
            konten:    { ...prev.konten,    ...saved.konten    },
            about:     { ...prev.about,     ...saved.about     },
            career:    { ...prev.career,    ...saved.career,
                         posisi: saved.career?.posisi || prev.career.posisi },
            contact:   { ...prev.contact,   ...saved.contact   },
            statistik: saved.statistik || prev.statistik,
            faq:       saved.faq       || prev.faq,
          }));
        }
      } catch { /* pakai default */ }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

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

  // ── Setters ──────────────────────────────────────────────────────────────────
  const setBranding  = (k, v) => setData(d => ({ ...d, branding:  { ...d.branding,  [k]: v } }));
  const setNavbar    = (k, v) => setData(d => ({ ...d, navbar:    { ...d.navbar,    [k]: v } }));
  const setHero      = (k, v) => setData(d => ({ ...d, hero:      { ...d.hero,      [k]: v } }));
  const setFooter    = (k, v) => setData(d => ({ ...d, footer:    { ...d.footer,    [k]: v } }));
  const setKonten    = (k, v) => setData(d => ({ ...d, konten:    { ...d.konten,    [k]: v } }));
  const setAbout     = (k, v) => setData(d => ({ ...d, about:     { ...d.about,     [k]: v } }));
  const setCareer    = (k, v) => setData(d => ({ ...d, career:    { ...d.career,    [k]: v } }));
  const setContact   = (k, v) => setData(d => ({ ...d, contact:   { ...d.contact,   [k]: v } }));
  const setPageField = (page, k, v) =>
    setData(d => ({ ...d, pages: { ...d.pages, [page]: { ...d.pages[page], [k]: v } } }));

  const setStat    = (i, k, v) => setData(d => { const s = [...d.statistik]; s[i] = { ...s[i], [k]: v }; return { ...d, statistik: s }; });
  const addStat    = () => setData(d => ({ ...d, statistik: [...d.statistik, { label: '', value: '' }] }));
  const removeStat = (i) => setData(d => ({ ...d, statistik: d.statistik.filter((_, x) => x !== i) }));

  const setFaq     = (i, k, v) => setData(d => { const f = [...d.faq]; f[i] = { ...f[i], [k]: v }; return { ...d, faq: f }; });
  const addFaq     = () => setData(d => ({ ...d, faq: [...d.faq, { pertanyaan: '', jawaban: '' }] }));
  const removeFaq  = (i) => setData(d => ({ ...d, faq: d.faq.filter((_, x) => x !== i) }));

  const setNavLink    = (i, k, v) =>
    setData(d => { const l = [...d.navbar.links]; l[i] = { ...l[i], [k]: v }; return { ...d, navbar: { ...d.navbar, links: l } }; });
  const addNavLink    = () => setData(d => ({ ...d, navbar: { ...d.navbar, links: [...d.navbar.links, { label: '', path: '' }] } }));
  const removeNavLink = (i) => setData(d => ({ ...d, navbar: { ...d.navbar, links: d.navbar.links.filter((_, x) => x !== i) } }));

  const setPilar    = (i, v) => setData(d => { const p = [...(d.konten.pilarSyariah || [])]; p[i] = v; return { ...d, konten: { ...d.konten, pilarSyariah: p } }; });
  const addPilar    = () => setData(d => ({ ...d, konten: { ...d.konten, pilarSyariah: [...(d.konten.pilarSyariah || []), ''] } }));
  const removePilar = (i) => setData(d => ({ ...d, konten: { ...d.konten, pilarSyariah: (d.konten.pilarSyariah || []).filter((_, x) => x !== i) } }));

  // ── Posisi Karir setters ─────────────────────────────────────────────────────
  const setPosisi    = (i, k, v) => setData(d => { const p = [...d.career.posisi]; p[i] = { ...p[i], [k]: v }; return { ...d, career: { ...d.career, posisi: p } }; });
  const addPosisi    = () => setData(d => ({ ...d, career: { ...d.career, posisi: [...d.career.posisi, { title: '', prioritas: false, emoji: '💼', jobdesk: [''] }] } }));
  const removePosisi = (i) => setData(d => ({ ...d, career: { ...d.career, posisi: d.career.posisi.filter((_, x) => x !== i) } }));

  // jobdesk sebagai array per posisi
  const setJobdesk    = (pi, ji, v) => setData(d => { const p = [...d.career.posisi]; const jd = [...p[pi].jobdesk]; jd[ji] = v; p[pi] = { ...p[pi], jobdesk: jd }; return { ...d, career: { ...d.career, posisi: p } }; });
  const addJobdesk    = (pi)        => setData(d => { const p = [...d.career.posisi]; p[pi] = { ...p[pi], jobdesk: [...p[pi].jobdesk, ''] }; return { ...d, career: { ...d.career, posisi: p } }; });
  const removeJobdesk = (pi, ji)    => setData(d => { const p = [...d.career.posisi]; p[pi] = { ...p[pi], jobdesk: p[pi].jobdesk.filter((_, x) => x !== ji) }; return { ...d, career: { ...d.career, posisi: p } }; });

  if (loading) return <div className="p-8 text-gray-400 animate-pulse">Memuat pengaturan website...</div>;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Manajemen Website</h1>
          <p className="text-gray-500 mt-1 text-sm">Semua perubahan langsung tampil di web setelah disimpan.</p>
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

      {/* STATUS REAL-TIME */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"/>
        <p className="text-sm text-emerald-700 font-medium">
          Real-time aktif — perubahan tersimpan ke Firebase dan langsung terbaca oleh semua halaman publik.
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-1.5 flex-wrap bg-gray-100 p-1.5 rounded-2xl">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap
              ${activeTab === tab.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: HERO ─────────────────────────────────────────────────────────── */}
      {activeTab === 'hero' && (
        <div className="space-y-4">
          <SectionCard title="Hero Banner — Tampilan Utama Beranda" icon={<FiHome size={16}/>} accent="bg-gradient-to-r from-red-500 to-red-400">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Badge / Label Kecil" hint="Teks kecil di atas judul.">
                <input className={inputCls} value={data.hero.badge} onChange={e => setHero('badge', e.target.value)} placeholder="Developer Property Syariah Terpercaya"/>
              </Field>
              <Field label="Judul Utama (pakai \\n untuk baris baru)">
                <input className={inputCls} value={data.hero.judul} onChange={e => setHero('judul', e.target.value)} placeholder="Hunian Syariah Modern\nuntuk Masa Depan..."/>
              </Field>
              <div className="md:col-span-2">
                <Field label="Sub-judul / Deskripsi">
                  <textarea className={inputCls} rows={3} value={data.hero.subjudul} onChange={e => setHero('subjudul', e.target.value)}/>
                </Field>
              </div>
              <Field label="Teks Tombol Utama">
                <input className={inputCls} value={data.hero.ctaUtama} onChange={e => setHero('ctaUtama', e.target.value)} placeholder="Lihat Project Kami"/>
              </Field>
              <Field label="Link Tombol Utama">
                <input className={inputCls} value={data.hero.ctaUtamaLink} onChange={e => setHero('ctaUtamaLink', e.target.value)} placeholder="/proyek"/>
              </Field>
              <Field label="Teks Tombol Kedua">
                <input className={inputCls} value={data.hero.ctaKedua} onChange={e => setHero('ctaKedua', e.target.value)} placeholder="Jadwalkan Survey Lokasi"/>
              </Field>
              <Field label="Link Tombol Kedua">
                <input className={inputCls} value={data.hero.ctaKeduaLink} onChange={e => setHero('ctaKeduaLink', e.target.value)} placeholder="/kontak"/>
              </Field>
            </div>
          </SectionCard>
          {/* Live Preview */}
          <div className="bg-gray-900 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 to-transparent pointer-events-none"/>
            <div className="relative z-10 text-center max-w-xl mx-auto">
              {data.hero.badge && (
                <div className="flex items-center justify-center gap-2 text-red-400 text-[11px] font-bold uppercase tracking-widest mb-3">
                  <span className="w-1 h-1 rounded-full bg-red-500"/>{data.hero.badge}<span className="w-1 h-1 rounded-full bg-red-500"/>
                </div>
              )}
              <h2 className="text-white text-2xl font-black leading-tight mb-3">
                {(data.hero.judul || 'Judul Hero').split('\n').map((line, i) => (
                  <span key={i}>{i > 0 && <br/>}<span className={i > 0 ? 'text-red-400' : ''}>{line}</span></span>
                ))}
              </h2>
              {data.hero.subjudul && <p className="text-gray-400 text-xs mb-4 leading-relaxed">{data.hero.subjudul.slice(0, 120)}...</p>}
              <div className="flex gap-3 justify-center flex-wrap">
                <span className="bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl">{data.hero.ctaUtama || 'CTA Utama'}</span>
                <span className="border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl">{data.hero.ctaKedua || 'CTA Kedua'}</span>
              </div>
            </div>
            <div className="absolute top-3 right-3 text-[10px] text-gray-500 bg-gray-800 px-2 py-1 rounded-lg">Live Preview</div>
          </div>
        </div>
      )}

      {/* ── TAB: KONTEN BERANDA ────────────────────────────────────────────────── */}
      {activeTab === 'konten' && (
        <div className="space-y-4">
          <SectionCard title="Section Tentang AFKAR LAND" icon={<FileText size={16}/>}>
            <div className="space-y-4">
              <Field label="Paragraf 1">
                <textarea className={inputCls} rows={3} value={data.konten.tentangParagraf1} onChange={e => setKonten('tentangParagraf1', e.target.value)}/>
              </Field>
              <Field label="Paragraf 2">
                <textarea className={inputCls} rows={3} value={data.konten.tentangParagraf2} onChange={e => setKonten('tentangParagraf2', e.target.value)}/>
              </Field>
            </div>
          </SectionCard>
          <SectionCard title="7 Pilar Transaksi Syariah" icon={<FiCheckCircle size={16}/>}>
            <div className="space-y-2">
              {(data.konten.pilarSyariah || []).map((pilar, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-300 w-5 shrink-0">{i+1}</span>
                  <input className={inputCls} value={pilar} onChange={e => setPilar(i, e.target.value)} placeholder="Tanpa Bank"/>
                  <button onClick={() => removePilar(i)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg shrink-0"><FiTrash2 size={13}/></button>
                </div>
              ))}
              <button onClick={addPilar} className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors w-full justify-center">
                <FiPlus size={14}/> Tambah Pilar
              </button>
            </div>
          </SectionCard>
          <SectionCard title="Section Trust — Teks Kepercayaan" icon={<FiInfo size={16}/>}>
            <Field label="Sub-judul Section Testimoni / Trust">
              <textarea className={inputCls} rows={3} value={data.konten.trustSubjudul} onChange={e => setKonten('trustSubjudul', e.target.value)}/>
            </Field>
          </SectionCard>
          <SectionCard title="CTA Penutup — Banner Merah di Bawah" icon={<Megaphone size={16}/>} accent="bg-gradient-to-r from-red-600 to-red-400">
            <div className="space-y-4">
              <Field label="Judul CTA Penutup">
                <input className={inputCls} value={data.konten.ctaPenutupJudul} onChange={e => setKonten('ctaPenutupJudul', e.target.value)}/>
              </Field>
              <Field label="Sub-judul CTA Penutup">
                <textarea className={inputCls} rows={2} value={data.konten.ctaPenutupSubjudul} onChange={e => setKonten('ctaPenutupSubjudul', e.target.value)}/>
              </Field>
            </div>
          </SectionCard>
        </div>
      )}

      {/* ── TAB: STATISTIK ────────────────────────────────────────────────────── */}
      {activeTab === 'statistik' && (
        <SectionCard title="Statistik Perusahaan" icon={<LayoutDashboard size={16}/>}>
          <div className="space-y-3">
            {data.statistik.map((stat, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Nilai</label>
                    <input className={inputCls} value={stat.value} onChange={e => setStat(i, 'value', e.target.value)} placeholder="500+"/>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Label</label>
                    <input className={inputCls} value={stat.label} onChange={e => setStat(i, 'label', e.target.value)} placeholder="Unit Terjual"/>
                  </div>
                </div>
                <button onClick={() => removeStat(i)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg shrink-0"><FiTrash2 size={15}/></button>
              </div>
            ))}
            <button onClick={addStat} className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors w-full justify-center">
              <FiPlus size={15}/> Tambah Statistik
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-900 rounded-xl p-4">
            {data.statistik.filter(s => s.value || s.label).map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-red-500 font-black text-xl">{s.value}</div>
                <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          TAB: TENTANG KAMI ← BARU
      ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'about' && (
        <div className="space-y-4">

          {/* Hero About */}
          <SectionCard title="Hero — Halaman Tentang Kami" icon={<FiInfo size={16}/>} accent="bg-gradient-to-r from-blue-500 to-blue-400">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Badge Kecil (di atas judul)">
                <input className={inputCls} value={data.about.heroBadge} onChange={e => setAbout('heroBadge', e.target.value)} placeholder="Tentang AFKAR LAND"/>
              </Field>
              <Field label="Judul Hero">
                <input className={inputCls} value={data.about.heroJudul} onChange={e => setAbout('heroJudul', e.target.value)} placeholder="Membangun Hunian Syariah dengan Amanah"/>
              </Field>
              <div className="md:col-span-2">
                <Field label="Sub-judul Hero">
                  <textarea className={inputCls} rows={2} value={data.about.heroSubjudul} onChange={e => setAbout('heroSubjudul', e.target.value)}/>
                </Field>
              </div>
              <div>
                <Field label="Gambar Hero (URL)" hint="Tampil sebagai foto kanan di section hero.">
                  <input className={inputCls} value={data.about.heroImage} onChange={e => setAbout('heroImage', e.target.value)} placeholder="https://..."/>
                </Field>
                <ImgPreview url={data.about.heroImage}/>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <Field label="Teks Tombol Utama">
                  <input className={inputCls} value={data.about.ctaUtamaLabel} onChange={e => setAbout('ctaUtamaLabel', e.target.value)} placeholder="Lihat Proyek"/>
                </Field>
                <Field label="Link Tombol Utama">
                  <input className={inputCls} value={data.about.ctaUtamaLink} onChange={e => setAbout('ctaUtamaLink', e.target.value)} placeholder="/proyek"/>
                </Field>
              </div>
            </div>
          </SectionCard>

          {/* Section Perusahaan */}
          <SectionCard title="Section Tentang Perusahaan" icon={<FileText size={16}/>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Field label="Gambar Perusahaan (URL)" hint="Foto yang tampil di kiri section 'Berawal dari Tujuan yang Baik'.">
                  <input className={inputCls} value={data.about.companyImage} onChange={e => setAbout('companyImage', e.target.value)} placeholder="https://..."/>
                </Field>
                <ImgPreview url={data.about.companyImage}/>
              </div>
              <div className="space-y-4">
                <Field label="Judul Section">
                  <input className={inputCls} value={data.about.companyJudul} onChange={e => setAbout('companyJudul', e.target.value)} placeholder="Berawal dari Sebuah Tujuan yang Baik"/>
                </Field>
                <Field label="Paragraf 1">
                  <textarea className={inputCls} rows={3} value={data.about.companyParagraf1} onChange={e => setAbout('companyParagraf1', e.target.value)}/>
                </Field>
                <Field label="Paragraf 2">
                  <textarea className={inputCls} rows={3} value={data.about.companyParagraf2} onChange={e => setAbout('companyParagraf2', e.target.value)}/>
                </Field>
              </div>
            </div>
          </SectionCard>

          {/* Founder */}
          <SectionCard title="Section Pesan Founder" icon={<FiUser size={16}/>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Field label="Foto Founder (URL)" hint="Gunakan path lokal /images/... atau URL hosting.">
                  <input className={inputCls} value={data.about.founderImage} onChange={e => setAbout('founderImage', e.target.value)} placeholder="/images/ustadz.png"/>
                </Field>
                <ImgPreview url={data.about.founderImage}/>
              </div>
              <div className="space-y-4">
                <Field label="Nama Founder">
                  <input className={inputCls} value={data.about.founderNama} onChange={e => setAbout('founderNama', e.target.value)} placeholder="Ustadz Haris Amrin"/>
                </Field>
                <Field label="Jabatan / Gelar">
                  <input className={inputCls} value={data.about.founderJabatan} onChange={e => setAbout('founderJabatan', e.target.value)} placeholder="Founder AFKAR LAND"/>
                </Field>
                <Field label="Kutipan / Quote" hint="Ditampilkan sebagai blockquote dengan garis merah.">
                  <textarea className={inputCls} rows={3} value={data.about.founderKutipan} onChange={e => setAbout('founderKutipan', e.target.value)}/>
                </Field>
              </div>
            </div>
          </SectionCard>

          {/* CTA Penutup About */}
          <SectionCard title="CTA Penutup — Halaman Tentang Kami" icon={<Megaphone size={16}/>} accent="bg-gradient-to-r from-red-600 to-red-400">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <Field label="Judul CTA">
                  <input className={inputCls} value={data.about.ctaJudul} onChange={e => setAbout('ctaJudul', e.target.value)} placeholder="Temukan Hunian Syariah Pilihan Anda"/>
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Sub-judul CTA">
                  <textarea className={inputCls} rows={2} value={data.about.ctaSubjudul} onChange={e => setAbout('ctaSubjudul', e.target.value)}/>
                </Field>
              </div>
              <Field label="Teks Tombol">
                <input className={inputCls} value={data.about.ctaLabel} onChange={e => setAbout('ctaLabel', e.target.value)} placeholder="Lihat Semua Proyek"/>
              </Field>
              <Field label="Link Tombol">
                <input className={inputCls} value={data.about.ctaLink} onChange={e => setAbout('ctaLink', e.target.value)} placeholder="/proyek"/>
              </Field>
            </div>
          </SectionCard>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          TAB: KARIR ← BARU
      ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'career' && (
        <div className="space-y-4">

          {/* Hero Career */}
          <SectionCard title="Hero — Halaman Karir" icon={<FiBriefcase size={16}/>} accent="bg-gradient-to-r from-orange-500 to-orange-400">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Judul Hero">
                <input className={inputCls} value={data.career.heroJudul} onChange={e => setCareer('heroJudul', e.target.value)} placeholder="Tumbuh Bersama AFKAR LAND"/>
              </Field>
              <div>
                <Field label="Gambar Hero (URL)">
                  <input className={inputCls} value={data.career.heroImage} onChange={e => setCareer('heroImage', e.target.value)} placeholder="https://..."/>
                </Field>
                <ImgPreview url={data.career.heroImage}/>
              </div>
              <div className="md:col-span-2">
                <Field label="Sub-judul Hero">
                  <textarea className={inputCls} rows={2} value={data.career.heroSubjudul} onChange={e => setCareer('heroSubjudul', e.target.value)}/>
                </Field>
              </div>
            </div>
          </SectionCard>

          {/* Info Rekrutmen */}
          <SectionCard title="Info Rekrutmen & Kontak HRD" icon={<FiPhone size={16}/>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Link Portal Rekrutmen">
                <input className={inputCls} value={data.career.hrPortalLink} onChange={e => setCareer('hrPortalLink', e.target.value)} placeholder="https://sites.google.com/..."/>
              </Field>
              <Field label="No. WA HRD (format: 628xxx)">
                <input className={inputCls} value={data.career.hrdWaNumber} onChange={e => setCareer('hrdWaNumber', e.target.value)} placeholder="6285355355323"/>
              </Field>
              <Field label="Nama PIC HRD">
                <input className={inputCls} value={data.career.hrdNama} onChange={e => setCareer('hrdNama', e.target.value)} placeholder="Pak Abdi"/>
              </Field>
              <Field label="Lokasi Penempatan">
                <input className={inputCls} value={data.career.rekrutmenLokasi} onChange={e => setCareer('rekrutmenLokasi', e.target.value)} placeholder="Makassar & Wotu"/>
              </Field>
              <Field label="Periode Rekrutmen">
                <input className={inputCls} value={data.career.rekrutmenPeriode} onChange={e => setCareer('rekrutmenPeriode', e.target.value)} placeholder="13 Mei – 25 Mei 2026"/>
              </Field>
              <Field label="Tahun Rekrutmen">
                <input className={inputCls} value={data.career.rekrutmenTahun} onChange={e => setCareer('rekrutmenTahun', e.target.value)} placeholder="2026"/>
              </Field>
              <div className="md:col-span-2">
                <Field label="Gambar Flyer Lowongan (URL / Path lokal)" hint="Tampil sebagai poster di sidebar rekrutmen.">
                  <input className={inputCls} value={data.career.flyerImage} onChange={e => setCareer('flyerImage', e.target.value)} placeholder="/lowongan/open-recruitment.jpg"/>
                </Field>
                <ImgPreview url={data.career.flyerImage}/>
              </div>
              <div>
                <Field label="Gambar Budaya Kerja (URL)" hint="Background foto section 'Bekerja dengan Amanah'.">
                  <input className={inputCls} value={data.career.budayaImage} onChange={e => setCareer('budayaImage', e.target.value)} placeholder="https://..."/>
                </Field>
                <ImgPreview url={data.career.budayaImage}/>
              </div>
            </div>
          </SectionCard>

          {/* Manajemen Posisi */}
          <SectionCard title="Daftar Posisi Lowongan" icon={<FiPlus size={16}/>}>
            <p className="text-xs text-gray-400 -mt-2 mb-5">
              Tambah, edit, atau hapus posisi yang tampil di halaman Karir. Centang "Prioritas" agar posisi tampil lebih menonjol.
            </p>
            <div className="space-y-4">
              {(data.career.posisi || []).map((pos, pi) => (
                <div key={pi} className="border border-gray-200 rounded-2xl overflow-hidden">
                  {/* Header posisi */}
                  <div className="flex items-center gap-3 p-4 bg-gray-50 border-b border-gray-200">
                    <input className="w-10 px-2 py-1.5 rounded-lg bg-white border border-gray-200 text-center text-sm outline-none"
                      value={pos.emoji} onChange={e => setPosisi(pi, 'emoji', e.target.value)} placeholder="💼"/>
                    <input className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-sm font-bold outline-none focus:border-red-400"
                      value={pos.title} onChange={e => setPosisi(pi, 'title', e.target.value)} placeholder="Nama Posisi"/>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer select-none">
                      <input type="checkbox" checked={pos.prioritas || false}
                        onChange={e => setPosisi(pi, 'prioritas', e.target.checked)}
                        className="w-4 h-4 rounded accent-red-600"/>
                      Prioritas
                    </label>
                    <button onClick={() => removePosisi(pi)}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg shrink-0"><FiTrash2 size={14}/></button>
                  </div>
                  {/* Jobdesk */}
                  <div className="p-4 space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tanggung Jawab</label>
                    {(pos.jobdesk || []).map((jd, ji) => (
                      <div key={ji} className="flex items-center gap-2">
                        <span className="text-xs text-gray-300 w-4 shrink-0">•</span>
                        <input className={inputCls} value={jd}
                          onChange={e => setJobdesk(pi, ji, e.target.value)}
                          placeholder="Tanggung jawab..."/>
                        <button onClick={() => removeJobdesk(pi, ji)}
                          className="p-1.5 text-red-300 hover:bg-red-50 rounded-lg shrink-0"><FiTrash2 size={12}/></button>
                      </div>
                    ))}
                    <button onClick={() => addJobdesk(pi)}
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors mt-1">
                      <FiPlus size={12}/> Tambah item jobdesk
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={addPosisi}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors w-full justify-center">
                <FiPlus size={15}/> Tambah Posisi Baru
              </button>
            </div>
            {/* Preview */}
            {(data.career.posisi || []).length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {data.career.posisi.map((p, i) => (
                  <span key={i} className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5
                    ${p.prioritas ? 'bg-red-50 text-red-700 border-red-100' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    {p.emoji} {p.title || '—'} {p.prioritas && <span className="text-[9px] bg-red-100 px-1.5 py-0.5 rounded-full">Prioritas</span>}
                  </span>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          TAB: KONTAK ← BARU
      ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'kontak' && (
        <div className="space-y-4">

          {/* Hero Contact */}
          <SectionCard title="Hero — Halaman Kontak" icon={<FiPhone size={16}/>} accent="bg-gradient-to-r from-green-500 to-green-400">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Judul Hero">
                <input className={inputCls} value={data.contact.heroJudul} onChange={e => setContact('heroJudul', e.target.value)} placeholder="Kami Siap Membantu"/>
              </Field>
              <div className="md:col-span-2">
                <Field label="Sub-judul Hero">
                  <textarea className={inputCls} rows={2} value={data.contact.heroSubjudul} onChange={e => setContact('heroSubjudul', e.target.value)}/>
                </Field>
              </div>
            </div>
          </SectionCard>

          {/* Info Kontak */}
          <SectionCard title="Informasi Kontak" icon={<FiInfo size={16}/>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="No. WA untuk Tombol Chat (format: 628xxx)" hint="Digunakan tombol 'Chat WhatsApp' di halaman Kontak.">
                <input className={inputCls} value={data.contact.waNumber} onChange={e => setContact('waNumber', e.target.value)} placeholder="6285705218281"/>
              </Field>
              <Field label="Email Resmi">
                <input className={inputCls} value={data.contact.emailAddress} onChange={e => setContact('emailAddress', e.target.value)} placeholder="info@afkarland.com"/>
              </Field>
              <div className="md:col-span-2">
                <Field label="Alamat Kantor">
                  <input className={inputCls} value={data.contact.alamat} onChange={e => setContact('alamat', e.target.value)} placeholder="Makassar, Sulawesi Selatan, Indonesia"/>
                </Field>
              </div>
            </div>
          </SectionCard>

          {/* Jam Operasional */}
          <SectionCard title="Jam Operasional" icon={<span className="text-sm">🕒</span>}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Field label="Senin – Jumat">
                <input className={inputCls} value={data.contact.jamSenin} onChange={e => setContact('jamSenin', e.target.value)} placeholder="09.00 – 17.00"/>
              </Field>
              <Field label="Sabtu">
                <input className={inputCls} value={data.contact.jamSabtu} onChange={e => setContact('jamSabtu', e.target.value)} placeholder="09.00 – 16.00"/>
              </Field>
              <Field label="Minggu">
                <input className={inputCls} value={data.contact.jamMinggu} onChange={e => setContact('jamMinggu', e.target.value)} placeholder="By Confirmation"/>
              </Field>
            </div>
          </SectionCard>

          {/* Google Maps Embed */}
          <SectionCard title="Google Maps Embed URL" icon={<span className="text-sm">📍</span>}>
            <Field label="URL Embed Google Maps" hint="Dapatkan dari Google Maps → Share → Embed a map → salin URL di src='...'">
              <textarea className={inputCls} rows={3} value={data.contact.mapsEmbed} onChange={e => setContact('mapsEmbed', e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..."/>
            </Field>
            {data.contact.mapsEmbed && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200 h-48">
                <iframe src={data.contact.mapsEmbed} width="100%" height="100%" style={{border: 0}} loading="lazy" title="Preview Maps"/>
              </div>
            )}
          </SectionCard>
        </div>
      )}

      {/* ── TAB: GAMBAR PER HALAMAN ────────────────────────────────────────────── */}
      {activeTab === 'pages' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 h-fit">
            <p className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest px-2 mb-3">Pilih Halaman</p>
            <div className="space-y-1">
              {PAGE_LIST.map(p => (
                <button key={p.key} onClick={() => setActivePage(p.key)}
                  className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm transition-all text-left font-medium
                    ${activePage === p.key ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                  {p.label}
                  {data.pages[p.key]?.heroImage && <span className="ml-auto text-[10px] opacity-60">✓ Gambar</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4">
            {PAGE_LIST.filter(p => p.key === activePage).map(p => (
              <SectionCard key={p.key} title={`Pengaturan — ${p.label}`} icon={<FiImage size={16}/>}>
                <div className="space-y-5">
                  <div>
                    <label className={labelCls}>Hero / Banner Image URL</label>
                    <p className="text-xs text-gray-400 mb-2">Gambar latar belakang bagian atas halaman. Resolusi minimal 1920×600px.</p>
                    <input className={inputCls} value={data.pages[p.key]?.heroImage || ''} onChange={e => setPageField(p.key, 'heroImage', e.target.value)} placeholder="https://storage.googleapis.com/..."/>
                    <ImgPreview url={data.pages[p.key]?.heroImage}/>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Judul Halaman (Hero Title)</label>
                      <input className={inputCls} value={data.pages[p.key]?.heroTitle || ''} onChange={e => setPageField(p.key, 'heroTitle', e.target.value)} placeholder={`Judul halaman ${p.label}`}/>
                    </div>
                    <div>
                      <label className={labelCls}>Sub-judul (Hero Subtitle)</label>
                      <input className={inputCls} value={data.pages[p.key]?.heroSubtitle || ''} onChange={e => setPageField(p.key, 'heroSubtitle', e.target.value)} placeholder="Deskripsi singkat halaman"/>
                    </div>
                  </div>
                  {data.pages[p.key]?.heroImage && (
                    <div className="relative rounded-2xl overflow-hidden h-40 border border-gray-200">
                      <img src={data.pages[p.key].heroImage} alt="preview" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }}/>
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                        <div className="text-lg font-bold">{data.pages[p.key].heroTitle || p.label}</div>
                        {data.pages[p.key].heroSubtitle && <div className="text-sm opacity-80 mt-1">{data.pages[p.key].heroSubtitle}</div>}
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

      {/* ── TAB: BRANDING ──────────────────────────────────────────────────────── */}
      {activeTab === 'branding' && (
        <div className="space-y-4">
          <SectionCard title="Logo Utama Website" icon={<Palette size={16}/>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Field label="URL Logo (PNG/SVG transparan)" hint="Firebase Storage, Cloudinary, atau hosting gambar lain.">
                  <input className={inputCls} value={data.branding.logoUrl} onChange={e => setBranding('logoUrl', e.target.value)} placeholder="https://storage.googleapis.com/..."/>
                </Field>
                <ImgPreview url={data.branding.logoUrl}/>
              </div>
              <div className="space-y-4">
                <Field label="Alt Text Logo">
                  <input className={inputCls} value={data.branding.logoAlt} onChange={e => setBranding('logoAlt', e.target.value)} placeholder="AFKAR GROUP INDONESIA"/>
                </Field>
                <Field label="Nama Site (teks fallback)">
                  <input className={inputCls} value={data.branding.siteName} onChange={e => setBranding('siteName', e.target.value)} placeholder="AFKAR GROUP INDONESIA"/>
                </Field>
                <Field label="Tagline">
                  <input className={inputCls} value={data.branding.tagline} onChange={e => setBranding('tagline', e.target.value)} placeholder="Properti Syariah Terbaik di Sulawesi"/>
                </Field>
              </div>
            </div>
          </SectionCard>
          <SectionCard title="Favicon & Warna Brand" icon={<FiGlobe size={16}/>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Field label="URL Favicon (.ico atau .png 32x32)">
                  <input className={inputCls} value={data.branding.faviconUrl} onChange={e => setBranding('faviconUrl', e.target.value)} placeholder="https://..."/>
                </Field>
                <ImgPreview url={data.branding.faviconUrl}/>
              </div>
              <Field label="Warna Utama Brand">
                <div className="flex items-center gap-3 mt-1">
                  <input type="color" value={data.branding.primaryColor} onChange={e => setBranding('primaryColor', e.target.value)} className="w-14 h-10 rounded-xl border border-gray-200 cursor-pointer p-1"/>
                  <input className={inputCls} value={data.branding.primaryColor} onChange={e => setBranding('primaryColor', e.target.value)} placeholder="#dc2626"/>
                  <div className="w-10 h-10 rounded-xl shrink-0 border border-gray-100" style={{ backgroundColor: data.branding.primaryColor }}/>
                </div>
              </Field>
            </div>
          </SectionCard>
          {data.branding.logoUrl && (
            <div className="bg-gray-900 rounded-2xl p-4 flex items-center gap-3">
              <img src={data.branding.logoUrl} alt={data.branding.logoAlt} className="h-8 object-contain"/>
              <span className="text-white font-bold text-sm">{data.branding.siteName}</span>
              <span className="ml-auto text-xs text-gray-400">Preview navbar</span>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: NAVBAR ────────────────────────────────────────────────────────── */}
      {activeTab === 'navbar' && (
        <div className="space-y-4">
          <SectionCard title="Logo di Navbar" icon={<FiLayout size={16}/>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Field label="URL Logo Navbar (opsional)">
                  <input className={inputCls} value={data.navbar.logoUrl} onChange={e => setNavbar('logoUrl', e.target.value)} placeholder="Kosongkan untuk pakai logo branding utama"/>
                </Field>
                <ImgPreview url={data.navbar.logoUrl}/>
              </div>
              <div className="flex items-center justify-center">
                <div className="bg-gray-900 rounded-2xl px-6 py-4 flex items-center gap-3 w-full">
                  {(data.navbar.logoUrl || data.branding.logoUrl) ? (
                    <img src={data.navbar.logoUrl || data.branding.logoUrl} alt="logo" className="h-7 object-contain"/>
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
                  <input className={inputCls} value={link.label} onChange={e => setNavLink(i, 'label', e.target.value)} placeholder="Label menu (contoh: Beranda)"/>
                  <input className={inputCls} value={link.path} onChange={e => setNavLink(i, 'path', e.target.value)} placeholder="Path (contoh: /proyek)"/>
                  <button onClick={() => removeNavLink(i)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg shrink-0"><FiTrash2 size={14}/></button>
                </div>
              ))}
            </div>
            <button onClick={addNavLink} className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors w-full justify-center">
              <FiPlus size={15}/> Tambah Menu
            </button>
          </SectionCard>
        </div>
      )}

      {/* ── TAB: FOOTER & SOSMED ───────────────────────────────────────────────── */}
      {activeTab === 'footer' && (
        <div className="space-y-4">
          <SectionCard title="Informasi Footer" icon={<FiInfo size={16}/>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <Field label="Deskripsi Footer">
                  <textarea className={inputCls} rows={2} value={data.footer.description} onChange={e => setFooter('description', e.target.value)}/>
                </Field>
              </div>
              <Field label="Nomor Telepon / WhatsApp">
                <input className={inputCls} value={data.footer.phone} onChange={e => setFooter('phone', e.target.value)} placeholder="+62 812-3456-7890"/>
              </Field>
              <Field label="Email">
                <input className={inputCls} value={data.footer.email} onChange={e => setFooter('email', e.target.value)} placeholder="info@afkarland.com"/>
              </Field>
              <div className="md:col-span-2">
                <Field label="Alamat Kantor">
                  <input className={inputCls} value={data.footer.address} onChange={e => setFooter('address', e.target.value)} placeholder="Makassar, Sulawesi Selatan"/>
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Teks Copyright">
                  <input className={inputCls} value={data.footer.copyright} onChange={e => setFooter('copyright', e.target.value)} placeholder="© 2025 AFKAR GROUP INDONESIA. All rights reserved."/>
                </Field>
              </div>
            </div>
          </SectionCard>
          <SectionCard title="Media Sosial" icon={<Smartphone size={16}/>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/afkarland' },
                { key: 'facebook',  label: 'Facebook URL',  placeholder: 'https://facebook.com/afkarland' },
                { key: 'youtube',   label: 'YouTube URL',   placeholder: 'https://youtube.com/@afkarland'  },
                { key: 'tiktok',    label: 'TikTok URL',    placeholder: 'https://tiktok.com/@afkarland'   },
              ].map(s => (
                <Field key={s.key} label={s.label}>
                  <input className={inputCls} value={data.footer[s.key] || ''} onChange={e => setFooter(s.key, e.target.value)} placeholder={s.placeholder}/>
                </Field>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {/* ── TAB: FAQ ───────────────────────────────────────────────────────────── */}
      {activeTab === 'faq' && (
        <SectionCard title="FAQ — Pertanyaan Umum" icon={<span className="text-sm">❓</span>}>
          <div className="space-y-4">
            {data.faq.map((item, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase">FAQ #{i + 1}</span>
                  <button onClick={() => removeFaq(i)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><FiTrash2 size={13}/></button>
                </div>
                <input className={inputCls} value={item.pertanyaan} onChange={e => setFaq(i, 'pertanyaan', e.target.value)} placeholder="Pertanyaan..."/>
                <textarea className={inputCls} rows={2} value={item.jawaban} onChange={e => setFaq(i, 'jawaban', e.target.value)} placeholder="Jawaban..."/>
              </div>
            ))}
            <button onClick={addFaq} className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors w-full justify-center">
              <FiPlus size={15}/> Tambah FAQ
            </button>
          </div>
        </SectionCard>
      )}

      {/* TOMBOL SIMPAN STICKY */}
      <div className="sticky bottom-4 flex justify-end">
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-sm transition-colors disabled:opacity-60 shadow-xl shadow-red-900/20">
          <FiSave size={16}/> {saving ? 'Menyimpan...' : '💾 Simpan & Publish ke Web'}
        </button>
      </div>

    </div>
  );
}