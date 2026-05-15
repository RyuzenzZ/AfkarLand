import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md"
      >
        <h1 className="text-9xl font-heading font-extrabold text-gray-200 mb-4">404</h1>
        <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-500 mb-8">Maaf, halaman yang Anda cari mungkin telah dihapus, dipindahkan, atau tidak pernah ada.</p>
        
        {}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-full font-bold hover:bg-brand-accent transition-colors"
        >
          <FiHome size={20} /> Kembali ke Beranda
        </Link>
      </motion.div>
    </div>
  );
}