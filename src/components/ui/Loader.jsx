import React from 'react';
import { motion } from 'framer-motion';

// LOGIKA: Menampilkan animasi Intro Logo AFKAR LAND yang elegan
export default function Loader() {
  return (
    // REVISI: Mengubah div luar menjadi motion.div agar bisa diberi efek 'exit' saat menghilang
    <motion.div 
      initial={{ opacity: 1 }}
      // REVISI: Efek menghilang secara halus (fade-out dan sedikit blur) saat durasi habis
      exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 0.8, ease: "easeInOut" } }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        {/* Efek Lingkaran Emas Bersinar */}
        <div className="relative flex items-center justify-center mb-6">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute w-32 h-32 rounded-full bg-brand-accent blur-xl"
          ></motion.div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="w-20 h-20 border-4 border-gray-100 border-t-brand-primary border-r-brand-accent rounded-full relative z-10"
          />
        </div>

        {/* Teks Logo */}
        <h1 className="text-5xl font-heading font-black tracking-[0.1em] text-gray-900 drop-shadow-sm">
          AFKAR <span className="text-brand-primary">LAND</span>
        </h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-gray-500 mt-3 text-sm font-bold uppercase tracking-[0.4em]"
        >
          Developer Properti Syariah
        </motion.p>
      </motion.div>
    </motion.div>
  );
}