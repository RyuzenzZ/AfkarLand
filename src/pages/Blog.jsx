import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCalendar, FiArrowRight, FiSearch, FiTag } from 'react-icons/fi';
import { useArticles, formatArticleDate } from '../hooks/useArticles';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

function SkeletonCard() {
  return (
    <div className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-white/5" />
      <div className="p-8 space-y-4">
        <div className="h-3 bg-white/5 rounded w-1/3" />
        <div className="h-5 bg-white/5 rounded w-full" />
        <div className="h-5 bg-white/5 rounded w-4/5" />
        <div className="h-4 bg-white/5 rounded w-1/4 mt-6" />
      </div>
    </div>
  );
}

export default function Blog() {
  const { articles, loading, error } = useArticles();
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery]       = useState('');

  // Kategori dinamis dari artikel yang ada di Firestore
  const CATEGORIES = useMemo(() => {
    const cats = [...new Set(articles.map(a => a.kategori).filter(Boolean))];
    return ['Semua', ...cats];
  }, [articles]);

  // Featured = artikel pertama (urutan dari Firestore sudah terbaru dulu)
  const featuredArticle = useMemo(() => articles[0] || null, [articles]);

  // Grid artikel — saat filter default, keluarkan featured agar tidak duplikat
  const gridArticles = useMemo(() => {
    const filtered = articles.filter(a => {
      const matchCat    = activeCategory === 'Semua' || a.kategori === activeCategory;
      const matchSearch = a.judul?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
    if (activeCategory === 'Semua' && searchQuery === '') {
      return filtered.filter(a => a.id !== featuredArticle?.id);
    }
    return filtered;
  }, [articles, activeCategory, searchQuery, featuredArticle]);

  return (
    <div className="w-full bg-[#080808] min-h-screen text-white font-body pb-24 overflow-hidden">

      {/* ── HERO ── */}
      <section className="pt-32 pb-16 relative">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 font-bold tracking-widest text-xs uppercase mb-6">
              Artikel & Informasi
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold mb-6 leading-tight">
              Insight, Edukasi & <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-300">Update Proyek</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg leading-relaxed">
              Temukan informasi terbaru seputar property syariah, perkembangan proyek, edukasi investasi, dan perjalanan AFKAR LAND dalam membangun hunian islami yang amanah.
            </motion.p>
          </div>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-4xl mx-auto">
            <div className="relative mb-8">
              <FiSearch className="absolute left-5 top-4 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Cari artikel, panduan, atau update proyek..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors shadow-lg"
              />
            </div>

            {/* Tabs kategori */}
            {!loading && (
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border ${
                      activeCategory === cat
                        ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-900/20'
                        : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED ARTICLE ── */}
      {!loading && featuredArticle && activeCategory === 'Semua' && searchQuery === '' && (
        <section className="py-12 relative z-10">
          <div className="container mx-auto px-6 md:px-12">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}
              className="bg-[#111] border border-white/10 rounded-[2.5rem] p-4 md:p-6 shadow-2xl hover:border-red-500/30 transition-colors group">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="relative aspect-video lg:aspect-square overflow-hidden rounded-[2rem]">
                  {/* ✅ field: thumbnail (bukan image) */}
                  {featuredArticle.thumbnail ? (
                    <img src={featuredArticle.thumbnail} alt="Featured"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center text-gray-600">No Image</div>
                  )}
                  <div className="absolute top-6 left-6">
                    <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                      {featuredArticle.kategori}
                    </span>
                  </div>
                </div>
                <div className="p-4 md:p-8 lg:p-12 lg:pl-0 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-xs text-gray-500 font-bold uppercase tracking-wider mb-6">
                    <span className="flex items-center gap-1.5"><FiCalendar /> {formatArticleDate(featuredArticle.createdAt)}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-white mb-6 leading-tight group-hover:text-red-400 transition-colors">
                    {featuredArticle.judul}
                  </h2>
                  {/* Pratinjau konten — potong 150 karakter pertama */}
                  {featuredArticle.konten && (
                    <p className="text-gray-400 text-lg leading-relaxed mb-10 line-clamp-3">
                      {featuredArticle.konten.slice(0, 150)}...
                    </p>
                  )}
                  <div>
                    <Link to={`/artikel/${featuredArticle.slug}`}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                      Baca Selengkapnya <FiArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── GRID ARTIKEL ── */}
      <section className="py-12 relative z-10">
        <div className="container mx-auto px-6 md:px-12">

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-20 bg-[#111] border border-red-500/20 rounded-3xl">
              <p className="text-red-400 font-bold">Gagal memuat artikel. Periksa koneksi internet Anda.</p>
            </div>
          )}

          {!loading && !error && gridArticles.length === 0 && (
            <div className="text-center py-20 bg-[#111] border border-white/5 rounded-3xl">
              <FiSearch className="mx-auto text-gray-600 mb-4" size={48} />
              <h3 className="text-xl font-bold text-gray-400">Artikel tidak ditemukan</h3>
              <p className="text-gray-500 mt-2">Coba gunakan kata kunci atau kategori lain.</p>
            </div>
          )}

          {!loading && !error && gridArticles.length > 0 && (
            <motion.div initial="hidden" animate="visible" variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridArticles.map((article, idx) => (
                <motion.div key={article.id || idx} variants={fadeUp}
                  className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-lg hover:border-red-500/40 hover:shadow-red-900/10 transition-all duration-300 group flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {/* ✅ field: thumbnail (bukan image) */}
                    {article.thumbnail ? (
                      <img src={article.thumbnail} alt={article.judul}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-white/5" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-80" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        <FiTag className="inline mr-1 mb-0.5" />{article.kategori}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-1 bg-[#111]">
                    <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">
                      <span className="flex items-center gap-1.5"><FiCalendar size={12} /> {formatArticleDate(article.createdAt)}</span>
                    </div>
                    <h3 className="text-xl font-heading font-bold text-white mb-6 line-clamp-3 leading-snug group-hover:text-red-400 transition-colors flex-1">
                      {article.judul}
                    </h3>
                    <div className="pt-6 border-t border-white/5 mt-auto">
                      <Link to={`/artikel/${article.slug}`}
                        className="inline-flex items-center gap-2 text-sm text-red-500 font-bold hover:text-white transition-colors">
                        Baca Artikel <FiArrowRight />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

    </div>
  );
}