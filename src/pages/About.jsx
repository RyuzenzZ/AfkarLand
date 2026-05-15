import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function About() {
  return (
    <div className="w-full bg-white pb-24">
      
      {/* Header Gelap */}
      <section className="pt-32 pb-20 bg-[#0A0A0A] text-white">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="text-4xl md:text-6xl font-heading font-extrabold mb-6">
            Tentang <span className="text-brand-primary">AFKAR LAND</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }} className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Mengenal lebih dekat perjalanan, nilai, dan tim di balik karya hunian islami premium di Sulawesi.
          </motion.p>
        </div>
      </section>

      {/* Konten Sejarah */}
      <section className="py-24">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80" alt="Gedung Afkar Land" className="w-full rounded-3xl shadow-2xl" />
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">Sejarah & Dedikasi Kami</h2>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                Berawal dari keprihatinan akan sulitnya masyarakat mendapatkan hunian tanpa melibatkan sistem perbankan yang ribawi, AFKAR LAND didirikan dengan satu tujuan mulia: <strong>Memberikan kemudahan kepemilikan rumah berskema syariah.</strong>
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                Sebagai bagian dari <strong>AFKAR GROUP INDONESIA</strong>, kami telah membuktikan integritas kami melalui berbagai proyek perumahan yang sukses diserahterimakan tepat waktu dengan kualitas bangunan yang melampaui ekspektasi konsumen.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h3 className="text-4xl font-heading font-extrabold text-brand-primary mb-2">4+</h3>
                  <p className="text-gray-900 font-bold">Proyek Aktif</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h3 className="text-4xl font-heading font-extrabold text-brand-primary mb-2">100%</h3>
                  <p className="text-gray-900 font-bold">Murni Syariah</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Budaya Kerja */}
      <section className="py-24 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">Budaya & Nilai Inti (Core Values)</h2>
            <p className="text-gray-600 mb-12 text-lg">Dalam bekerja dan melayani konsumen, seluruh tim AFKAR LAND berpegang teguh pada prinsip-prinsip syariat dan profesionalisme.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {[
                { title: 'Amanah (Terpercaya)', desc: 'Menjaga kepercayaan konsumen terkait legalitas, kualitas bangunan, dan serah terima.' },
                { title: 'Kafa\'ah (Profesional)', desc: 'Bekerja dengan standar keahlian tinggi di setiap bidang (arsitektur, sipil, marketing).' },
                { title: 'Siddiq (Jujur)', desc: 'Transparan dalam spesifikasi, harga, dan kondisi lingkungan proyek.' },
                { title: 'Fathanah (Cerdas)', desc: 'Inovatif dalam mendesain kawasan dan mencari solusi atas masalah tata ruang.' }
              ].map((val, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                  <div className="mt-1 text-brand-primary"><FiCheck size={24} /></div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{val.title}</h4>
                    <p className="text-gray-600">{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}