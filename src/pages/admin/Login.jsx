import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FiLock, FiMail, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 1. Eksekusi Login Firebase
      await login(email, password);
      
      // 2. Tampilkan Notifikasi Baru
      toast.success('Login Berhasil! Membuka Dashboard...', { duration: 2000 });

      // 3. KUNCI PERBAIKAN: Beri waktu sistem 1.5 detik agar Kartu ID selesai dibuat!
      // Tanpa jeda ini, AdminLayout akan selalu menendang kamu kembali ke sini.
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);

    } catch (error) {
      console.error("Detail Error Firebase:", error);
      toast.error('Gagal login. Periksa email dan password Anda.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 font-body relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-10 shadow-2xl relative"
      >
        <Link 
          to="/" 
          className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-brand-primary transition-colors"
        >
          <FiArrowLeft /> Beranda
        </Link>

        <div className="text-center mb-10 mt-4">
          <h1 className="text-3xl font-heading font-extrabold text-gray-900 tracking-tight mb-2">
            AFKAR <span className="text-brand-primary">ADMIN</span>
          </h1>
          <p className="text-gray-500 text-sm">Masuk untuk mengelola data website</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Admin</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" 
                placeholder="admin@afkarland.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" 
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" disabled={isSubmitting}
            className="w-full bg-brand-primary hover:bg-brand-accent text-white font-bold py-4 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Memproses...' : <><FiArrowRight /> Masuk ke Dashboard</>}
          </button>
        </form>
        
        <p className="text-center text-xs text-gray-400 mt-8">
          Sistem Terproteksi Firebase VIBE ARCHITECT PRO
        </p>
      </motion.div>
    </div>
  );
}