import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

// LOGIKA: Komponen ini memastikan Navbar dan Footer konsisten muncul di halaman publik
export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-body">
      {/* Bagian Navigasi Atas */}
      <Navbar />

      {/* Konten Utama (Berubah-ubah sesuai URL) */}
      <main className="grow pt-20"> 
        <Outlet />
      </main>

      {/* Bagian Kaki Website */}
      <Footer />
    </div>
  );
}