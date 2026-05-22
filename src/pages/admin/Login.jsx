import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiShield,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessNoticeShown, setAccessNoticeShown] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const toastId = toast.loading('Memverifikasi akses admin...');

    try {
      await login(email.trim(), password);
      toast.success('Login berhasil. Membuka dashboard...', { id: toastId, duration: 1800 });
      setTimeout(() => navigate('/admin/dashboard', { replace: true }), 650);
    } catch {
      toast.error('Login gagal. Periksa email dan password.', { id: toastId, duration: 2600 });
      setIsSubmitting(false);
    }
  };

  const showAdminOnlyNotice = () => {
    if (accessNoticeShown) return;
    setAccessNoticeShown(true);
    toast('Form login ini hanya untuk admin website AFKAR LAND.', {
      icon: 'i',
      duration: 2600,
    });
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b0b0c] px-5 py-8 text-white"
    >
      <div
        className="absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage:
            'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '58px 58px',
        }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/12 blur-3xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.75, 0.48, 0.75] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent" />

      <motion.div
        className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] shadow-2xl shadow-black/40 backdrop-blur-xl md:grid-cols-[1fr_1.08fr]"
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <div className="hidden border-r border-white/10 bg-white/[0.035] p-10 md:flex md:flex-col md:justify-between">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/55 transition-colors hover:text-white"
            >
              <FiArrowLeft size={14} /> Beranda
            </Link>
          </div>

          <div className="space-y-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 shadow-xl shadow-red-950/50">
              <FiShield size={30} />
            </div>
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-red-300">Admin Console</p>
              <h1 className="max-w-sm text-4xl font-black leading-tight tracking-tight">
                Akses aman untuk pengelolaan website AFKAR LAND.
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs text-white/55">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-1 font-bold text-white">CMS</div>
              Konten, SEO, analytics.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-1 font-bold text-white">Protected</div>
              Firebase Auth session.
            </div>
          </div>
        </div>

        <div className="p-7 sm:p-10">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/55 transition-colors hover:text-white md:hidden"
          >
            <FiArrowLeft size={14} /> Beranda
          </Link>

          <div className="mb-8">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 shadow-lg shadow-red-950/40">
              <FiLock size={24} />
            </div>
            <h2 className="text-3xl font-black tracking-tight">Masuk Admin</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/50">
              Gunakan akun terdaftar untuk mengelola website utama.
            </p>
          </div>

          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/[0.07] px-4 py-3 text-left">
            <FiShield size={17} className="mt-0.5 shrink-0 text-amber-200" />
            <p className="text-xs leading-relaxed text-amber-50/75">
              Area ini hanya bisa diakses oleh admin resmi AFKAR LAND. Akses karyawan lintas divisi tersedia melalui Portal Tim Afkar Land.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/50">
                Email Admin
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" size={16} />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  onFocus={showAdminOnlyNotice}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.055] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-red-400/70 focus:bg-white/[0.08] focus:ring-4 focus:ring-red-600/10"
                  placeholder="admin@afkarland.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/50">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  onFocus={showAdminOnlyNotice}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.055] py-3.5 pl-11 pr-12 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-red-400/70 focus:bg-white/[0.08] focus:ring-4 focus:ring-red-600/10"
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(value => !value)}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-white/35 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.985 }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-red-950/35 transition-all hover:bg-red-500 hover:shadow-red-950/50 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  Masuk ke Dashboard <FiArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs leading-relaxed text-white/45">
            Akses ini khusus admin website utama. Portal tim internal tersedia melalui menu Portal Tim Afkar Land.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
