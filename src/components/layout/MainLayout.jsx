import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useThemeMode } from '../../hooks/useThemeMode';

// LOGIKA: Komponen ini memastikan Navbar dan Footer konsisten muncul di halaman publik
export default function MainLayout() {
  const { theme } = useThemeMode();

  return (
    <div className={`public-site theme-${theme} flex flex-col min-h-screen bg-white text-gray-900 font-body`}>
      {/* Bagian Navigasi Atas */}
      <Navbar />

      {/* Konten Utama (Berubah-ubah sesuai URL) */}
      <main className="public-main grow pt-20"> 
        <Outlet />
      </main>

      {/* Bagian Kaki Website */}
      <Footer />
    </div>
  );
}
