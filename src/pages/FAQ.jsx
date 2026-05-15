import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      q: "Apa yang dimaksud dengan Skema 100% Syariah?",
      a: "Skema 100% Syariah berarti transaksi dilakukan murni antara konsumen dan developer tanpa melibatkan pihak ketiga (bank). Sehingga terbebas dari Riba (bunga), denda keterlambatan bayar, penyitaan sepihak, dan asuransi yang diharamkan."
    },
    {
      q: "Bagaimana jika saya terlambat membayar cicilan?",
      a: "Sesuai kaidah syariah, kami tidak mengenakan denda finansial atas keterlambatan. Konsumen diwajibkan berkomunikasi dengan baik kepada developer untuk mencari solusi penjadwalan ulang jika terjadi kendala ekonomi yang benar-benar mendesak."
    },
    {
      q: "Apakah surat-surat legalitas tanah terjamin?",
      a: "Tentu. Seluruh proyek AFKAR LAND berdiri di atas tanah yang legalitasnya sudah Clear & Clean (SHM). Proses pecah sertifikat dan IMB/PBG kami proses secara profesional."
    },
    {
      q: "Apakah harus BI Checking?",
      a: "Tidak perlu. Karena tidak menggunakan fasilitas perbankan konvensional, riwayat BI Checking Anda tidak mempengaruhi persetujuan. Kami menggunakan wawancara dan verifikasi kemampuan bayar langsung."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full bg-white pb-24">
      <section className="pt-32 pb-20 bg-[#0A0A0A] text-white">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-heading font-extrabold mb-6">
            Tanya <span className="text-brand-primary">Jawab</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Temukan jawaban atas pertanyaan yang paling sering diajukan mengenai properti syariah kami.
          </motion.p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 md:px-12 max-w-3xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-2xl overflow-hidden bg-white transition-all duration-300">
                <button 
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between font-bold text-lg text-left focus:outline-none hover:bg-gray-50"
                >
                  <span className={activeIndex === index ? 'text-brand-primary' : 'text-gray-900'}>{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeIndex === index ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {activeIndex === index ? <FiMinus /> : <FiPlus />}
                  </div>
                </button>
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed border-t border-gray-100 mt-2">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}