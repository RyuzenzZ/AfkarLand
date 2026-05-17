import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { FiCalendar, FiArrowLeft, FiShare2, FiArrowRight } from 'react-icons/fi';
import { useArticleBySlug, useArticles, formatArticleDate } from '../hooks/useArticles';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

function ArticleSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-white/5 rounded w-20 mb-10" />
      <div className="flex gap-4 mb-6">
        <div className="h-5 bg-white/5 rounded w-24" />
        <div className="h-5 bg-white/5 rounded w-40" />
      </div>
      <div className="h-12 bg-white/5 rounded w-full mb-4" />
      <div className="h-12 bg-white/5 rounded w-3/4 mb-12" />
      <div className="aspect-video bg-white/5 rounded-[2rem] mb-12" />
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-4 bg-white/5 rounded" style={{ width: `${75 + (i % 3) * 10}%` }} />
        ))}
      </div>
    </div>
  );
}

export default function BlogDetail() {
  const { slug } = useParams();

  // ── Artikel yang sedang dibuka (by slug) ───────────────────────────────
  const { article, loading, error } = useArticleBySlug(slug);

  // ── Artikel lain untuk section "Berita Terbaru" ────────────────────────
  const { articles: allArticles } = useArticles();
  const relatedArticles = allArticles.filter(a => a.slug !== slug).slice(0, 3);

  // ── Progress bar ───────────────────────────────────────────────────────
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: article?.judul, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="w-full bg-[#080808] font-body text-white min-h-screen relative pb-24">

      {/* Reading Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-red-600 z-[100] origin-left" style={{ scaleX }} />

      {/* ── A. HEADER ── */}
      <section className="pt-32 pb-10">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <Link to="/artikel" className="inline-flex items-center gap-2 text-gray-500 hover:text-red-500 mb-10 transition-colors text-sm font-bold uppercase tracking-widest">
            <FiArrowLeft /> Kembali
          </Link>

          {loading && <ArticleSkeleton />}

          {error && !loading && (
            <div className="text-center py-20 bg-[#111] border border-red-500/20 rounded-3xl">
              <p className="text-red-400 font-bold">Gagal memuat artikel. Periksa koneksi internet Anda.</p>
            </div>
          )}

          {!loading && !error && !article && (
            <motion.div initial="hidden" animate="visible" variants={fadeUp}
              className="text-center py-20 bg-[#111] border border-white/10 rounded-3xl">
              <h3 className="text-2xl font-bold text-white mb-4">Artikel Tidak Ditemukan</h3>
              <p className="text-gray-400 mb-8">
                Artikel <strong className="text-white">{slug?.split('-').join(' ')}</strong> belum tersedia atau sedang diperbarui.
              </p>
              <Link to="/artikel"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors">
                <FiArrowLeft /> Kembali ke Artikel
              </Link>
            </motion.div>
          )}

          {!loading && !error && article && (
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                  {article.kategori}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  <FiCalendar /> {formatArticleDate(article.createdAt)}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-extrabold leading-[1.1] mb-8 text-white">
                {article.judul}
              </h1>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── B. HERO IMAGE ── */}
      {/* ✅ field: thumbnail (bukan image) */}
      {!loading && article?.thumbnail && (
        <section className="pb-16">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
              <img src={article.thumbnail} alt={article.judul} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80" />
            </motion.div>
          </div>
        </section>
      )}

      {/* ── C. KONTEN ARTIKEL ── */}
      {!loading && article && (
        <section className="pb-20">
          <div className="container mx-auto px-6 md:px-12 max-w-4xl flex flex-col lg:flex-row gap-12 relative">

            {/* Sticky Share */}
            <div className="hidden lg:block w-16 shrink-0 relative">
              <div className="sticky top-32 flex flex-col gap-4 items-center">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-2 rotate-180"
                  style={{ writingMode: 'vertical-rl' }}>Bagikan</span>
                <div className="w-[1px] h-10 bg-white/10 mb-2" />
                <button onClick={handleShare} title="Salin link artikel"
                  className="w-10 h-10 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 transition-all">
                  <FiShare2 size={16} />
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/*
                ✅ Konten disimpan sebagai plain text (textarea) di ManageArticles.
                Dirender dengan whitespace-pre-wrap agar line break dari textarea terjaga.
                Jika di masa depan ManageArticles diupgrade ke rich text editor (HTML),
                ganti ke: dangerouslySetInnerHTML={{ __html: article.konten }}
              */}
              <div className="prose prose-invert prose-lg max-w-none
                prose-headings:font-heading prose-headings:font-bold prose-headings:text-white
                prose-p:text-gray-300 prose-p:leading-relaxed
                prose-a:text-red-500 hover:prose-a:text-red-400
                prose-strong:text-white">
                <p className="whitespace-pre-wrap text-gray-300 leading-relaxed text-lg font-light">
                  {article.konten || ''}
                </p>
              </div>

              {/* CTA Penutup */}
              <div className="mt-16 p-10 bg-gradient-to-br from-red-900/40 to-[#111] border border-red-500/20 rounded-3xl text-center shadow-2xl">
                <h3 className="text-2xl font-heading font-bold text-white mb-3">Ingin Menjadi Bagian dari Kawasan Islami Kami?</h3>
                <p className="text-gray-400 mb-8 max-w-lg mx-auto">Konsultasikan properti impian Anda secara gratis dan dapatkan pricelist terbaru dari tim ahli kami.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a href="https://wa.me/6285705218281" target="_blank" rel="noopener noreferrer"
                    className="w-full sm:w-auto px-8 py-3.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg">
                    Konsultasi Sekarang
                  </a>
                  <Link to="/proyek"
                    className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
                    Lihat Semua Proyek
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── D. BERITA TERBARU ── */}
      {!loading && relatedArticles.length > 0 && (
        <section className="py-16 border-t border-white/5 bg-[#0a0a0a]">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-2xl font-heading font-bold text-white">Berita & Update Terbaru</h2>
              <Link to="/artikel" className="text-sm font-bold text-red-500 hover:text-white transition-colors">Lihat Semua</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((news, idx) => (
                <Link key={news.id || idx} to={`/artikel/${news.slug}`}
                  className="bg-[#111] p-6 rounded-2xl border border-white/5 hover:border-red-500/30 transition-all group flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3 block">
                      {formatArticleDate(news.createdAt)}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors leading-snug mb-4">
                      {news.judul}
                    </h3>
                  </div>
                  <span className="text-xs text-red-500 font-bold flex items-center gap-2 mt-auto group-hover:gap-3 transition-all">
                    Baca <FiArrowRight />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}