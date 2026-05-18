// About.jsx — Halaman Tentang AFKAR LAND
// ─────────────────────────────────────────────────────────────────────────────
// ✅ TERINTEGRASI dengan ManageHomepage via useSiteSettings (Firestore real-time)
// Semua teks, gambar, dan CTA dikelola dari panel admin → langsung tampil di sini
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiArrowRight, FiShield, FiHeart, FiCheckCircle,
  FiMessageSquare, FiStar
} from 'react-icons/fi';

// ✅ Hook real-time dari Firestore (sama seperti Home.jsx)
import { useSiteSettings } from '../hooks/useSiteSettings';

// ── Animasi ──────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};
const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

// ── Default fallback (sinkron dengan ManageHomepage DEFAULT.about) ─────────
const DEFAULTS = {
  heroBadge:        'Tentang AFKAR LAND',
  heroJudul:        'Membangun Hunian Syariah dengan Amanah',
  heroSubjudul:     'AFKAR LAND adalah perusahaan pengembang properti syariah yang berkomitmen menghadirkan hunian nyaman, berkualitas, dan sesuai prinsip Islam tanpa riba.',
  heroImage:        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80',
  ctaUtamaLabel:    'Lihat Proyek',
  ctaUtamaLink:     '/proyek',
  companyImage:     'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
  companyJudul:     'Berawal dari Sebuah Tujuan yang Baik',
  companyParagraf1: 'AFKAR LAND hadir untuk membantu masyarakat memiliki hunian yang nyaman dengan proses yang lebih aman, transparan, dan sesuai prinsip syariah.',
  companyParagraf2: 'Kami percaya bahwa rumah bukan hanya tempat tinggal, tetapi tempat tumbuhnya keluarga, pendidikan anak, dan keberkahan kehidupan.',
  founderImage:     '/images/ustadz.png',
  founderNama:      'Ustadz Haris Amrin',
  founderJabatan:   'Founder AFKAR LAND',
  founderKutipan:   'Kami ingin menghadirkan lingkungan yang nyaman, islami, dan membawa keberkahan bagi setiap keluarga.',
  ctaJudul:         'Temukan Hunian Syariah Pilihan Anda',
  ctaSubjudul:      'Jelajahi berbagai proyek property syariah AFKAR LAND yang dirancang untuk kenyamanan dan masa depan keluarga Anda.',
  ctaLink:          '/proyek',
  ctaLabel:         'Lihat Semua Proyek',
};

export default function About() {
  // ── Baca pengaturan real-time dari Firestore via admin ────────────────────
  const { settings } = useSiteSettings();

  // ✅ Ambil dari settings.about, fallback ke DEFAULTS jika belum diisi admin
  const about = { ...DEFAULTS, ...(settings?.about || {}) };

  const heroBadge        = about.heroBadge;
  const heroJudul        = about.heroJudul;
  const heroSubjudul     = about.heroSubjudul;
  const heroImage        = about.heroImage;
  const ctaUtamaLabel    = about.ctaUtamaLabel;
  const ctaUtamaLink     = about.ctaUtamaLink;
  const companyImage     = about.companyImage;
  const companyJudul     = about.companyJudul;
  const companyParagraf1 = about.companyParagraf1;
  const companyParagraf2 = about.companyParagraf2;
  const founderImage     = about.founderImage;
  const founderNama      = about.founderNama;
  const founderJabatan   = about.founderJabatan;
  const founderKutipan   = about.founderKutipan;
  const ctaJudul         = about.ctaJudul;
  const ctaSubjudul      = about.ctaSubjudul;
  const ctaLink          = about.ctaLink;
  const ctaLabel         = about.ctaLabel;

  return (
    <div className="w-full bg-[#080808] font-body overflow-hidden text-white">

      {/* ==========================================
          1. HERO SECTION — TENTANG AFKAR LAND
          ✅ heroBadge, heroJudul, heroSubjudul,
             heroImage, ctaUtamaLabel, ctaUtamaLink
             — semua dari ManageHomepage → Tab Tentang Kami
      ========================================== */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        {/* Background glow premium */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-900/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Kiri: Copywriting */}
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              {/* ✅ heroBadge */}
              <motion.div variants={fadeUp} className="mb-6">
                <span className="inline-block px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 font-bold tracking-widest text-xs uppercase">
                  {heroBadge}
                </span>
              </motion.div>

              {/* ✅ heroJudul */}
              <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold leading-[1.1] mb-6 tracking-tight text-white">
                {heroJudul.split(' ').map((word, i, arr) => {
                  // Kata terakhir ditampilkan dengan aksen merah gradien
                  const lastWordIndex = arr.length - 1;
                  return i === lastWordIndex
                    ? <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-300"> {word}</span>
                    : <span key={i}>{i > 0 ? ' ' : ''}{word}</span>;
                })}
              </motion.h1>

              {/* ✅ heroSubjudul */}
              <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-400 font-light mb-10 leading-relaxed max-w-lg">
                <strong className="text-white font-bold">AFKAR LAND</strong>{' '}
                {heroSubjudul.replace(/^AFKAR LAND\s*/i, '')}
              </motion.p>

              {/* ✅ ctaUtamaLabel + ctaUtamaLink */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={ctaUtamaLink}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-900/30"
                >
                  {ctaUtamaLabel} <FiArrowRight size={18} />
                </Link>
                <a
                  href={`https://wa.me/${settings?.contact?.waNumber || settings?.career?.hrdWaNumber || '6285705218281'}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                >
                  Konsultasi
                </a>
              </motion.div>
            </motion.div>

            {/* Kanan: Foto Proyek Premium */}
            {/* ✅ heroImage — dari Cloudinary via ManageHomepage */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="rounded-[2.5rem] overflow-hidden border border-white/10 relative z-10 aspect-[4/5] md:aspect-square">
                <img
                  src={heroImage}
                  alt={`Proyek ${founderJabatan ? founderJabatan.replace('Founder ', '') : 'AFKAR LAND'}`}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#080808] via-transparent to-transparent" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ==========================================
          2. TENTANG PERUSAHAAN
          ✅ companyImage, companyJudul,
             companyParagraf1, companyParagraf2
             — dari ManageHomepage → Tab Tentang Kami
      ========================================== */}
      <section className="py-24 bg-[#111] border-y border-white/5">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Kiri: Foto Perusahaan */}
            {/* ✅ companyImage */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative order-2 lg:order-1"
            >
              <div className="rounded-3xl overflow-hidden border border-white/10 relative z-10 aspect-video lg:aspect-[4/3]">
                <img
                  src={companyImage}
                  alt="Suasana Proyek AFKAR LAND"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-red-600 rounded-full blur-3xl opacity-20"></div>
            </motion.div>

            {/* Kanan: Penjelasan */}
            <motion.div
              initial="hidden" whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="order-1 lg:order-2"
            >
              {/* ✅ companyJudul */}
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-8 leading-tight">
                {companyJudul}
              </h2>
              <div className="space-y-6 text-gray-400 font-light text-lg leading-relaxed">
                {/* ✅ companyParagraf1 */}
                <p>{companyParagraf1}</p>
                {/* ✅ companyParagraf2 */}
                <p>{companyParagraf2}</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ==========================================
          3. EDUKASI PROPERTY SYARIAH
          (Konten statis — ayat Al-Qur'an & benefit cards)
      ========================================== */}
      <section className="py-24 bg-[#080808]">
        <div className="container mx-auto px-6 md:px-12">

          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.h2
              initial="hidden" whileInView="visible"
              viewport={{ once: true }} variants={fadeUp}
              className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-6"
            >
              Apa Itu Property Syariah?
            </motion.h2>
            <motion.div
              initial="hidden" whileInView="visible"
              viewport={{ once: true }} variants={fadeUp}
              className="space-y-4 text-gray-400 font-light text-lg leading-relaxed"
            >
              <p>
                Property syariah adalah konsep kepemilikan rumah yang dijalankan berdasarkan prinsip Islam — mengedepankan transaksi yang adil, transparan, dan bebas dari praktik riba.
              </p>
              <p>
                Dalam sistem property syariah, proses jual beli dilakukan dengan akad yang jelas, tanpa bunga, tanpa denda keterlambatan, dan tanpa unsur yang merugikan salah satu pihak.
              </p>
            </motion.div>
          </div>

          {/* BOX AYAT AL-QUR'AN */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto mb-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-900 opacity-10 rounded-3xl blur-xl"></div>
            <div className="relative bg-[#111] border border-red-500/20 p-10 md:p-14 rounded-3xl text-center shadow-2xl">
              <p className="text-3xl md:text-5xl text-red-500 mb-6 font-serif leading-loose" dir="rtl">
                وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا
              </p>
              <p className="text-gray-400 italic mb-4">
                "Wa aḥallallāhul-bai'a wa ḥarramar-ribā"
              </p>
              <p className="text-white font-medium text-lg mb-6">
                "Padahal Allah telah menghalalkan jual beli dan mengharamkan riba."
              </p>
              <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-400 text-sm font-bold tracking-wider">
                QS. Al-Baqarah : 275
              </div>
            </div>
          </motion.div>

          {/* CARD BENEFIT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <FiHeart />,        title: 'Tanpa Riba',      desc: 'Transaksi lebih tenang tanpa sistem bunga.' },
              { icon: <FiCheckCircle />,  title: 'Akad Transparan', desc: 'Seluruh proses dijelaskan secara terbuka.' },
              { icon: <FiShield />,       title: 'Tanpa Denda',     desc: 'Tidak memberatkan konsumen.' },
              { icon: <FiStar />,         title: 'Amanah & Berkah', desc: 'Mengutamakan kepercayaan dan keberkahan.' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial="hidden" whileInView="visible"
                viewport={{ once: true }} variants={fadeUp}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#111] p-8 rounded-3xl border border-white/5 text-center hover:border-red-500/30 transition-colors group"
              >
                <div className="w-14 h-14 mx-auto bg-black rounded-xl flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform">
                  {React.cloneElement(item.icon, { size: '24' })}
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                <p className="text-gray-500 font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ==========================================
          4. FOUNDER SECTION
          ✅ founderImage, founderNama,
             founderJabatan, founderKutipan
             — dari ManageHomepage → Tab Tentang Kami
      ========================================== */}
      <section className="py-24 bg-[#111] border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-900/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Kiri: Foto Founder */}
            {/* ✅ founderImage */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 relative"
            >
              <div className="absolute inset-0 bg-red-600 rounded-3xl -translate-x-4 translate-y-4 opacity-20" />
              <div className="relative rounded-3xl overflow-hidden border border-white/10 aspect-[3/4] bg-[#1a1a1a]">
                <img
                  src={founderImage}
                  alt={founderNama}
                  className="w-full h-full object-cover filter contrast-125 grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
              </div>
            </motion.div>

            {/* Kanan: Kata-kata Founder */}
            <motion.div
              initial="hidden" whileInView="visible"
              viewport={{ once: true }} variants={fadeUp}
              className="lg:col-span-7 lg:pl-12"
            >
              <div className="mb-4">
                <span className="text-red-500 font-bold uppercase tracking-widest text-xs">Pesan Founder</span>
              </div>
              <FiMessageSquare className="text-red-900/40 w-16 h-16 mb-6" />

              <h3 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-6 leading-tight">
                "Kami Tidak Sekadar Menjual Rumah"
              </h3>

              {/* ✅ founderKutipan */}
              <p className="text-xl md:text-2xl text-gray-300 italic leading-relaxed mb-10 font-light border-l-4 border-red-500 pl-6">
                "{founderKutipan}"
              </p>

              <div>
                {/* ✅ founderNama */}
                <h4 className="text-2xl font-bold text-white mb-1">{founderNama}</h4>
                {/* ✅ founderJabatan */}
                <p className="text-red-500 text-xs font-bold uppercase tracking-widest">{founderJabatan}</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ==========================================
          5. FAQ PREVIEW — 3 pertanyaan teratas
             dari settings.faq (Firestore real-time)
      ========================================== */}
      <section className="py-24 bg-[#111] border-y border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">

          {/* Heading */}
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 font-bold tracking-widest text-xs uppercase mb-4">
              Ada Pertanyaan?
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white">
              Pertanyaan yang Sering Ditanyakan
            </h2>
          </motion.div>

          {/* FAQ accordion preview — 3 pertanyaan pertama */}
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true }} variants={stagger}
            className="space-y-3 mb-10"
          >
            {(
              settings.faq?.length > 0
                ? settings.faq
                : [
                    { pertanyaan: 'Apa itu skema 100% Syariah?',     jawaban: 'Transaksi murni antara konsumen dan developer tanpa bank — bebas dari riba, denda, sita, dan asuransi yang diharamkan.' },
                    { pertanyaan: 'Apakah perlu BI Checking?',        jawaban: 'Tidak perlu. Karena tidak melibatkan bank, riwayat kredit Anda tidak mempengaruhi persetujuan sama sekali.' },
                    { pertanyaan: 'Apakah legalitas tanah terjamin?', jawaban: 'Ya. Seluruh proyek AFKAR LAND berdiri di atas tanah berstatus SHM yang telah Clear & Clean.' },
                  ]
            ).slice(0, 3).map((faq, i) => (
              <motion.div
                key={i} variants={fadeUp}
                className="border border-white/8 rounded-2xl bg-[#0f0f0f] px-6 py-5"
              >
                <div className="flex items-start gap-4">
                  <span className="w-7 h-7 rounded-full bg-red-500/15 border border-red-500/25 text-red-400 text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-white font-bold text-base mb-2">
                      {faq.pertanyaan || faq.q}
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {faq.jawaban || faq.a}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Tombol ke halaman FAQ lengkap */}
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true }} variants={fadeUp}
            className="text-center"
          >
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-white font-bold rounded-xl transition-all duration-300"
            >
              Lihat Semua Pertanyaan <FiArrowRight size={18} />
            </Link>
          </motion.div>

        </div>
      </section>

      {/* ==========================================
          6. CTA — LIHAT PROYEK
          ✅ ctaJudul, ctaSubjudul, ctaLabel, ctaLink
             — dari ManageHomepage → Tab Tentang Kami
      ========================================== */}
      <section className="py-24 border-t border-white/5 bg-[#080808]">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-red-900 via-red-800 to-[#0A0A0A] rounded-3xl p-12 md:p-20 text-center overflow-hidden border border-red-500/30 shadow-2xl shadow-red-900/20"
          >
            {/* Tekstur mesh/glow */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}
            />

            <div className="relative z-10">
              {/* ✅ ctaJudul */}
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-4">
                {ctaJudul}
              </h2>
              {/* ✅ ctaSubjudul */}
              <p className="text-red-100 mb-10 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                {ctaSubjudul}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* ✅ ctaLabel + ctaLink */}
                <Link
                  to={ctaLink}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-red-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all hover:-translate-y-1 shadow-xl shadow-black/20"
                >
                  {ctaLabel} <FiArrowRight size={18} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}