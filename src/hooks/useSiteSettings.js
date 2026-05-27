// useSiteSettings.js — AFKAR LAND
// Hook real-time untuk membaca pengaturan site dari Firestore
// Dipakai di semua halaman publik agar perubahan admin langsung terlihat

import { createContext, createElement, useContext, useEffect, useState } from 'react';

const DEFAULT_SETTINGS = {
  branding: {
    logoUrl:      '',
    logoAlt:      'AFKAR LAND',
    siteName:     'AFKAR LAND',
    tagline:      'Properti Syariah Terbaik di Sulawesi',
    faviconUrl:   '',
    primaryColor: '#dc2626',
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
  // ── Gambar hero tiap halaman (dikelola di tab "Gambar Halaman" CMS) ─────────
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
    badge:        'Developer Property Syariah Terpercaya',
    judul:        'Hunian Syariah Modern\nuntuk Masa Depan Keluarga Anda',
    subjudul:     'AFKAR LAND menghadirkan kawasan property syariah premium tanpa riba, tanpa bank, tanpa bunga, dan tanpa sita dengan konsep hunian modern islami di Indonesia Timur.',
    ctaUtama:     'Lihat Project Kami',
    ctaUtamaLink: '/proyek',
    ctaKedua:     'Jadwalkan Survey Lokasi',
    ctaKeduaLink: '/kontak',
  },
  statistik: [
    { label: 'Unit Terjual',   value: '500+' },
    { label: 'Proyek Aktif',   value: '4'    },
    { label: 'Kota Jangkauan', value: '8+'   },
    { label: 'Kepuasan Klien', value: '98%'  },
  ],
  // ── Konten teks beranda ────────────────────────────────────────────────────
  konten: {
    tentangParagraf1:   'AFKAR LAND adalah perusahaan pengembang property syariah modern yang berfokus menghadirkan kawasan hunian nyaman, berkualitas, dan bernilai investasi tinggi.',
    tentangParagraf2:   'Kami hadir untuk memberikan solusi kepemilikan rumah tanpa riba melalui sistem transaksi syariah yang aman, transparan, dan sesuai prinsip Islam.',
    pilarSyariah:       ['Tanpa Bank', 'Tanpa Bunga', 'Tanpa Denda', 'Tanpa Sita', 'Tanpa BI Checking', 'Tanpa Penalti', 'Tanpa Asuransi'],
    ctaPenutupJudul:    'Siap Memiliki Hunian Syariah Impian Anda?',
    ctaPenutupSubjudul: 'Konsultasikan kebutuhan property Anda bersama tim konsultan profesional AFKAR LAND sekarang juga.',
    trustSubjudul:      'AfkarLand berkomitmen untuk menghadirkan dan mengembangkan proyek properti syariah di seluruh wilayah sulawesi.',
  },
  // ── Halaman Tentang Kami ───────────────────────────────────────────────────
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
  // ── Halaman Karir ─────────────────────────────────────────────────────────
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
      {
        title: 'Marketing Executive', prioritas: true, emoji: '📣',
        jobdesk: ['Mencari & mengelola calon pembeli (leads)', 'Follow up database & komunikasi calon konsumen', 'Closing penjualan & membuat laporan harian'],
      },
      {
        title: 'Teknik', prioritas: true, emoji: '🔧',
        jobdesk: ['Merencanakan & mengawasi pelaksanaan proyek', 'Membuat gambar kerja, RAB & time schedule', 'Koordinasi kontraktor, vendor & tim terkait'],
      },
      {
        title: 'Sales Leader', prioritas: false, emoji: '🏆',
        jobdesk: ['Memimpin & mengelola tim sales', 'Menyusun strategi penjualan & rencana kerja'],
      },
    ],
  },
  // ── Halaman Kontak ────────────────────────────────────────────────────────
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
  // ── Footer & Sosmed ───────────────────────────────────────────────────────
  footer: {
    description: 'Membangun hunian berkualitas dengan prinsip syariah untuk keluarga Indonesia.',
    phone:       '+62 812-3456-7890',
    email:       'info@afkarland.com',
    address:     'Makassar, Sulawesi Selatan',
    instagram:   '',
    facebook:    '',
    youtube:     '',
    tiktok:      '',
    copyright:   '© 2025 AFKAR LAND. All rights reserved.',
  },
  // ── FAQ ───────────────────────────────────────────────────────────────────
  faq: [
    { pertanyaan: 'Apakah produk AFKAR LAND bersertifikat syariah?', jawaban: 'Ya, semua produk kami telah melalui kajian syariah dan bebas dari riba.' },
    { pertanyaan: 'Bagaimana cara pemesanan unit?',                  jawaban: 'Anda bisa mengisi formulir booking di halaman detail proyek atau menghubungi tim kami.' },
  ],
};

const SETTINGS_CACHE_KEY = 'afkar_site_settings_v1';

function readCachedSettings() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SETTINGS_CACHE_KEY);
    if (!raw) return null;
    return mergeWithDefaults(DEFAULT_SETTINGS, JSON.parse(raw));
  } catch {
    return null;
  }
}

function writeCachedSettings(settings) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settings));
  } catch {
    // Cache is only a flicker-prevention layer; Firestore remains source of truth.
  }
}

// ── Deep merge helpers ────────────────────────────────────────────────────────

/**
 * Merge satu object dengan defaultnya satu level dalam.
 * Properti yang ada di saved menang; properti yang tidak ada di saved
 * diisi dari defaults.
 */
function shallowMerge(defaults, saved) {
  if (!saved || typeof saved !== 'object') return defaults;
  return { ...defaults, ...saved };
}

/**
 * Deep merge khusus untuk `pages`:
 * Setiap sub-halaman (home, about, dst) di-merge dengan defaultnya secara
 * individual sehingga field yang tidak disimpan di Firestore tetap
 * mendapat nilai default yang benar.
 *
 * Contoh: Firestore menyimpan pages.faq = { heroImage: 'url' }
 * → hasil: { heroImage: 'url', heroTitle: 'FAQ', heroSubtitle: '' }
 */
function mergePages(defaultPages, savedPages) {
  if (!savedPages || typeof savedPages !== 'object') return defaultPages;
  const result = { ...defaultPages };
  for (const pageKey of Object.keys(savedPages)) {
    result[pageKey] = shallowMerge(defaultPages[pageKey] || {}, savedPages[pageKey]);
  }
  return result;
}

/**
 * Merge data Firestore dengan DEFAULT_SETTINGS secara menyeluruh.
 * - Object satu level (branding, hero, footer, …): shallow merge
 * - pages: deep merge per-halaman (lihat mergePages)
 * - Array (statistik, faq, navbar.links, career.posisi, konten.pilarSyariah):
 *   data Firestore selalu menang kalau ada
 */
function mergeWithDefaults(defaults, saved) {
  const result = { ...defaults };

  for (const key of Object.keys(saved || {})) {
    if (key === 'pages') {
      // Dua level dalam — merge tiap halaman secara individual
      result.pages = mergePages(defaults.pages, saved.pages);
    } else if (
      key in defaults &&
      typeof defaults[key] === 'object' &&
      !Array.isArray(defaults[key]) &&
      defaults[key] !== null
    ) {
      // Object satu level: shallow merge
      result[key] = shallowMerge(defaults[key], saved[key]);
    } else {
      result[key] = saved[key];
    }
  }

  // Array: data Firestore selalu menang kalau ada dan bukan kosong
  if (Array.isArray(saved?.statistik)            && saved.statistik.length)            result.statistik  = saved.statistik;
  if (Array.isArray(saved?.faq)                  && saved.faq.length)                  result.faq        = saved.faq;
  if (Array.isArray(saved?.navbar?.links)        && saved.navbar.links.length)         result.navbar     = { ...result.navbar,  links:  saved.navbar.links };
  if (Array.isArray(saved?.career?.posisi)       && saved.career.posisi.length)        result.career     = { ...result.career,  posisi: saved.career.posisi };
  if (Array.isArray(saved?.konten?.pilarSyariah) && saved.konten.pilarSyariah.length)  result.konten     = { ...result.konten,  pilarSyariah: saved.konten.pilarSyariah };

  return result;
}

// ── Hook utama ────────────────────────────────────────────────────────────────
const SiteSettingsContext = createContext(null);

function useSiteSettingsSubscription() {
  const [initial] = useState(() => {
    const cached = readCachedSettings();
    return {
      settings: cached || DEFAULT_SETTINGS,
      hasCache: Boolean(cached),
    };
  });
  const [settings, setSettings] = useState(initial.settings);
  const [loading, setLoading]   = useState(!initial.hasCache);

  useEffect(() => {
    let unsub = () => {};
    let mounted = true;

    Promise.all([
      import('../config/firebaseConfig'),
      import('firebase/firestore'),
    ]).then(([{ db }, { doc, onSnapshot }]) => {
      if (!mounted) return;
      unsub = onSnapshot(
        doc(db, 'homepage_settings', 'main'),
        (snap) => {
          if (snap.exists()) {
            const nextSettings = mergeWithDefaults(DEFAULT_SETTINGS, snap.data());
            setSettings(nextSettings);
            writeCachedSettings(nextSettings);
          }
          setLoading(false);
        },
        () => setLoading(false)
      );
    }).catch(() => {
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  return { settings, loading };
}

export function SiteSettingsProvider({ children }) {
  const value = useSiteSettingsSubscription();
  return createElement(SiteSettingsContext.Provider, { value }, children);
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used inside SiteSettingsProvider');
  }
  return context;
}

// ── Helper: ambil pengaturan satu halaman tertentu ───────────────────────────
// Contoh: const { heroImage, heroTitle, branding, loading } = usePageSettings('about');
export function usePageSettings(pageKey) {
  const { settings, loading } = useSiteSettings();
  return {
    ...(settings.pages?.[pageKey] || {}),
    branding: settings.branding,
    loading,
  };
}

export default useSiteSettings;
