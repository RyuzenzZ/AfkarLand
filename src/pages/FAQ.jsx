// FAQ.jsx — Halaman Tanya Jawab AFKAR LAND
// ─────────────────────────────────────────────────────────────────────────────
// ✅ Dark theme selaras dengan About.jsx
// ✅ FAQ dikategorikan, data dari Firestore via useSiteSettings
// ✅ Fallback: data lengkap terstruktur dari dokumen FAQ resmi

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiPlus, FiMinus, FiArrowRight, FiMessageSquare } from 'react-icons/fi';
import { useSiteSettings } from '../hooks/useSiteSettings';

// ── Animasi ──────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// ── Fallback FAQ Terstruktur (kategori) ───────────────────────────────────────
const FALLBACK_KATEGORIS = [
  {
    id: 'tentang',
    label: 'Tentang Afkar Land',
    emoji: '🏢',
    faqs: [
      {
        pertanyaan: 'Apa itu Afkar Land?',
        jawaban: 'Afkar Land adalah developer property berbasis syariah yang menghadirkan hunian dengan konsep transaksi halal, aman, dan nyaman — tanpa riba, tanpa sita, dan tanpa denda.',
      },
      {
        pertanyaan: 'Di mana lokasi project Afkar Land?',
        jawaban: 'Saat ini project Afkar Land berada di lokasi strategis yang dekat dengan akses utama, fasilitas umum, dan kawasan berkembang di Sulawesi Selatan.',
      },
      {
        pertanyaan: 'Apa keunggulan membeli property di Afkar Land?',
        jawaban: 'Tanpa riba, tanpa bank, tanpa BI Checking, tanpa sita, tanpa denda keterlambatan, proses lebih mudah, dan lingkungan islami yang nyaman.',
      },
      {
        pertanyaan: 'Apa visi Afkar Land?',
        jawaban: 'Membangun hunian berkah yang membantu masyarakat memiliki rumah dengan cara yang sesuai prinsip syariah.',
      },
    ],
  },
  {
    id: 'syariah',
    label: 'Property Syariah',
    emoji: '☪️',
    faqs: [
      {
        pertanyaan: 'Apa itu property syariah?',
        jawaban: 'Property syariah adalah sistem jual beli property yang menggunakan prinsip Islam dalam akad dan transaksinya — tanpa bunga, tanpa denda, dan tanpa unsur yang merugikan.',
      },
      {
        pertanyaan: 'Apa bedanya property syariah dan konvensional?',
        jawaban: 'Property syariah: tanpa bunga, tanpa bank, akad jelas, tanpa denda, tanpa sita. Property konvensional: menggunakan bunga, melibatkan bank, banyak biaya tambahan, ada denda dan risiko sita.',
      },
      {
        pertanyaan: 'Apakah property syariah aman?',
        jawaban: 'Ya, selama developer memiliki legalitas jelas, akad transparan, dan proses transaksi sesuai aturan. Afkar Land memenuhi semua kriteria tersebut.',
      },
      {
        pertanyaan: 'Kenapa banyak orang memilih property syariah?',
        jawaban: 'Karena lebih tenang secara finansial dan sesuai prinsip Islam, terutama bagi yang ingin menghindari riba.',
      },
    ],
  },
  {
    id: 'pembayaran',
    label: 'Skema Pembayaran',
    emoji: '💳',
    faqs: [
      {
        pertanyaan: 'Bagaimana skema pembayaran di Afkar Land?',
        jawaban: 'Umumnya menggunakan: Booking Fee → DP (Down Payment) → Cicilan langsung ke developer sesuai akad yang disepakati.',
      },
      {
        pertanyaan: 'Apakah ada bunga?',
        jawaban: 'Tidak ada bunga sama sekali. Seluruh transaksi dilakukan murni antara konsumen dan developer tanpa melibatkan bank.',
      },
      {
        pertanyaan: 'Apakah cicilan tetap?',
        jawaban: 'Ya, nominal cicilan tetap sampai lunas sesuai akad awal. Tidak ada kenaikan cicilan di tengah jalan.',
      },
      {
        pertanyaan: 'Kalau telat bayar bagaimana?',
        jawaban: 'Tidak ada denda keterlambatan. Biasanya akan dilakukan komunikasi dan musyawarah terlebih dahulu untuk mencari solusi terbaik.',
      },
      {
        pertanyaan: 'Apakah ada BI Checking?',
        jawaban: 'Tidak ada BI Checking. Karena tidak menggunakan fasilitas perbankan konvensional, riwayat kredit Anda tidak mempengaruhi persetujuan.',
      },
    ],
  },
  {
    id: 'legalitas',
    label: 'Legalitas & Keamanan',
    emoji: '🔒',
    faqs: [
      {
        pertanyaan: 'Apakah legalitas tanah aman?',
        jawaban: 'Ya, setiap project memiliki legalitas yang jelas (SHM/SHGB) dan dapat dicek langsung oleh calon pembeli.',
      },
      {
        pertanyaan: 'Apakah rumah bisa disita?',
        jawaban: 'Tidak. Tidak ada sistem sita seperti di perbankan konvensional. Jika ada kendala pembayaran, diselesaikan melalui musyawarah.',
      },
      {
        pertanyaan: 'Bagaimana proses akad?',
        jawaban: 'Akad dilakukan secara transparan dengan penjelasan detail mengenai harga, tenor, dan kewajiban kedua pihak. Tidak ada biaya tersembunyi.',
      },
      {
        pertanyaan: 'Apakah bisa survei lokasi?',
        jawaban: 'Tentu bisa. Konsumen dianjurkan survei langsung agar lebih yakin sebelum membeli. Tim kami siap menemani.',
      },
    ],
  },
  {
    id: 'investasi',
    label: 'Investasi & Umum',
    emoji: '📈',
    faqs: [
      {
        pertanyaan: 'Apakah cocok untuk investasi?',
        jawaban: 'Ya, karena property cenderung naik setiap tahun dan kebutuhan hunian terus meningkat, terutama di wilayah Sulawesi yang sedang berkembang pesat.',
      },
      {
        pertanyaan: 'Siapa saja yang cocok membeli property syariah?',
        jawaban: 'Cocok untuk karyawan, pengusaha, freelancer, pasangan muda, investor, maupun orang tua yang ingin rumah halal untuk keluarga.',
      },
      {
        pertanyaan: 'Apakah bisa untuk rumah pertama?',
        jawaban: 'Sangat cocok, terutama bagi yang ingin memulai memiliki rumah tanpa sistem riba.',
      },
    ],
  },
  {
    id: 'booking',
    label: 'Promo & Booking',
    emoji: '🎁',
    faqs: [
      {
        pertanyaan: 'Apakah bisa booking dulu?',
        jawaban: 'Bisa. Biasanya cukup dengan booking fee untuk mengamankan unit. Hubungi tim marketing kami untuk informasi lebih lanjut.',
      },
      {
        pertanyaan: 'Apakah ada promo?',
        jawaban: 'Promo mengikuti periode tertentu seperti diskon DP, free biaya tertentu, bonus furniture, atau cashback. Pantau terus info resmi kami.',
      },
      {
        pertanyaan: 'Bagaimana cara konsultasi?',
        jawaban: 'Bisa langsung menghubungi tim marketing resmi Afkar Land untuk konsultasi, survei lokasi, dan simulasi pembayaran via WhatsApp.',
      },
      {
        pertanyaan: 'Kenapa harus beli sekarang?',
        jawaban: 'Karena harga property cenderung naik terus sementara lahan semakin terbatas. Semakin cepat, semakin baik harganya.',
      },
    ],
  },
];

// ── Helper: kelompokkan flat FAQ dari Firestore ke kategori ──────────────────
// Kalau data Firestore punya field `kategori`, dikelompokkan otomatis.
// Kalau tidak, semua masuk satu kelompok "Pertanyaan Umum".
function groupFaqs(faqs) {
  const hasKategori = faqs.some(f => f.kategori);
  if (!hasKategori) {
    return [{ id: 'umum', label: 'Pertanyaan Umum', emoji: '💬', faqs }];
  }
  const map = {};
  faqs.forEach(f => {
    const k = f.kategori || 'Lainnya';
    if (!map[k]) map[k] = { id: k.toLowerCase().replace(/\s+/g, '-'), label: k, emoji: '💬', faqs: [] };
    map[k].faqs.push(f);
  });
  return Object.values(map);
}

// ─────────────────────────────────────────────────────────────────────────────
export default function FAQ() {
  const { settings, loading } = useSiteSettings();

  const pageHero    = settings.pages?.faq || {};
  const firestoreFaq = settings.faq && settings.faq.length > 0 ? settings.faq : null;
  const kategoris   = firestoreFaq ? groupFaqs(firestoreFaq) : FALLBACK_KATEGORIS;

  const [activeKategori, setActiveKategori] = useState(kategoris[0]?.id || 'tentang');
  const [activeIndex,    setActiveIndex]    = useState(null);

  const currentFaqs = kategoris.find(k => k.id === activeKategori)?.faqs || [];

  const handleKategori = (id) => {
    setActiveKategori(id);
    setActiveIndex(null);
  };

  const waNumber = settings.contact?.waNumber || '6285705218281';

  return (
    <div className="w-full bg-[#080808] font-body text-white overflow-hidden">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative pt-36 pb-24 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-900/5 rounded-full blur-3xl pointer-events-none" />

        {/* Hero image overlay */}
        {pageHero.heroImage && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${pageHero.heroImage})` }}
            />
            <div className="absolute inset-0 bg-[#080808]/80" />
          </>
        )}

        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger}>

            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-block px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 font-bold tracking-widest text-xs uppercase">
                Pusat Informasi
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold mb-6 leading-tight tracking-tight"
            >
              {pageHero.heroTitle ? (
                pageHero.heroTitle
              ) : (
                <>Tanya <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-300">Jawab</span></>
              )}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed"
            >
              {pageHero.heroSubtitle || 'Temukan jawaban atas pertanyaan yang paling sering diajukan mengenai properti syariah kami.'}
            </motion.p>

          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FAQ — KATEGORI + ACCORDION
      ══════════════════════════════════════════ */}
      <section className="py-8 pb-28">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">

            {/* ── Sidebar Kategori ─────────────────────────────────────────── */}
            <aside className="lg:w-64 shrink-0">
              {loading ? (
                <div className="space-y-2">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial="hidden" animate="visible" variants={stagger}
                  className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0"
                >
                  {kategoris.map((kat) => (
                    <motion.button
                      key={kat.id}
                      variants={fadeUp}
                      onClick={() => handleKategori(kat.id)}
                      className={`shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 w-full
                        ${activeKategori === kat.id
                          ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                          : 'bg-white/4 border border-white/6 text-gray-400 hover:bg-white/8 hover:text-white'
                        }`}
                    >
                      <span className="text-lg shrink-0">{kat.emoji}</span>
                      <span className="font-bold text-sm leading-tight">{kat.label}</span>
                      <span className={`ml-auto text-xs font-extrabold shrink-0 ${activeKategori === kat.id ? 'text-white/70' : 'text-white/25'}`}>
                        {kat.faqs.length}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </aside>

            {/* ── Accordion FAQ ─────────────────────────────────────────────── */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="space-y-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-16 bg-white/5 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeKategori}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    {/* Heading kategori aktif */}
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-2xl">
                        {kategoris.find(k => k.id === activeKategori)?.emoji}
                      </span>
                      <h2 className="text-xl font-heading font-extrabold text-white">
                        {kategoris.find(k => k.id === activeKategori)?.label}
                      </h2>
                      <div className="flex-1 h-px bg-white/6" />
                    </div>

                    {currentFaqs.map((faq, index) => (
                      <div
                        key={index}
                        className={`rounded-2xl overflow-hidden border transition-all duration-300
                          ${activeIndex === index
                            ? 'border-red-500/30 bg-[#1a0a0a]'
                            : 'border-white/6 bg-[#111] hover:border-white/12'
                          }`}
                      >
                        <button
                          onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                          className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                        >
                          <span className={`font-bold text-base leading-snug pr-4 ${activeIndex === index ? 'text-white' : 'text-white/75'}`}>
                            {faq.pertanyaan || faq.q}
                          </span>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0
                            ${activeIndex === index
                              ? 'bg-red-600 text-white'
                              : 'bg-white/5 border border-white/10 text-gray-400'
                            }`}>
                            {activeIndex === index ? <FiMinus size={14}/> : <FiPlus size={14}/>}
                          </div>
                        </button>

                        <AnimatePresence>
                          {activeIndex === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-6 pt-1 text-gray-400 leading-relaxed text-sm border-t border-white/5">
                                {faq.jawaban || faq.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA — MASIH ADA PERTANYAAN?
      ══════════════════════════════════════════ */}
      <section className="py-24 border-t border-white/5 bg-[#080808]">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-red-900 via-red-800 to-[#0A0A0A] rounded-3xl p-12 md:p-20 text-center overflow-hidden border border-red-500/30 shadow-2xl shadow-red-900/20"
          >
            {/* Tekstur grid */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
            <div className="relative z-10">
              <FiMessageSquare className="text-red-300/40 w-12 h-12 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white mb-4">
                Masih Ada Pertanyaan?
              </h2>
              <p className="text-red-100/80 mb-10 max-w-xl mx-auto font-light leading-relaxed">
                Tim konsultan kami siap membantu Anda — mulai dari simulasi pembayaran, survei lokasi, hingga proses akad.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Assalamu\'alaikum 👋\n\nSaya ingin bertanya lebih lanjut mengenai property syariah Afkar Land.\n\nMohon bantuannya, terima kasih 🙏')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-red-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all hover:-translate-y-1 shadow-xl shadow-black/20"
                >
                  Hubungi via WhatsApp <FiArrowRight size={18} />
                </a>
                <Link
                  to="/kontak"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent border border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all"
                >
                  Ke Halaman Kontak
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}