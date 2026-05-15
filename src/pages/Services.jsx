import React from 'react';
import { motion } from 'framer-motion';
import { FiHome, FiPenTool, FiFileText, FiTrendingUp } from 'react-icons/fi';

export default function Services() {
  const services = [
    { icon: <FiHome />, title: 'Pengembangan Perumahan', desc: 'Membangun kawasan residensial premium dengan skema 100% Syariah, tanpa bank, riba, dan sita.' },
    { icon: <FiPenTool />, title: 'Desain & Arsitektur Islami', desc: 'Perencanaan desain rumah yang memperhatikan estetika modern namun tetap mematuhi adab hunian islami.' },
    { icon: <FiFileText />, title: 'Konsultasi Legalitas', desc: 'Bantuan pengurusan surat-surat kepemilikan tanah dan bangunan yang aman dan terjamin keabsahannya.' },
    { icon: <FiTrendingUp />, title: 'Investasi Properti Berkah', desc: 'Peluang investasi properti syariah dengan nilai *capital gain* yang terus meningkat di wilayah berkembang Sulawesi.' }
  ];

  return (
    <div className="w-full bg-white pb-24">
      <section className="pt-32 pb-20 bg-[#0A0A0A] text-white">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-heading font-extrabold mb-6">
            Layanan <span className="text-brand-primary">Profesional</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Solusi properti end-to-end yang mengutamakan kepuasan, keamanan hukum, dan nilai-nilai keberkahan.
          </motion.p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {services.map((srv, idx) => (
              <motion.div 
                key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                className="p-10 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm text-brand-primary flex items-center justify-center text-3xl mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                  {srv.icon}
                </div>
                <h3 className="text-2xl font-heading font-bold mb-4">{srv.title}</h3>
                <p className="text-gray-600 leading-relaxed">{srv.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}