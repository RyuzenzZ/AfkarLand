import React, { useState, useEffect } from 'react';
import { FiEye, FiDownload, FiCheck } from 'react-icons/fi';

export default function ManageLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Menggunakan data dummy sementara untuk memastikan halaman bisa dibuka
  useEffect(() => {
    setTimeout(() => {
      setLeads([
        { id: 1, nama: 'Budi Santoso', nomorWa: '081234567890', pilihanProject: 'Masagena Green Hills', estimasiBudget: '500 Juta - 1 Miliar', status: 'Baru' },
        { id: 2, nama: 'Andi Manggala', nomorWa: '089988776655', pilihanProject: 'The Hasanah', estimasiBudget: 'Di atas 1 Miliar', status: 'Follow Up' }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Data Lead Proyek</h1>
          <p className="text-gray-500 mt-1">Daftar calon konsumen yang meminta jadwal survei/pricelist.</p>
        </div>
        <button className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
          <FiDownload /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-600 uppercase tracking-wider">
                <th className="p-4 font-bold">Nama Klien</th>
                <th className="p-4 font-bold">No. WhatsApp</th>
                <th className="p-4 font-bold">Minat Proyek</th>
                <th className="p-4 font-bold">Estimasi Budget</th>
                <th className="p-4 font-bold text-center">Status</th>
                <th className="p-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Memuat data...</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Belum ada data lead masuk.</td></tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{lead.nama}</td>
                    <td className="p-4 text-gray-600">{lead.nomorWa}</td>
                    <td className="p-4 text-brand-primary font-medium">{lead.pilihanProject}</td>
                    <td className="p-4 text-gray-600">{lead.estimasiBudget}</td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600">
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4 flex items-center justify-center gap-2">
                      <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200" title="Lihat Detail">
                        <FiEye />
                      </button>
                      <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100" title="Tandai Selesai/Follow Up">
                        <FiCheck />
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