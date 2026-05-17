// ManageServices.jsx — AFKAR LAND Admin Panel
// CRUD layanan perusahaan yang ditampilkan di halaman publik

import React, { useState, useEffect } from 'react';
import {
  collection, onSnapshot, addDoc, updateDoc,
  deleteDoc, doc, serverTimestamp, query, orderBy
} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave } from 'react-icons/fi';
import { Wrench } from 'lucide-react';
import toast from 'react-hot-toast';

const ICON_OPTIONS = ['🏠','🏢','🌿','💎','🔑','📐','🏗️','🤝','⚡','🛡️','📊','🌍'];

const INITIAL_FORM = {
  nama: '', deskripsi: '', icon: '🏠', detail: '', urutan: 0, aktif: true,
};

const inputCls = "w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-400 outline-none text-sm transition-colors";

export default function ManageServices() {
  const [services, setServices]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [isModalOpen, setIsModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId]       = useState(null);
  const [form, setForm]           = useState(INITIAL_FORM);
  const [modalHapus, setModalHapus] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'services'), orderBy('urutan', 'asc'));
    const unsub = onSnapshot(q,
      snap => { setServices(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false); },
      ()   => {
        const u2 = onSnapshot(collection(db, 'services'), snap => {
          setServices(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false);
        });
        return u2;
      }
    );
    return () => unsub();
  }, []);

  const openAdd = () => {
    setForm({ ...INITIAL_FORM, urutan: services.length });
    setIsEditing(false); setIsModal(true);
  };
  const openEdit = (s) => {
    setForm(s); setEditId(s.id); setIsEditing(true); setIsModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { ...form, urutan: Number(form.urutan), updatedAt: serverTimestamp() };
    try {
      if (isEditing) {
        await updateDoc(doc(db, 'services', editId), payload);
        toast.success('Layanan diperbarui!');
      } else {
        await addDoc(collection(db, 'services'), { ...payload, createdAt: serverTimestamp() });
        toast.success('Layanan baru ditambahkan!');
      }
      setIsModal(false);
    } catch { toast.error('Gagal menyimpan.'); }
  };

  const handleHapus = async () => {
    try {
      await deleteDoc(doc(db, 'services', modalHapus));
      toast.success('Layanan dihapus.'); setModalHapus(null);
    } catch { toast.error('Gagal menghapus.'); }
  };

  const toggleAktif = async (id, current) => {
    try {
      await updateDoc(doc(db, 'services', id), { aktif: !current });
      toast.success(!current ? 'Layanan diaktifkan' : 'Layanan disembunyikan');
    } catch { toast.error('Gagal mengubah status.'); }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Layanan Perusahaan</h1>
          <p className="text-gray-500 mt-1 text-sm">Kelola layanan yang ditampilkan di halaman publik.</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors shadow-sm">
          <FiPlus size={16}/> Tambah Layanan
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Layanan', value: services.length, color: 'text-gray-900' },
          { label: 'Aktif Ditampilkan', value: services.filter(s => s.aktif !== false).length, color: 'text-emerald-600' },
          { label: 'Disembunyikan', value: services.filter(s => s.aktif === false).length, color: 'text-red-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-400 font-medium mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* GRID KARTU LAYANAN */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 animate-pulse">Memuat data layanan...</div>
      ) : services.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 text-gray-400">
          <Wrench size={40} className="mx-auto mb-3 opacity-20"/>
          <p>Belum ada layanan. Tambahkan layanan pertama!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <div key={s.id} className={`bg-white rounded-2xl border shadow-sm p-5 transition-all relative group
              ${s.aktif === false ? 'opacity-50 border-gray-100' : 'border-gray-100 hover:border-red-200 hover:shadow-md'}`}>

              {/* Urutan badge */}
              <span className="absolute top-3 left-3 text-[10px] font-bold text-gray-300 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                #{s.urutan + 1}
              </span>

              {/* Actions */}
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => toggleAktif(s.id, s.aktif !== false)}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${s.aktif !== false ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                  {s.aktif !== false ? '✓' : '○'}
                </button>
                <button onClick={() => openEdit(s)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><FiEdit2 size={13}/></button>
                <button onClick={() => setModalHapus(s.id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><FiTrash2 size={13}/></button>
              </div>

              <div className="mt-4 mb-3">
                <div className="text-4xl mb-3">{s.icon}</div>
                <h3 className="font-bold text-gray-900">{s.nama}</h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{s.deskripsi}</p>
              {s.aktif === false && (
                <span className="inline-block mt-3 text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Disembunyikan</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MODAL TAMBAH / EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="font-heading font-bold text-gray-900">{isEditing ? 'Edit Layanan' : 'Tambah Layanan Baru'}</h2>
              <button onClick={() => setIsModal(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"><FiX/></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Pilih Icon */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Pilih Icon</label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map(ic => (
                    <button type="button" key={ic} onClick={() => setForm(f => ({ ...f, icon: ic }))}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border-2 transition-all
                        ${form.icon === ic ? 'border-red-500 bg-red-50' : 'border-gray-100 hover:border-gray-300'}`}>
                      {ic}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Nama Layanan *</label>
                <input className={inputCls} value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} required placeholder="Konsultasi Properti" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Deskripsi Singkat</label>
                <textarea className={inputCls} rows={2} value={form.deskripsi} onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))} placeholder="Deskripsi layanan..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Detail Lengkap</label>
                <textarea className={inputCls} rows={3} value={form.detail} onChange={e => setForm(f => ({ ...f, detail: e.target.value }))} placeholder="Penjelasan lebih lengkap tentang layanan ini..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Urutan Tampil</label>
                  <input type="number" className={inputCls} value={form.urutan} onChange={e => setForm(f => ({ ...f, urutan: e.target.value }))} min={0} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Status</label>
                  <select className={inputCls} value={form.aktif ? 'aktif' : 'sembunyikan'} onChange={e => setForm(f => ({ ...f, aktif: e.target.value === 'aktif' }))}>
                    <option value="aktif">✅ Tampilkan</option>
                    <option value="sembunyikan">🚫 Sembunyikan</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 flex gap-3">
                <button type="button" onClick={() => setIsModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50">Batal</button>
                <button type="submit" className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                  <FiSave size={15}/> Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HAPUS */}
      {modalHapus && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrash2 className="text-red-500" size={24}/>
            </div>
            <h2 className="text-xl font-heading font-bold text-gray-900 mb-2">Hapus Layanan?</h2>
            <p className="text-gray-500 text-sm mb-6">Data layanan ini akan dihapus permanen dari website.</p>
            <div className="flex gap-3">
              <button onClick={() => setModalHapus(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 text-sm">Batal</button>
              <button onClick={handleHapus} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 text-sm">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}