import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { FiArrowRight, FiCheckCircle, FiHome, FiShield, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { db } from '../config/firebaseConfig';

const DEFAULT_SERVICES = [
  {
    id: 'default-development',
    icon: '🏠',
    nama: 'Pengembangan Perumahan',
    deskripsi: 'Membangun kawasan residensial premium dengan skema syariah, tanpa bank, riba, dan sita.',
    detail: 'AFKAR LAND mengembangkan hunian dengan perencanaan kawasan, legalitas, dan proses transaksi yang lebih transparan.',
    urutan: 0,
  },
  {
    id: 'default-design',
    icon: '📐',
    nama: 'Desain & Arsitektur Islami',
    deskripsi: 'Perencanaan rumah modern yang tetap memperhatikan kenyamanan keluarga muslim.',
    detail: 'Setiap konsep hunian dirancang agar fungsional, nyaman, dan sesuai kebutuhan keluarga.',
    urutan: 1,
  },
  {
    id: 'default-legal',
    icon: '🛡️',
    nama: 'Konsultasi Legalitas',
    deskripsi: 'Pendampingan informasi legalitas tanah dan bangunan yang aman dan jelas.',
    detail: 'Tim membantu menjelaskan proses administrasi agar calon pembeli memahami setiap tahap transaksi.',
    urutan: 2,
  },
  {
    id: 'default-investment',
    icon: '📊',
    nama: 'Investasi Properti Berkah',
    deskripsi: 'Peluang memiliki properti syariah dengan nilai jangka panjang di wilayah berkembang.',
    detail: 'Proyek dipilih dengan mempertimbangkan akses, perkembangan kawasan, dan kebutuhan pasar.',
    urutan: 3,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

function ServiceIcon({ value }) {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/15 bg-red-500/10 text-2xl text-red-500">
      {value || <FiShield />}
    </div>
  );
}

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'services'), orderBy('urutan', 'asc'));
    let fallbackUnsub = null;
    const unsub = onSnapshot(
      q,
      (snap) => {
        setServices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      () => {
        fallbackUnsub = onSnapshot(collection(db, 'services'), (snap) => {
          const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          data.sort((a, b) => Number(a.urutan || 0) - Number(b.urutan || 0));
          setServices(data);
          setLoading(false);
        });
      }
    );
    return () => {
      unsub();
      fallbackUnsub?.();
    };
  }, []);

  const visibleServices = useMemo(() => {
    const active = services.filter(service => service.aktif !== false && service.nama);
    return active.length ? active : DEFAULT_SERVICES;
  }, [services]);

  return (
    <div className="w-full overflow-hidden bg-[#080808] text-white">
      <section className="relative flex min-h-[72vh] items-center overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0">
          <img
            src="/images/MasagenaParallax.jpg"
            alt="Layanan AFKAR LAND"
            className="h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/70 via-[#080808]/70 to-[#080808]" />
        </div>
        <div className="container relative z-10 mx-auto px-6 md:px-12">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/25 bg-red-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-red-300">
              <FiStar size={14} /> Layanan
            </div>
            <h1 className="font-heading text-4xl font-extrabold leading-tight md:text-6xl">
              Solusi properti syariah dari awal sampai serah terima.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
              Layanan AFKAR LAND dikelola langsung dari admin dan diperbarui real-time untuk membantu calon customer memahami proses, legalitas, dan nilai proyek.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 md:px-12">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {Array(4).fill(0).map((_, index) => (
                <div key={index} className="h-64 animate-pulse rounded-3xl border border-white/5 bg-white/[0.04]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {visibleServices.map((service, index) => (
                <motion.article
                  key={service.id || service.nama}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  className="group flex min-h-[260px] flex-col rounded-3xl border border-white/5 bg-white/[0.045] p-7 transition-all hover:-translate-y-1 hover:border-red-500/25 hover:bg-white/[0.07]"
                >
                  <ServiceIcon value={service.icon} />
                  <h2 className="mt-6 font-heading text-2xl font-extrabold text-white">{service.nama}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">{service.deskripsi}</p>
                  {service.detail && (
                    <div className="mt-5 flex items-start gap-3 rounded-2xl border border-white/5 bg-black/20 p-4 text-sm leading-relaxed text-gray-300">
                      <FiCheckCircle className="mt-0.5 shrink-0 text-red-400" />
                      <span>{service.detail}</span>
                    </div>
                  )}
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-white/5 py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-red-500/20 bg-red-600 p-8 md:flex-row md:items-center md:p-10">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-red-100">
                <FiHome /> Konsultasi Proyek
              </div>
              <h2 className="font-heading text-3xl font-extrabold text-white">Butuh arahan memilih proyek?</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-red-50/80">
                Tim AFKAR LAND siap membantu menyesuaikan kebutuhan hunian, lokasi, dan skema pembayaran.
              </p>
            </div>
            <Link
              to="/kontak"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-black text-red-600 transition-all hover:bg-red-50"
            >
              Hubungi Kami <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
