import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMapPin, FiCheckCircle, FiSend, FiArrowLeft, FiArrowRight,
  FiDownload, FiMessageCircle, FiPhone, FiX, FiChevronDown,
  FiChevronRight, FiStar, FiShield, FiHome, FiTrendingUp,
  FiNavigation, FiFileText
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { createLead } from '../services/firestoreService';

// ─────────────────────────────────────────────────────────────
// CANVAS 1 — DATA LAYER LENGKAP
// ─────────────────────────────────────────────────────────────

// LOGIKA: Tim marketing — 5 orang dengan nomor aktif per arahan Damar Mahendra
const allMarketing = [
  {
    id: 'damar', name: 'Damar Mahendra',
    role: 'Marketing Executive',
    label: 'Marketing Executive',
    ahli: 'Properti Syariah & Investasi',
    spesialisasi: 'Properti Syariah & Investasi',
    foto: 'https://ui-avatars.com/api/?name=Damar+Mahendra&background=C0392B&color=fff&size=200&bold=true',
    wa: '6285705218281', phone: '085705218281',
    isOnline: true, badge: '⭐ Top Performer',
    badgeClass: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  },
  {
    id: 'fila', name: 'Fila Amelia',
    role: 'Marketing Executive',
    label: 'Marketing Executive',
    ahli: 'Akad Syariah & Cash Bertahap',
    spesialisasi: 'Akad Syariah & Cash Bertahap',
    foto: 'https://ui-avatars.com/api/?name=Fila+Amelia&background=C0392B&color=fff&size=200&bold=true',
    wa: '6288975158899', phone: '088975158899',
    isOnline: true, badge: '🏠 Syariah Specialist',
    badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  {
    id: 'hazfira', name: 'Hazfira',
    role: 'Marketing Executive',
    label: 'Marketing Executive',
    ahli: 'Investasi & Cash Bertahap',
    spesialisasi: 'Investasi & Cash Bertahap',
    foto: 'https://ui-avatars.com/api/?name=Hazfira&background=C0392B&color=fff&size=200&bold=true',
    wa: '6285230922038', phone: '085230922038',
    isOnline: true, badge: '💼 Investment Expert',
    badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  {
    id: 'erni', name: 'Erni',
    role: 'Marketing Executive',
    label: 'Marketing Executive',
    ahli: 'Konsultasi Properti Syariah',
    spesialisasi: 'Konsultasi Properti Syariah',
    foto: 'https://ui-avatars.com/api/?name=Erni&background=C0392B&color=fff&size=200&bold=true',
    wa: '6285280080063', phone: '085280080063',
    isOnline: true, badge: '✨ Syariah Expert',
    badgeClass: 'bg-green-500/10 text-green-400 border-green-500/20',
  },
  {
    id: 'ayu', name: 'Ayu',
    role: 'Marketing Executive',
    label: 'Marketing Executive',
    ahli: 'Survey Lokasi & Negosiasi',
    spesialisasi: 'Survey Lokasi & Negosiasi',
    foto: 'https://ui-avatars.com/api/?name=Ayu&background=C0392B&color=fff&size=200&bold=true',
    wa: '6285397587857', phone: '085397587857',
    isOnline: true, badge: '📍 Survey Specialist',
    badgeClass: 'bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20',
  },
];

const keunggulanList = [
  { emoji: '🚫', title: 'Tanpa Riba', desc: 'Sistem transaksi bersih tanpa unsur bunga' },
  { emoji: '🏦', title: 'Tanpa Bank', desc: 'Transaksi langsung dengan developer' },
  { emoji: '✅', title: 'Tanpa BI Checking', desc: 'Proses pengajuan lebih mudah & cepat' },
  { emoji: '🌙', title: 'Lingkungan Islami', desc: 'Komunitas bertetangga yang Islami' },
  { emoji: '📍', title: 'Lokasi Strategis', desc: 'Akses mudah ke berbagai fasilitas kota' },
  { emoji: '📈', title: 'Investasi Menjanjikan', desc: 'Nilai properti terus berkembang pesat' },
];

const fasilitasList = [
  { emoji: '🕌', label: 'Masjid' },
  { emoji: '🛡️', label: 'Security 24 Jam' },
  { emoji: '🌳', label: 'Area Hijau' },
  { emoji: '🛣️', label: 'Jalan Kawasan' },
  { emoji: '💧', label: 'Drainase' },
  { emoji: '🏪', label: 'Area Komersial' },
];

const faqDefault = [
  { q: 'Apakah menggunakan bank konvensional?', a: 'Tidak. AFKAR LAND menggunakan sistem syariah tanpa bank konvensional. Transaksi dilakukan langsung antara pembeli dan developer dengan akad yang transparan dan sesuai syariah Islam.' },
  { q: 'Bagaimana sistem pembayaran yang tersedia?', a: 'Tersedia 3 skema: Cash Keras (diskon maksimal), Cash Bertahap (cicilan langsung ke developer), dan KPR Syariah (melalui bank syariah pilihan). Kami akan bantu cari skema terbaik sesuai kemampuan Anda.' },
  { q: 'Apakah legalitas unit sudah aman?', a: 'Ya, 100% aman. Semua unit AFKAR LAND berstatus SHM (Sertifikat Hak Milik) yang merupakan legalitas tertinggi properti di Indonesia. Anda tidak perlu khawatir soal kepemilikan.' },
  { q: 'Apakah bisa survey lokasi terlebih dahulu?', a: 'Tentu! Kami sangat menganjurkan survey lokasi sebelum memutuskan pembelian. Hubungi tim marketing kami untuk menjadwalkan kunjungan gratis ke lokasi project.' },
];

const progressDefault = [
  { fase: 'Fase 1', label: 'Land Clearing', persen: 100, status: 'selesai', tgl: 'Jan 2024', ket: 'Pembersihan lahan & pematangan tanah selesai 100%' },
  { fase: 'Fase 2', label: 'Pondasi & Struktur', persen: 85,  status: 'berjalan', tgl: 'Mar 2024', ket: 'Pembangunan pondasi dan struktur unit sedang berjalan' },
  { fase: 'Fase 3', label: 'Infrastruktur', persen: 40,  status: 'berjalan', tgl: 'Jun 2024', ket: 'Instalasi jalan, drainase, dan utilitas kawasan' },
  { fase: 'Fase 4', label: 'Finishing',  persen: 0,   status: 'rencana', tgl: 'Des 2024', ket: 'Finishing, landscaping & serah terima unit' },
];

// LOGIKA: Data per proyek — idealnya fetch dari Firestore
const projectData = {
  'masagena-green-hills': {
    name: 'Masagena Green Hills',
    tagline: 'Hunian Asri Bernuansa Hijau di Gowa',
    location: 'Pattallassang, Kab. Gowa',
    locationDetail: 'Timbusseng, Borongpa\'la\'la, Kec. Pattallassang, Kabupaten Gowa (Dekat Kampus teknik Unhas Gowa & Puncak Bollangi)',
    status: 'Tersedia',
    harga: 'Mulai Rp 171,8 Juta',
    // LOGIKA: Harga sesuai Product Knowledge terbaru (sudah naik Rp 3.000.000)
    tipeUnit: [
      { tipe: 'Tipe 24/72', lantai: '1 Lantai', kamar: '1 Kamar Tidur', normal: 'Rp 232.568.000', cashKeras: 'Rp 171.800.000', cashLunak: 'Rp 178.552.000' },
      { tipe: 'Tipe 36/72', lantai: '1 Lantai', kamar: '2 Kamar Tidur', normal: 'Rp 306.283.099', cashKeras: 'Rp 226.002.279', cashLunak: 'Rp 234.922.370' },
      { tipe: 'Tipe 42/78', lantai: '1 Lantai', kamar: '2 Kamar Tidur', normal: 'Rp 352.135.800', cashKeras: 'Rp 259.717.500', cashLunak: 'Rp 269.986.200' },
      { tipe: 'Tipe 60/78', lantai: '2 Lantai', kamar: '3 Kamar Tidur', normal: 'Rp 625.501.784', cashKeras: 'Rp 460.721.900', cashLunak: 'Rp 479.030.776' },
    ],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200',
    ],
    about: 'Masagena Green Hills hadir sebagai solusi hunian syariah modern di perbukitan Gowa yang nyaman dan strategis. Terletak dekat Kampus Teknik unhas gowa dan Puncak Bollangi, kawasan ini menawarkan udara sejuk, lingkungan Islami, dan akses mudah ke berbagai fasilitas kota.',
    aboutExtra: 'Dengan sistem transaksi syariah tanpa bank, tanpa riba, tanpa denda, dan tanpa BI Checking — Masagena Green Hills menjadi pilihan cerdas untuk hunian pertama maupun investasi jangka panjang keluarga Anda.',
    brosurUrl: '/brosur/masagena-green-hills.pdf',
    brosurFileName: 'Brosur-Masagena-Green-Hills.pdf',
    brosurSize: '2.4 MB',
    websiteUrl: 'https://masagena.afkarland.id',
    // LOGIKA: Masagena — Marketing Executive: Damar & Fila
    marketingIds: ['damar', 'fila'],
    faq: faqDefault,
  },
  'wotu-islamic-village': {
    name: 'Wotu Islamic Village',
    tagline: 'Kawasan Islami Terpadu Pertama di Luwu Timur',
    location: 'Wotu, Kab. Luwu Timur',
    locationDetail: 'Jl. Pahlawan Arolipu, Wotu, Kab. Luwu Timur (Depan SMAN 2 Luwu Timur)',
    status: 'Tersedia',
    harga: 'Mulai Rp 71 Juta',
    // LOGIKA: Harga sesuai Product Knowledge update 30 Desember 2025
    tipeUnit: [
      { tipe: 'Kavling 6×14 (91 m²)', lantai: 'Tanah Kosong', kamar: '-', normal: 'Rp 93.720.000', cashKeras: 'Rp 71.000.000', cashLunak: 'Rp 75.970.000' },
      { tipe: 'Kavling 7×14 (98 m²)', lantai: 'Tanah Kosong', kamar: '-', normal: 'Rp 100.320.000', cashKeras: 'Rp 76.000.000', cashLunak: 'Rp 79.040.000' },
      { tipe: 'Rumah Tipe 20/91', lantai: '1 Lantai', kamar: '1 Kamar Tidur', normal: 'Rp 225.598.400', cashKeras: 'Rp 155.800.000', cashLunak: 'Rp 162.032.000' },
      { tipe: 'Rumah Tipe 42/91', lantai: '1 Lantai', kamar: '2 Kamar Tidur', normal: 'Rp 344.624.000', cashKeras: 'Rp 238.000.000', cashLunak: 'Rp 247.520.000' },
      { tipe: 'Rumah Tipe 60/98', lantai: '2 Lantai', kamar: '3 Kamar Tidur', normal: 'Rp 449.604.000', cashKeras: 'Rp 310.500.000', cashLunak: 'Rp 322.920.000' },
    ],
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200',
    ],
    about: 'Wotu Islamic Village adalah kawasan hunian islami terpadu pertama di Luwu Timur yang mengintegrasikan fasilitas ibadah, pendidikan agama, dan kehidupan bertetangga yang Islami dalam satu kawasan terencana.',
    aboutExtra: 'Tersedia pilihan kavling dan rumah dengan harga mulai 79 jutaan. Dengan sistem syariah tanpa bank, tanpa riba, tanpa BI Checking — cocok untuk hunian maupun investasi di kawasan timur Sulawesi Selatan yang terus berkembang.',
    brosurUrl: '/brosur/wotu-islamic-village.pdf',
    brosurFileName: 'Brosur-Wotu-Islamic-Village.pdf',
    brosurSize: '2.1 MB',
    websiteUrl: 'https://wotu.afkarland.id',
    // LOGIKA: Wotu — Marketing Executive: Hazfira
    marketingIds: ['hazfira'],
    faq: faqDefault,
  },
  'hasanah-panakkukang': {
    name: 'The Hasanah Panakkukang',
    tagline: 'Hunian Premium 2 Lantai di Jantung Makassar — Sisa 2 Unit!',
    location: 'Panakkukang, Makassar',
    locationDetail: 'Kompleks PAM, Jl. Penjernihan Raya III, Panakkukang, Makassar',
    // LOGIKA: Hanya tersisa 2 unit dari total 5 unit (A-01 s/d A-05)
    status: 'Sisa Sedikit',
    harga: 'Mulai Rp 1,299 Miliar',
    tipeUnit: [
      { tipe: 'Tipe 70/82 (2 Lantai)', lantai: '2 Lantai', kamar: '3 KT + 2 KM + Toilet', normal: 'Rp 1.399.000.000', cashKeras: 'Rp 1.299.000.000 (Harga Promo)', cashLunak: 'DP 50% = Rp 699.500.000 (angsuran s/d 3 tahun ke developer)' },
    ],
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200',
    ],
    about: 'The Hasanah Panakkukang adalah hunian premium 2 lantai yang berlokasi di kawasan paling strategis Kota Makassar. Dengan luas bangunan 70 m² di atas lahan 81 m², unit ini cocok untuk keluarga yang menginginkan ruang luas di tengah kota.',
    aboutExtra: '⚠️ SISA 2 UNIT dari total 5 unit eksklusif! Tersedia opsi Harga Promo Rp 1,299 M atau DP 50% = Rp 699,5 juta dengan angsuran hingga 3 tahun langsung ke developer — tanpa bank, tanpa riba, tanpa sita. Fasilitas lengkap: Free AC, CCTV, Tandon Air, Pemecahan Sertifikat, Balik Nama, dan Free Umrah.',
    brosurUrl: '/brosur/hasanah-panakkukang.pdf',
    brosurFileName: 'Brosur-Hasanah-Panakkukang.pdf',
    brosurSize: '1.9 MB',
    websiteUrl: 'https://hasanah.afkarland.id',
    // LOGIKA: The Hasanah — Marketing Executive: Damar & Fila
    marketingIds: ['damar', 'fila'],
    faq: faqDefault,
  },
  'afkar-madani-estate': {
    name: 'Afkar Madani Estate',
    tagline: '🚀 Grand Launching 7 Juni 2026 — Premium · Eksklusif · Syariah',
    location: 'BTP, Makassar',
    locationDetail: 'AFKAR MADANI ESTATE BTP, Makassar — Grand Launching 7 Juni 2026',
    status: 'Coming Soon',
    harga: 'Segera Diumumkan di Grand Launching',
    tipeUnit: [],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=1200',
    ],
    about: 'Afkar Madani Estate hadir sebagai perumahan syariah premium eksklusif terbaru dari AFKAR LAND, berlokasi di kawasan BTP Makassar. Dirancang untuk keluarga yang menginginkan hunian berkelas dengan infrastruktur modern dan keamanan 24 jam.',
    aboutExtra: '📅 MARK YOUR CALENDAR! Grand Launching resmi Afkar Madani Estate akan diselenggarakan pada 7 Juni 2026. Daftarkan minat Anda sekarang dan jadilah yang pertama mendapat penawaran Early Bird eksklusif sebelum acara launching!',
    brosurUrl: '/brosur/afkar-madani-estate.pdf',
    brosurFileName: 'Brosur-Afkar-Madani-Estate.pdf',
    brosurSize: '2.7 MB',
    websiteUrl: 'https://afkarmadani.afkarland.id',
    // LOGIKA: Afkar Madani Estate — Marketing Executive: Erni & Ayu
    marketingIds: ['erni', 'ayu'],
    faq: faqDefault,
  },
};

function triggerDownload(url, fileName, name) {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast.success(`📄 Brosur ${name} sedang diunduh...`);
}

// ─────────────────────────────────────────────────────────────
// CANVAS 2 — SUB-KOMPONEN UTAMA
// ─────────────────────────────────────────────────────────────

// ── Gallery Carousel ──
function GallerySection({ images, projectName }) {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent(c => (c - 1 + images.length) % images.length);
  const next = () => setCurrent(c => (c + 1) % images.length);

  return (
    <div className="space-y-3">
      {/* MAIN IMAGE */}
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden group bg-[#111]">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={images[current]}
            alt={`${projectName} ${current + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* ARROWS */}
        <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-[#C9A84C] backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover:opacity-100">
          <FiArrowLeft size={16} />
        </button>
        <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-[#C9A84C] backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover:opacity-100">
          <FiArrowRight size={16} />
        </button>

        {/* COUNTER */}
        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
          {current + 1} / {images.length}
        </div>
      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              i === current ? 'border-[#C9A84C]' : 'border-white/10 opacity-60 hover:opacity-90'
            }`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* DOT INDICATORS */}
      <div className="flex justify-center gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? 'w-5 h-1.5 bg-[#C9A84C]' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Marketing Card ──
function MarketingCard({ mk, isSelected, onSelect, projectName }) {
  const waMsg = encodeURIComponent(
    `Assalamu'alaikum Kak ${mk.name} 👋\n\nSaya tertarik dengan project *${projectName}* dan ingin berkonsultasi lebih lanjut.\n\nMohon dibantu ya 🙏`
  );
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={() => onSelect(mk.id)}
      className={`
        relative flex flex-col items-center text-center p-5 rounded-2xl cursor-pointer
        border-2 transition-all duration-300 bg-[#111]
        ${isSelected ? 'border-[#C9A84C] shadow-lg shadow-[#C9A84C]/10' : 'border-white/6 hover:border-[#C9A84C]/30'}
      `}
    >
      {/* SELECTED CHECK */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            className="absolute top-3 right-3 w-5 h-5 bg-[#C9A84C] rounded-full flex items-center justify-center"
          >
            <FiCheckCircle className="text-black" size={11} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* AVATAR CIRCULAR */}
      <div className="relative mb-3">
        <div className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-300 ${isSelected ? 'border-[#C9A84C]' : 'border-white/15'}`}>
          <img src={mk.foto} alt={mk.name} className="w-full h-full object-cover"
            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mk.name)}&background=C0392B&color=fff&size=200`; }}
          />
        </div>
        {/* STATUS ONLINE */}
        <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#111] ${mk.isOnline ? 'bg-green-400' : 'bg-gray-500'}`} title={mk.isOnline ? 'Online' : 'Offline'} />
      </div>

      <h4 className="font-bold text-white text-sm leading-tight mb-0.5">{mk.name}</h4>
      {/* LABEL: Property Consultant */}
      <p className="text-white/40 text-[10px] mb-2 leading-tight tracking-wide">Property Consultant</p>

      {/* BADGE: Official Team Afkar Land */}
      <span className="inline-flex items-center gap-1.5 text-[9px] font-bold px-2.5 py-1 rounded-full border mb-3 bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/30">
        <FiShield size={8} />
        Official Team Afkar Land
      </span>

      {/* BUTTONS */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full space-y-2 overflow-hidden"
          >
            <a href={`https://wa.me/${mk.wa}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-brand-primary hover:bg-[#C9A84C] text-white hover:text-black font-bold text-xs rounded-xl transition-all duration-300"
            >
              <FiMessageCircle size={12} /> Hubungi WhatsApp
            </a>
            <a href={`tel:${mk.phone}`} onClick={e => e.stopPropagation()}
              className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-white/6 hover:bg-white/12 text-white font-bold text-xs rounded-xl border border-white/10 transition-all duration-300"
            >
              <FiPhone size={12} /> Telepon Sekarang
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {!isSelected && (
        <p className="text-white/20 text-[9px] italic">Klik untuk pilih konsultan ini</p>
      )}
    </motion.div>
  );
}

// ── FAQ Accordion ──
function FAQSection({ faq }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-2">
      {faq.map((item, i) => (
        <div key={i} className="bg-[#111] border border-white/6 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left group"
          >
            <span className="text-white font-semibold text-sm pr-4 group-hover:text-[#C9A84C] transition-colors">{item.q}</span>
            <motion.span animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-white/40 shrink-0">
              <FiChevronDown size={16} />
            </motion.span>
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-white/50 text-sm leading-relaxed border-t border-white/5 pt-3">
                  {item.a}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

// ── Sticky Floating CTA ──
function StickyFloatingCTA({ project, selectedMk }) {
  const [visible, setVisible] = useState(false);
  const targetMk = selectedMk || allMarketing[0];

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const waMsg = encodeURIComponent(`Assalamu'alaikum, saya tertarik dengan *${project.name}*. Boleh dibantu? 🙏`);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          className="fixed bottom-6 right-5 z-50 flex flex-col gap-2.5 items-end"
        >
          {/* WA */}
          <a href={`https://wa.me/${targetMk.wa}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-lg shadow-green-900/30 transition-all duration-300 hover:-translate-y-0.5 group"
          >
            <FiMessageCircle size={14} />
            <span className="hidden sm:block">WhatsApp</span>
          </a>
          {/* Phone */}
          <a href={`tel:${targetMk.phone}`}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-lg shadow-blue-900/30 transition-all duration-300 hover:-translate-y-0.5"
          >
            <FiPhone size={14} />
            <span className="hidden sm:block">Telepon</span>
          </a>
          {/* Download Brosur */}
          <button
            onClick={() => triggerDownload(project.brosurUrl, project.brosurFileName, project.name)}
            className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#e0c46e] text-black font-bold text-xs px-4 py-2.5 rounded-full shadow-lg shadow-[#C9A84C]/20 transition-all duration-300 hover:-translate-y-0.5"
          >
            <FiDownload size={14} />
            <span className="hidden sm:block">Brosur</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────
// CANVAS 3 — KOMPONEN UTAMA: ProjectDetail Page
// ─────────────────────────────────────────────────────────────

export default function ProjectDetail() {
  const { slug } = useParams();
  const [selectedMkId, setSelectedMkId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const proj = projectData[slug] || projectData['masagena-green-hills'];
  const teamIds = proj.marketingIds || ['damar', 'fila', 'hazfira', 'erni', 'ayu'];
  const team = allMarketing.filter(m => teamIds.includes(m.id));
  const selectedMk = team.find(m => m.id === selectedMkId) || null;

  const [form, setForm] = useState({
    nama: '', nomorWa: '', email: '',
    pilihanProject: proj.name,
    pilihanMarketing: '',
    tujuanPembelian: '',
    pesan: ''
  });

  // LOGIKA: Sinkron pilihan marketing antara grid dan form select
  useEffect(() => {
    if (selectedMkId) setForm(prev => ({ ...prev, pilihanMarketing: selectedMkId }));
  }, [selectedMkId]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const targetMk = team.find(m => m.id === form.pilihanMarketing) || team[0];
    try {
      // FIREBASE: Simpan lead ke Firestore
      await createLead({
        ...form,
        pilihanProject: proj.name,
        marketingDipilih: targetMk?.name || 'Tidak dipilih',
        sumber: 'Halaman Detail Proyek v2',
      });
      toast.success('✅ Konsultasi terkirim! Menghubungkan ke WhatsApp marketing...');
      // SMART ROUTING: Redirect ke WA marketing yang dipilih
      const msg = encodeURIComponent(
        `Assalamu'alaikum Kak ${targetMk.name} 👋\n\nNama: *${form.nama}*\nProject: *${proj.name}*\nTujuan: ${form.tujuanPembelian}\n\nSaya telah mengisi form konsultasi. Mohon dibantu ya 🙏`
      );
      setTimeout(() => { window.open(`https://wa.me/${targetMk.wa}?text=${msg}`, '_blank'); }, 1200);
      setForm({ nama: '', nomorWa: '', email: '', pilihanProject: proj.name, pilihanMarketing: '', tujuanPembelian: '', pesan: '' });
      setSelectedMkId(null);
    } catch {
      toast.error('❌ Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectMk = (id) => {
    setSelectedMkId(prev => prev === id ? null : id);
  };

  return (
    <div className="w-full bg-[#080808] min-h-screen pb-24">

      {/* STICKY FLOATING CTA */}
      <StickyFloatingCTA project={proj} selectedMk={selectedMk} />

      {/* ══ HERO: Cinematic Banner ══ */}
      <section className="relative h-[65vh] min-h-[480px]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${proj.image}')` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/40 to-black/20" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="container mx-auto px-5 md:px-10 pb-12">
            <Link to="/proyek" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-5 text-xs font-medium transition-colors">
              <FiArrowLeft size={12} /> Kembali ke Semua Project
            </Link>

            {/* Status */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${proj.status === 'Sisa Sedikit' ? 'bg-brand-primary text-white animate-pulse' : 'bg-white/15 backdrop-blur-sm text-white border border-white/20'}`}>
                {proj.status === 'Sisa Sedikit' ? '🔴 Sisa Sedikit!' : '🟢 Tersedia'}
              </span>
              <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/30 uppercase tracking-wider">
                ☽ Syariah
              </span>
            </div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="font-heading font-extrabold text-white text-3xl sm:text-5xl md:text-6xl leading-tight mb-2">
              {proj.name}
            </motion.h1>
            <p className="text-[#C9A84C] text-sm font-semibold mb-3">{proj.tagline}</p>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5 text-white/60 text-sm">
                <FiMapPin size={14} className="text-[#C9A84C]" /> {proj.locationDetail || proj.location}
              </div>
              <div className={`font-bold text-base ${proj.status === 'Coming Soon' ? 'text-[#C9A84C]' : 'text-white'}`}>{proj.harga}</div>
            </div>

            {/* CTA WA Cepat Hero */}
            <div className="flex flex-wrap gap-3 mt-6">
              <a href={`https://wa.me/${team[0]?.wa || '6285705218281'}?text=${encodeURIComponent(`Assalamu'alaikum, saya tertarik dengan *${proj.name}*. Boleh dibantu? 🙏`)}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-bold text-sm rounded-xl transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
              >
                <FiMessageCircle size={15} /> Chat WhatsApp Sekarang
              </a>
              <button onClick={() => triggerDownload(proj.brosurUrl, proj.brosurFileName, proj.name)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A84C] hover:bg-[#e0c46e] text-black font-bold text-sm rounded-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <FiDownload size={15} /> Download Brosur
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ KONTEN UTAMA ══ */}
      <div className="container mx-auto px-5 md:px-10 space-y-16 pt-14">

        {/* ── GALERI PROJECT ── */}
        <section>
          <SectionLabel gold>Galeri Project</SectionLabel>
          <GallerySection images={proj.gallery} projectName={proj.name} />
        </section>

        {/* ── TENTANG PROJECT ── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <SectionLabel>Tentang Project</SectionLabel>
            <p className="text-white/55 text-sm leading-relaxed mb-3">{proj.about}</p>
            <p className="text-white/55 text-sm leading-relaxed">{proj.aboutExtra}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '📍', label: 'Lokasi', val: proj.locationDetail || proj.location },
              { icon: '💰', label: 'Harga Mulai', val: proj.harga },
              { icon: '📋', label: 'Status', val: proj.status },
              { icon: '🏡', label: 'Tipe', val: 'Syariah' },
            ].map((item, i) => (
              <div key={i} className="bg-[#111] rounded-xl p-4 border border-white/5">
                <p className="text-lg mb-1">{item.icon}</p>
                <p className="text-white/30 text-[10px] mb-0.5">{item.label}</p>
                <p className="text-white font-bold text-sm leading-tight">{item.val}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── KEUNGGULAN PROJECT ── */}
        <section>
          <SectionLabel>Keunggulan Project</SectionLabel>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {keunggulanList.map((k, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="bg-[#111] border border-white/6 hover:border-[#C9A84C]/25 rounded-2xl p-5 transition-all duration-300 group"
              >
                <div className="text-2xl mb-3">{k.emoji}</div>
                <h4 className="text-white font-bold text-sm mb-1 group-hover:text-[#C9A84C] transition-colors">{k.title}</h4>
                <p className="text-white/35 text-xs leading-snug">{k.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── FASILITAS ── */}
        <section>
          <SectionLabel>Fasilitas Kawasan</SectionLabel>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {fasilitasList.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="bg-[#111] border border-white/6 hover:border-[#C9A84C]/25 rounded-xl p-4 flex flex-col items-center text-center gap-2 transition-all duration-300 group"
              >
                <span className="text-2xl">{f.emoji}</span>
                <span className="text-white/50 group-hover:text-[#C9A84C] text-[10px] font-semibold transition-colors leading-tight">{f.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── PRICELIST TIPE UNIT ── */}
        {proj.tipeUnit && proj.tipeUnit.length > 0 ? (
          <section>
            <SectionLabel gold>Pricelist & Tipe Unit</SectionLabel>
            <div className="overflow-x-auto rounded-2xl border border-white/8">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="bg-[#1a1a1a] border-b border-white/8">
                    <th className="text-left px-5 py-3.5 text-white/50 text-[10px] font-bold uppercase tracking-widest">Tipe Unit</th>
                    <th className="text-left px-5 py-3.5 text-white/50 text-[10px] font-bold uppercase tracking-widest">Lantai / Kamar</th>
                    <th className="text-left px-5 py-3.5 text-white/50 text-[10px] font-bold uppercase tracking-widest">Harga Normal</th>
                    <th className="text-left px-5 py-3.5 text-[#C9A84C] text-[10px] font-bold uppercase tracking-widest">💥 Promo Cash Keras</th>
                    <th className="text-left px-5 py-3.5 text-white/50 text-[10px] font-bold uppercase tracking-widest">Cash Lunak</th>
                  </tr>
                </thead>
                <tbody>
                  {proj.tipeUnit.map((t, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 === 0 ? 'bg-[#111]' : 'bg-[#0f0f0f]'}`}
                    >
                      <td className="px-5 py-4 text-white font-bold text-xs">{t.tipe}</td>
                      <td className="px-5 py-4 text-white/50 text-xs">{t.lantai}{t.kamar !== '-' ? ` · ${t.kamar}` : ''}</td>
                      <td className="px-5 py-4 text-white/40 text-xs line-through">{t.normal}</td>
                      <td className="px-5 py-4 text-[#C9A84C] font-black text-xs">{t.cashKeras}</td>
                      <td className="px-5 py-4 text-white/40 text-xs">{t.cashLunak || '—'}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-white/25 text-[10px] mt-3 text-center">
              🛡️ Semua skema: Tanpa Bank · Tanpa Riba · Tanpa Denda · Tanpa Sita · Tanpa BI Checking
            </p>
            <p className="text-white/40 text-[11px] mt-2 text-center leading-relaxed">
              📌 <span className="text-white/55">Catatan:</span> Untuk informasi detail mengenai skema kredit, nilai DP (Uang Muka), dan simulasi angsuran bulanan, silakan hubungi Marketing kami.
            </p>
          </section>
        ) : proj.status === 'Coming Soon' ? (
          <section>
            <SectionLabel gold>Pricelist & Tipe Unit</SectionLabel>
            <div className="flex flex-col items-center justify-center py-12 bg-[#111] border border-[#C9A84C]/20 rounded-2xl text-center gap-3">
              <span className="text-4xl">🔒</span>
              <p className="text-white font-bold text-base">Pricelist Segera Dirilis</p>
              <p className="text-white/35 text-xs max-w-xs leading-relaxed">Bocoran harga mulai <span className="text-[#C9A84C] font-bold">700 Jutaan</span>. Daftarkan minat Anda sekarang untuk mendapat penawaran early bird eksklusif!</p>
            </div>
          </section>
        ) : null}

        {/* ── DOWNLOAD BROSUR CARD ── */}
        <section>
          <SectionLabel gold>Download Brosur Project</SectionLabel>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-[#111] to-[#1a1a1a] border border-[#C9A84C]/20 rounded-2xl p-6"
          >
            {/* Preview icon */}
            <div className="shrink-0 w-20 h-24 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-xl flex flex-col items-center justify-center gap-1">
              <FiFileText size={28} className="text-[#C9A84C]" />
              <span className="text-[#C9A84C] text-[9px] font-bold">PDF</span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">Dokumen Resmi</p>
              <h4 className="text-white font-bold text-base mb-1">{proj.brosurFileName}</h4>
              <p className="text-white/40 text-xs">Ukuran file: {proj.brosurSize} · Format PDF</p>
              <p className="text-white/30 text-xs mt-1">Berisi info lengkap: spesifikasi unit, siteplan, harga, dan promo terkini.</p>
            </div>
            <button onClick={() => triggerDownload(proj.brosurUrl, proj.brosurFileName, proj.name)}
              className="shrink-0 flex items-center gap-2 px-7 py-3 bg-[#C9A84C] hover:bg-[#e0c46e] text-black font-bold text-sm rounded-xl transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-[#C9A84C]/15"
            >
              <FiDownload size={15} /> Download Brosur
            </button>
          </motion.div>
        </section>

        {/* ── MARKETING EXECUTIVE ── */}
        <section id="marketing-section">
          <SectionLabel>Marketing Executive Project Ini</SectionLabel>
          <p className="text-white/35 text-sm mb-6 -mt-2">Pilih konsultan properti syariah Anda — klik kartu untuk langsung terhubung via WhatsApp atau telepon.</p>
          <div className={`grid gap-4 ${team.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' : team.length === 2 ? 'grid-cols-2 max-w-lg mx-auto' : team.length === 3 ? 'grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'}`}>
            {team.map((mk) => (
              <MarketingCard key={mk.id} mk={mk} isSelected={selectedMkId === mk.id} onSelect={handleSelectMk} projectName={proj.name} />
            ))}
          </div>
          {!selectedMkId && (
            <p className="text-white/20 text-xs text-center mt-4 italic">👆 Klik kartu konsultan untuk melihat tombol kontak</p>
          )}
        </section>

        {/* ── FORM KONSULTASI ── */}
        <section>
          <SectionLabel gold>Form Konsultasi Project</SectionLabel>
          <div className="bg-[#111] border border-white/6 rounded-2xl p-7 md:p-10">

            {/* Indikator marketing dipilih */}
            <AnimatePresence>
              {selectedMk && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#C9A84C]/8 border border-[#C9A84C]/20">
                    <div className="flex items-center gap-3">
                      <img src={selectedMk.foto} alt={selectedMk.name} className="w-8 h-8 rounded-full border-2 border-[#C9A84C] object-cover" />
                      <div>
                        <p className="text-[10px] text-white/40">Konsultan dipilih:</p>
                        <p className="text-sm font-bold text-[#C9A84C]">{selectedMk.name}</p>
                      </div>
                    </div>
                    <button onClick={() => setSelectedMkId(null)} className="text-white/30 hover:text-white/60 transition-colors"><FiX size={14} /></button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                {/* NAMA */}
                <FormField label="Nama Lengkap" name="nama" type="text" placeholder="Contoh: Budi Santoso" value={form.nama} onChange={handleChange} required />
                {/* WA */}
                <FormField label="Nomor WhatsApp" name="nomorWa" type="tel" placeholder="Contoh: 08123456789" value={form.nomorWa} onChange={handleChange} required />
                {/* EMAIL */}
                <FormField label="Email" name="email" type="email" placeholder="Contoh: budi@email.com" value={form.email} onChange={handleChange} />
                {/* PILIH PROJECT */}
                <div>
                  <label className="block text-xs font-bold text-white/60 mb-2">Pilih Project</label>
                  <select name="pilihanProject" value={form.pilihanProject} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/10 focus:outline-none focus:border-[#C9A84C] text-white/80 text-sm transition-all"
                  >
                    <option value="Masagena Green Hills">Masagena Green Hills</option>
                    <option value="Wotu Islamic Village">Wotu Islamic Village</option>
                    <option value="The Hasanah Panakkukang">The Hasanah Panakkukang</option>
                    <option value="Afkar Madani Estate">Afkar Madani Estate</option>
                  </select>
                </div>
                {/* TUJUAN */}
                <div>
                  <label className="block text-xs font-bold text-white/60 mb-2">Tujuan Pembelian</label>
                  <select name="tujuanPembelian" value={form.tujuanPembelian} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/10 focus:outline-none focus:border-[#C9A84C] text-white/80 text-sm transition-all"
                  >
                    <option value="">Pilih Tujuan</option>
                    <option value="Hunian Pribadi">Hunian Pribadi</option>
                    <option value="Investasi">Investasi</option>
                    <option value="Hunian & Investasi">Hunian & Investasi</option>
                  </select>
                </div>
              </div>
              {/* PESAN */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-white/60 mb-2">Pesan Tambahan <span className="font-normal text-white/30">(Opsional)</span></label>
                <textarea name="pesan" rows="3" value={form.pesan} onChange={handleChange} placeholder="Pertanyaan spesifik tentang project ini..."
                  className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/10 focus:outline-none focus:border-[#C9A84C] text-white/80 text-sm transition-all resize-none placeholder-white/20"
                />
              </div>
              <button type="submit" disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 bg-brand-primary hover:bg-[#C9A84C] text-white hover:text-black font-bold text-sm rounded-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 shadow-lg shadow-brand-primary/20"
              >
                {isSubmitting
                  ? <><span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Mengirim & Menghubungkan...</>
                  : <><FiSend size={15} /> Kirim Konsultasi & Hubungi Marketing</>
                }
              </button>
              <p className="text-white/20 text-[11px] text-center mt-3">🔒 Data Anda aman · Setelah kirim, Anda akan diarahkan ke WhatsApp marketing</p>
            </form>
          </div>
        </section>

        {/* ── AJAKAN SURVEY LOKASI ── */}
        <section>
          <SectionLabel>Buktikan Sendiri — Survey Lokasi Gratis!</SectionLabel>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f0f0f] via-[#141414] to-[#0f0f0f] border border-[#C9A84C]/20 p-8 md:p-10"
          >
            {/* Decorative gold line top */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/60 to-transparent" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  emoji: '👁️',
                  title: 'Lihat Langsung Lokasinya',
                  desc: 'Jangan percaya foto saja. Datang, rasakan suasana kawasannya sendiri — udara segar, lingkungan Islami, akses strategis.',
                },
                {
                  emoji: '🤝',
                  title: 'Didampingi Tim Marketing',
                  desc: 'Kami antar, kami dampingi. Tim marketing kami siap menjawab semua pertanyaan Anda langsung di lokasi tanpa tekanan.',
                },
                {
                  emoji: '📐',
                  title: 'Pilih Unit Terbaik Anda',
                  desc: 'Pilih langsung kavling atau unit yang paling sesuai kebutuhan & budget Anda. Booking di tempat dengan proses mudah.',
                },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center p-5 rounded-xl bg-white/3 border border-white/6 hover:border-[#C9A84C]/30 transition-all duration-300 group"
                >
                  <span className="text-3xl mb-3">{item.emoji}</span>
                  <h4 className="text-white font-bold text-sm mb-2 group-hover:text-[#C9A84C] transition-colors">{item.title}</h4>
                  <p className="text-white/35 text-[11px] leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA Quote + Button */}
            <div className="text-center">
              <p className="text-white/60 text-sm italic mb-1">
                "Rumah adalah keputusan terbesar dalam hidup Anda.
              </p>
              <p className="text-[#C9A84C] font-bold text-sm mb-6">
                Pastikan Anda memilih yang terbaik — dengan melihatnya sendiri." 🏡
              </p>
              <a
                href={`https://wa.me/${team[0]?.wa || '6285705218281'}?text=${encodeURIComponent(`Assalamu'alaikum, saya ingin jadwalkan *Survey Lokasi* untuk project *${proj.name}*. Kapan bisa? 🙏`)}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C9A84C] hover:bg-[#e0c46e] text-black font-bold text-sm rounded-xl transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-[#C9A84C]/20"
              >
                📅 Jadwalkan Survey Lokasi Sekarang — GRATIS!
              </a>
              <p className="text-white/20 text-[10px] mt-3">Tanpa biaya · Tanpa kewajiban beli · Kami siap menemani Anda</p>
            </div>

            {/* Decorative gold line bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/60 to-transparent" />
          </motion.div>
        </section>

        {/* ── FAQ ── */}
        <section>
          <SectionLabel>Pertanyaan Umum (FAQ)</SectionLabel>
          <FAQSection faq={proj.faq} />
        </section>

        {/* ── CTA PENUTUP ── */}
        <section>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a0000] via-brand-primary to-[#4a0000] border border-[#C9A84C]/20 px-7 py-12 text-center"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
            <div className="relative z-10">
              <h2 className="font-heading font-extrabold text-white text-2xl md:text-3xl mb-3">
                Mulai Langkah Memiliki Hunian Syariah Impian Anda
              </h2>
              <p className="text-white/55 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                Konsultasikan kebutuhan property Anda bersama tim AFKAR LAND sekarang juga.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a href={`https://wa.me/${team[0]?.wa || '6285705218281'}?text=${encodeURIComponent(`Assalamu'alaikum, saya ingin jadwalkan survey lokasi *${proj.name}*. Kapan bisa? 🙏`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-primary font-bold text-sm rounded-xl hover:bg-gray-50 transition-all hover:-translate-y-0.5 shadow-lg"
                >
                  📅 Jadwalkan Survey
                </a>
                <button onClick={() => document.querySelector('#marketing-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A84C] hover:bg-[#e0c46e] text-black font-bold text-sm rounded-xl transition-all hover:-translate-y-0.5"
                >
                  <FiMessageCircle size={14} /> Hubungi Marketing
                </button>
                <button onClick={() => triggerDownload(proj.brosurUrl, proj.brosurFileName, proj.name)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-bold text-sm rounded-xl border border-white/20 transition-all hover:-translate-y-0.5"
                >
                  <FiDownload size={14} /> Download Brosur
                </button>
              </div>
            </div>
          </motion.div>
        </section>

      </div>

      {/* Built with Webapp GASP Builder Era v.1.0 by @damarmahendra */}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CANVAS 4 — HELPER COMPONENTS
// ─────────────────────────────────────────────────────────────

// Section Label dengan garis gold
function SectionLabel({ children, gold = false }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`h-5 w-0.5 ${gold ? 'bg-[#C9A84C]' : 'bg-brand-primary'} rounded-full`} />
      <h2 className={`font-heading font-extrabold text-lg ${gold ? 'text-[#C9A84C]' : 'text-white'}`}>
        {children}
      </h2>
    </div>
  );
}

// Form field reusable
function FormField({ label, name, type, placeholder, value, onChange, required }) {
  return (
    <div>
      <label className="block text-xs font-bold text-white/60 mb-2">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/10 focus:outline-none focus:border-[#C9A84C] text-white/80 text-sm transition-all placeholder-white/20"
      />
    </div>
  );
}