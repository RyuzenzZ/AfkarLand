// ManageGallery.jsx — AFKAR LAND Admin Panel
// Upload & kelola galeri foto proyek (Firebase Storage + Firestore)

import React, { useState, useEffect, useRef } from 'react';
import {
  collection, onSnapshot, addDoc, deleteDoc, doc,
  serverTimestamp, query, orderBy, updateDoc
} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { FiUpload, FiTrash2, FiX, FiImage, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';

// CATATAN: Upload foto memerlukan Firebase Storage yang dikonfigurasi.
// Untuk demo, galeri menerima URL gambar eksternal.
// Untuk production: tambahkan import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const KATEGORI = ['Semua', 'Eksterior', 'Interior', 'Siteplan', 'Progres Pembangunan', 'Event', 'Lainnya'];

const INITIAL_FORM = { judul: '', kategori: 'Eksterior', url: '', proyek: '', altText: '' };

const inputCls = "w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-400 outline-none text-sm transition-colors";

export default function ManageGallery() {
  const [photos, setPhotos]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('Semua');
  const [isModal, setIsModal]     = useState(false);
  const [form, setForm]           = useState(INITIAL_FORM);
  const [saving, setSaving]       = useState(false);
  const [modalHapus, setModalHapus] = useState(null);
  const [lightbox, setLightbox]   = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q,
      snap => { setPhotos(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false); },
      ()   => {
        const u2 = onSnapshot(collection(db, 'gallery'), snap => {
          setPhotos(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false);
        });
        return u2;
      }
    );
    return () => unsub();
  }, []);

  const filtered = filter === 'Semua' ? photos : photos.filter(p => p.kategori === filter);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.url) return toast.error('URL gambar tidak boleh kosong.');
    setSaving(true);
    try {
      await addDoc(collection(db, 'gallery'), { ...form, createdAt: serverTimestamp() });
      toast.success('Foto berhasil ditambahkan!');
      setIsModal(false); setForm(INITIAL_FORM);
    } catch { toast.error('Gagal menyimpan.'); }
    finally { setSaving(false); }
  };

  const handleHapus = async () => {
    try {
      await deleteDoc(doc(db, 'gallery', modalHapus));
      toast.success('Foto dihapus.'); setModalHapus(null);
    } catch { toast.error('Gagal menghapus.'); }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Galeri Media</h1>
          <p className="text-gray-500 mt-1 text-sm">Kelola foto dan media visual proyek AFKAR LAND.</p>
        </div>
        <button onClick={() => setIsModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors shadow-sm">
          <FiUpload size={16}/> Tambah Foto
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {KATEGORI.filter(k => k !== 'Semua').slice(0, 4).map(k => (
          <div key={k} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="text-2xl font-black text-gray-900">{photos.filter(p => p.kategori === k).length}</div>
            <div className="text-xs text-gray-400 mt-1">{k}</div>
          </div>
        ))}
      </div>

      {/* FILTER KATEGORI */}
      <div className="flex items-center gap-2 flex-wrap">
        <FiFilter size={14} className="text-gray-400"/>
        {KATEGORI.map(k => (
          <button key={k} onClick={() => setFilter(k)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all
              ${filter === k ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            {k} {k !== 'Semua' && `(${photos.filter(p => p.kategori === k).length})`}
          </button>
        ))}
      </div>

      {/* GRID FOTO */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-2xl animate-pulse"/>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 text-gray-400">
          <FiImage size={40} className="mx-auto mb-3 opacity-20"/>
          <p>Belum ada foto di kategori ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((photo) => (
            <div key={photo.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 cursor-pointer"
              onClick={() => setLightbox(photo)}>
              <img
                src={photo.url} alt={photo.altText || photo.judul}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={e => { e.target.src = `https://placehold.co/400x400/f3f4f6/9ca3af?text=${encodeURIComponent(photo.judul || 'Foto')}`; }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100">
                <div className="text-white text-xs font-bold truncate">{photo.judul}</div>
                <div className="text-white/70 text-[10px]">{photo.kategori}</div>
              </div>
              {/* Hapus button */}
              <button
                onClick={e => { e.stopPropagation(); setModalHapus(photo.id); }}
                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700">
                <FiTrash2 size={12}/>
              </button>
              {/* Kategori badge */}
              <span className="absolute top-2 left-2 text-[9px] font-bold bg-black/60 text-white px-2 py-1 rounded-lg">
                {photo.kategori}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* LIGHTBOX */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-xl"><FiX size={24}/></button>
          <div className="max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <img src={lightbox.url} alt={lightbox.altText || lightbox.judul} className="w-full rounded-2xl" />
            <div className="mt-4 text-white">
              <div className="font-bold">{lightbox.judul}</div>
              <div className="text-sm text-white/60">{lightbox.kategori} {lightbox.proyek && `· ${lightbox.proyek}`}</div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH FOTO */}
      {isModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="font-heading font-bold text-gray-900">Tambah Foto</h2>
              <button onClick={() => setIsModal(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"><FiX/></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">URL Foto *</label>
                <input className={inputCls} value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} required placeholder="https://contoh.com/foto.jpg" />
                <p className="text-xs text-gray-400 mt-1">Gunakan URL gambar publik (Firebase Storage, Cloudinary, dll.)</p>
              </div>
              {form.url && (
                <img src={form.url} alt="preview" className="w-full h-32 object-cover rounded-xl border border-gray-100"
                  onError={e => { e.target.style.display = 'none'; }} />
              )}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Judul Foto *</label>
                <input className={inputCls} value={form.judul} onChange={e => setForm(f => ({ ...f, judul: e.target.value }))} required placeholder="Eksterior Type 36/72" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Kategori</label>
                  <select className={inputCls} value={form.kategori} onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))}>
                    {KATEGORI.filter(k => k !== 'Semua').map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Proyek</label>
                  <select className={inputCls} value={form.proyek} onChange={e => setForm(f => ({ ...f, proyek: e.target.value }))}>
                    <option value="">Umum</option>
                    <option value="Masagena Green Hills">Masagena Green Hills</option>
                    <option value="Wotu Islamic Village">Wotu Islamic Village</option>
                    <option value="The Hasanah Panakkukang">The Hasanah</option>
                    <option value="Afkar Madani Estate">Afkar Madani</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Alt Text (SEO)</label>
                <input className={inputCls} value={form.altText} onChange={e => setForm(f => ({ ...f, altText: e.target.value }))} placeholder="Deskripsi gambar untuk mesin pencari" />
              </div>
              <div className="pt-4 border-t border-gray-100 flex gap-3">
                <button type="button" onClick={() => setIsModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50">Batal</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                  <FiUpload size={15}/> {saving ? 'Menyimpan...' : 'Upload Foto'}
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
            <h2 className="text-xl font-heading font-bold text-gray-900 mb-2">Hapus Foto?</h2>
            <p className="text-gray-500 text-sm mb-6">Foto ini akan dihapus permanen.</p>
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