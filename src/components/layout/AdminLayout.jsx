import { useEffect, useRef, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiBell, FiChevronLeft, FiChevronRight, FiLock, FiMenu } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(() => localStorage.getItem('afkar_admin_sidebar_hidden') === 'true');
  const sessionToastShown = useRef(false);

  useEffect(() => {
    if (!loading && !user && !sessionToastShown.current) {
      sessionToastShown.current = true;
      toast.error('Sesi admin tidak aktif. Silakan login kembali.', { duration: 3000 });
    }
  }, [loading, user]);

  useEffect(() => {
    localStorage.setItem('afkar_admin_sidebar_hidden', String(sidebarHidden));
  }, [sidebarHidden]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative flex h-14 w-14 items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-red-100" />
            <div className="h-10 w-10 rounded-full border-4 border-red-600 border-t-transparent animate-spin" />
          </div>
          <p className="text-xs font-bold tracking-[0.28em] text-gray-400 uppercase">Memuat sistem admin</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#0b0b0c] flex items-center justify-center p-6 text-white">
        <div
          className="absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage:
              'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '58px 58px',
          }}
        />
        <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/12 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl shadow-black/40 backdrop-blur-xl"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 shadow-lg shadow-red-950/40">
            <FiLock size={28} />
          </div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-red-300">Session Expired</p>
          <h1 className="text-2xl font-black tracking-tight">Sesi Admin Tidak Aktif</h1>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            Untuk menjaga keamanan panel, silakan login kembali sebelum mengakses dashboard admin AFKAR LAND.
          </p>
          <Link
            to="/admin/login"
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-red-950/35 transition-all hover:bg-red-500"
          >
            Login Kembali <FiArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-body">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`fixed top-0 left-0 h-full z-40 transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${sidebarHidden ? 'md:-translate-x-full' : 'md:translate-x-0'}`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <button
        type="button"
        onClick={() => setSidebarHidden(prev => !prev)}
        className={`fixed top-4 z-50 hidden items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-600 shadow-sm transition-all hover:border-red-200 hover:text-red-600 md:flex ${
          sidebarHidden ? 'left-4' : 'left-[17rem]'
        }`}
        aria-label={sidebarHidden ? 'Tampilkan sidebar admin' : 'Sembunyikan sidebar admin'}
      >
        {sidebarHidden ? <FiChevronRight size={15} /> : <FiChevronLeft size={15} />}
        {sidebarHidden ? 'Menu' : 'Hide'}
      </button>

      <main className={`admin-layout-scroll h-screen min-h-0 flex-1 overflow-y-auto bg-gray-50 transition-all duration-300 ${sidebarHidden ? 'md:ml-0' : 'md:ml-64'}`}>
        <div className="md:hidden flex items-center justify-between gap-4 px-5 py-4 bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              aria-label="Buka menu admin"
            >
              <FiMenu size={20} />
            </button>
            <span className="text-lg font-heading font-extrabold tracking-widest text-gray-900">
              AFKAR <span className="text-red-600">LAND</span>
            </span>
          </div>
          <Link
            to="/admin/notifications"
            className="relative p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            aria-label="Notifikasi"
          >
            <FiBell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </Link>
        </div>

        <div className="p-5 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
