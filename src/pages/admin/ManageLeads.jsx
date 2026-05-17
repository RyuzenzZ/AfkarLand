import React, { useState, useEffect } from 'react';
import { FiEye, FiDownload, FiEdit2, FiTrash2, FiPlus, FiX, FiPhone, FiUser, FiHome, FiDollarSign, FiCheck } from 'react-icons/fi';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import toast from 'react-hot-toast';

// ============================================================
// LOGIKA: Data proyek pilihan (sesuaikan dengan proyek nyata)
// ============================================================
const PROYEK_OPTIONS = [
  'Masagena Green Hills',
  'Wotu Islamic Village',
  'The Hasanah Panakkukang',
  'Afkar Madani Estate',
];

const BUDGET_OPTIONS = [
  'Di bawah 300 Juta',
  '300 Juta - 500 Juta',
  '500 Juta - 1 Miliar',
  'Di atas 1 Miliar',
];

const STATUS_OPTIONS = ['Baru', 'Follow Up', 'Survei', 'Negosiasi', 'Selesai'];

// LOGIKA: Warna badge sesuai status
const statusStyle = {
  'Baru':       'bg-blue-50 text-blue-600 border border-blue-200',
  'Follow Up':  'bg-yellow-50 text-yellow-600 border border-yellow-200',
  'Survei':     'bg-purple-50 text-purple-600 border border-purple-200',
  'Negosiasi':  'bg-orange-50 text-orange-600 border border-orange-200',
  'Selesai':    'bg-emerald-50 text-emerald-600 border border-emerald-200',
};

// LOGIKA: Template data lead kosong untuk form tambah
const EMPTY_FORM = {
  nama: '',
  nomorWa: '',
  pilihanProject: PROYEK_OPTIONS[0],
  estimasiBudget: BUDGET_OPTIONS[0],
  status: 'Baru',
  catatan: '',
};

export default function ManageLeads() {
  const [leads, setLeads]         = useState([]);
  const [loading, setLoading]     = useState(true);

  // LOGIKA: State kontrol modal
  const [modalTambah, setModalTambah]   = useState(false);
  const [modalEdit, setModalEdit]       = useState(null);   // isi = data lead yg diedit
  const [modalReview, setModalReview]   = useState(null);   // isi = data lead yg direview
  const [modalHapus, setModalHapus]     = useState(null);   // isi = id lead yg dihapus

  // LOGIKA: State form input
  const [form, setForm] = useState(EMPTY_FORM);

  // ----------------------------------------------------------------
  // LOGIKA: Load data realtime dari Firestore koleksi 'leads'
  // ----------------------------------------------------------------
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'leads'),
      (snapshot) => {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        // Urutkan terbaru di atas berdasarkan createdAt
        data.sort((a, b) => {
          const timeA = a.createdAt?.toMillis?.() ?? 0;
          const timeB = b.createdAt?.toMillis?.() ?? 0;
          return timeB - timeA;
        });
        setLeads(data);
        setLoading(false);
      },
      (error) => {
        console.error('Gagal memuat leads:', error);
        toast.error('Gagal memuat data lead');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // ----------------------------------------------------------------
  // LOGIKA: Tambah lead baru ke Firestore
  // ----------------------------------------------------------------
  const handleTambah = async () => {
    if (!form.nama || !form.nomorWa) return toast.error('Nama dan Nomor WhatsApp wajib diisi!');
    try {
      await addDoc(collection(db, 'leads'), {
        ...form,
        createdAt: serverTimestamp(),
      });
      toast.success('Lead baru berhasil ditambahkan!');
      setModalTambah(false);
      setForm(EMPTY_FORM);
    } catch (err) {
      console.error(err);
      toast.error('Gagal menyimpan lead');
    }
  };

  // ----------------------------------------------------------------
  // LOGIKA: Buka modal edit dan prefill data
  // ----------------------------------------------------------------
  const bukaEdit = (lead) => {
    setForm({ ...lead });
    setModalEdit(lead);
  };

  // LOGIKA: Simpan hasil edit ke Firestore
  const handleEdit = async () => {
    if (!form.nama || !form.nomorWa) return toast.error('Nama dan Nomor WhatsApp wajib diisi!');
    try {
      const { id, createdAt, ...updateData } = form;
      await updateDoc(doc(db, 'leads', modalEdit.id), {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
      toast.success('Data lead berhasil diperbarui!');
      setModalEdit(null);
      setForm(EMPTY_FORM);
    } catch (err) {
      console.error(err);
      toast.error('Gagal memperbarui lead');
    }
  };

  // ----------------------------------------------------------------
  // LOGIKA: Hapus lead dari Firestore
  // ----------------------------------------------------------------
  const handleHapus = async () => {
    try {
      await deleteDoc(doc(db, 'leads', modalHapus));
      toast.success('Lead berhasil dihapus');
      setModalHapus(null);
    } catch (err) {
      console.error(err);
      toast.error('Gagal menghapus lead');
    }
  };

  // ----------------------------------------------------------------
  // LOGIKA: Update status cepat ke Firestore (tombol centang di tabel)
  // ----------------------------------------------------------------
  const nextStatus = async (lead) => {
    const idx = STATUS_OPTIONS.indexOf(lead.status);
    const next = STATUS_OPTIONS[(idx + 1) % STATUS_OPTIONS.length];
    try {
      await updateDoc(doc(db, 'leads', lead.id), {
        status: next,
        updatedAt: serverTimestamp(),
      });
      toast.success(`Status diubah ke "${next}"`);
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengubah status');
    }
  };

  // ----------------------------------------------------------------
  // LOGIKA: Export seluruh data lead ke file CSV
  // ----------------------------------------------------------------
  const exportCSV = () => {
    const header = ['Nama', 'No. WhatsApp', 'Minat Proyek', 'Estimasi Budget', 'Status', 'Catatan'];
    const rows   = leads.map(l => [l.nama, l.nomorWa, l.pilihanProject, l.estimasiBudget, l.status, l.catatan || '-']);
    const csv    = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob   = new Blob([csv], { type: 'text/csv' });
    const url    = URL.createObjectURL(blob);
    const a      = document.createElement('a');
    a.href = url; a.download = 'data-leads-afkarland.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  // ================================================================
  // KOMPONEN: Form Input (dipakai di modal Tambah & Edit)
  // ================================================================
  const FormInput = () => (
    <div className="flex flex-col gap-4">
      {/* Nama */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-1"><FiUser size={14}/> Nama Klien *</label>
        <input
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          placeholder="Nama lengkap klien"
          value={form.nama}
          onChange={e => setForm(f => ({ ...f, nama: e.target.value }))}
        />
      </div>
      {/* WhatsApp */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-1"><FiPhone size={14}/> No. WhatsApp *</label>
        <input
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          placeholder="08xxxxxxxxxx"
          value={form.nomorWa}
          onChange={e => setForm(f => ({ ...f, nomorWa: e.target.value }))}
        />
      </div>
      {/* Pilihan Proyek */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-1"><FiHome size={14}/> Minat Proyek</label>
        <select
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
          value={form.pilihanProject}
          onChange={e => setForm(f => ({ ...f, pilihanProject: e.target.value }))}
        >
          {PROYEK_OPTIONS.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>
      {/* Budget */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-1"><FiDollarSign size={14}/> Estimasi Budget</label>
        <select
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
          value={form.estimasiBudget}
          onChange={e => setForm(f => ({ ...f, estimasiBudget: e.target.value }))}
        >
          {BUDGET_OPTIONS.map(b => <option key={b}>{b}</option>)}
        </select>
      </div>
      {/* Status */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-1">Status</label>
        <select
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
          value={form.status}
          onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
        >
          {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      {/* Catatan */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-1">Catatan</label>
        <textarea
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
          rows={3}
          placeholder="Catatan tambahan tentang klien..."
          value={form.catatan}
          onChange={e => setForm(f => ({ ...f, catatan: e.target.value }))}
        />
      </div>
    </div>
  );

  // ================================================================
  // RENDER UTAMA
  // ================================================================
  return (
    <div>
      {/* ==================== HEADER ==================== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Data Lead Proyek</h1>
          <p className="text-gray-500 mt-1">Daftar calon konsumen yang meminta jadwal survei/pricelist.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm font-bold shadow-sm"
          >
            <FiDownload size={16}/> Export CSV
          </button>
          <button
            onClick={() => { setForm(EMPTY_FORM); setModalTambah(true); }}
            className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl hover:bg-red-700 transition-colors text-sm font-bold shadow-sm"
          >
            <FiPlus size={16}/> Tambah Lead
          </button>
        </div>
      </div>

      {/* ==================== TABEL ==================== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
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
                <tr><td colSpan="6" className="p-10 text-center text-gray-400">Memuat data lead...</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan="6" className="p-10 text-center text-gray-400">Belum ada data lead masuk.</td></tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-semibold text-gray-900">{lead.nama}</td>
                    <td className="p-4 text-gray-600 font-mono text-sm">{lead.nomorWa}</td>
                    <td className="p-4 text-red-600 font-medium">{lead.pilihanProject}</td>
                    <td className="p-4 text-gray-600 text-sm">{lead.estimasiBudget}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusStyle[lead.status] || 'bg-gray-100 text-gray-600'}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Tombol Review */}
                        <button
                          onClick={() => setModalReview(lead)}
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                          title="Lihat Detail"
                        >
                          <FiEye size={15}/>
                        </button>
                        {/* Tombol Edit */}
                        <button
                          onClick={() => bukaEdit(lead)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          title="Edit Data Lead"
                        >
                          <FiEdit2 size={15}/>
                        </button>
                        {/* Tombol Next Status */}
                        <button
                          onClick={() => nextStatus(lead)}
                          className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                          title="Naikkan Status"
                        >
                          <FiCheck size={15}/>
                        </button>
                        {/* Tombol Hapus */}
                        <button
                          onClick={() => setModalHapus(lead.id)}
                          className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                          title="Hapus Lead"
                        >
                          <FiTrash2 size={15}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Footer tabel */}
        {!loading && (
          <div className="px-4 py-3 border-t border-gray-100 text-sm text-gray-400">
            Total {leads.length} lead terdaftar
          </div>
        )}
      </div>

      {/* ================================================================
          MODAL: TAMBAH LEAD
          ================================================================ */}
      {modalTambah && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-heading font-bold text-gray-900">Tambah Lead Baru</h2>
              <button onClick={() => setModalTambah(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><FiX/></button>
            </div>
            <div className="p-6">
              <FormInput />
              <div className="flex gap-3 mt-6">
                <button onClick={() => setModalTambah(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-colors text-sm">Batal</button>
                <button onClick={handleTambah} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors text-sm">Simpan Lead</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          MODAL: EDIT LEAD
          ================================================================ */}
      {modalEdit && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-heading font-bold text-gray-900">Edit Data Lead</h2>
              <button onClick={() => setModalEdit(null)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><FiX/></button>
            </div>
            <div className="p-6">
              <FormInput />
              <div className="flex gap-3 mt-6">
                <button onClick={() => setModalEdit(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-colors text-sm">Batal</button>
                <button onClick={handleEdit} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors text-sm">Simpan Perubahan</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          MODAL: REVIEW DETAIL LEAD
          ================================================================ */}
      {modalReview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-heading font-bold text-gray-900">Detail Lead</h2>
              <button onClick={() => setModalReview(null)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><FiX/></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {/* Avatar inisial */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center text-2xl font-extrabold">
                  {modalReview.nama.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{modalReview.nama}</div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${statusStyle[modalReview.status]}`}>{modalReview.status}</span>
                </div>
              </div>
              <hr className="border-gray-100"/>
              {/* Detail info */}
              {[
                { label: 'No. WhatsApp',      value: modalReview.nomorWa,        icon: <FiPhone size={14}/> },
                { label: 'Minat Proyek',       value: modalReview.pilihanProject,  icon: <FiHome size={14}/> },
                { label: 'Estimasi Budget',    value: modalReview.estimasiBudget,  icon: <FiDollarSign size={14}/> },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="text-gray-400 mt-0.5">{item.icon}</span>
                  <div>
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">{item.label}</div>
                    <div className="text-sm text-gray-800 font-medium mt-0.5">{item.value}</div>
                  </div>
                </div>
              ))}
              {/* Catatan */}
              {modalReview.catatan && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Catatan</div>
                  <div className="text-sm text-gray-700">{modalReview.catatan}</div>
                </div>
              )}
              {/* Tombol WA langsung */}
              <a
                href={`https://wa.me/62${modalReview.nomorWa.replace(/^0/, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors text-sm mt-2"
              >
                <FiPhone size={16}/> Hubungi via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          MODAL: KONFIRMASI HAPUS
          ================================================================ */}
      {modalHapus && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrash2 className="text-red-500" size={24}/>
            </div>
            <h2 className="text-xl font-heading font-bold text-gray-900 mb-2">Hapus Lead?</h2>
            <p className="text-gray-500 text-sm mb-6">Data lead ini akan dihapus permanen dan tidak bisa dikembalikan.</p>
            <div className="flex gap-3">
              <button onClick={() => setModalHapus(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-colors text-sm">Batal</button>
              <button onClick={handleHapus} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors text-sm">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}