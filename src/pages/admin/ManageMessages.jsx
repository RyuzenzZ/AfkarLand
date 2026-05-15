import React, { useState, useEffect } from 'react';
import { FiEye, FiCheck, FiTrash2, FiX, FiPhone, FiMail, FiMessageSquare } from 'react-icons/fi';

const statusStyle = {
  Baru:   'bg-red-50 text-red-600 border border-red-200',
  Dibaca: 'bg-gray-100 text-gray-500 border border-gray-200',
  Selesai:'bg-emerald-50 text-emerald-600 border border-emerald-200',
};

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modalBaca, setModalBaca]   = useState(null);
  const [modalHapus, setModalHapus] = useState(null);

  // LOGIKA: Load data dummy
  useEffect(() => {
    setTimeout(() => {
      setMessages([
        { id: 1, nama: 'Bapak Ilham',  email: 'ilham@email.com', telepon: '081299998888', pesan: 'Assalamu\'alaikum, saya ingin menanyakan tentang legalitas tanah di Masagena Green Hills. Apakah sudah bersertifikat? Terima kasih.', waktu: 'Hari ini, 10:30', status: 'Baru' },
        { id: 2, nama: 'Ibu Siti',     email: 'siti@email.com',  telepon: '085277776666', pesan: 'Halo, apakah bisa melakukan survei lokasi hari Sabtu? Saya dan suami tertarik dengan unit di The Hasanah Panakkukang.', waktu: 'Kemarin, 15:00', status: 'Dibaca' },
        { id: 3, nama: 'Pak Hendra',   email: 'hendra@email.com',telepon: '087811112222', pesan: 'Saya ingin mengetahui lebih lanjut tentang skema cicilan syariah untuk Wotu Islamic Village. Apakah ada DP ringan?', waktu: '12 Mei 2026', status: 'Selesai' },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  // LOGIKA: Tandai pesan sebagai Dibaca saat modal dibuka
  const bukaPesan = (msg) => {
    setModalBaca(msg);
    if (msg.status === 'Baru') {
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: 'Dibaca' } : m));
    }
  };

  // LOGIKA: Toggle status Dibaca → Selesai
  const tandaiSelesai = (id) => {
    setMessages(prev => prev.map(m =>
      m.id === id ? { ...m, status: m.status === 'Selesai' ? 'Dibaca' : 'Selesai' } : m
    ));
  };

  // LOGIKA: Hapus pesan
  const handleHapus = () => {
    setMessages(prev => prev.filter(m => m.id !== modalHapus));
    setModalHapus(null);
  };

  const totalBaru = messages.filter(m => m.status === 'Baru').length;

  return (
    <div>
      {/* HEADER */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Pesan Masuk</h1>
          <p className="text-gray-500 mt-1">Kotak masuk dari formulir halaman Hubungi Kami.</p>
        </div>
        {totalBaru > 0 && (
          <span className="bg-red-600 text-white text-sm font-bold px-3 py-1.5 rounded-full">
            {totalBaru} Pesan Baru
          </span>
        )}
      </div>

      {/* TABEL */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
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
                <tr><td colSpan="6" className="p-10 text-center text-gray-400">Memuat pesan masuk...</td></tr>
              ) : messages.length === 0 ? (
                <tr><td colSpan="6" className="p-10 text-center text-gray-400">Belum ada pesan masuk.</td></tr>
              ) : messages.map((msg) => (
                <tr key={msg.id} className={`hover:bg-gray-50 transition-colors ${msg.status === 'Baru' ? 'bg-red-50/30' : ''}`}>
                  <td className="p-4 font-bold text-gray-900">{msg.nama}</td>
                  <td className="p-4">
                    <div className="text-sm text-gray-800 font-medium">{msg.telepon}</div>
                    <div className="text-xs text-gray-400">{msg.email}</div>
                  </td>
                  <td className="p-4 text-gray-600 text-sm max-w-xs">
                    <div className="truncate">{msg.pesan}</div>
                  </td>
                  <td className="p-4 text-gray-400 text-sm whitespace-nowrap">{msg.waktu}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusStyle[msg.status]}`}>
                      {msg.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => bukaPesan(msg)} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors" title="Baca Pesan"><FiEye size={15}/></button>
                      <button onClick={() => tandaiSelesai(msg.id)} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors" title="Tandai Selesai"><FiCheck size={15}/></button>
                      <button onClick={() => setModalHapus(msg.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors" title="Hapus Pesan"><FiTrash2 size={15}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && (
          <div className="px-4 py-3 border-t border-gray-100 text-sm text-gray-400">
            Total {messages.length} pesan · {totalBaru} belum dibaca
          </div>
        )}
      </div>

      {/* MODAL BACA PESAN */}
      {modalBaca && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-heading font-bold">Detail Pesan</h2>
              <button onClick={() => setModalBaca(null)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><FiX/></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {/* Avatar + Nama */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center text-2xl font-extrabold">
                  {modalBaca.nama.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{modalBaca.nama}</div>
                  <div className="text-xs text-gray-400">{modalBaca.waktu}</div>
                </div>
              </div>
              <hr className="border-gray-100"/>
              {/* Info Kontak */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiPhone size={14} className="text-gray-400"/>
                  <span className="font-medium">{modalBaca.telepon}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiMail size={14} className="text-gray-400"/>
                  <span>{modalBaca.email}</span>
                </div>
              </div>
              <hr className="border-gray-100"/>
              {/* Isi Pesan */}
              <div>
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                  <FiMessageSquare size={12}/> Isi Pesan
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">
                  {modalBaca.pesan}
                </div>
              </div>
              {/* Tombol Balas WA */}
              <a
                href={`https://wa.me/62${modalBaca.telepon.replace(/^0/, '')}?text=Assalamu'alaikum ${modalBaca.nama}, terima kasih sudah menghubungi AFKAR LAND. `}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors text-sm"
              >
                <FiPhone size={16}/> Balas via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HAPUS */}
      {modalHapus && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><FiTrash2 className="text-red-500" size={24}/></div>
            <h2 className="text-xl font-heading font-bold text-gray-900 mb-2">Hapus Pesan?</h2>
            <p className="text-gray-500 text-sm mb-6">Pesan ini akan dihapus permanen.</p>
            <div className="flex gap-3">
              <button onClick={() => setModalHapus(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 text-sm">Batal</button>
              <button onClick={handleHapus} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 text-sm">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}