import React, { useState, useEffect } from 'react';
import { FiUsers, FiMessageSquare, FiFileText, FiBriefcase } from 'react-icons/fi';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

export default function Dashboard() {
  const [counts, setCounts] = useState({
    leads: 0,
    messages: 0,
    applications: 0,
    articles: 0
  });
  const [loading, setLoading] = useState(true);

  // Mengambil data secara REAL-TIME dari Firebase Firestore
  useEffect(() => {
    setLoading(true);

    // Listener untuk Leads
    const unsubLeads = onSnapshot(collection(db, 'leads'), (snapshot) => {
      setCounts(prev => ({ ...prev, leads: snapshot.size }));
    });

    // Listener untuk Pesan
    const unsubMessages = onSnapshot(collection(db, 'messages'), (snapshot) => {
      setCounts(prev => ({ ...prev, messages: snapshot.size }));
    });

    // Listener untuk Lamaran
    const unsubApps = onSnapshot(collection(db, 'applications'), (snapshot) => {
      setCounts(prev => ({ ...prev, applications: snapshot.size }));
    });

    // Listener untuk Artikel
    const unsubArticles = onSnapshot(collection(db, 'articles'), (snapshot) => {
      setCounts(prev => ({ ...prev, articles: snapshot.size }));
      setLoading(false);
    });

    // Bersihkan memori saat berpindah halaman
    return () => {
      unsubLeads(); unsubMessages(); unsubApps(); unsubArticles();
    };
  }, []);

  const stats = [
    { title: 'Total Lead Masuk', value: counts.leads, icon: <FiUsers size={24} />, color: 'bg-blue-50 text-blue-600' },
    { title: 'Pesan Publik', value: counts.messages, icon: <FiMessageSquare size={24} />, color: 'bg-red-50 text-red-600' },
    { title: 'Lamaran Kerja', value: counts.applications, icon: <FiBriefcase size={24} />, color: 'bg-emerald-50 text-emerald-600' },
    { title: 'Artikel Publik', value: counts.articles, icon: <FiFileText size={24} />, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-900">Dashboard Utama</h1>
        <p className="text-gray-500 mt-1">Pantau aktivitas dan statistik website AFKAR LAND secara real-time.</p>
      </div>

      {/* Grid Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
              <h3 className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Area Notifikasi Singkat */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center mt-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-brand-primary to-red-400"></div>
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary">
          <FiUsers size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Sistem Integrasi Aktif</h3>
        <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
          Semua perubahan data pada panel ini sudah terhubung ke database cloud Firebase. Gunakan menu navigasi di sebelah kiri untuk mengelola konten dan melihat detail pesan masuk.
        </p>
      </div>
    </div>
  );
}