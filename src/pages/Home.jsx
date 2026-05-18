import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiArrowRight, FiShield, FiHome, FiHeart, FiCheckCircle, 
  FiTarget, FiTrendingUp, FiLayers, FiUsers, FiAward, 
  FiDownload, FiStar, FiMapPin, FiMessageSquare, FiMonitor, FiShare2
} from 'react-icons/fi';

// ── Real-time settings dari admin ──────────────────────────────
import { useSiteSettings } from '../hooks/useSiteSettings';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

// --- DATA PROJECT (Untuk Beranda) ---
const featuredProjects = [
  { slug: 'masagena-green-hills', name: 'Masagena Green Hills', img: '/images/Masagena.jpg', desc: 'Kawasan hunian modern bernuansa hijau dengan lingkungan strategis.', brosurUrl: '/brosur/Brosur_Masagena_Green_Hills.pdf' },
  { slug: 'wotu-islamic-village', name: 'Wotu Islamic Village', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80', desc: 'Kawasan islami terpadu dengan masjid agung dan lingkungan syariah.', brosurUrl: '/brosur/Brosur_Wotu_Islamic_Village.pdf' },
  { slug: 'hasanah-panakkukang', name: 'The Hasanah Panakkukang', img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80', desc: 'Hunian premium modern di kawasan paling strategis pusat kota Makassar.', brosurUrl: '/brosur/Brosur_The_Hasanah_Panakkukang.pdf' },
  { slug: 'afkar-madani-estate', name: 'Afkar Madani Estate', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80', desc: 'Perumahan premium eksklusif dengan gerbang mewah & infrastruktur modern.', brosurUrl: '/brosur/Brosur_Afkar_Madani_Estate.pdf' }
];

// --- DATA ANGGOTA TIM PER DIVISI ---
const teamMembersData = {
  'Marketing Executive': [
    { name: 'Fila Amelia', role: 'Official Masagena Green Hills', img: 'https://ui-avatars.com/api/?name=Fila+Amelia&background=111&color=fff&size=200' },
    { name: 'Hazfira', role: 'Official Wotu Islamic Village', img: 'https://ui-avatars.com/api/?name=Hazfira&background=111&color=fff&size=200' },
    { name: 'Cooming Soon', role: 'Official The Hasanah Panakkukang', img: 'https://ui-avatars.com/api/?name=Cooming+Soon&background=111&color=fff&size=200' },
    { name: 'Cooming Soon', role: 'Official Afkar Madani Estate', img: 'https://ui-avatars.com/api/?name=Cooming+Soon&background=111&color=fff&size=200' }
  ],
  'Digital Marketing': [
    { name: 'Damar Mahendra', role: 'Adsvertiser & Pengembang Web & APK', img: 'https://ui-avatars.com/api/?name=Damar+Mahendra&background=111&color=fff&size=200' }
  ],
  'Sales Leader': [
    { name: 'Cooming Soon', role: 'Leader Official Project AFKAR LAND', img: 'https://ui-avatars.com/api/?name=Cooming+Soon&background=111&color=fff&size=200' }
  ],
  'Marcomm': [
    { name: 'Nabila Azzahra', role: 'Creative Content Editor', img: 'https://ui-avatars.com/api/?name=Nabila+Azzahra&background=111&color=fff&size=200' },
    { name: 'Cooming Soon', role: 'Creative Documenter', img: 'https://ui-avatars.com/api/?name=Cooming+Soon&background=111&color=fff&size=200' }
  ],
  'Pimpinan Proyek / Teknis': [
    { name: 'Cooming Soon', role: 'Pimpinan Proyek AFKAR LAND', img: 'https://ui-avatars.com/api/?name=Cooming+Soon&background=111&color=fff&size=200' },
    { name: 'Cooming Soon', role: 'Project Engineering Lead – Wotu Islamic Village', img: 'https://ui-avatars.com/api/?name=Cooming+Soon&background=111&color=fff&size=200' },
    { name: 'Cooming Soon', role: 'Project Engineering Lead – The Hasanah Panakkukang', img: 'https://ui-avatars.com/api/?name=Cooming+Soon&background=111&color=fff&size=200' },
    { name: 'Cooming Soon', role: 'Project Engineering Lead – Afkar Madani Estate', img: 'https://ui-avatars.com/api/?name=Cooming+Soon&background=111&color=fff&size=200' },
    { name: 'Cooming Soon', role: 'Project Engineering Lead – Masagena Green Hills', img: 'https://ui-avatars.com/api/?name=Cooming+Soon&background=111&color=fff&size=200' },
    { name: 'Novi Marliani', role: 'Admin Project Wotu Islamic Village', img: 'https://ui-avatars.com/api/?name=Novi+Marliani&background=111&color=fff&size=200' },
    { name: 'Cooming Soon', role: 'Admin Project The Hasanah Panakkukang', img: 'https://ui-avatars.com/api/?name=Cooming+Soon&background=111&color=fff&size=200' },
    { name: 'Cooming Soon', role: 'Admin Project Afkar Madani Estate', img: 'https://ui-avatars.com/api/?name=Cooming+Soon&background=111&color=fff&size=200' },
    { name: 'Cooming Soon', role: 'Admin Project Masagena Green Hills', img: 'https://ui-avatars.com/api/?name=Cooming+Soon&background=111&color=fff&size=200' }
  ]
};

// --- DATA TESTIMONI ---
const testimonials = [
  { text: "Alhamdulillah, proses pembelian sangat mudah tanpa ribet urusan bank. Developer sangat kooperatif dan yang terpenting hati tenang karena tidak ada denda jika telat bayar.", name: "Keluarga Ahmad", project: "Masagena Green Hills" },
  { text: "Lingkungan islami yang kami cari akhirnya ketemu di sini. Proses syariahnya benar-benar menenangkan hati, bebas dari perasaan was-was.", name: "Keluarga Rahman", project: "Wotu Islamic Village" },
  { text: "Lokasi sangat strategis di pusat kota namun tetap mengedepankan nilai-nilai syariah. Tanpa BI checking sangat membantu kami yang berwirausaha.", name: "Keluarga Ibrahim", project: "The Hasanah Panakkukang" },
  { text: "Desain rumahnya premium dan elegan. Gerbangnya mewah. Alhamdulillah bisa punya rumah tanpa riba di lingkungan yang aman dan nyaman.", name: "Keluarga Wijaya", project: "Afkar Madani Estate" },
  { text: "Sangat merekomendasikan AFKAR LAND untuk siapapun yang ingin hijrah dari transaksi ribawi. Legalitas aman dan sangat terpercaya.", name: "Keluarga Syamsuddin", project: "Masagena Green Hills" },
];

const duplicatedTestimonials = [...testimonials, ...testimonials];

// Default fallback values — termasuk konten dari ManageHomepage
const DEFAULTS = {
  heroImage:  '/images/Hero.jpg',
  badge:      'Developer Property Syariah Terpercaya',
  judul:      'Hunian Syariah Modern\nuntuk Masa Depan Keluarga Anda',
  subjudul:   'AFKAR LAND menghadirkan kawasan property syariah premium tanpa riba, tanpa bank, tanpa bunga, dan tanpa sita dengan konsep hunian modern islami di Indonesia Timur.',
  ctaUtama:      'Lihat Project Kami',
  ctaUtamaLink:  '/proyek',
  ctaKedua:      'Jadwalkan Survey Lokasi',
  ctaKeduaLink:  '/kontak',
  statistik: [
    { label: 'Unit Terjual',   value: '500+' },
    { label: 'Proyek Aktif',   value: '4'    },
    { label: 'Kota Jangkauan', value: '8+'   },
    { label: 'Kepuasan Klien', value: '98%'  },
  ],
  // ── Konten halaman — sinkron dengan ManageHomepage "Konten Halaman" tab ──
  konten: {
    tentangParagraf1: 'AFKAR LAND adalah perusahaan pengembang property syariah modern yang berfokus menghadirkan kawasan hunian nyaman, berkualitas, dan bernilai investasi tinggi.',
    tentangParagraf2: 'Kami hadir untuk memberikan solusi kepemilikan rumah tanpa riba melalui sistem transaksi syariah yang aman, transparan, dan sesuai prinsip Islam. Menghindari sistem denda dan sita yang memberatkan.',
    pilarSyariah: ['Tanpa Bank', 'Tanpa Bunga', 'Tanpa Denda', 'Tanpa Sita', 'Tanpa BI Checking', 'Tanpa Penalti', 'Tanpa Asuransi'],
    ctaPenutupJudul:    'Siap Memiliki Hunian Syariah Impian Anda?',
    ctaPenutupSubjudul: 'Konsultasikan kebutuhan property Anda bersama tim konsultan profesional AFKAR LAND sekarang juga. Gratis tanpa komitmen!',
    trustSubjudul: 'AfkarLand berkomitmen untuk menghadirkan dan mengembangkan proyek properti syariah di seluruh wilayah sulawesi termasuk Makassar, Gowa, Wotu dan beberapa wilayah lainnya yang akan menjadi wilayah pengembangan property syariah.',
  },
};

export default function Home() {
  const [activeDivision, setActiveDivision] = useState(null);

  // ── Baca pengaturan real-time dari Firestore via admin ─────
  const { settings } = useSiteSettings();

  // Ambil nilai dari admin, fallback ke default jika belum diisi
  const heroImage  = settings?.pages?.home?.heroImage  || DEFAULTS.heroImage;
  const hero       = settings?.hero   || {};
  const badge      = hero.badge        || DEFAULTS.badge;
  const judul      = hero.judul        || DEFAULTS.judul;
  const subjudul   = hero.subjudul     || DEFAULTS.subjudul;
  const ctaUtama      = hero.ctaUtama      || DEFAULTS.ctaUtama;
  const ctaUtamaLink  = hero.ctaUtamaLink  || DEFAULTS.ctaUtamaLink;
  const ctaKedua      = hero.ctaKedua      || DEFAULTS.ctaKedua;
  const ctaKeduaLink  = hero.ctaKeduaLink  || DEFAULTS.ctaKeduaLink;
  const statistik  = settings?.statistik?.length ? settings.statistik : DEFAULTS.statistik;

  // ── Konten halaman — dari tab "Konten Halaman" di ManageHomepage ──
  const konten = { ...DEFAULTS.konten, ...(settings?.konten || {}) };
  const tentangParagraf1  = konten.tentangParagraf1;
  const tentangParagraf2  = konten.tentangParagraf2;
  const pilarSyariah      = Array.isArray(konten.pilarSyariah) && konten.pilarSyariah.length
    ? konten.pilarSyariah
    : DEFAULTS.konten.pilarSyariah;
  const ctaPenutupJudul    = konten.ctaPenutupJudul;
  const ctaPenutupSubjudul = konten.ctaPenutupSubjudul;
  const trustSubjudul      = konten.trustSubjudul;

  const toggleDivision = (divisionName) => {
    setActiveDivision(activeDivision === divisionName ? null : divisionName);
  };

  return (
    <div className="w-full bg-[#080808] font-body overflow-hidden text-white">

      {/* ==========================================
          1. HERO SECTION — gambar & teks dari admin
      ========================================== */}
      <section className="relative h-screen min-h-[900px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* ✅ Hero image real-time dari admin */}
          <img
            src={heroImage}
            alt="AFKAR LAND"
            className="w-full h-full object-cover opacity-40 scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/80 via-[#080808]/50 to-[#080808]" />
          <div className="absolute inset-0 bg-red-900/10 mix-blend-overlay" />
        </div>

        <div className="container relative z-10 mx-auto px-6 md:px-12 mt-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl mx-auto text-center">
            <motion.div variants={fadeUp} className="mb-6">
              <div className="inline-block text-3xl font-heading font-extrabold tracking-[0.2em] mb-2">
                AFKAR <span className="text-red-600">LAND</span>
              </div>
              {/* ✅ Badge dari admin */}
              <div className="flex items-center justify-center gap-2 text-red-500 font-bold tracking-widest text-[10px] uppercase">
                <span className="w-1 h-1 rounded-full bg-red-500" />
                {badge}
                <span className="w-1 h-1 rounded-full bg-red-500" />
              </div>
            </motion.div>

            {/* ✅ Judul dari admin */}
            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold leading-[1.1] mb-6 tracking-tight">
              {judul.includes('\n') ? (
                <>
                  {judul.split('\n')[0]}<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-300">
                    {judul.split('\n')[1]}
                  </span>
                </>
              ) : (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-300">
                  {judul}
                </span>
              )}
            </motion.h1>

            {/* ✅ Subjudul dari admin */}
            <motion.p variants={fadeUp} className="text-base md:text-lg text-gray-300 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
              {subjudul}
            </motion.p>

            {/* ✅ CTA buttons dari admin */}
            <motion.div variants={fadeUp}>
              <Link
                to={ctaUtamaLink}
                className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-900/30 hover:-translate-y-1"
              >
                {ctaUtama} <FiArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }}
          className="absolute bottom-10 left-0 right-0 z-20 px-6 hidden md:block"
        >
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-4 gap-4">
              {[
                { icon: <FiShield />, title: '100% Syariah' },
                { icon: <FiLayers />, title: '4 Project Aktif' },
                { icon: <FiUsers />, title: 'Tim Professional' },
                { icon: <FiAward />, title: 'Legalitas Aman' }
              ].map((stat, i) => (
                <div key={i} className="bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-red-500/50 transition-colors">
                  <div className="text-red-500 bg-red-500/10 p-3 rounded-xl">{stat.icon}</div>
                  <h4 className="font-bold text-sm">{stat.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          STATISTIK BANNER — angka dari admin
      ========================================== */}
      {statistik.length > 0 && (
        <section className="py-12 bg-[#111] border-y border-white/5">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {statistik.map((s, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-black text-red-500 mb-1">{s.value}</div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==========================================
          2. SECTION TENTANG AFKAR LAND
          ✅ Paragraf dari ManageHomepage → Konten Halaman
      ========================================== */}
      <section className="py-24 md:py-32 bg-[#080808] relative">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-widest">
                Tentang AFKAR LAND
              </div>
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold mb-6 leading-tight">
                Membangun Hunian,<br />Membangun Kehidupan yang Lebih Berkah
              </h2>
              {/* ✅ Paragraf real-time dari ManageHomepage → tab Konten Halaman */}
              <div className="space-y-4 text-gray-400 leading-relaxed text-sm md:text-base">
                <p>
                  <strong className="text-white">AFKAR LAND</strong> {tentangParagraf1}
                </p>
                <p>
                  {tentangParagraf2}
                </p>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img src="/images/Masagena.jpg" alt="Premium House" className="rounded-3xl w-full h-64 object-cover mt-8 border border-white/5" />
                <img src="/images/Masagena1.jpg" alt="Islamic Environment" className="rounded-3xl w-full h-80 object-cover border border-white/5" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-red-600 rounded-full flex items-center justify-center border-8 border-[#080808] shadow-2xl z-10">
                <FiHome className="text-white w-8 h-8" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. SECTION FOUNDER & MANAGEMENT
      ========================================== */}
      <section className="py-24 bg-[#111] border-y border-white/5">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-4">Pimpinan & Manajemen</h2>
            <p className="text-gray-400 text-sm">Orang-orang hebat di balik berdirinya AFKAR LAND.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden group h-full border border-white/5 bg-[#1a1a1a] min-h-[600px]">
                <img src="/images/ustadz.png" alt="Ustadz Haris Amrin" className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 absolute inset-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-8 relative z-10 h-full flex flex-col justify-end">
                  <div className="mb-4">
                    <FiMessageSquare className="text-red-500 w-8 h-8 mb-3 opacity-50" />
                    <p className="text-sm font-medium italic text-gray-300">
                      "Membangun property bukan sekadar bisnis, tetapi menghadirkan hunian yang membawa keberkahan bagi keluarga muslim."
                    </p>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">Ustadz Haris Amrin</h3>
                  <p className="text-red-500 text-xs font-bold uppercase tracking-widest">Founder AFKAR LAND</p>
                </div>
              </div>
            </motion.div>

            <div className="lg:col-span-7 flex flex-col gap-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-[#1a1a1a] rounded-3xl p-8 border border-white/5 flex flex-col sm:flex-row gap-6 items-center flex-1 transition-colors hover:border-red-500/30 group">
                <img src="/images/nia.png" alt="Nia Kartika Putri" className="w-24 h-24 rounded-full border-2 border-red-500/50 object-cover shrink-0 group-hover:border-red-500 transition-colors" />
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-bold text-white mb-1">Nia Kartika Putri</h3>
                  <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mb-3">Project Management</p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Berkomitmen memastikan setiap project AFKAR LAND dibangun dengan kualitas terbaik, tepat waktu, dan memberikan pelayanan profesional kepada konsumen.
                  </p>
                </div>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.1 }} className="bg-[#1a1a1a] rounded-3xl p-8 border border-white/5 flex flex-col sm:flex-row gap-6 items-center flex-1 transition-colors hover:border-red-500/30 group">
                <img src="/images/Abdi.jpeg" alt="Abdi Negara" className="w-24 h-24 rounded-full border-2 border-red-500/50 object-cover shrink-0 group-hover:border-red-500 transition-colors" />
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-bold text-white mb-1">Abdi Negara</h3>
                  <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mb-3">HRD (Human Resources Development)</p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Membangun budaya kerja profesional dan islami, serta memastikan AFKAR LAND diisi oleh SDM yang amanah dan berkualitas tinggi.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="pt-10 border-t border-white/5">
            <h3 className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">
              Struktur Divisi & Tim Profesional
            </h3>
            <p className="text-center text-xs text-red-500/70 mb-8 -mt-4 animate-pulse">Klik divisi di bawah ini untuk melihat anggota tim</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { name: 'Marketing Executive', icon: <FiUsers /> },
                { name: 'Digital Marketing', icon: <FiMonitor /> },
                { name: 'Sales Leader', icon: <FiTrendingUp /> },
                { name: 'Marcomm', icon: <FiShare2 /> },
                { name: 'Pimpinan Proyek / Teknis', icon: <FiLayers /> },
              ].map((div, i) => {
                const isActive = activeDivision === div.name;
                return (
                  <motion.button 
                    key={i} 
                    variants={fadeUp} 
                    onClick={() => toggleDivision(div.name)}
                    className={`
                      border p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 group
                      ${isActive 
                        ? 'border-red-500 bg-red-900/10 shadow-lg shadow-red-900/20' 
                        : 'border-white/5 bg-[#080808] hover:border-red-500/50 hover:bg-[#111]'}
                    `}
                  >
                    <div className={`mb-4 transition-colors text-3xl group-hover:scale-110 ${isActive ? 'text-red-500' : 'text-gray-600 group-hover:text-red-400'}`}>
                      {div.icon}
                    </div>
                    <h4 className={`text-[13px] font-bold transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                      {div.name}
                    </h4>
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {activeDivision && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="overflow-hidden mt-6"
                >
                  <div className="bg-[#1a1a1a] p-8 md:p-10 rounded-3xl border border-white/10 relative">
                    <button 
                      onClick={() => setActiveDivision(null)}
                      className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                    
                    <h4 className="text-xl md:text-2xl font-bold text-white mb-8 border-b border-white/5 pb-4">
                      Tim <span className="text-red-500">{activeDivision}</span>
                    </h4>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                      {teamMembersData[activeDivision]?.map((member, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center group">
                          <div className="relative mb-4">
                            <div className="absolute inset-0 bg-red-500 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                            <img 
                              src={member.img} 
                              alt={member.name} 
                              className="w-24 h-24 rounded-full object-cover border-2 border-white/10 group-hover:border-red-500 relative z-10 transition-colors duration-300" 
                            />
                          </div>
                          <h5 className="font-bold text-white text-sm md:text-base mb-1">{member.name}</h5>
                          <p className="text-gray-500 text-[10px] uppercase tracking-widest">{member.role}</p>
                        </div>
                      ))}
                    </div>
                    
                    {!teamMembersData[activeDivision] && (
                      <p className="text-gray-500 italic text-center py-4">Data anggota tim untuk divisi ini belum tersedia.</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
          </motion.div>

        </div>
      </section>

      {/* ==========================================
          4. SECTION VISI & MISI
      ========================================== */}
      <section className="py-24 bg-[#080808]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-gradient-to-br from-red-900/20 to-black border border-red-500/10 p-10 md:p-14 rounded-3xl">
              <FiTarget className="text-red-500 w-12 h-12 mb-6" />
              <h3 className="text-3xl font-heading font-bold mb-4">Visi</h3>
              <p className="text-gray-400 leading-relaxed">
                Menjadi developer property syariah terpercaya yang menghadirkan kawasan hunian modern islami berkualitas di Indonesia.
              </p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-red-900/20 to-black border border-red-500/10 p-10 md:p-14 rounded-3xl">
              <FiTrendingUp className="text-red-500 w-12 h-12 mb-6" />
              <h3 className="text-3xl font-heading font-bold mb-4">Misi</h3>
              <ul className="space-y-3">
                {[
                  'Menghadirkan property tanpa riba',
                  'Memberikan pelayanan terbaik',
                  'Membangun lingkungan islami',
                  'Menjadi solusi investasi property syariah'
                ].map((misi, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-400 text-sm"><FiCheckCircle className="text-red-500 w-4 h-4 shrink-0" /> {misi}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==========================================
          5. SECTION KENAPA PILIH AFKAR LAND
      ========================================== */}
      <section className="py-24 bg-[#111] border-y border-white/5">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-4">Kenapa Pilih AFKAR LAND?</h2>
            <p className="text-gray-400 text-sm">Alasan mengapa ribuan keluarga mempercayakan huniannya pada kami.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <FiHeart />, title: 'Tanpa Riba', desc: 'Transaksi bersih 100% tanpa adanya unsur bunga yang diharamkan.' },
              { icon: <FiLayers />, title: 'Tanpa Bank', desc: 'Cicilan langsung ke developer, tanpa pihak ketiga yang memberatkan.' },
              { icon: <FiShield />, title: 'Legalitas Aman', desc: 'Lahan sudah milik perusahaan, legalitas SHM & IMB/PBG terjamin.' },
              { icon: <FiMapPin />, title: 'Lokasi Strategis', desc: 'Berada di kawasan sunrise property yang dekat fasilitas publik.' },
              { icon: <FiAward />, title: 'Material Berkualitas', desc: 'Dibangun menggunakan material premium dan standar SNI.' },
              { icon: <FiHome />, title: 'Lingkungan Islami', desc: 'Fasilitas ibadah lengkap & komunitas tetangga yang saleh.' }
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-red-500/50 hover:bg-red-500/5 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-gray-400 group-hover:text-red-500 group-hover:bg-red-500/10 transition-colors mb-6">
                  {item.icon}
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          6. SECTION PROJECT UNGGULAN
      ========================================== */}
      <section className="py-32 bg-[#080808]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold mb-4">Project Property AFKAR LAND</h2>
              <p className="text-gray-400">Temukan kawasan hunian syariah modern terbaik yang sedang kami kembangkan.</p>
            </div>
            <Link to="/proyek" className="inline-flex items-center gap-2 text-red-500 font-bold hover:text-white transition-colors border-b border-red-500/30 pb-1">
              Lihat Semua Project <FiArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProjects.map((proj, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden group hover:border-red-500/50 transition-colors flex flex-col h-full"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src={proj.img} alt={proj.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#C9A84C] text-black text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      PROPERTY SYARIAH
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-red-400 transition-colors">{proj.name}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-6 flex-1">{proj.desc}</p>
                  
                  <div className="flex flex-col gap-2 mt-auto">
                    <Link to={`/proyek/${proj.slug}`} className="w-full text-center py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors">
                      Lihat Detail
                    </Link>
                    <a 
                      href={proj.brosurUrl}
                      download={`Brosur_${proj.name.replace(/\s+/g, '_')}.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center py-2.5 bg-transparent border border-white/10 hover:border-white/30 text-white/70 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <FiDownload size={14} /> Download Brosur
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          7. SECTION SISTEM PROPERTY SYARIAH
          ✅ Daftar pilar dari ManageHomepage → Konten Halaman
      ========================================== */}
      <section className="py-24 bg-[#111] border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-900/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-4">7 Pilar Transaksi Syariah</h2>
            <p className="text-gray-400 text-sm">Menghindari jebakan finansial demi rumah yang berkah.</p>
          </div>
          
          {/* ✅ Pilar syariah real-time dari ManageHomepage → Konten Halaman */}
          <div className="flex flex-wrap justify-center gap-4">
            {pilarSyariah.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-[#080808]/50 backdrop-blur-sm border border-red-500/10 p-6 rounded-2xl text-center hover:bg-red-600/10 transition-colors group flex-1 min-w-[140px] max-w-[180px]"
              >
                <FiCheckCircle className="text-red-500 w-8 h-8 mx-auto mb-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                <h4 className="font-bold text-sm text-gray-200">{item}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          8. SECTION TRUST / TESTIMONI
          ✅ Subjudul dari ManageHomepage → Konten Halaman
      ========================================== */}
      <section className="py-32 bg-[#080808] overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 mb-16 text-center max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold mb-6">Dipercaya Ratusan Keluarga Muslim</h2>
            {/* ✅ Subjudul trust real-time dari ManageHomepage */}
            <p className="text-gray-400 mb-10 leading-relaxed text-sm md:text-base">
              {trustSubjudul}
            </p>
            
            <div className="flex justify-center mb-10">
              <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 inline-block shadow-xl shadow-black/50">
                {/* ✅ Jumlah project dari statistik admin */}
                <div className="text-5xl md:text-6xl font-black text-red-500 mb-2">
                  {statistik.find(s => s.label?.toLowerCase().includes('proyek') || s.label?.toLowerCase().includes('project'))?.value || '4'}
                </div>
                <div className="text-xs md:text-sm text-gray-400 font-bold uppercase tracking-widest">Project Berkembang</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-transparent via-red-900/20 to-transparent p-6 rounded-3xl border-y border-red-500/10 mb-8">
              <p className="text-white font-medium mb-4 text-sm md:text-base">
                Ingin AFKAR LAND membangun property syariah di wilayahmu? Hubungi kami sekarang.
              </p>
              <Link to="/kontak" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-full font-bold transition-all hover:-translate-y-1 shadow-lg shadow-red-900/30">
                Hubungi Kami <FiArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* SLIDER TESTIMONI BERJALAN OTOMATIS */}
        <div className="relative w-full overflow-hidden flex pb-10">
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#080808] to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex gap-6 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 35, repeat: Infinity }}
          >
            {duplicatedTestimonials.map((t, i) => (
              <div key={i} className="w-[300px] md:w-[420px] bg-[#111] p-8 rounded-3xl border border-white/5 shrink-0 whitespace-normal flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-5">
                    {[1,2,3,4,5].map(star => <FiStar key={star} className="text-yellow-500 w-4 h-4 fill-yellow-500" />)}
                  </div>
                  <p className="text-gray-300 italic text-sm md:text-base leading-relaxed mb-8">
                    "{t.text}"
                  </p>
                </div>
                <div className="flex items-center gap-4 border-t border-white/5 pt-4 mt-auto">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center font-bold text-red-500 text-lg shrink-0">
                    {t.name.split(' ')[1]?.charAt(0) || t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{t.name}</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Konsumen {t.project}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          9. CTA PENUTUP — dari ManageHomepage → Konten Halaman
          ✅ Judul, subjudul, dan tombol dari admin
      ========================================== */}
      <section className="py-24 border-t border-white/5 bg-[#080808]">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative bg-gradient-to-br from-red-800 via-red-600 to-[#1a0000] rounded-3xl p-12 md:p-20 text-center overflow-hidden border border-red-500/30 shadow-2xl shadow-red-900/20"
          >
            <div className="relative z-10">
              {/* ✅ Judul CTA penutup real-time dari ManageHomepage */}
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-4">
                {ctaPenutupJudul}
              </h2>
              {/* ✅ Subjudul CTA penutup real-time dari ManageHomepage */}
              <p className="text-red-100 mb-10 max-w-2xl mx-auto text-sm md:text-base">
                {ctaPenutupSubjudul}
              </p>
              {/* ✅ CTA buttons dari admin */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={ctaUtamaLink}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-red-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all hover:-translate-y-1"
                >
                  {ctaUtama} <FiArrowRight size={18} />
                </Link>
                <Link
                  to={ctaKeduaLink}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent border border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all"
                >
                  {ctaKedua}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}