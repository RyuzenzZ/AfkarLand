import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi';

export default function Blog() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // Data dummy artikel (Nantinya diganti fetch dari Firestore)
  const articles = [
    { 
      slug: 'keunggulan-properti-syariah-2026', 
      title: 'Keunggulan Memilih Properti Syariah di Tahun 2026', 
      excerpt: 'Mengetahui lebih dalam mengapa sistem syariah tanpa riba semakin diminati oleh keluarga muda di Sulawesi.', 
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80', 
      date: '14 Mei 2026', 
      author: 'Tim Redaksi' 
    },
    { 
      slug: 'tips-menabung-beli-rumah', 
      title: 'Tips Cerdas Menabung untuk Membeli Rumah Tanpa KPR Bank', 
      excerpt: 'Langkah praktis mengelola keuangan keluarga agar impian memiliki rumah cash bertahap bisa terwujud.', 
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80', 
      date: '10 Mei 2026', 
      author: 'Nia Kartika' 
    },
    { 
      slug: 'perkembangan-properti-makassar', 
      title: 'Mengapa Makassar Adalah Lokasi Investasi Properti Terbaik', 
      excerpt: 'Analisis perkembangan infrastruktur kota Makassar dan sekitarnya yang mendongkrak nilai properti.', 
      image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80', 
      date: '02 Mei 2026', 
      author: 'Damar Mahendra' 
    }
  ];

  return (
    <div className="w-full bg-gray-50 pb-24">
      <section className="pt-32 pb-20 bg-[#0A0A0A] text-white">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-heading font-extrabold mb-6">
            Artikel & <span className="text-brand-primary">Edukasi</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Informasi terkini seputar properti syariah, investasi, dan tips hunian islami.
          </motion.p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, idx) => (
              <motion.div 
                key={article.slug}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-gray-200">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-8 flex flex-col grow">
                  <div className="flex items-center gap-4 text-xs text-gray-500 font-bold tracking-wider uppercase mb-4">
                    <span className="flex items-center gap-1.5"><FiCalendar /> {article.date}</span>
                    <span className="flex items-center gap-1.5"><FiUser /> {article.author}</span>
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-brand-primary transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 mb-6 line-clamp-3 grow">{article.excerpt}</p>
                  <Link to={`/artikel/${article.slug}`} className="text-brand-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
                    Baca Selengkapnya <FiArrowRight />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}