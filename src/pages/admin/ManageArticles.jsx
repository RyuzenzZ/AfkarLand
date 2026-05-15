import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink } from 'react-icons/fi';

export default function ManageArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Menggunakan data dummy sementara
  useEffect(() => {
    setTimeout(() => {
      setArticles([
        { id: 1, judul: 'Keunggulan Memilih Properti Syariah di Tahun 2026', kategori: 'Edukasi', status: 'Published', tanggal: '14 Mei 2026' },
        { id: 2, judul: 'Tips Menabung untuk Membeli Rumah Tanpa KPR Bank', kategori: 'Finansial', status: 'Draft', tanggal: '10 Mei 2026' },
        { id: 3, judul: 'Mengapa Makassar Adalah Lokasi Investasi Terbaik', kategori: 'Investasi', status: 'Published', tanggal: '02 Mei 2026' }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Kelola Artikel</h1>
          <p className="text-gray-500 mt-1">Buat dan kelola konten blog untuk edukasi klien Anda.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-primary text-white px-5 py-2.5 rounded-lg hover:bg-brand-accent transition-colors font-bold">
          <FiPlus /> Tulis Artikel Baru
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-600 uppercase tracking-wider">
                <th className="p-4 font-bold">Judul Artikel</th>
                <th className="p-4 font-bold">Kategori</th>
                <th className="p-4 font-bold">Tanggal</th>
                <th className="p-4 font-bold text-center">Status</th>
                <th className="p-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Memuat data artikel...</td></tr>
              ) : articles.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Belum ada artikel.</td></tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900 max-w-md truncate">{article.judul}</td>
                    <td className="p-4 text-gray-600">{article.kategori}</td>
                    <td className="p-4 text-gray-600">{article.tanggal}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        article.status === 'Published' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="p-4 flex items-center justify-center gap-2">
                      <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200" title="Lihat">
                        <FiExternalLink />
                      </button>
                      <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100" title="Edit">
                        <FiEdit2 />
                      </button>
                      <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="Hapus">
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}