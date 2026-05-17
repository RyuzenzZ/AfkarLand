import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiExternalLink, FiBriefcase, FiTrendingUp, 
  FiUsers, FiAward, FiArrowRight, FiMail 
} from 'react-icons/fi';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

export default function Career() {
  // Link portal HRD resmi AFKAR LAND
  const hrPortalLink = "https://sites.google.com/view/afkar-rekrutmen/";

  // Nomor & pesan otomatis WhatsApp HRD
  const hrdWa = '6285355355323';
  const hrdWaMsg = encodeURIComponent(
    `Assalamu'alaikum 👋\n\nSaya ingin menanyakan informasi lebih lanjut mengenai *lowongan pekerjaan* di AFKAR LAND.\n\nMohon bantuannya ya, terima kasih 🙏`
  );
  const hrdWaLink = `https://wa.me/${hrdWa}?text=${hrdWaMsg}`;

  // Flyer lowongan — simpan gambar di public/lowongan/open-recruitment.jpg
  const flyerSrc = '/lowongan/open-recruitment.jpg';

  // Data posisi dari flyer — Marketing Executive & Teknik = PRIORITAS
  const posisiList = [
    {
      title: 'Marketing Executive',
      prioritas: true,
      emoji: '📣',
      jobdesk: [
        'Mencari & mengelola calon pembeli (leads)',
        'Follow up database & komunikasi calon konsumen',
        'Presentasi produk & mengajak survey lokasi',
        'Closing penjualan & membuat laporan harian',
      ],
      waMsg: encodeURIComponent(`Assalamu'alaikum Pak Abdi 👋\n\nSaya ingin melamar posisi *Marketing Executive* di AFKAR GROUP INDONESIA.\n\nBerikut data singkat saya:\n- Nama: \n- Usia: \n- Domisili: \n- Pengalaman Kerja: \n- Alasan Bergabung: \n\nTerima kasih 🙏`),
    },
    {
      title: 'Teknik',
      prioritas: true,
      emoji: '🔧',
      jobdesk: [
        'Merencanakan & mengawasi pelaksanaan proyek',
        'Membuat gambar kerja, RAB & time schedule',
        'Mengontrol kualitas, kuantitas & progres lapangan',
        'Koordinasi kontraktor, vendor & tim terkait',
      ],
      waMsg: encodeURIComponent(`Assalamu'alaikum Pak Abdi 👋\n\nSaya ingin melamar posisi *Teknik* di AFKAR GROUP INDONESIA.\n\nBerikut data singkat saya:\n- Nama: \n- Usia: \n- Domisili: \n- Pengalaman Kerja: \n- Alasan Bergabung: \n\nTerima kasih 🙏`),
    },
    {
      title: 'Sales Leader',
      prioritas: false,
      emoji: '🏆',
      jobdesk: [
        'Memimpin & mengelola tim sales',
        'Menyusun strategi penjualan & rencana kerja',
        'Memantau kinerja tim & coaching',
        'Membuat laporan penjualan & evaluasi tim',
      ],
      waMsg: encodeURIComponent(`Assalamu'alaikum Pak Abdi 👋\n\nSaya ingin melamar posisi *Sales Leader* di AFKAR GROUP INDONESIA.\n\nBerikut data singkat saya:\n- Nama: \n- Usia: \n- Domisili: \n- Pengalaman Kerja: \n- Alasan Bergabung: \n\nTerima kasih 🙏`),
    },
    {
      title: 'Marketing Communications',
      prioritas: false,
      emoji: '📱',
      jobdesk: [
        'Menyusun & eksekusi strategi komunikasi pemasaran',
        'Mengelola konten berbagai channel komunikasi',
        'Menulis materi promosi & press release',
        'Monitoring & analisa performa konten & kampanye',
      ],
      waMsg: encodeURIComponent(`Assalamu'alaikum Pak Abdi 👋\n\nSaya ingin melamar posisi *Marketing Communications* di AFKAR GROUP INDONESIA.\n\nBerikut data singkat saya:\n- Nama: \n- Usia: \n- Domisili: \n- Pengalaman Kerja: \n- Alasan Bergabung: \n\nTerima kasih 🙏`),
    },
    {
      title: 'Admin Sales',
      prioritas: false,
      emoji: '📋',
      jobdesk: [
        'Mengelola data & dokumen penjualan',
        'Membuat penawaran harga, PO & invoice',
        'Memastikan kelengkapan dokumen sales',
        'Membuat laporan penjualan & administrasi',
      ],
      waMsg: encodeURIComponent(`Assalamu'alaikum Pak Abdi 👋\n\nSaya ingin melamar posisi *Admin Sales* di AFKAR GROUP INDONESIA.\n\nBerikut data singkat saya:\n- Nama: \n- Usia: \n- Domisili: \n- Pengalaman Kerja: \n- Alasan Bergabung: \n\nTerima kasih 🙏`),
    },
  ];

  return (
    <div className="w-full bg-[#080808] font-body min-h-screen text-white overflow-hidden pb-24">
      
      {/* =========================================
          1. HERO SECTION — KARIR & PELUANG
      ========================================= */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-20">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-900/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Kiri: Copywriting */}
            <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.div variants={fadeUp} className="mb-6">
                <span className="inline-block px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 font-bold tracking-widest text-xs uppercase">
                  Karir & Peluang
                </span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold mb-6 leading-tight">
                Tumbuh Bersama <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-300">AFKAR LAND</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-400 font-light leading-relaxed mb-10 max-w-lg">
                Bangun karir cemerlang di industri properti sambil mengumpulkan amal jariyah melalui sistem kerja yang profesional dan islami.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                <a href={hrPortalLink} target="_blank" rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-900/30"
                >
                  Cek Lowongan <FiExternalLink size={18} />
                </a>
                <a href={hrdWaLink} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                >
                  Hubungi HRD
                </a>
              </motion.div>
            </motion.div>

            {/* Kanan: Foto Tim Modern */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative hidden lg:block">
              <div className="rounded-[2.5rem] overflow-hidden border border-white/10 relative z-10 aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80" 
                  alt="Tim AFKAR LAND Meeting" 
                  className="w-full h-full object-cover opacity-90" 
                />
                {/* Gradient transisi halus */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#080808] via-transparent to-transparent opacity-80" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* =========================================
          2. PORTAL REKRUTMEN (Glassmorphism)
      ========================================= */}
      <section className="py-12 relative z-20">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} 
            className="bg-[#111]/80 backdrop-blur-xl p-10 md:p-16 rounded-[2.5rem] shadow-2xl border border-white/10 text-center relative overflow-hidden group"
          >
            {/* Glow halus saat dihover */}
            <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="w-20 h-20 bg-black border border-white/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
              <FiBriefcase size={32} />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white mb-6">
              Portal Rekrutmen Terpadu
            </h2>
            
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
              Untuk menjaga transparansi dan standar profesionalisme, seluruh proses seleksi, lowongan pekerjaan, dan tes masuk <strong className="text-white">AFKAR LAND</strong> dilakukan melalui Portal Rekrutmen Resmi HRD kami.
            </p>
            
            <a href={hrPortalLink} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 hover:-translate-y-1 transition-all duration-300"
            >
              Cek Lowongan Pekerjaan <FiArrowRight size={20} />
            </a>
            
            <p className="text-xs text-red-400 mt-6 font-bold tracking-widest uppercase">
              *Anda akan diarahkan ke halaman rekrutmen terpisah
            </p>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          3. MENGAPA BERGABUNG DENGAN KAMI?
      ========================================= */}
      <section className="py-24 bg-[#080808]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white">Keuntungan Bergabung di Tim Kami</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <FiTrendingUp size={28} />, 
                title: 'Pengembangan Karir', 
                desc: 'Kami mendukung peningkatan skill karyawan melalui berbagai pelatihan internal maupun eksternal di bidang properti dan digital marketing.' 
              },
              { 
                icon: <FiUsers size={28} />, 
                title: 'Lingkungan Islami', 
                desc: 'Budaya kerja yang mengedepankan nilai-nilai syariat, saling mengingatkan dalam kebaikan, dan menjaga integritas (Amanah).' 
              },
              { 
                icon: <FiAward size={28} />, 
                title: 'Sistem Reward Kompetitif', 
                desc: 'Kami mengapresiasi setiap kerja keras tim dengan skema gaji, bonus, dan komisi penjualan yang transparan dan adil.' 
              }
            ].map((benefit, idx) => (
              <motion.div 
                key={idx} 
                initial="hidden" whileInView="visible" viewport={{ once: true }} 
                variants={fadeUp} transition={{ delay: idx * 0.1 }} 
                className="bg-[#111] p-10 rounded-3xl border border-white/5 hover:border-red-500/30 hover:bg-[#1a1a1a] transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-black border border-white/10 text-red-500 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h4 className="text-xl font-bold text-white mb-4">{benefit.title}</h4>
                <p className="text-gray-500 font-light leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          4. BUDAYA KERJA AFKAR LAND
      ========================================= */}
      <section className="py-12">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} 
            className="relative rounded-[3rem] overflow-hidden bg-[#111] aspect-[4/3] md:aspect-[21/9] flex items-center"
          >
            {/* Background Image full width */}
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" 
                alt="Budaya Kerja Kolaboratif" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Gradient Overlay untuk text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/80 to-transparent" />

            <div className="relative z-10 p-10 md:p-20 max-w-3xl">
              <span className="inline-block px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 font-bold tracking-widest text-[10px] uppercase mb-6">
                Budaya Perusahaan
              </span>
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-6 leading-tight">
                Bekerja dengan Amanah dan Profesionalisme
              </h2>
              <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed">
                Kami percaya bahwa lingkungan kerja yang sehat akan melahirkan tim yang kuat. Karena itu, AFKAR LAND membangun budaya kerja yang kolaboratif, islami, dan berorientasi pada pertumbuhan bersama.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          4.5. OPEN RECRUITMENT — RAPI & TERSTRUKTUR
      ========================================= */}
      <section className="py-24 bg-[#080808]">
        <div className="container mx-auto px-6 md:px-12">

          {/* ── HEADER ── */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
          >
            <div>
              <span className="inline-block px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 font-bold tracking-widest text-[10px] uppercase mb-4">
                Open Recruitment 2026
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white mb-2 leading-tight">
                Posisi yang Sedang Dibuka
              </h2>
              <p className="text-white/40 text-sm">AFKAR GROUP INDONESIA · Makassar & Wotu</p>
            </div>
            {/* Deadline badge */}
            <div className="shrink-0 flex items-center gap-3 bg-[#111] border border-white/8 rounded-2xl px-5 py-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center text-lg shrink-0">📅</div>
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Pendaftaran</p>
                <p className="text-white font-extrabold text-sm">13 Mei – 25 Mei 2026</p>
              </div>
            </div>
          </motion.div>

          {/* ── MAIN GRID: Flyer + Posisi ── */}
          <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-10 items-start">

            {/* ─── KOLOM KIRI: Flyer + Info Kontak ─── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="hidden xl:block xl:sticky xl:top-24 space-y-4"
            >
              {/* Flyer */}
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-red-900/10">
                <img
                  src={flyerSrc}
                  alt="Flyer Open Recruitment AFKAR GROUP INDONESIA 2026"
                  className="w-full object-cover"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80'; }}
                />
              </div>

              {/* Kirim Lamaran Card */}
              <div className="rounded-2xl bg-[#111] border border-white/8 overflow-hidden">
                <div className="px-5 pt-5 pb-3 border-b border-white/5">
                  <p className="text-white font-bold text-sm">📤 Kirim Lamaran</p>
                  <p className="text-white/35 text-xs mt-0.5">Langsung via WhatsApp ke HRD</p>
                </div>
                <div className="p-5 space-y-4">
                  <a
                    href={`https://wa.me/6285355355323?text=${encodeURIComponent("Assalamu'alaikum Pak Abdi 👋\n\nSaya ingin mengirimkan lamaran kerja ke AFKAR GROUP INDONESIA.\n\nData saya:\n- Nama: \n- Usia: \n- Domisili: \n- Posisi yang dilamar: \n- Pengalaman Kerja: \n- Alasan Bergabung: \n\nTerima kasih 🙏")}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-green-500/8 border border-green-500/20 hover:bg-green-500/15 hover:border-green-500/40 transition-all group/wa"
                  >
                    <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center text-base shrink-0">💬</div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm group-hover/wa:text-green-400 transition-colors truncate">+62853-5535-5323</p>
                      <p className="text-white/35 text-xs">Pak Abdi · HRD AFKAR GROUP</p>
                    </div>
                    <FiArrowRight size={14} className="text-white/25 group-hover/wa:text-green-400 transition-colors shrink-0 ml-auto" />
                  </a>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: '📍', label: 'Penempatan', val: 'Makassar & Wotu' },
                      { icon: '👥', label: 'Tipe', val: 'Full Time' },
                    ].map((info, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/3 border border-white/5">
                        <p className="text-base mb-1">{info.icon}</p>
                        <p className="text-white/35 text-[10px] mb-0.5">{info.label}</p>
                        <p className="text-white font-semibold text-xs">{info.val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ─── MOBILE ONLY: Info Banner ringkas ─── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="xl:hidden rounded-2xl overflow-hidden border border-white/8 bg-gradient-to-br from-red-950/50 via-[#140808] to-[#111]"
            >
              {/* Flyer gambar — compact di mobile */}
              <div className="relative">
                <img
                  src={flyerSrc}
                  alt="Open Recruitment AFKAR GROUP"
                  className="w-full object-cover max-h-56 object-top"
                  onError={e => { e.target.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#140808]" />
              </div>
              {/* Kontak singkat */}
              <div className="p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-0.5">Kirim Lamaran ke</p>
                  <p className="text-white font-bold text-sm">+62853-5535-5323</p>
                  <p className="text-white/35 text-xs">Pak Abdi · HRD AFKAR GROUP</p>
                </div>
                <a
                  href={`https://wa.me/6285355355323?text=${encodeURIComponent("Assalamu'alaikum Pak Abdi 👋\n\nSaya ingin melamar di AFKAR GROUP INDONESIA.\n\n- Nama: \n- Usia: \n- Domisili: \n- Posisi: \n- Pengalaman: \n- Alasan: \n\nTerima kasih 🙏")}`}
                  target="_blank" rel="noopener noreferrer"
                  className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold text-xs rounded-xl transition-all"
                >
                  💬 Chat
                </a>
              </div>
            </motion.div>

            {/* ─── KOLOM KANAN: Daftar Posisi ─── */}
            <div className="space-y-3">

              {/* Label kelompok: PRIORITAS */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full">
                    ⭐ Posisi Prioritas
                  </span>
                  <div className="flex-1 h-px bg-red-500/10" />
                </div>
              </motion.div>

              {/* Kartu PRIORITAS — 2 kolom */}
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6"
              >
                {posisiList.filter(p => p.prioritas).map((pos, i) => (
                  <motion.div key={i} variants={fadeUp} transition={{ delay: i * 0.1 }}
                    className="relative flex flex-col rounded-2xl border border-red-500/30 bg-gradient-to-b from-[#1c0a0a] to-[#110808] overflow-hidden group hover:border-red-400/60 hover:shadow-lg hover:shadow-red-900/20 transition-all duration-300"
                  >
                    {/* Top accent line */}
                    <div className="h-0.5 w-full bg-gradient-to-r from-red-600 via-red-400 to-transparent" />

                    <div className="flex-1 p-5">
                      {/* Header kartu */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-red-500/20 border border-red-500/25 flex items-center justify-center text-xl shrink-0">
                            {pos.emoji}
                          </div>
                          <div>
                            <h3 className="font-heading font-extrabold text-white text-base leading-tight">{pos.title}</h3>
                            <p className="text-white/35 text-[10px] mt-0.5">AFKAR GROUP INDONESIA</p>
                          </div>
                        </div>
                        <span className="shrink-0 text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500 text-white">
                          Prioritas
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="w-full h-px bg-white/5 mb-4" />

                      {/* Jobdesk */}
                      <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">Tanggung Jawab</p>
                      <ul className="space-y-2 mb-5">
                        {pos.jobdesk.map((jd, ji) => (
                          <li key={ji} className="flex items-start gap-2.5 text-white/55 text-xs leading-relaxed">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-red-400/70 shrink-0" />
                            {jd}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Footer tombol */}
                    <div className="p-4 pt-0">
                      <a
                        href={`https://wa.me/6285355355323?text=${pos.waMsg}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all duration-300 group-hover:-translate-y-0.5 shadow-lg shadow-red-900/30"
                      >
                        Lamar Sekarang <FiArrowRight size={14} />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Label kelompok: POSISI LAINNYA */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/40 bg-white/5 border border-white/8 px-3 py-1 rounded-full">
                    Posisi Lainnya
                  </span>
                  <div className="flex-1 h-px bg-white/6" />
                </div>
              </motion.div>

              {/* Kartu biasa — 1 per baris, lebih compact */}
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                className="space-y-3"
              >
                {posisiList.filter(p => !p.prioritas).map((pos, i) => (
                  <motion.div key={i} variants={fadeUp} transition={{ delay: i * 0.07 }}
                    className="flex flex-col sm:flex-row sm:items-center gap-5 rounded-2xl border border-white/6 bg-[#111] hover:border-white/14 hover:bg-[#141414] p-5 group transition-all duration-300"
                  >
                    {/* Ikon */}
                    <div className="w-12 h-12 rounded-xl bg-white/4 border border-white/8 flex items-center justify-center text-xl shrink-0">
                      {pos.emoji}
                    </div>

                    {/* Info tengah */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="font-heading font-extrabold text-white/85 text-base leading-tight">{pos.title}</h3>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/35">
                          Full Time
                        </span>
                      </div>
                      <p className="text-white/35 text-xs mb-2">AFKAR GROUP INDONESIA · Makassar & Wotu</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {pos.jobdesk.slice(0, 2).map((jd, ji) => (
                          <span key={ji} className="flex items-center gap-1.5 text-white/35 text-xs">
                            <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />{jd}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Tombol */}
                    <a
                      href={`https://wa.me/6285355355323?text=${pos.waMsg}`}
                      target="_blank" rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/6 hover:bg-white/12 border border-white/10 hover:border-white/20 text-white font-bold text-sm transition-all duration-300 group-hover:-translate-y-0.5"
                    >
                      Lamar <FiArrowRight size={13} />
                    </a>
                  </motion.div>
                ))}
              </motion.div>

            </div>
          </div>

          {/* ── INFO PANEL: Kualifikasi · Benefit · Cara Daftar ── */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              {
                icon: '✅', color: 'green',
                label: 'Kualifikasi Umum',
                items: [
                  'Pria/Wanita, usia 20–35 tahun',
                  'Min. SMA/D3/S1 sesuai posisi',
                  'Komunikatif & berorientasi target',
                  'Menguasai Microsoft Office',
                ],
              },
              {
                icon: '🎁', color: 'yellow',
                label: 'Benefit Bergabung',
                items: [
                  'Gaji bulanan + komisi tidak terbatas',
                  'Bonus closing',
                  'Training & pembinaan rutin',
                  'Lingkungan kerja islami & positif',
                  'Peluang berkembang jadi leader',
                ],
              },
              {
                icon: '📤', color: 'red',
                label: 'Cara Daftar via WA',
                items: [
                  'Nama lengkap',
                  'Usia & domisili',
                  'Pengalaman kerja',
                  'Alasan bergabung',
                ],
                cta: true,
              },
            ].map((col, i) => (
              <motion.div key={i} variants={fadeUp} transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-[#111] border border-white/6 overflow-hidden"
              >
                {/* Card header */}
                <div className={`px-5 py-4 border-b border-white/5 flex items-center gap-3
                  ${col.color === 'green' ? 'bg-green-500/5' : col.color === 'yellow' ? 'bg-yellow-500/5' : 'bg-red-500/5'}`}
                >
                  <span className="text-xl">{col.icon}</span>
                  <p className="text-white font-bold text-sm">{col.label}</p>
                </div>
                {/* Card body */}
                <div className="p-5">
                  <ul className="space-y-2.5 mb-4">
                    {col.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-white/50 text-xs leading-relaxed">
                        <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0
                          ${col.color === 'green' ? 'bg-green-400' : col.color === 'yellow' ? 'bg-yellow-400' : 'bg-red-400'}`}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {col.cta && (
                    <a
                      href={`https://wa.me/6285355355323?text=${encodeURIComponent("Assalamu'alaikum Pak Abdi 👋\n\nSaya ingin mengirimkan lamaran ke AFKAR GROUP INDONESIA.\n\n- Nama: \n- Usia: \n- Domisili: \n- Posisi: \n- Pengalaman: \n- Alasan: \n\nTerima kasih 🙏")}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-red-900/30"
                    >
                      Kirim ke +62853-5535-5323 <FiArrowRight size={12} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* =========================================
          4.7. LANGKAH MELAMAR — Mobile-first
      ========================================= */}
      <section className="py-16 bg-[#0a0a0a] border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12">

          {/* Heading */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/50 font-bold tracking-widest text-[10px] uppercase mb-4">
              Panduan Melamar
            </span>
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white mb-2">
              3 Langkah Mudah Bergabung
            </h2>
            <p className="text-white/35 text-sm max-w-sm mx-auto">
              Proses melamar 100% via WhatsApp — cepat, mudah, tanpa kirim berkas fisik.
            </p>
          </motion.div>

          {/* Step cards */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
          >
            {[
              {
                step: '01',
                icon: '🎯',
                title: 'Pilih Posisi',
                desc: 'Tentukan posisi yang paling sesuai dengan latar belakang dan minat Anda. Prioritaskan Marketing Executive atau Teknik jika memenuhi syarat.',
                color: 'red',
              },
              {
                step: '02',
                icon: '📝',
                title: 'Siapkan Data Diri',
                desc: 'Siapkan nama lengkap, usia, domisili, riwayat pengalaman kerja, dan alasan mengapa Anda ingin bergabung bersama AFKAR GROUP.',
                color: 'yellow',
              },
              {
                step: '03',
                icon: '💬',
                title: 'Kirim via WhatsApp',
                desc: 'Tap tombol Lamar di posisi pilihan Anda. Pesan lamaran sudah otomatis terisi — tinggal lengkapi data Anda dan kirim ke Pak Abdi.',
                color: 'green',
              },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} transition={{ delay: i * 0.1 }}
                className="relative rounded-2xl bg-[#111] border border-white/6 hover:border-white/12 p-6 overflow-hidden group transition-all duration-300"
              >
                {/* Step number watermark */}
                <span className="absolute top-4 right-5 font-heading font-extrabold text-5xl text-white/4 select-none leading-none">{s.step}</span>

                {/* Top badge */}
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-4 border
                  ${s.color === 'red' ? 'bg-red-500/10 border-red-500/20 text-red-400'
                    : s.color === 'yellow' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                    : 'bg-green-500/10 border-green-500/20 text-green-400'}`}
                >
                  Langkah {s.step}
                </div>

                <div className="text-2xl mb-3">{s.icon}</div>
                <h4 className="font-heading font-extrabold text-white text-base mb-2">{s.title}</h4>
                <p className="text-white/40 text-xs leading-relaxed">{s.desc}</p>

                {/* Bottom connector line (only for first two on desktop) */}
                {i < 2 && (
                  <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-px bg-white/10 z-10" />
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Stats bar */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {[
              { val: '5', label: 'Posisi Tersedia', icon: '💼' },
              { val: '2', label: 'Posisi Prioritas', icon: '⭐' },
              { val: '25 Mei', label: 'Batas Pendaftaran', icon: '📅' },
              { val: '2 Kota', label: 'Makassar & Wotu', icon: '📍' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl bg-[#111] border border-white/6 px-4 py-3.5">
                <span className="text-xl shrink-0">{stat.icon}</span>
                <div>
                  <p className="text-white font-extrabold text-base leading-tight">{stat.val}</p>
                  <p className="text-white/35 text-[10px]">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA tombol langsung */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <a
              href={`https://wa.me/6285355355323?text=${encodeURIComponent("Assalamu'alaikum Pak Abdi 👋\n\nSaya ingin melamar kerja di AFKAR GROUP INDONESIA.\n\nData saya:\n- Nama: \n- Usia: \n- Domisili: \n- Posisi yang dilamar: \n- Pengalaman Kerja: \n- Alasan Bergabung: \n\nTerima kasih 🙏")}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-xl transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-red-900/30"
            >
              💬 Kirim Lamaran Sekarang <FiArrowRight size={14} />
            </a>
            <a
              href={hrPortalLink} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-bold text-sm rounded-xl transition-all duration-300"
            >
              Lihat Portal Rekrutmen <FiExternalLink size={14} />
            </a>
          </motion.div>

        </div>
      </section>


      <section className="py-24 border-t border-white/5 bg-[#080808]">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative bg-gradient-to-br from-red-900 via-red-800 to-[#0A0A0A] rounded-3xl p-12 md:p-20 text-center overflow-hidden border border-red-500/30 shadow-2xl shadow-red-900/20"
          >
            {/* Tekstur grid halus */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-4">
                Ada Pertanyaan Seputar Rekrutmen?
              </h2>
              <p className="text-red-100 mb-10 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                Hubungi tim HRD kami langsung melalui halaman kontak untuk mendapatkan informasi lebih lanjut mengenai proses perekrutan AFKAR LAND.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href={hrdWaLink} target="_blank" rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-red-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all hover:-translate-y-1 shadow-xl shadow-black/20"
                >
                  Hubungi HRD <FiMail size={18} />
                </a>
                <a href={hrPortalLink} target="_blank" rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent border border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all"
                >
                  Lihat Lowongan <FiExternalLink size={18} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}