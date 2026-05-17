// ManageTestimonials.jsx — AFKAR LAND Admin Panel
// CRUD testimoni dari klien, lengkap dengan rating bintang

import React, { useState, useEffect } from 'react';
import {
  collection, onSnapshot, addDoc, updateDoc,
  deleteDoc, doc, serverTimestamp, query, orderBy
} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

const INITIAL_FORM = {
  nama: '', jabatan: '', perusahaan: '', foto: '',
  isi: '', rating: 5, proyek: '', tampil: true,
};

const inputCls = "w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-400 outline-none text-sm transition-colors";

const StarRating = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(s => (
      <button type="button" key={s} onClick={() => onChange(s)}
        className={`transition-colors ${s <= value ? 'text-amber-400' : 'text-gray-200'} hover:text-amber-400`}>
        <FiStar size={22} fill={s <= value ? '#fbbf24' : 'none'}/>
      </button>
    ))}
  </div>
);

const TestiCard = ({ t, onEdit, onHapus, onToggle }) => (
  <div className={`bg-white rounded-2xl border p-5 shadow-sm transition-all group relative
    ${t.tampil === false ? 'opacity-50 border-gray-100' : 'border-gray-100 hover:border-red-200 hover:shadow-md'}`}>
    {/* Actions */}
    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button onClick={() => onToggle(t)} title={t.tampil !== false ? 'Sembunyikan' : 'Tampilkan'}
        className={`p-1.5 rounded-lg text-xs font-bold ${t.tampil !== false ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
        {t.tampil !== false ? '👁' : '🚫'}
      </button>
      <button onClick={() => onEdit(t)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><FiEdit2 size={13}/></button>
      <button onClick={() => onHapus(t.id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><FiTrash2 size={13}/></button>
    </div>

    {/* Bintang */}
    <div className="flex gap-0.5 mb-3">
      {[1,2,3,4,5].map(s => (
        <FiStar key={s} size={14} fill={s <= t.rating ? '#fbbf24' : 'none'} className={s <= t.rating ? 'text-amber-400' : 'text-gray-200'}/>
      ))}
    </div>

    {/* Isi testimoni */}
    <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3 italic">"{t.isi}"</p>

    {/* Profil */}
    <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
      {t.foto ? (
        <img src={t.foto} alt={t.nama} className="w-10 h-10 rounded-full object-cover border border-gray-100"/>
      ) : (
        <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center text-base font-extrabold shrink-0">
          {t.nama?.charAt(0)?.toUpperCase()}
        </div>
      )}
      <div>
        <div className="text-sm font-bold text-gray-900">{t.nama}</div>
        <div className="text-xs text-gray-400">{t.jabatan}{t.perusahaan && ` · ${t.perusahaan}`}</div>
      </div>
    </div>
    {t.proyek && (
      <div className="mt-3 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg w-fit">{t.proyek}</div>
    )}
  </div>
);

export default function ManageTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [isModal, setIsModal]           = useState(false);
  const [isEditing, setIsEditing]       = useState(false);
  const [editId, setEditId]             = useState(null);
  const [form, setForm]                 = useState(INITIAL_FORM);
  const [modalHapus, setModalHapus]     = useState(null);
  const [filterRating, setFilterRating] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q,
      snap => { setTestimonials(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false); },
      ()   => {
        const u2 = onSnapshot(collection(db, 'testimonials'), snap => {
          setTestimonials(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false);
        });
        return u2;
      }
    );
    return () => unsub();
  }, []);

  const openAdd  = () => { setForm(INITIAL_FORM); setIsEditing(false); setIsModal(true); };
  const openEdit = (t) => { setForm(t); setEditId(t.id); setIsEditing(true); setIsModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { ...form, rating: Number(form.rating), updatedAt: serverTimestamp() };
    try {
      if (isEditing) {
        await updateDoc(doc(db, 'testimonials', editId), payload);
        toast.success('Testimoni diperbarui!');
      } else {
        await addDoc(collection(db, 'testimonials'), { ...payload, createdAt: serverTimestamp() });
        toast.success('Testimoni ditambahkan!');
      }
      setIsModal(false);
    } catch { toast.error('Gagal menyimpan.'); }
  };

  const handleHapus = async () => {
    try {
      await deleteDoc(doc(db, 'testimonials', modalHapus));
      toast.success('Testimoni dihapus.'); setModalHapus(null);
    } catch { toast.error('Gagal menghapus.'); }
  };

  const handleToggle = async (t) => {
    try {
      await updateDoc(doc(db, 'testimonials', t.id), { tampil: t.tampil === false ? true : false });
      toast.success(t.tampil !== false ? 'Disembunyikan' : 'Ditampilkan');
    } catch { toast.error('Gagal.'); }
  };

  const filtered = filterRating === 0 ? testimonials : testimonials.filter(t => t.rating === filterRating);
  const avgRating = testimonials.length > 0
    ? (testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / testimonials.length).toFixed(1)
    : '-';

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Testimoni Klien</h1>
          <p className="text-gray-500 mt-1 text-sm">Kelola ulasan dan kepuasan klien AFKAR LAND.</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors shadow-sm">
          <FiPlus size={16}/> Tambah Testimoni
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Testimoni', value: testimonials.length, color: 'text-gray-900' },
          { label: 'Rating Rata-rata', value: `${avgRating} ⭐`, color: 'text-amber-500' },
          { label: 'Tampil Publik',   value: testimonials.filter(t => t.tampil !== false).length, color: 'text-emerald-600' },
          { label: 'Bintang 5',       value: testimonials.filter(t => t.rating === 5).length, color: 'text-red-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* FILTER RATING */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-400 font-bold">Filter:</span>
        {[0,5,4,3,2,1].map(r => (
          <button key={r} onClick={() => setFilterRating(r)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all
              ${filterRating === r ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            {r === 0 ? 'Semua' : `${r} Bintang (${testimonials.filter(t => t.rating === r).length})`}
          </button>
        ))}
      </div>

      {/* GRID */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 animate-pulse">Memuat testimoni...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 text-gray-400">
          <FiStar size={40} className="mx-auto mb-3 opacity-20"/>
          <p>Belum ada testimoni.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(t => (
            <TestiCard key={t.id} t={t} onEdit={openEdit} onHapus={setModalHapus} onToggle={handleToggle}/>
          ))}
        </div>
      )}

      {/* MODAL TAMBAH / EDIT */}
      {isModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="font-heading font-bold text-gray-900">{isEditing ? 'Edit Testimoni' : 'Tambah Testimoni'}</h2>
              <button onClick={() => setIsModal(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"><FiX/></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Rating Bintang</label>
                <StarRating value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))}/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Isi Testimoni *</label>
                <textarea className={inputCls} rows={4} value={form.isi} onChange={e => setForm(f => ({ ...f, isi: e.target.value }))} required placeholder="Cerita pengalaman klien..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Nama Klien *</label>
                  <input className={inputCls} value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} required placeholder="Bapak Ahmad" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Jabatan</label>
                  <input className={inputCls} value={form.jabatan} onChange={e => setForm(f => ({ ...f, jabatan: e.target.value }))} placeholder="Pemilik Unit" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Perusahaan</label>
                  <input className={inputCls} value={form.perusahaan} onChange={e => setForm(f => ({ ...f, perusahaan: e.target.value }))} placeholder="Opsional" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Proyek Terkait</label>
                  <select className={inputCls} value={form.proyek} onChange={e => setForm(f => ({ ...f, proyek: e.target.value }))}>
                    <option value="">-- Pilih Proyek --</option>
                    <option>Masagena Green Hills</option>
                    <option>Wotu Islamic Village</option>
                    <option>The Hasanah Panakkukang</option>
                    <option>Afkar Madani Estate</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">URL Foto Profil</label>
                <input className={inputCls} value={form.foto} onChange={e => setForm(f => ({ ...f, foto: e.target.value }))} placeholder="https://contoh.com/foto.jpg (opsional)" />
              </div>
              <div className="flex items-center gap-3 py-2">
                <input type="checkbox" id="tampil" checked={form.tampil !== false} onChange={e => setForm(f => ({ ...f, tampil: e.target.checked }))} className="w-4 h-4 accent-red-600"/>
                <label htmlFor="tampil" className="text-sm text-gray-700 font-medium">Tampilkan di halaman publik</label>
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
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><FiTrash2 className="text-red-500" size={24}/></div>
            <h2 className="text-xl font-heading font-bold text-gray-900 mb-2">Hapus Testimoni?</h2>
            <p className="text-gray-500 text-sm mb-6">Data testimoni ini akan dihapus permanen.</p>
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