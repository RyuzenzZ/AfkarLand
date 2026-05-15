import React, { useState, useEffect } from 'react';
import { FiExternalLink } from 'react-icons/fi';

export default function ManageApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Menggunakan data dummy sementara
  useEffect(() => {
    setTimeout(() => {
      setApps([
        { id: 1, nama: 'Dian Sastro', email: 'dian@email.com', posisi: 'Digital Marketing Specialist', telepon: '081122334455', portofolio: 'https://linkedin.com' },
        { id: 2, nama: 'Reza Rahadian', email: 'reza@email.com', posisi: 'Arsitek / Drafter', telepon: '085544332211', portofolio: 'https://behance.net' }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-900">Data Lamaran Kerja</h1>
        <p className="text-gray-500 mt-1">Daftar calon tim hebat yang ingin bergabung dengan AFKAR LAND.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-600 uppercase tracking-wider">
                <th className="p-4 font-bold">Pelamar</th>
                <th className="p-4 font-bold">Posisi Dilamar</th>
                <th className="p-4 font-bold">Kontak (WA)</th>
                <th className="p-4 font-bold text-center">Portofolio/CV</th>
                <th className="p-4 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Memuat data pelamar...</td></tr>
              ) : apps.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Belum ada lamaran masuk.</td></tr>
              ) : (
                apps.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{app.nama}</div>
                      <div className="text-xs text-gray-500">{app.email}</div>
                    </td>
                    <td className="p-4 font-medium text-brand-primary">{app.posisi}</td>
                    <td className="p-4 text-gray-600">{app.telepon}</td>
                    <td className="p-4 text-center">
                      <a 
                        href={app.portofolio} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
                      >
                        Buka <FiExternalLink />
                      </a>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600">
                        Review
                      </span>
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