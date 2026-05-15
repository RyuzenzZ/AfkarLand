import React, { useState, useEffect } from 'react';
import { FiEye, FiTrash2, FiExternalLink, FiX, FiPhone, FiMail, FiBriefcase, FiCheck } from 'react-icons/fi';

const STATUS_OPTIONS = ['Review', 'Interview', 'Diterima', 'Ditolak'];

const statusStyle = {
  Review:    'bg-amber-50 text-amber-600 border border-amber-200',
  Interview: 'bg-blue-50 text-blue-600 border border-blue-200',
  Diterima:  'bg-emerald-50 text-emerald-600 border border-emerald-200',
  Ditolak:   'bg-red-50 text-red-500 border border-red-200',
};

export default function ManageApplications() {
  const [apps, setApps]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalReview, setModalReview] = useState(null);
  const [modalHapus, setModalHapus]   = useState(null);

  // LOGIKA: Load data dummy
  useEffect(() => {
    setTimeout(() => {
      setApps([
        { id: 1, nama: 'Dian Prasetyo',  email: 'dian@email.com', posisi: 'Digital Marketing Specialist', telepon: '081122334455', portofolio: 'https://linkedin.com',  status: 'Review',    tanggal: '13 Mei 2026', pesan: 'Saya memiliki pengalaman 3 tahun di bidang properti digital dan siap berkontribusi untuk AFKAR LAND.' },
        { id: 2, nama: 'Reza Firmansyah',email: 'reza@email.com',  posisi: 'Arsitek / Drafter',           telepon: '085544332211', portofolio: 'https://behance.net',  status: 'Interview', tanggal: '10 Mei 2026', pesan: 'Saya lulusan Arsitektur UNHAS 2022, mahir AutoCAD dan SketchUp, pernah mengerjakan proyek perumahan subsidi.' },
        { id: 3, nama: 'Aulia Rahma',    email: 'aulia@email.com', posisi: 'Admin & Customer Service',   telepon: '087899990000', portofolio: 'https://drive.google.com', status: 'Diterima', tanggal: '05 Mei 2026', pesan: 'Berpengalaman 2 tahun sebagai customer service di perusahaan properti, komunikatif dan ramah.' },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  // LOGIKA: Naikkan status pelamar ke tahap berikutnya
  const nextStatus = (id) => {
    setApps(prev => prev.map(a => {
      if (a.id !== id) return a;
      const idx = STATUS_OPTIONS.indexOf(a.status);
      return { ...a, status: STATUS_OPTIONS[Math.min(idx + 1, STATUS_OPTIONS.length - 1)] };
    }));
  };

  // LOGIKA: Hapus lamaran
  const handleHapus = () => {
    setApps(prev => prev.filter(a => a.id !== modalHapus));
    setModalHapus(null);
  };

  return (
    <div>
      {/* HEADER */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Data Lamaran Kerja</h1>
          <p className="text-gray-500 mt-1">Daftar calon tim hebat yang ingin bergabung dengan AFKAR LAND.</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{apps.length}</div>
          <div className="text-xs text-gray-400">Total Pelamar</div>
        </div>
      </div>

      {/* TABEL */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-bold">Pelamar</th>
                <th className="p-4 font-bold">Posisi Dilamar</th>
                <th className="p-4 font-bold">Kontak</th>
                <th className="p-4 font-bold">Tanggal</th>
                <th className="p-4 font-bold text-center">Status</th>
                <th className="p-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="p-10 text-center text-gray-400">Memuat data pelamar...</td></tr>
              ) : apps.length === 0 ? (
                <tr><td colSpan="6" className="p-10 text-center text-gray-400">Belum ada lamaran masuk.</td></tr>
              ) : apps.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{app.nama}</div>
                    <div className="text-xs text-gray-400">{app.email}</div>
                  </td>
                  <td className="p-4 font-medium text-red-600 text-sm">{app.posisi}</td>
                  <td className="p-4 text-gray-600 text-sm font-mono">{app.telepon}</td>
                  <td className="p-4 text-gray-400 text-sm">{app.tanggal}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusStyle[app.status]}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* Tombol Review Detail */}
                      <button onClick={() => setModalReview(app)} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors" title="Lihat Detail"><FiEye size={15}/></button>
                      {/* Tombol Buka Portofolio */}
                      <a href={app.portofolio} target="_blank" rel="noreferrer" className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors" title="Lihat Portofolio/CV"><FiExternalLink size={15}/></a>
                      {/* Tombol Naikkan Status */}
                      <button onClick={() => nextStatus(app.id)} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors" title="Naikkan Status" disabled={app.status === 'Ditolak'}><FiCheck size={15}/></button>
                      {/* Tombol Hapus */}
                      <button onClick={() => setModalHapus(app.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors" title="Hapus Lamaran"><FiTrash2 size={15}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && (
          <div className="px-4 py-3 border-t border-gray-100 text-sm text-gray-400 flex gap-4 flex-wrap">
            {STATUS_OPTIONS.map(s => (
              <span key={s}>{s}: <strong>{apps.filter(a => a.status === s).length}</strong></span>
            ))}
          </div>
        )}
      </div>

      {/* MODAL REVIEW DETAIL */}
      {modalReview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-heading font-bold">Detail Pelamar</h2>
              <button onClick={() => setModalReview(null)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><FiX/></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center text-2xl font-extrabold">
                  {modalReview.nama.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{modalReview.nama}</div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${statusStyle[modalReview.status]}`}>{modalReview.status}</span>
                </div>
              </div>
              <hr className="border-gray-100"/>
              {/* Info */}
              {[
                { label: 'Posisi Dilamar', value: modalReview.posisi,    icon: <FiBriefcase size={14}/> },
                { label: 'No. WhatsApp',   value: modalReview.telepon,   icon: <FiPhone size={14}/> },
                { label: 'Email',          value: modalReview.email,     icon: <FiMail size={14}/> },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="text-gray-400 mt-0.5">{item.icon}</span>
                  <div>
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">{item.label}</div>
                    <div className="text-sm text-gray-800 font-medium mt-0.5">{item.value}</div>
                  </div>
                </div>
              ))}
              {/* Pesan motivasi */}
              {modalReview.pesan && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Pesan / Motivasi</div>
                  <div className="text-sm text-gray-700 leading-relaxed">{modalReview.pesan}</div>
                </div>
              )}
              {/* Aksi */}
              <div className="flex gap-3 mt-2">
                <a
                  href={modalReview.portofolio}
                  target="_blank" rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50 text-sm transition-colors"
                >
                  <FiExternalLink size={14}/> Portofolio/CV
                </a>
                <a
                  href={`https://wa.me/62${modalReview.telepon.replace(/^0/, '')}?text=Halo ${modalReview.nama}, kami dari AFKAR LAND ingin menghubungi Anda terkait lamaran posisi ${modalReview.posisi}.`}
                  target="_blank" rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl transition-colors text-sm"
                >
                  <FiPhone size={14}/> Hubungi WA
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HAPUS */}
      {modalHapus && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><FiTrash2 className="text-red-500" size={24}/></div>
            <h2 className="text-xl font-heading font-bold text-gray-900 mb-2">Hapus Lamaran?</h2>
            <p className="text-gray-500 text-sm mb-6">Data lamaran ini akan dihapus permanen.</p>
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