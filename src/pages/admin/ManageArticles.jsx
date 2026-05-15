import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiX, FiFileText } from 'react-icons/fi';

// LOGIKA: Pilihan kategori artikel
const KATEGORI_OPTIONS = ['Edukasi', 'Finansial', 'Investasi', 'Properti Syariah', 'Berita'];
const STATUS_OPTIONS   = ['Draft', 'Published'];

const EMPTY_FORM = {
  judul: '', kategori: KATEGORI_OPTIONS[0], status: 'Draft',
  tanggal: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
  konten: '',
};

const statusStyle = {
  Published: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  Draft:     'bg-gray-100 text-gray-500 border border-gray-200',
};

export default function ManageArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState(EMPTY_FORM);

  const [modalTambah, setModalTambah] = useState(false);
  const [modalEdit, setModalEdit]     = useState(null);
  const [modalPreview, setModalPreview] = useState(null);
  const [modalHapus, setModalHapus]   = useState(null);

  // LOGIKA: Load data dummy
  useEffect(() => {
    setTimeout(() => {
      setArticles([
        { id: 1, judul: 'Keunggulan Memilih Properti Syariah di Tahun 2026', kategori: 'Edukasi',   status: 'Published', tanggal: '14 Mei 2026', konten: 'Properti syariah menawarkan berbagai keunggulan dibanding properti konvensional, mulai dari akad yang transparan, bebas riba, hingga kepastian hukum yang lebih jelas bagi pembeli.' },
        { id: 2, judul: 'Tips Menabung untuk Membeli Rumah Tanpa KPR Bank',   kategori: 'Finansial', status: 'Draft',     tanggal: '10 Mei 2026', konten: 'Memiliki rumah tanpa KPR bank adalah impian banyak orang. Dengan disiplin menabung dan memilih developer syariah yang tepat, mimpi ini bisa terwujud.' },
        { id: 3, judul: 'Mengapa Makassar Adalah Lokasi Investasi Terbaik',   kategori: 'Investasi', status: 'Published', tanggal: '02 Mei 2026', konten: 'Makassar sebagai ibukota Sulawesi Selatan terus bertumbuh pesat. Infrastruktur yang berkembang dan pertumbuhan ekonomi yang stabil menjadikannya pilihan investasi properti terbaik.' },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  // LOGIKA: Tambah artikel baru
  const handleTambah = () => {
    if (!form.judul) return alert('Judul artikel wajib diisi!');
    setArticles(prev => [{ ...form, id: Date.now() }, ...prev]);
    setModalTambah(false);
    setForm(EMPTY_FORM);
  };

  // LOGIKA: Buka modal edit dengan data prefill
  const bukaEdit = (article) => {
    setForm({ ...article });
    setModalEdit(article);
  };

  // LOGIKA: Simpan hasil edit
  const handleEdit = () => {
    if (!form.judul) return alert('Judul artikel wajib diisi!');
    setArticles(prev => prev.map(a => a.id === modalEdit.id ? { ...form, id: modalEdit.id } : a));
    setModalEdit(null);
    setForm(EMPTY_FORM);
  };

  // LOGIKA: Toggle status Published/Draft langsung dari tabel
  const toggleStatus = (id) => {
    setArticles(prev => prev.map(a =>
      a.id === id ? { ...a, status: a.status === 'Published' ? 'Draft' : 'Published' } : a
    ));
  };

  // LOGIKA: Hapus artikel
  const handleHapus = () => {
    setArticles(prev => prev.filter(a => a.id !== modalHapus));
    setModalHapus(null);
  };

  // KOMPONEN: Form Artikel
  const FormInput = () => (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-bold text-gray-700 mb-1 block">Judul Artikel *</label>
        <input
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          placeholder="Masukkan judul artikel..."
          value={form.judul}
          onChange={e => setForm(f => ({ ...f, judul: e.target.value }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-bold text-gray-700 mb-1 block">Kategori</label>
          <select
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
            value={form.kategori}
            onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))}
          >
            {KATEGORI_OPTIONS.map(k => <option key={k}>{k}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-bold text-gray-700 mb-1 block">Status</label>
          <select
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
            value={form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
          >
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="text-sm font-bold text-gray-700 mb-1 block">Konten / Isi Artikel</label>
        <textarea
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
          rows={6}
          placeholder="Tulis isi artikel di sini..."
          value={form.konten}
          onChange={e => setForm(f => ({ ...f, konten: e.target.value }))}
        />
      </div>
    </div>
  );

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Kelola Artikel</h1>
          <p className="text-gray-500 mt-1">Buat dan kelola konten blog untuk edukasi klien Anda.</p>
        </div>
        <button
          onClick={() => { setForm(EMPTY_FORM); setModalTambah(true); }}
          className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl hover:bg-red-700 transition-colors font-bold text-sm shadow-sm"
        >
          <FiPlus size={16}/> Tulis Artikel Baru
        </button>
      </div>

      {/* TABEL */}
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
                <tr><td colSpan="5" className="p-10 text-center text-gray-400">Memuat data artikel...</td></tr>
              ) : articles.length === 0 ? (
                <tr><td colSpan="5" className="p-10 text-center text-gray-400">Belum ada artikel.</td></tr>
              ) : articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-semibold text-gray-900 max-w-xs">
                    <div className="truncate">{article.judul}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">{article.kategori}</span>
                  </td>
                  <td className="p-4 text-gray-500 text-sm">{article.tanggal}</td>
                  <td className="p-4 text-center">
                    {/* LOGIKA: Klik badge untuk toggle status */}
                    <button
                      onClick={() => toggleStatus(article.id)}
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${statusStyle[article.status]}`}
                      title="Klik untuk toggle status"
                    >
                      {article.status}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => setModalPreview(article)} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors" title="Preview Artikel"><FiEye size={15}/></button>
                      <button onClick={() => bukaEdit(article)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Edit Artikel"><FiEdit2 size={15}/></button>
                      <button onClick={() => setModalHapus(article.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors" title="Hapus Artikel"><FiTrash2 size={15}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && (
          <div className="px-4 py-3 border-t border-gray-100 text-sm text-gray-400">
            Total {articles.length} artikel · {articles.filter(a => a.status === 'Published').length} Published · {articles.filter(a => a.status === 'Draft').length} Draft
          </div>
        )}
      </div>

      {/* MODAL TAMBAH */}
      {modalTambah && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-heading font-bold">Artikel Baru</h2>
              <button onClick={() => setModalTambah(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><FiX/></button>
            </div>
            <div className="p-6">
              <FormInput />
              <div className="flex gap-3 mt-6">
                <button onClick={() => setModalTambah(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 text-sm">Batal</button>
                <button onClick={handleTambah} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 text-sm">Simpan Artikel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT */}
      {modalEdit && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-heading font-bold">Edit Artikel</h2>
              <button onClick={() => setModalEdit(null)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><FiX/></button>
            </div>
            <div className="p-6">
              <FormInput />
              <div className="flex gap-3 mt-6">
                <button onClick={() => setModalEdit(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 text-sm">Batal</button>
                <button onClick={handleEdit} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 text-sm">Simpan Perubahan</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PREVIEW */}
      {modalPreview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-heading font-bold">Preview Artikel</h2>
              <button onClick={() => setModalPreview(null)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><FiX/></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">{modalPreview.kategori}</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyle[modalPreview.status]}`}>{modalPreview.status}</span>
              </div>
              <h3 className="text-2xl font-heading font-bold text-gray-900 leading-snug">{modalPreview.judul}</h3>
              <p className="text-xs text-gray-400">{modalPreview.tanggal}</p>
              <hr className="border-gray-100"/>
              <p className="text-gray-700 leading-relaxed text-sm">{modalPreview.konten || 'Belum ada konten.'}</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HAPUS */}
      {modalHapus && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><FiTrash2 className="text-red-500" size={24}/></div>
            <h2 className="text-xl font-heading font-bold text-gray-900 mb-2">Hapus Artikel?</h2>
            <p className="text-gray-500 text-sm mb-6">Artikel ini akan dihapus permanen dan tidak bisa dikembalikan.</p>
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