import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, loading } = useAuth();

  // 1. TAMPILAN JIKA SEDANG LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white font-bold text-xl">
        SEDANG MEMBACA KARTU ID DARI FIREBASE... MOHON TUNGGU...
      </div>
    );
  }

  // 2. TAMPILAN DIAGNOSA JIKA KARTU ID KOSONG (Ini yang biasanya menendang Anda secara diam-diam)
  if (!user) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-6">
        <div className="max-w-xl bg-white p-10 rounded-3xl shadow-xl border-2 border-red-500">
          <h1 className="text-3xl font-black text-red-600 mb-4">🚨 STOP! DIAGNOSA ERROR</h1>
          <p className="text-gray-700 mb-6 font-medium">
            Anda berhasil login di form, tetapi saat berpindah ke halaman ini, sistem membaca bahwa KARTU ID Anda <span className="font-bold text-red-600">KOSONG (null)</span>. Ini berarti memori state React Anda bocor atau AuthProvider Anda tidak terpasang dengan benar di file utama (main.jsx).
          </p>
          
          <div className="bg-gray-900 text-green-400 p-6 rounded-xl font-mono text-sm mb-8">
            <p>{`> Status Loading : ${loading ? 'Aktif' : 'Selesai'}`}</p>
            <p>{`> Status User    : ${user ? 'Ditemukan' : 'KOSONG / TIDAK TERBACA'}`}</p>
          </div>

          <Link to="/admin/login" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl w-full block text-center">
            Kembali ke Halaman Login
          </Link>
        </div>
      </div>
    );
  }

  // 3. JIKA BERHASIL (Normal)
  return (
    <div className="flex min-h-screen bg-gray-50 font-body overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 md:p-10 w-[calc(100%-16rem)] min-h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}