import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { FiChevronLeft, FiChevronRight, FiGrid, FiImage, FiX } from 'react-icons/fi';
import { db } from '../config/firebaseConfig';

const CATEGORIES = ['Semua', 'Eksterior', 'Interior', 'Siteplan', 'Progres Pembangunan', 'Event', 'Lainnya'];

const DEFAULT_GALLERY = [
  {
    id: 'default-masagena',
    judul: 'Masagena Green Hills',
    kategori: 'Eksterior',
    proyek: 'Masagena Green Hills',
    url: '/images/Masagena.jpg',
    altText: 'Proyek Masagena Green Hills AFKAR LAND',
  },
  {
    id: 'default-hero',
    judul: 'Kawasan Hunian Syariah',
    kategori: 'Eksterior',
    proyek: 'AFKAR LAND',
    url: '/images/Hero.jpg',
    altText: 'Kawasan hunian syariah AFKAR LAND',
  },
  {
    id: 'default-masagena-1',
    judul: 'Dokumentasi Proyek',
    kategori: 'Progres Pembangunan',
    proyek: 'Masagena Green Hills',
    url: '/images/Masagena1.jpg',
    altText: 'Dokumentasi proyek AFKAR LAND',
  },
];

function GalleryLightbox({ photo, photos, onClose }) {
  const initialIndex = Math.max(0, photos.findIndex(item => item.id === photo.id));
  const [index, setIndex] = useState(initialIndex);
  const current = photos[index];

  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') setIndex(value => Math.max(value - 1, 0));
      if (event.key === 'ArrowRight') setIndex(value => Math.min(value + 1, photos.length - 1));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, photos.length]);

  if (!current) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 p-5"
        onClick={onClose}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Tutup galeri"
        >
          <FiX size={22} />
        </button>

        {index > 0 && (
          <button
            type="button"
            onClick={(event) => { event.stopPropagation(); setIndex(value => value - 1); }}
            className="absolute left-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Foto sebelumnya"
          >
            <FiChevronLeft size={24} />
          </button>
        )}

        {index < photos.length - 1 && (
          <button
            type="button"
            onClick={(event) => { event.stopPropagation(); setIndex(value => value + 1); }}
            className="absolute right-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Foto berikutnya"
          >
            <FiChevronRight size={24} />
          </button>
        )}

        <div className="w-full max-w-5xl" onClick={event => event.stopPropagation()}>
          <img
            src={current.url}
            alt={current.altText || current.judul}
            className="mx-auto max-h-[75vh] w-full rounded-2xl object-contain"
          />
          <div className="mt-5 flex items-end justify-between gap-4 text-white">
            <div>
              <h2 className="text-xl font-black">{current.judul}</h2>
              <p className="mt-1 text-sm text-white/55">
                {current.kategori}{current.proyek ? ` · ${current.proyek}` : ''}
              </p>
            </div>
            <span className="text-sm font-bold text-white/45">{index + 1} / {photos.length}</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    let fallbackUnsub = null;
    const unsub = onSnapshot(
      q,
      (snap) => {
        setPhotos(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(item => item.url));
        setLoading(false);
      },
      () => {
        fallbackUnsub = onSnapshot(collection(db, 'gallery'), (snap) => {
          setPhotos(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(item => item.url));
          setLoading(false);
        });
      }
    );
    return () => {
      unsub();
      fallbackUnsub?.();
    };
  }, []);

  const sourcePhotos = photos.length ? photos : DEFAULT_GALLERY;
  const filteredPhotos = useMemo(() => {
    if (activeCategory === 'Semua') return sourcePhotos;
    return sourcePhotos.filter(photo => photo.kategori === activeCategory);
  }, [activeCategory, sourcePhotos]);

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <section className="relative overflow-hidden pt-36 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(185,28,28,0.22),transparent_38%)]" />
        <div className="container relative z-10 mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/25 bg-red-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-red-300">
              <FiImage size={14} /> Galeri
            </div>
            <h1 className="font-heading text-4xl font-extrabold leading-tight md:text-6xl">
              Dokumentasi visual proyek dan aktivitas AFKAR LAND.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-400">
              Galeri ini terhubung langsung dengan ManageGallery, sehingga dokumentasi proyek dapat diperbarui dari admin tanpa mengubah kode.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition-all ${
                  activeCategory === category
                    ? 'bg-red-600 text-white'
                    : 'border border-white/10 bg-white/[0.04] text-gray-300 hover:bg-white/[0.08]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {Array(8).fill(0).map((_, index) => (
                <div key={index} className="aspect-square animate-pulse rounded-3xl bg-white/[0.05]" />
              ))}
            </div>
          ) : filteredPhotos.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 py-20 text-center">
              <FiGrid className="mx-auto mb-4 text-white/30" size={34} />
              <p className="font-bold text-white">Belum ada foto pada kategori ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {filteredPhotos.map((photo, index) => (
                <motion.button
                  key={photo.id}
                  type="button"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.35, delay: index * 0.025 }}
                  onClick={() => setLightbox(photo)}
                  className="group relative aspect-square overflow-hidden rounded-3xl bg-white/[0.04] text-left"
                >
                  <img
                    src={photo.url}
                    alt={photo.altText || photo.judul}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent opacity-80" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="truncate text-sm font-black text-white">{photo.judul}</div>
                    <div className="mt-1 truncate text-[10px] font-bold uppercase tracking-widest text-white/55">
                      {photo.kategori}{photo.proyek ? ` · ${photo.proyek}` : ''}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      {lightbox && <GalleryLightbox photo={lightbox} photos={filteredPhotos} onClose={() => setLightbox(null)} />}
    </div>
  );
}
