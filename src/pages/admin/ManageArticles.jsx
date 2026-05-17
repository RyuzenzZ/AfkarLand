import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, query, orderBy, serverTimestamp
} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import {
  FiPlus, FiEdit2, FiTrash2, FiEye, FiX,
  FiUpload, FiImage, FiLoader, FiAlertCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';

// ═══════════════════════════════════════════════════════════════════
// CLOUDINARY UPLOAD — gratis, CDN global, tidak ada hotlink block
// Ganti imgBB karena imgBB memblokir hotlinking dari domain luar.
//
// CARA SETUP (5 menit, gratis):
//   1. Daftar di https://cloudinary.com (gratis, no kartu kredit)
//   2. Dashboard → Settings → Upload → Add upload preset
//      · Signing Mode: UNSIGNED  ← wajib ini
//      · Folder: articles         ← opsional, untuk organisasi
//      · Klik Save
//   3. Catat: Cloud Name (ada di pojok kiri atas dashboard)
//             Upload Preset Name (yang baru dibuat)
//   4. Tambahkan di file .env:
//        VITE_CLOUDINARY_CLOUD_NAME=namaclouddkamu
//        VITE_CLOUDINARY_UPLOAD_PRESET=nama_preset_kamu
// ═══════════════════════════════════════════════════════════════════

// ─── LOGIKA: Ambil config dari environment variables ────────────────
const CLOUD_NAME     = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME    || '';
const UPLOAD_PRESET  = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

// ─── LOGIKA: Cek apakah Cloudinary sudah dikonfigurasi ─────────────
const CLOUDINARY_READY = Boolean(CLOUD_NAME && UPLOAD_PRESET);

/**
 * Upload gambar ke Cloudinary via XMLHttpRequest
 * Mendukung progress callback real-time (0–100)
 *
 * @param {File}     file        - File gambar yang dipilih user
 * @param {Function} onProgress  - callback(pct: number) untuk progress bar
 * @returns {Promise<string>}    - URL CDN permanent (https://res.cloudinary.com/...)
 */
async function uploadToCloudinary(file, onProgress) {
  // ─── LOGIKA: Validasi config sebelum upload ──────────────────────
  if (!CLOUDINARY_READY) {
    throw new Error(
      'Cloudinary belum dikonfigurasi.\n' +
      '1. Daftar gratis di cloudinary.com\n' +
      '2. Buat unsigned upload preset di Settings → Upload\n' +
      '3. Tambahkan ke .env:\n' +
      '   VITE_CLOUDINARY_CLOUD_NAME=namamu\n' +
      '   VITE_CLOUDINARY_UPLOAD_PRESET=preset_kamu'
    );
  }

  // ─── LOGIKA: Siapkan FormData untuk Cloudinary API ──────────────
  const formData = new FormData();
  formData.append('file',         file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder',       'articles');                   // folder di Cloudinary
  formData.append('public_id',    `article_${Date.now()}`);     // nama unik per file

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  // ─── LOGIKA: Pakai XHR bukan fetch agar dapat event progress ────
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // ─── LOGIKA: Track progress upload secara real-time ──────────
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        onProgress?.(pct);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          // ─── LOGIKA: secure_url = HTTPS CDN URL yang permanent ─
          resolve(data.secure_url);
        } catch {
          reject(new Error('Cloudinary: gagal parse response'));
        }
      } else {
        let errMsg = `Cloudinary error ${xhr.status}`;
        try {
          const errData = JSON.parse(xhr.responseText);
          errMsg = errData?.error?.message || errMsg;
        } catch { /* abaikan */ }
        reject(new Error(errMsg));
      }
    });

    xhr.addEventListener('error',  () => reject(new Error('Cloudinary: koneksi gagal')));
    xhr.addEventListener('abort',  () => reject(new Error('Cloudinary: upload dibatalkan')));

    xhr.open('POST', url);
    xhr.send(formData);
  });
}

// ─── LOGIKA: Konstanta form ──────────────────────────────────────────
const KATEGORI_DEFAULT = ['Edukasi', 'Finansial', 'Investasi', 'Properti Syariah', 'Berita'];
const STATUS_DEFAULT   = ['Draft', 'Published'];

const EMPTY_FORM = {
  judul: '', slug: '', kategori: KATEGORI_DEFAULT[0],
  status: 'Draft', konten: '', thumbnail: '',
};

const statusStyle = {
  Published: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  Draft:     'bg-gray-100 text-gray-500 border border-gray-200',
};

// ─── LOGIKA: Buat slug URL dari teks judul ────────────────────────────
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ─── LOGIKA: Render field form — dipanggil sbg fungsi biasa ───────────
// (bukan component) agar input tidak kehilangan fokus saat re-render
function renderFormFields({
  form, handleChange, handleKategoriChange, handleStatusChange,
  kategoriBaru, setKategoriBaru, statusBaru, setStatusBaru,
  KATEGORI_LIST, STATUS_LIST,
  imageFile, imagePreview, uploadProgress, handleImageSelect, imageInputRef,
}) {
  const showKategoriInput = kategoriBaru !== null || !KATEGORI_LIST.includes(form.kategori);
  const showStatusInput   = statusBaru   !== null || !STATUS_LIST.includes(form.status);

  return (
    <div className="flex flex-col gap-5">

      {/* ── Judul ── */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-1 block">Judul Artikel *</label>
        <input name="judul" value={form.judul} onChange={handleChange}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          placeholder="Masukkan judul artikel..." autoComplete="off" />
      </div>

      {/* ── Slug ── */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-1 block">Slug URL</label>
        <input name="slug" value={form.slug} onChange={handleChange}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          placeholder="judul-artikel-url" autoComplete="off" />
        <p className="text-xs text-gray-400 mt-1">/artikel/{form.slug || '...'}</p>
      </div>

      {/* ── Kategori + Status ── */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-bold text-gray-700 mb-1 block">Kategori</label>
          <select
            value={showKategoriInput ? '__manual__' : form.kategori}
            onChange={handleKategoriChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
          >
            {KATEGORI_LIST.map(k => <option key={k} value={k}>{k}</option>)}
            <option value="__manual__">+ Isi Manual...</option>
          </select>
          {showKategoriInput && (
            <input
              value={form.kategori}
              onChange={e => {
                setKategoriBaru(e.target.value);
                handleChange({ target: { name: 'kategori', value: e.target.value } });
              }}
              className="mt-2 w-full border border-red-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Ketik kategori baru..." autoComplete="off"
            />
          )}
        </div>

        <div>
          <label className="text-sm font-bold text-gray-700 mb-1 block">Status</label>
          <select
            value={showStatusInput ? '__manual__' : form.status}
            onChange={handleStatusChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
          >
            {STATUS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
            <option value="__manual__">+ Isi Manual...</option>
          </select>
          {showStatusInput && (
            <input
              value={form.status}
              onChange={e => {
                setStatusBaru(e.target.value);
                handleChange({ target: { name: 'status', value: e.target.value } });
              }}
              className="mt-2 w-full border border-red-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Ketik status baru..." autoComplete="off"
            />
          )}
        </div>
      </div>

      {/* ── Thumbnail Upload ── */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-2 block">Thumbnail / Gambar</label>

        {/* ─── LOGIKA: Peringatan jika Cloudinary belum dikonfigurasi ── */}
        {!CLOUDINARY_READY && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-3 text-xs text-amber-700">
            <FiAlertCircle className="shrink-0 mt-0.5" size={14} />
            <span>
              Upload file belum aktif. Tambahkan{' '}
              <code className="bg-amber-100 px-1 rounded">VITE_CLOUDINARY_CLOUD_NAME</code> dan{' '}
              <code className="bg-amber-100 px-1 rounded">VITE_CLOUDINARY_UPLOAD_PRESET</code> di{' '}
              <code className="bg-amber-100 px-1 rounded">.env</code> —
              daftar gratis di{' '}
              <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer"
                className="underline font-bold">cloudinary.com</a>.
              Untuk sementara, gunakan URL gambar di bawah.
            </span>
          </div>
        )}

        {/* ─── LOGIKA: Area klik/drop untuk pilih gambar ───────────── */}
        <div
          onClick={() => imageInputRef.current?.click()}
          className="relative border-2 border-dashed border-gray-200 hover:border-red-400 rounded-xl p-4 cursor-pointer transition-colors group"
        >
          {(imagePreview || form.thumbnail) ? (
            <div className="relative">
              {/* ─── LOGIKA: imagePreview = blob URL lokal saat file baru dipilih ─
                            form.thumbnail = URL Cloudinary dari Firestore saat edit */}
              <img
                src={imagePreview || form.thumbnail}
                alt="preview"
                className="w-full h-40 object-cover rounded-lg"
                onError={e => { e.target.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-bold flex items-center gap-1.5">
                  <FiUpload /> Ganti Gambar
                </span>
              </div>
              {/* ─── LOGIKA: Progress bar muncul saat upload ke Cloudinary berlangsung ── */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/30 rounded-b-lg overflow-hidden">
                  <div
                    className="h-full bg-red-500 transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-6 text-gray-400 group-hover:text-red-400 transition-colors">
              <FiImage size={32} />
              <span className="text-sm font-bold">
                {CLOUDINARY_READY ? 'Klik atau seret gambar ke sini' : 'Klik untuk pilih gambar'}
              </span>
              <span className="text-xs text-gray-400">
                JPG, PNG, WEBP · Maks 5 MB · Upload via Cloudinary CDN
              </span>
            </div>
          )}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />
        </div>

        {/* ─── LOGIKA: Info file yang dipilih — diupload saat tombol Simpan ditekan ── */}
        {imageFile && (
          <p className="text-xs text-emerald-600 mt-1.5 font-bold">
            ✓ {imageFile.name} dipilih — akan diupload ke Cloudinary saat simpan
          </p>
        )}

        {/* ─── LOGIKA: Fallback URL manual jika tidak pakai file upload ── */}
        <p className="text-xs text-gray-400 mt-2 mb-1.5">— atau tempel URL gambar langsung —</p>
        <input
          name="thumbnail"
          value={imageFile ? '' : form.thumbnail}
          onChange={handleChange}
          disabled={!!imageFile}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-50 disabled:text-gray-400"
          placeholder="https://example.com/gambar.jpg"
          autoComplete="off"
        />

        {/* ─── LOGIKA: Tombol batal pakai file, kembali ke input URL ── */}
        {imageFile && (
          <button
            type="button"
            onClick={() => {
              if (imageInputRef.current) imageInputRef.current.value = '';
              handleChange({ target: { name: '__resetImage__', value: '' } });
            }}
            className="mt-1.5 text-xs text-red-500 hover:underline"
          >
            × Batal, pakai URL saja
          </button>
        )}
      </div>

      {/* ── Konten Artikel ── */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-1 block">Konten / Isi Artikel</label>
        <textarea
          name="konten"
          value={form.konten}
          onChange={handleChange}
          rows={8}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-y leading-relaxed"
          placeholder="Tulis isi artikel di sini..."
        />
        <p className="text-xs text-gray-400 mt-1">{form.konten.length} karakter</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Komponen Utama ManageArticles
// ═══════════════════════════════════════════════════════════════════
export default function ManageArticles() {
  const [articles,  setArticles]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [saving,    setSaving]    = useState(false);
  const [saveLabel, setSaveLabel] = useState('');

  const [modalTambah,  setModalTambah]  = useState(false);
  const [modalEdit,    setModalEdit]    = useState(null);
  const [modalPreview, setModalPreview] = useState(null);
  const [modalHapus,   setModalHapus]   = useState(null);

  const [imageFile,      setImageFile]      = useState(null);
  const [imagePreview,   setImagePreview]   = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const imageInputRef = useRef(null);

  const [kategoriBaru, setKategoriBaru] = useState(null);
  const [statusBaru,   setStatusBaru]   = useState(null);

  // ─── LOGIKA: Gabungkan kategori default + kategori dari Firestore ─
  const KATEGORI_LIST = [...new Set([...KATEGORI_DEFAULT, ...articles.map(a => a.kategori).filter(Boolean)])];
  const STATUS_LIST   = [...new Set([...STATUS_DEFAULT,   ...articles.map(a => a.status).filter(Boolean)])];

  // ─── LOGIKA: Realtime listener Firestore untuk daftar artikel ────
  useEffect(() => {
    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      snap => {
        setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      () => {
        // ─── LOGIKA: Fallback tanpa orderBy jika belum ada index ──
        const u2 = onSnapshot(collection(db, 'articles'), snap => {
          setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          setLoading(false);
        });
        return u2;
      }
    );
    return () => unsub();
  }, []);

  // ─── LOGIKA: Reset semua state form ke kondisi awal ──────────────
  const resetForm = useCallback(() => {
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview('');
    setUploadProgress(0);
    setKategoriBaru(null);
    setStatusBaru(null);
    setSaveLabel('');
    if (imageInputRef.current) imageInputRef.current.value = '';
  }, []);

  // ─── LOGIKA: Handler perubahan input field ────────────────────────
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    // ─── LOGIKA: Event khusus untuk reset file gambar ────────────
    if (name === '__resetImage__') {
      setImageFile(null);
      setImagePreview('');
      setUploadProgress(0);
      return;
    }

    setForm(prev => ({
      ...prev,
      [name]: value,
      // ─── LOGIKA: Auto-generate slug dari judul saat mode tambah ─
      ...(name === 'judul' && !modalEdit ? { slug: slugify(value) } : {}),
    }));
  }, [modalEdit]);

  const handleKategoriChange = useCallback((e) => {
    const val = e.target.value;
    if (val === '__manual__') {
      setKategoriBaru('');
      setForm(prev => ({ ...prev, kategori: '' }));
    } else {
      setKategoriBaru(null);
      setForm(prev => ({ ...prev, kategori: val }));
    }
  }, []);

  const handleStatusChange = useCallback((e) => {
    const val = e.target.value;
    if (val === '__manual__') {
      setStatusBaru('');
      setForm(prev => ({ ...prev, status: '' }));
    } else {
      setStatusBaru(null);
      setForm(prev => ({ ...prev, status: val }));
    }
  }, []);

  // ─── LOGIKA: Saat user pilih file gambar — buat preview lokal ────
  const handleImageSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran gambar maksimal 5 MB');
      return;
    }
    setImageFile(file);
    // ─── LOGIKA: createObjectURL = URL sementara di browser untuk preview
    setImagePreview(URL.createObjectURL(file));
    setForm(prev => ({ ...prev, thumbnail: '' }));
  }, []);

  // ─── LOGIKA: Simpan artikel — upload gambar dulu jika ada file ───
  const handleSimpan = async (mode) => {
    if (!form.judul.trim())    return toast.error('Judul wajib diisi!');
    if (!form.kategori.trim()) return toast.error('Kategori wajib diisi!');

    setSaving(true);
    let thumbnailUrl = form.thumbnail || '';

    try {
      // ─── LOGIKA: Ada file dipilih → upload ke Cloudinary dulu ──
      if (imageFile) {
        if (!CLOUDINARY_READY) {
          throw new Error(
            'Cloudinary belum dikonfigurasi. Tambahkan VITE_CLOUDINARY_CLOUD_NAME ' +
            'dan VITE_CLOUDINARY_UPLOAD_PRESET di file .env'
          );
        }

        setSaveLabel('Mengupload gambar ke Cloudinary...');
        thumbnailUrl = await uploadToCloudinary(imageFile, (pct) => {
          setUploadProgress(pct);
          setSaveLabel(`Mengupload... ${pct}%`);
        });
        toast.success('Gambar berhasil diupload ke Cloudinary!');
      }

      // ─── LOGIKA: Simpan data artikel + thumbnail URL ke Firestore ─
      setSaveLabel('Menyimpan ke Firestore...');
      const payload = { ...form, thumbnail: thumbnailUrl };
      delete payload.id;

      if (mode === 'tambah') {
        await addDoc(collection(db, 'articles'), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        toast.success('Artikel berhasil ditambahkan!');
        setModalTambah(false);
      } else {
        await updateDoc(doc(db, 'articles', modalEdit.id), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
        toast.success('Artikel berhasil diperbarui!');
        setModalEdit(null);
      }
      resetForm();

    } catch (err) {
      console.error('[ManageArticles] Gagal simpan:', err);
      toast.error(err.message.slice(0, 150), { duration: 10_000 });
    } finally {
      setSaving(false);
      setSaveLabel('');
    }
  };

  // ─── LOGIKA: Toggle status Published ↔ Draft langsung dari tabel ─
  const toggleStatus = async (id, cur) => {
    const next = cur === 'Published' ? 'Draft' : 'Published';
    try {
      await updateDoc(doc(db, 'articles', id), { status: next });
      toast.success(`Status → "${next}"`);
    } catch {
      toast.error('Gagal mengubah status');
    }
  };

  // ─── LOGIKA: Hapus artikel dari Firestore ────────────────────────
  const handleHapus = async () => {
    try {
      await deleteDoc(doc(db, 'articles', modalHapus));
      toast.success('Artikel dihapus');
      setModalHapus(null);
    } catch {
      toast.error('Gagal menghapus artikel');
    }
  };

  // ─── LOGIKA: Format Firestore Timestamp ke string tanggal ─────────
  const formatTanggal = (ts) => {
    if (!ts) return '-';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  // ─── LOGIKA: Buka modal edit dengan data artikel yang dipilih ────
  const bukaEdit = (article) => {
    setForm({ ...article });
    setImageFile(null);
    setImagePreview('');
    setUploadProgress(0);
    setKategoriBaru(KATEGORI_DEFAULT.includes(article.kategori) ? null : article.kategori);
    setStatusBaru(STATUS_DEFAULT.includes(article.status)       ? null : article.status);
    setModalEdit(article);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  // ─── LOGIKA: Props form — dikirim ke renderFormFields ─────────────
  const formProps = {
    form, handleChange, handleKategoriChange, handleStatusChange,
    kategoriBaru, setKategoriBaru, statusBaru, setStatusBaru,
    KATEGORI_LIST, STATUS_LIST,
    imageFile, imagePreview, uploadProgress, handleImageSelect, imageInputRef,
  };

  // ─── LOGIKA: Footer tombol modal — reusable ───────────────────────
  const ModalFooter = ({ mode, onCancel, btnColor }) => (
    <div className="flex gap-3 mt-6">
      <button
        onClick={onCancel}
        disabled={saving}
        className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 text-sm disabled:opacity-50"
      >
        Batal
      </button>
      <button
        onClick={() => handleSimpan(mode)}
        disabled={saving}
        className={`flex-1 py-2.5 ${btnColor} text-white rounded-xl font-bold text-sm disabled:opacity-60 flex items-center justify-center gap-2 transition-colors`}
      >
        {saving
          ? <><FiLoader className="animate-spin" size={14} /> {saveLabel || 'Menyimpan...'}</>
          : mode === 'tambah' ? 'Simpan Artikel' : 'Simpan Perubahan'
        }
      </button>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════
  return (
    <div>

      {/* ── Header ── */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Kelola Artikel</h1>
          <p className="text-gray-500 mt-1">Buat dan kelola konten blog untuk edukasi klien Anda.</p>
        </div>
        <button
          onClick={() => { resetForm(); setModalTambah(true); }}
          className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl hover:bg-red-700 transition-colors font-bold text-sm shadow-sm"
        >
          <FiPlus size={16} /> Tulis Artikel Baru
        </button>
      </div>

      {/* ── Tabel Artikel ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-bold">Judul Artikel</th>
                <th className="p-4 font-bold">Kategori</th>
                <th className="p-4 font-bold">Tanggal</th>
                <th className="p-4 font-bold text-center">Status</th>
                <th className="p-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="p-10 text-center text-gray-400">Memuat data...</td></tr>
              ) : articles.length === 0 ? (
                <tr><td colSpan="5" className="p-10 text-center text-gray-400">Belum ada artikel.</td></tr>
              ) : articles.map(article => (
                <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-semibold text-gray-900 max-w-xs">
                    <div className="flex items-center gap-3">
                      {/* ─── LOGIKA: Thumbnail kecil di tabel — onError sembunyikan jika URL rusak */}
                      {article.thumbnail && (
                        <img
                          src={article.thumbnail}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <span className="truncate">{article.judul}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">
                      {article.kategori}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-sm">{formatTanggal(article.createdAt)}</td>
                  <td className="p-4 text-center">
                    {/* ─── LOGIKA: Klik status di tabel → toggle Published/Draft langsung */}
                    <button
                      onClick={() => toggleStatus(article.id, article.status)}
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${statusStyle[article.status] || 'bg-gray-100 text-gray-500 border border-gray-200'}`}
                    >
                      {article.status}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => setModalPreview(article)} title="Preview"
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                        <FiEye size={15} />
                      </button>
                      <button onClick={() => bukaEdit(article)} title="Edit"
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                        <FiEdit2 size={15} />
                      </button>
                      <button onClick={() => setModalHapus(article.id)} title="Hapus"
                        className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors">
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && (
          <div className="px-4 py-3 border-t border-gray-100 text-sm text-gray-400">
            Total {articles.length} · {articles.filter(a => a.status === 'Published').length} Published · {articles.filter(a => a.status === 'Draft').length} Draft
          </div>
        )}
      </div>

      {/* ══ Modal Tambah Artikel ══ */}
      {modalTambah && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-heading font-bold">Artikel Baru</h2>
              <button onClick={() => { setModalTambah(false); resetForm(); }}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><FiX /></button>
            </div>
            <div className="p-6">
              {renderFormFields(formProps)}
              <ModalFooter mode="tambah" onCancel={() => { setModalTambah(false); resetForm(); }} btnColor="bg-red-600 hover:bg-red-700" />
            </div>
          </div>
        </div>
      )}

      {/* ══ Modal Edit Artikel ══ */}
      {modalEdit && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-heading font-bold">Edit Artikel</h2>
              <button onClick={() => { setModalEdit(null); resetForm(); }}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><FiX /></button>
            </div>
            <div className="p-6">
              {renderFormFields(formProps)}
              <ModalFooter mode="edit" onCancel={() => { setModalEdit(null); resetForm(); }} btnColor="bg-blue-600 hover:bg-blue-700" />
            </div>
          </div>
        </div>
      )}

      {/* ══ Modal Preview Artikel ══ */}
      {modalPreview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-heading font-bold">Preview Artikel</h2>
              <button onClick={() => setModalPreview(null)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><FiX /></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {modalPreview.thumbnail && (
                <img
                  src={modalPreview.thumbnail}
                  alt={modalPreview.judul}
                  className="w-full h-48 object-cover rounded-xl"
                  onError={e => { e.target.style.display = 'none'; }}
                />
              )}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">
                  {modalPreview.kategori}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyle[modalPreview.status] || 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                  {modalPreview.status}
                </span>
              </div>
              <h3 className="text-2xl font-heading font-bold text-gray-900 leading-snug">
                {modalPreview.judul}
              </h3>
              <p className="text-xs text-gray-400">
                {formatTanggal(modalPreview.createdAt)} · /artikel/{modalPreview.slug}
              </p>
              <hr className="border-gray-100" />
              <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                {modalPreview.konten || 'Belum ada konten.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ══ Modal Konfirmasi Hapus ══ */}
      {modalHapus && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrash2 className="text-red-500" size={24} />
            </div>
            <h2 className="text-xl font-heading font-bold text-gray-900 mb-2">Hapus Artikel?</h2>
            <p className="text-gray-500 text-sm mb-6">
              Artikel ini akan dihapus permanen dan tidak bisa dikembalikan.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setModalHapus(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 text-sm">
                Batal
              </button>
              <button onClick={handleHapus}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 text-sm">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}