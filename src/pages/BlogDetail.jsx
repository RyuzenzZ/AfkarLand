import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiUser, FiArrowLeft } from 'react-icons/fi';

export default function BlogDetail() {
  const { slug } = useParams();
  
  // Data statis untuk pratinjau
  const article = {
    title: 'Keunggulan Memilih Properti Syariah di Tahun 2026',
    date: '14 Mei 2026',
    author: 'Tim Redaksi',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80',
    content: `
      <p>Membeli rumah adalah salah satu keputusan finansial terbesar dalam hidup. Saat ini, skema pembiayaan properti syariah semakin menjadi primadona, terutama bagi milenial dan keluarga muda di Sulawesi.</p>
      <br/>
      <h3>Mengapa Tanpa Bank?</h3>
      <p>Skema properti syariah (Developer Properti Syariah) berarti transaksi dilakukan langsung antara pembeli dan developer. Hal ini memotong rantai birokrasi perbankan yang rumit, sehingga proses persetujuan (BI Checking) tidak diperlukan. Konsumen yang memiliki riwayat BI Checking kurang baik tetap berkesempatan memiliki rumah asalkan memiliki kemampuan bayar yang jelas.</p>
      <br/>
      <h3>Ketenangan Tanpa Riba dan Denda</h3>
      <p>Sistem konvensional seringkali membebankan denda yang besar jika terjadi keterlambatan pembayaran. Dalam skema syariah, denda dihilangkan karena dianggap sebagai riba. Selain itu, jika pembeli mengalami kesulitan ekonomi (gagal bayar), properti tidak akan langsung disita secara sepihak.</p>
    `
  };

  return (
    <div className="w-full bg-white pb-24">
      <section className="pt-32 pb-16 bg-[#0A0A0A] text-white">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <Link to="/artikel" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors">
            <FiArrowLeft /> Kembali ke Daftar Artikel
          </Link>
          <div className="flex items-center gap-4 text-brand-primary font-bold tracking-wider uppercase text-sm mb-4">
            <span className="flex items-center gap-1.5"><FiCalendar /> {article.date}</span>
            <span className="flex items-center gap-1.5"><FiUser /> {article.author}</span>
          </div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-heading font-extrabold leading-tight">
            {article.title}
          </motion.h1>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full aspect-video rounded-3xl overflow-hidden mb-12 shadow-xl">
            <img src={article.image} alt="Cover" className="w-full h-full object-cover" />
          </motion.div>
          
          {/* Prose class digunakan untuk merapikan tag HTML bawaan dari rich text editor nantinya */}
          <div 
            className="prose prose-lg prose-red max-w-none text-gray-700 font-body leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />
        </div>
      </section>
    </div>
  );
}