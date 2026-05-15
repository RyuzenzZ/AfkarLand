import React, { useState, useEffect } from 'react';
import { FiSave, FiSettings } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

export default function Settings() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    namaPerusahaan: '',
    tagline: '',
    emailUtama: '',
    teleponUtama: '',
    alamat: ''
  });

  // Saat halaman dibuka, ambil data pengaturan terakhir dari Firebase
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'general');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setFormData(docSnap.data());
        } else {
          // Jika belum ada data sama sekali, berikan nilai default
          setFormData({
            namaPerusahaan: 'AFKAR LAND',
            tagline: 'Bersama AFKAR GROUP INDONESIA, wujudkan properti syariah di seluruh wilayah sulawesi.',
            emailUtama: 'halo@afkarland.com',
            teleponUtama: '+62 812-3456-7890',
            alamat: 'Makassar, Sulawesi Selatan, Indonesia'
          });
        }
      } catch (error) {
        console.error("Gagal mengambil pengaturan:", error);
        toast.error("Gagal memuat pengaturan web");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Simpan perubahan ke Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Menyimpan data ke koleksi 'settings' dokumen 'general'
      const docRef = doc(db, 'settings', 'general');
      await setDoc(docRef, formData, { merge: true });
      
      toast.success('Pengaturan berhasil diperbarui ke server!');
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      toast.error('Gagal menyimpan pengaturan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-gray-500">Memuat pengaturan...</div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center text-xl">
          <FiSettings />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Pengaturan Website</h1>
          <p className="text-gray-500 mt-1">Data yang diubah di sini akan otomatis mengubah informasi di website publik.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nama Perusahaan</label>
              <input 
                type="text" name="namaPerusahaan" value={formData.namaPerusahaan} onChange={handleChange} 
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand-primary outline-none transition-colors" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Publik</label>
              <input 
                type="email" name="emailUtama" value={formData.emailUtama} onChange={handleChange} 
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand-primary outline-none transition-colors" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Slogan / Tagline Website</label>
            <input 
              type="text" name="tagline" value={formData.tagline} onChange={handleChange} 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand-primary outline-none transition-colors" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nomor Telepon / WhatsApp</label>
              <input 
                type="text" name="teleponUtama" value={formData.teleponUtama} onChange={handleChange} 
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand-primary outline-none transition-colors" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Alamat Kantor Lengkap</label>
            <textarea 
              name="alamat" rows="3" value={formData.alamat} onChange={handleChange} 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand-primary outline-none transition-colors"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button 
              type="submit" disabled={isSubmitting}
              className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors font-bold disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <FiSave /> {isSubmitting ? 'Menyimpan ke Cloud...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}