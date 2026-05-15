import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiHome, FiHeart, FiCheckCircle, FiTarget, FiTrendingUp } from 'react-icons/fi';

// Animasi Reusable
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Home() {
  return (
    <div className="w-full bg-white font-body overflow-hidden">
      
      {/* =========================================
          1. HERO SECTION (Layar Penuh)
          ========================================= */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image dengan Overlay Gelap */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80" 
            alt="Perumahan Premium AFKAR LAND" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0A0A0A]"></div>
        </div>

        <div className="container relative z-10 mx-auto px-6 md:px-12 text-center text-white mt-20">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto">
            <motion.div variants={fadeUp} className="inline-block px-4 py-1.5 mb-6 rounded-full border border-brand-primary/50 bg-brand-primary/10 backdrop-blur-sm text-brand-primary font-bold tracking-widest text-sm uppercase">
              Developer Properti Syariah Terpercaya
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-heading font-extrabold leading-tight mb-6">
              Wujudkan Hunian Impian <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-red-400">Tanpa Riba</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-xl md:text-2xl text-gray-300 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
              Kami membangun kawasan islami premium di Sulawesi dengan skema kepemilikan 100% syariah. Nyaman di dunia, tenang di akhirat.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/proyek" className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-accent hover:shadow-lg hover:shadow-brand-primary/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                Lihat Proyek Kami <FiArrowRight />
              </Link>
              <Link to="/kontak" className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300">
                Konsultasi Gratis
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          2. ABOUT US (Apa itu AFKAR LAND?)
          ========================================= */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
              <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-3">Tentang Kami</h2>
              <h3 className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 mb-6 leading-tight">
                Membangun Kehidupan, <br/>Bukan Sekadar Bangunan.
              </h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                <strong className="text-gray-900">AFKAR LAND</strong> adalah perusahaan pengembang properti (Developer) yang berfokus pada penyediaan hunian eksklusif dengan sistem kepemilikan 100% syariah di kawasan Sulawesi. 
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Kami hadir sebagai solusi bagi keluarga muslim yang mendambakan rumah berkualitas tinggi, lingkungan bertetangga yang islami, namun tetap memegang teguh syariat Islam dengan menghindari skema perbankan yang mengandung riba, denda, maupun sita.
              </p>
              <Link to="/tentang-kami" className="inline-flex items-center gap-2 text-brand-primary font-bold hover:gap-4 transition-all duration-300">
                Pelajari Sejarah Kami <FiArrowRight />
              </Link>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative z-10">
                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80" alt="Arsitektur Modern Afkar Land" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-3xl shadow-xl z-20 hidden md:block border border-gray-100">
                <div className="text-5xl font-heading font-extrabold text-brand-primary mb-1">100%</div>
                <div className="text-gray-600 font-medium uppercase tracking-wider text-sm">Murni Syariah</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================
          3. MENGAPA PROPERTI SYARIAH? (Edukasi)
          ========================================= */}
      <section className="py-24 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-3">Edukasi Sistem</h2>
            <h3 className="text-4xl font-heading font-extrabold text-gray-900 mb-6">Mengapa Harus Properti Syariah?</h3>
            <p className="text-lg text-gray-600">Skema syariah memberikan ketenangan batin karena transaksi dilakukan langsung antara developer dan pembeli, memutus rantai birokrasi yang merugikan.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <FiShield size={32} />, title: 'Tanpa Bank & BI Checking', desc: 'Tidak ada proses BI Checking yang rumit. Penilaian didasarkan pada kemampuan bayar Anda secara langsung.' },
              { icon: <FiHeart size={32} />, title: 'Tanpa Bunga (Riba)', desc: 'Harga cicilan tetap (flat) dari awal hingga lunas. Tidak terpengaruh oleh fluktuasi suku bunga bank.' },
              { icon: <FiHome size={32} />, title: 'Tanpa Denda & Sita', desc: 'Jika terlambat bayar, tidak ada denda finansial. Jika gagal bayar, unit tidak disita paksa, melainkan dicari solusi bersama.' }
            ].map((item, index) => (
              <motion.div key={index} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} transition={{ delay: index * 0.2 }} className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="w-16 h-16 bg-red-50 text-brand-primary rounded-2xl flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h4>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          4. VISI & MISI (Dark Section)
          ========================================= */}
      <section className="py-24 bg-[#0A0A0A] text-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="order-2 lg:order-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
                  <FiTarget className="text-brand-primary mb-4" size={32} />
                  <h4 className="text-xl font-bold mb-3">Visi Kami</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">Menjadi developer properti syariah terbesar dan terpercaya di Indonesia Timur yang melahirkan kawasan islami percontohan.</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm sm:translate-y-8">
                  <FiTrendingUp className="text-brand-primary mb-4" size={32} />
                  <h4 className="text-xl font-bold mb-3">Misi Kami</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">Menyediakan hunian berkualitas, mengedukasi masyarakat tentang bahaya riba, dan membangun komunitas tetangga yang saleh.</p>
                </div>
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="order-1 lg:order-2 lg:pl-12">
              <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-3">Arah Perusahaan</h2>
              <h3 className="text-4xl md:text-5xl font-heading font-extrabold mb-6 leading-tight">
                Membangun Peradaban dari Balik Pintu Rumah.
              </h3>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Kami percaya bahwa generasi yang hebat lahir dari rumah yang diberkahi. Oleh karena itu, AFKAR LAND tidak hanya membangun fisik rumah, tetapi juga ekosistem lingkungannya.
              </p>
              <ul className="space-y-4">
                {['Fasilitas Masjid Jami di setiap proyek', 'Rumah Tahfidz & Area Edukasi Anak', 'Lingkungan Hijau & Asri', 'Legalitas Aman (SHM & PBG)'].map((list, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <FiCheckCircle className="text-brand-primary" /> {list}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================
          5. MENGAPA MEMILIH AFKAR LAND?
          ========================================= */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-3">Keunggulan Utama</h2>
            <h3 className="text-4xl font-heading font-extrabold text-gray-900 mb-6">Kenapa Memilih AFKAR LAND?</h3>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: "01", title: "Lokasi Strategis", desc: "Proyek kami selalu berada di area sunrise property yang bernilai investasi tinggi." },
              { num: "02", title: "Material Premium", desc: "Spesifikasi bangunan menggunakan standar SNI dan material kelas atas." },
              { num: "03", title: "Desain Eksklusif", desc: "Fasad modern tropis yang tak lekang oleh waktu dengan sirkulasi udara optimal." },
              { num: "04", title: "Legalitas Jelas", desc: "Lahan sudah atas nama perusahaan, siap AJB dan pecah sertifikat." }
            ].map((item, index) => (
              <motion.div key={index} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} transition={{ delay: index * 0.1 }} className="text-left group cursor-pointer">
                <div className="text-5xl font-heading font-extrabold text-gray-100 group-hover:text-red-100 transition-colors duration-300 mb-4">{item.num}</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-primary transition-colors">{item.title}</h4>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          6. CALL TO ACTION (CTA)
          ========================================= */}
      <section className="py-20 bg-brand-primary">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-6">
              Siap Memiliki Hunian Penuh Berkah?
            </h2>
            <p className="text-xl text-red-100 mb-10 max-w-2xl mx-auto">
              Hubungi tim marketing kami sekarang untuk mendapatkan pricelist terbaru dan jadwalkan survei lokasi akhir pekan ini.
            </p>
            <Link to="/kontak" className="inline-flex items-center gap-2 bg-white text-brand-primary px-8 py-4 rounded-xl font-bold hover:bg-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              Hubungi Kami Sekarang <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}