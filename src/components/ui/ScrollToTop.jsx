// src/components/ui/ScrollToTop.jsx
// LOGIKA: Auto scroll ke atas setiap kali route/pathname berubah

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // LOGIKA: Scroll instan ke posisi paling atas tanpa animasi
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  // LOGIKA: Tidak merender elemen apapun ke DOM
  return null;
}