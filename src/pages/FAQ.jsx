import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiCheckCircle,
  FiMessageCircle,
  FiMinus,
  FiPlus,
  FiSearch,
} from 'react-icons/fi';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { trackCtaClick, trackWhatsappClick } from '../lib/analytics';

const FAQ_ITEMS = [
  {
    question: 'Apa itu property syariah?',
    answer:
      'Property syariah adalah sistem kepemilikan properti yang dijalankan berdasarkan prinsip syariat Islam, dengan transaksi yang menghindari riba, gharar, dan akad yang tidak jelas. Umumnya menggunakan akad langsung antara developer dan pembeli tanpa bank konvensional.',
    source: 'Ausen Property Syariah',
  },
  {
    question: 'Apa bedanya property syariah dengan KPR konvensional?',
    answer:
      'Perbedaan utamanya ada pada sistem transaksi dan akad. Pada property syariah, transaksi dilakukan dengan akad syariah dan biasanya tanpa bunga bank. Sedangkan KPR konvensional menggunakan sistem pinjaman berbunga dari bank.',
    source: 'Ausen Property Syariah',
  },
  {
    question: 'Apakah AFKAR LAND merupakan developer property syariah?',
    answer:
      'Ya, AFKAR LAND merupakan perusahaan pengembang property syariah yang menghadirkan hunian modern dengan konsep Islami, nyaman, dan berorientasi pada nilai keberkahan dalam transaksi maupun lingkungan hunian.',
  },
  {
    question: 'Apa konsep yang diusung AFKAR LAND?',
    answer:
      'AFKAR LAND mengusung konsep Modern Islamic Living, yaitu hunian modern yang dipadukan dengan lingkungan nyaman, privasi keluarga, nilai Islami, serta lokasi strategis untuk aktivitas sehari-hari.',
  },
  {
    question: 'Apakah membeli rumah di AFKAR LAND harus melalui bank?',
    answer:
      'Tidak harus. Konsep property syariah umumnya memungkinkan transaksi langsung antara pembeli dan developer tanpa melibatkan bank konvensional.',
    source: 'Ausen Property Syariah',
  },
  {
    question: 'Apakah cicilan di property syariah berubah-ubah?',
    answer:
      'Biasanya tidak. Dalam banyak skema property syariah, nominal cicilan disepakati di awal akad sehingga lebih jelas dan transparan bagi pembeli.',
  },
  {
    question: 'Apa kelebihan membeli rumah di developer property syariah?',
    answer: 'Beberapa kelebihan yang biasanya dicari pembeli rumah syariah antara lain:',
    points: [
      'Transaksi lebih transparan',
      'Menghindari riba',
      'Akad lebih jelas',
      'Skema pembayaran lebih tenang',
      'Lingkungan hunian cenderung lebih Islami dan nyaman',
    ],
    source: 'Rumah Halal Indonesia',
  },
  {
    question: 'Apakah property syariah aman?',
    answer:
      'Aman selama memilih developer yang memiliki legalitas jelas, track record yang baik, dan akad yang transparan. Konsumen tetap perlu memeriksa legalitas proyek dan reputasi developer sebelum membeli.',
    source: 'Royal Orchid Syariah',
  },
  {
    question: 'Legalitas apa saja yang perlu dicek sebelum membeli rumah?',
    answer: 'Beberapa legalitas penting yang perlu diperhatikan sebelum membeli rumah adalah:',
    points: [
      'Sertifikat tanah',
      'PBG atau izin bangunan',
      'Status lahan',
      'Akad jual beli',
      'Reputasi developer',
    ],
    source: 'Rumah Halal Indonesia',
  },
  {
    question: 'Apakah property syariah cocok untuk investasi?',
    answer:
      'Ya. Property syariah banyak diminati karena kebutuhan hunian terus meningkat dan konsep hunian Islami semakin berkembang di Indonesia.',
    source: 'Royal Orchid Syariah',
  },
  {
    question: 'Siapa target hunian AFKAR LAND?',
    answer:
      'AFKAR LAND menghadirkan hunian untuk keluarga modern yang menginginkan rumah nyaman, strategis, bernilai investasi, dan tetap sesuai prinsip syariah.',
  },
  {
    question: 'Apakah AFKAR LAND hanya fokus pada jual rumah?',
    answer:
      'Tidak. Selain membangun hunian, AFKAR LAND juga berfokus membangun kawasan dengan konsep lingkungan yang nyaman, tertata, dan memiliki value jangka panjang.',
  },
  {
    question: 'Mengapa banyak orang mulai memilih property syariah?',
    answer:
      'Karena masyarakat mulai mencari sistem kepemilikan rumah yang lebih transparan, nyaman, dan sesuai prinsip Islam, terutama terkait transaksi tanpa riba.',
    source: 'Royal Orchid Syariah',
  },
  {
    question: 'Apa yang membuat AFKAR LAND berbeda?',
    answer:
      'AFKAR LAND berfokus pada pengembangan hunian modern Islami dengan konsep eksklusif, lokasi strategis, desain nyaman, dan pendekatan yang lebih dekat dengan kebutuhan keluarga masa kini.',
  },
  {
    question: 'Bagaimana cara mendapatkan informasi project terbaru AFKAR LAND?',
    answer:
      'Anda bisa mengikuti media sosial resmi atau menghubungi tim marketing AFKAR LAND untuk mendapatkan update project terbaru, promo, progress pembangunan, dan informasi launching kawasan terbaru.',
  },
];

const SOURCES = [
  {
    label: 'Ausen Property Syariah',
    url: 'https://ausenproperty.com/faq-frequently-asked-questions/',
  },
  {
    label: 'Rumah Halal Indonesia',
    url: 'https://rumahhalal.co.id/',
  },
  {
    label: 'Royal Orchid Syariah',
    url: 'https://royalorchidsyariah.com/property-syariah/',
  },
  {
    label: 'Diskusi publik pembiayaan syariah',
    url: 'https://www.reddit.com/r/finansial/comments/13570j0',
  },
];

function normalize(text) {
  return String(text || '').toLowerCase();
}

function AnswerContent({ faq }) {
  return (
    <div className="space-y-4 text-sm leading-7 text-white/70 md:text-[15px]">
      <p>{faq.answer}</p>
      {faq.points?.length ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {faq.points.map((point) => (
            <li
              key={point}
              className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3"
            >
              <FiCheckCircle className="mt-1 h-4 w-4 flex-none text-red-400" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {faq.source ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
          Referensi: {faq.source}
        </p>
      ) : null}
    </div>
  );
}

export default function FAQ() {
  const { settings } = useSiteSettings();
  const [activeIndex, setActiveIndex] = useState(0);
  const [query, setQuery] = useState('');

  const page = settings?.pages?.faq || {};
  const waNumber = settings?.contact?.waNumber || '6285705218281';
  const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    'Assalamualaikum, saya ingin konsultasi tentang project AFKAR LAND.'
  )}`;

  const filteredFaqs = useMemo(() => {
    const keyword = normalize(query).trim();
    if (!keyword) return FAQ_ITEMS;
    return FAQ_ITEMS.filter((faq) => {
      const haystack = normalize(`${faq.question} ${faq.answer} ${(faq.points || []).join(' ')}`);
      return haystack.includes(keyword);
    });
  }, [query]);

  const selectedIndex = Math.min(activeIndex, Math.max(filteredFaqs.length - 1, 0));

  return (
    <div className="w-full overflow-hidden bg-[#080808] font-body text-white">
      <section className="relative isolate min-h-[72vh] overflow-hidden bg-gradient-to-br from-[#080808] via-[#171112] to-[#330707] pt-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(216,13,13,0.28),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]" />
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 pb-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-4xl"
          >
            <span className="inline-flex items-center rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-red-200">
              FAQ AFKAR LAND
            </span>
            <h1 className="mt-7 text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
              {page.heroTitle && page.heroTitle !== 'FAQ' ? (
                page.heroTitle
              ) : (
                <>
                  15 FAQ Tentang Property Syariah &{' '}
                  <span className="bg-gradient-to-r from-white via-red-100 to-red-500 bg-clip-text text-transparent">
                    AFKAR LAND
                  </span>
                </>
              )}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/72 md:text-lg">
              {page.heroSubtitle ||
                'Temukan jawaban ringkas tentang konsep property syariah, transaksi tanpa riba, legalitas, investasi, dan cara mendapatkan informasi project terbaru AFKAR LAND.'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12, ease: 'easeOut' }}
            className="max-w-3xl rounded-2xl border border-white/10 bg-white/[0.055] p-3 shadow-2xl shadow-black/25 backdrop-blur-xl"
          >
            <label className="flex items-center gap-3 rounded-xl bg-black/30 px-4 py-3">
              <FiSearch className="h-5 w-5 text-red-300" />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                type="search"
                placeholder="Cari pertanyaan tentang akad, cicilan, legalitas, atau project"
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white placeholder:text-white/45 outline-none"
              />
            </label>
          </motion.div>
        </div>
      </section>

      <section className="relative bg-[#080808] py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[300px_1fr] lg:px-8">
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <p className="mb-4 px-2 text-xs font-bold uppercase tracking-[0.24em] text-red-300">
                Daftar FAQ
              </p>
              <div className="space-y-2">
                {filteredFaqs.map((faq, index) => (
                  <button
                    key={faq.question}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`w-full rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                      selectedIndex === index
                        ? 'bg-red-700 text-white shadow-lg shadow-red-950/25'
                        : 'text-white/60 hover:bg-white/8 hover:text-white'
                    }`}
                  >
                    <span className="mr-2 text-xs opacity-70">{String(index + 1).padStart(2, '0')}</span>
                    {faq.question}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="space-y-4">
            {filteredFaqs.length ? (
              filteredFaqs.map((faq, index) => {
                const isOpen = selectedIndex === index;
                return (
                  <motion.article
                    key={faq.question}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.18 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className={`overflow-hidden rounded-2xl border transition ${
                      isOpen
                        ? 'border-red-500/35 bg-[#151010] shadow-2xl shadow-red-950/20'
                        : 'border-white/10 bg-white/[0.035] hover:border-red-300/25'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className="flex w-full items-start justify-between gap-5 px-5 py-5 text-left md:px-7"
                      aria-expanded={isOpen}
                    >
                      <span className="flex gap-4">
                        <span className="mt-1 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-red-700 text-xs font-black text-white">
                          {index + 1}
                        </span>
                        <span className="text-lg font-extrabold leading-7 text-white md:text-xl">
                          {faq.question}
                        </span>
                      </span>
                      <span className="mt-1 inline-flex h-9 w-9 flex-none items-center justify-center rounded-full border border-white/10 bg-white/5 text-white">
                        {isOpen ? <FiMinus /> : <FiPlus />}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.32, ease: 'easeOut' }}
                        >
                          <div className="border-t border-white/10 px-5 py-5 md:px-7">
                            <AnswerContent faq={faq} />
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </motion.article>
                );
              })
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-8 text-center">
                <p className="text-lg font-bold text-white">FAQ tidak ditemukan.</p>
                <p className="mt-2 text-sm text-white/60">
                  Coba gunakan kata kunci lain atau hubungi tim AFKAR LAND untuk konsultasi langsung.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#0f0f0f] py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#7f1111] via-[#4b1010] to-[#141414] p-7 shadow-2xl shadow-red-950/25 md:p-10">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-100">
                Konsultasi Project
              </p>
              <h2 className="mt-4 text-3xl font-black leading-tight text-white md:text-4xl">
                Masih punya pertanyaan tentang hunian syariah AFKAR LAND?
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/75 md:text-base">
                Tim marketing dapat membantu menjelaskan ketersediaan unit, skema pembayaran, progress
                pembangunan, dan jadwal survey lokasi.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsappClick('faq_consultation')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-red-800 transition hover:bg-red-50"
                >
                  <FiMessageCircle />
                  Konsultasi via WhatsApp
                </a>
                <Link
                  to="/proyek"
                  onClick={() => trackCtaClick('faq_view_projects')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10"
                >
                  Lihat Project
                  <FiArrowRight />
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <h2 className="text-lg font-black text-white">Sumber Referensi</h2>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Beberapa jawaban umum diringkas dari referensi publik dan disesuaikan dengan konteks
              AFKAR LAND.
            </p>
            <div className="mt-5 space-y-3">
              {SOURCES.map((source) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-bold text-white/75 transition hover:border-red-300/35 hover:text-white"
                >
                  {source.label}
                  <FiArrowRight className="h-4 w-4 flex-none" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
