import React, { useState, useEffect } from 'react';
import { FiEye, FiCheck, FiTrash2 } from 'react-icons/fi';

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Menggunakan data dummy sementara
  useEffect(() => {
    setTimeout(() => {
      setMessages([
        { id: 1, nama: 'Bapak Ilham', email: 'ilham@email.com', telepon: '081299998888', ringkasan: 'Tanya legalitas tanah...', waktu: 'Hari ini, 10:30', status: 'Baru' },
        { id: 2, nama: 'Ibu Siti', email: 'siti@email.com', telepon: '085277776666', ringkasan: 'Apakah bisa survei hari sabtu?', waktu: 'Kemarin, 15:00', status: 'Dibaca' }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-900">Pesan Masuk</h1>
        <p className="text-gray-500 mt-1">Kotak masuk dari formulir halaman Hubungi Kami.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-600 uppercase tracking-wider">
                <th className="p-4 font-bold">Pengirim</th>
                <th className="p-4 font-bold">Kontak</th>
                <th className="p-4 font-bold">Ringkasan Pesan</th>
                <th className="p-4 font-bold">Waktu</th>
                <th className="p-4 font-bold text-center">Status</th>
                <th className="p-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Memuat data pesan...</td></tr>
              ) : messages.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Belum ada pesan masuk.</td></tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-gray-900">{msg.nama}</td>
                    <td className="p-4">
                      <div className="text-sm text-gray-900">{msg.telepon}</div>
                      <div className="text-xs text-gray-500">{msg.email}</div>
                    </td>
                    <td className="p-4 text-gray-600 truncate max-w-xs">{msg.ringkasan}</td>
                    <td className="p-4 text-gray-500 text-sm">{msg.waktu}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        msg.status === 'Baru' ? 'bg-red-50 text-brand-primary' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {msg.status}
                      </span>
                    </td>
                    <td className="p-4 flex items-center justify-center gap-2">
                      <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200" title="Baca Pesan">
                        <FiEye />
                      </button>
                      <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100" title="Tandai Selesai">
                        <FiCheck />
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