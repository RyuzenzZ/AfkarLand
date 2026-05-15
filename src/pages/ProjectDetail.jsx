import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiCheckCircle, FiSend, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { createLead } from '../services/firestoreService';

// LOGIKA: Menampilkan detail spesifik satu proyek dan menangani form konsultasi/lead
export default function ProjectDetail() {
  const { slug } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nama: '',
    nomorWa: '',
    estimasiBudget: '',
    pesan: ''
  });

  // Data Proyek Hardcode (Idealnya dari Firestore)
  const projectData = {
    'masagena-green-hills': { name: 'Masagena Green Hills', location: 'Sulawesi Selatan', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80', specs: ['Luas Tanah 90m2', 'Luas Bangunan 45m2', '2 Kamar Tidur', '1 Kamar Mandi', 'Carport'] },
    'wotu-islamic-village': { name: 'Wotu Islamic Village', location: 'Luwu Timur, Sulsel', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80', specs: ['Fasilitas Masjid Agung', 'Rumah Tahfidz', 'One Gate System', 'Taman Bermain Islami'] },
    'hasanah-panakkukang': { name: 'The Hasanah Panakkukang', location: 'Makassar', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80', specs: ['Lokasi Premium', 'Dekat Mall Panakkukang', 'Desain Modern Minimalis', 'Keamanan 24 Jam'] },
    'afkar-madani-estate': { name: 'Afkar Madani Estate', location: 'Sulawesi Selatan', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80', specs: ['Gerbang Mewah', 'Jalan Lingkungan Paving Blok', 'Bebas Banjir', 'Legalitas SHM Aman'] }
  };

  const currentProject = projectData[slug] || projectData['masagena-green-hills'];

  // Handler Perubahan Input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handler Submit Form Konsultasi
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // FIREBASE: Menyimpan data lead ke koleksi 'leads'
      await createLead({
        ...formData,
        pilihanProject: currentProject.name,
        sumber: 'Halaman Detail Proyek'
      });
      
      toast.success('Pesan terkirim! Tim Marketing kami akan segera menghubungi Anda via WhatsApp.');
      setFormData({ nama: '', nomorWa: '', estimasiBudget: '', pesan: '' }); // Reset form
    } catch (error) {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white pb-24">
      {/* HEADER GAMBAR PROYEK */}
      <section className="relative h-[60vh] min-h-125">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${currentProject.image}')` }}>
          <div className="absolute inset-0 bg-linear-to-t from-black flex items-end">
            <div className="container mx-auto px-6 md:px-12 pb-16">
              <Link to="/proyek" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
                <FiArrowLeft /> Kembali ke Proyek
              </Link>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-heading font-bold text-white mb-4">
                {currentProject.name}
              </motion.h1>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-2 text-brand-primary text-lg font-medium">
                <FiMapPin /> {currentProject.location}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* KONTEN UTAMA & FORM */}
      <section className="py-16">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Kiri: Spesifikasi & Marketing */}
            <div className="lg:col-span-2 space-y-12">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-3xl font-heading font-bold mb-6 border-b border-gray-100 pb-4">Spesifikasi & Keunggulan</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentProject.specs.map((spec, index) => (
                    <div key={index} className="flex items-center gap-3 text-lg text-gray-700">
                      <FiCheckCircle className="text-brand-primary shrink-0" /> {spec}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Tampilkan Marketing Terkait */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="text-2xl font-heading font-bold mb-6 border-b border-gray-100 pb-4">Konsultan Properti Anda</h2>
                <p className="text-gray-600 mb-6">Tim Marketing Executive kami siap membantu memberikan simulasi harga dan survei lokasi untuk Anda.</p>
                <div className="flex flex-wrap gap-4">
                  {['Damar Mahendra', 'Fila Amelia', 'Hazfira'].map((marketing, i) => (
                    <div key={i} className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-2xl border border-gray-200">
                      <div className="w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xl">
                        {marketing.charAt(0)}
                      </div>
                      <div className="font-bold text-gray-900">{marketing}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Kanan: Form Konsultasi (Sticky) */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 bg-white rounded-3xl p-8 shadow-2xl shadow-red-900/10 border border-gray-100">
                <h3 className="text-2xl font-heading font-bold mb-2">Jadwalkan Konsultasi</h3>
                <p className="text-gray-500 text-sm mb-6">Minta pricelist atau jadwalkan survei lokasi untuk proyek {currentProject.name}.</p>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                    <input type="text" name="nama" required value={formData.nama} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all" placeholder="Contoh: Budi Santoso" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nomor WhatsApp Aktif</label>
                    <input type="tel" name="nomorWa" required value={formData.nomorWa} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all" placeholder="Contoh: 08123456789" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Estimasi Budget</label>
                    <select name="estimasiBudget" required value={formData.estimasiBudget} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-gray-700">
                      <option value="">Pilih Range Budget</option>
                      <option value="< 300 Juta">Di bawah Rp 300 Juta</option>
                      <option value="300-500 Juta">Rp 300 - 500 Juta</option>
                      <option value="500-800 Juta">Rp 500 - 800 Juta</option>
                      <option value="> 800 Juta">Di atas Rp 800 Juta</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Pesan Tambahan (Opsional)</label>
                    <textarea name="pesan" rows="3" value={formData.pesan} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all" placeholder="Pertanyaan spesifik tentang perumahan ini..."></textarea>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full bg-brand-primary hover:bg-brand-accent text-white font-bold py-4 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-70">
                    {isSubmitting ? 'Mengirim Data...' : <><FiSend /> Kirim Permintaan</>}
                  </button>
                  <p className="text-xs text-center text-gray-400 mt-4">Data Anda aman dan tidak akan dibagikan ke pihak ketiga.</p>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}