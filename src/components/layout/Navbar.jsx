import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Efek transisi warna Navbar saat halaman di-scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tutup menu mobile otomatis saat berpindah halaman
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Tentang Kami', path: '/tentang-kami' },
    { name: 'Proyek', path: '/proyek' },
    { name: 'Artikel', path: '/artikel' },
    { name: 'Karir', path: '/karir' },
    { name: 'Kontak', path: '/kontak' },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-red-700 shadow-lg py-4' : 'bg-red-600 py-6'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center relative">
        
        {/* Logo Perusahaan */}
        <Link to="/" className="flex items-center gap-3 relative z-10 hover:scale-105 transition-transform">
          {/* Tempat Logo Gambar. Ganti URL src dengan path gambar logo Anda, misalnya "/images/logo.png" */}
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-sm">
            <img 
              src="https://via.placeholder.com/150/DC2626/FFFFFF?text=AL" 
              alt="Logo AFKAR LAND" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-2xl font-heading font-extrabold text-white tracking-widest">
            AFKAR <span className="text-red-200">LAND</span>
          </div>
        </Link>

        {/* Navigasi Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`text-sm font-bold text-white hover:text-red-200 transition-colors uppercase tracking-wider relative group`}
            >
              {link.name}
              {/* Garis bawah animasi saat hover atau sedang aktif */}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-red-200 transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          ))}
        </nav>

        {/* 🔒 JALUR RAHASIA ADMIN (HIDDEN LINK) */}
        <Link 
          to="/admin/login" 
          className="absolute right-0 top-0 w-10 h-10 opacity-0 z-20" 
          title="Login Akses"
        >
          Admin
        </Link>

        {/* Tombol Hamburger Mobile */}
        <button 
          className="md:hidden text-white relative z-10 hover:text-red-200 transition-colors" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      {/* Navigasi Dropdown Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-red-800 absolute top-full left-0 w-full shadow-2xl border-t border-red-900/50"
          >
            <div className="flex flex-col px-6 py-6 gap-2">
              {navLinks.map((link) => (
                 <Link 
                   key={link.name} 
                   to={link.path} 
                   className={`text-white font-bold text-lg py-3 border-b border-red-700/50 transition-colors ${location.pathname === link.path ? 'text-red-300' : 'hover:text-red-200'}`}
                 >
                   {link.name}
                 </Link>
              ))}
              
              {/* 🔒 Jalur Rahasia Admin untuk Mobile */}
              <Link to="/admin/login" className="text-xs text-red-800 mt-6 text-right select-none">
                login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}