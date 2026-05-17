// useSiteSettings.js — AFKAR LAND
// Hook real-time untuk membaca pengaturan site dari Firestore
// Dipakai di semua halaman publik agar perubahan admin langsung terlihat

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const DEFAULT_SETTINGS = {
  branding: {
    logoUrl: '',
    logoAlt: 'AFKAR GROUP INDONESIA',
    siteName: 'AFKAR GROUP INDONESIA',
    tagline: 'Properti Syariah Terbaik di Sulawesi',
    faviconUrl: '',
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
    home:     { heroImage: '', heroTitle: '',  heroSubtitle: '' },
    about:    { heroImage: '', heroTitle: 'Tentang Kami',    heroSubtitle: '' },
    projects: { heroImage: '', heroTitle: 'Proyek Kami',     heroSubtitle: '' },
    career:   { heroImage: '', heroTitle: 'Karir',           heroSubtitle: '' },
    blog:     { heroImage: '', heroTitle: 'Artikel & Blog',  heroSubtitle: '' },
    contact:  { heroImage: '', heroTitle: 'Hubungi Kami',    heroSubtitle: '' },
    faq:      { heroImage: '', heroTitle: 'FAQ',             heroSubtitle: '' },
  },
  hero: {
    judul: 'Properti Syariah Terbaik di Sulawesi',
    subjudul: 'Bersama AFKAR GROUP INDONESIA, wujudkan hunian impian dengan prinsip syariah yang amanah.',
    ctaUtama: 'Lihat Proyek Kami',
    ctaUtamaLink: '/proyek',
    ctaKedua: 'Hubungi Kami',
    ctaKeduaLink: '/kontak',
    badge: 'Terpercaya Sejak 2015',
  },
  statistik: [
    { label: 'Unit Terjual',   value: '500+' },
    { label: 'Proyek Aktif',   value: '4'    },
    { label: 'Kota Jangkauan', value: '8+'   },
    { label: 'Kepuasan Klien', value: '98%'  },
  ],
  footer: {
    description: 'Membangun hunian berkualitas dengan prinsip syariah untuk keluarga Indonesia.',
    phone: '+62 812-3456-7890',
    email: 'info@afkarland.com',
    address: 'Makassar, Sulawesi Selatan',
    instagram: '',
    facebook: '',
    youtube: '',
    copyright: '© 2025 AFKAR GROUP INDONESIA. All rights reserved.',
  },
  faq: [],
};

// Cache supaya tidak re-fetch setiap komponen mount
let cachedSettings = null;
let listeners = [];

export function useSiteSettings() {
  const [settings, setSettings] = useState(cachedSettings || DEFAULT_SETTINGS);
  const [loading, setLoading]   = useState(!cachedSettings);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'homepage_settings', 'main'),
      (snap) => {
        if (snap.exists()) {
          const data = { ...DEFAULT_SETTINGS, ...snap.data() };
          cachedSettings = data;
          setSettings(data);
        }
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, []);

  return { settings, loading };
}

// Helper: ambil pengaturan halaman tertentu
// Contoh pemakaian: const { heroImage, heroTitle } = usePageSettings('about');
export function usePageSettings(pageKey) {
  const { settings, loading } = useSiteSettings();
  return {
    ...(settings.pages?.[pageKey] || {}),
    branding: settings.branding,
    loading,
  };
}

export default useSiteSettings;