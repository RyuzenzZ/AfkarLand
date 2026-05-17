import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Plus, Edit2, Trash2, X, Save, Image as ImageIcon, 
  List, Users, HelpCircle, BarChart2, Upload, FileText, ExternalLink
} from 'lucide-react';

// ✅ FIX AUDIT: Import db dari config terpusat — bukan initializeApp sendiri
// Path: src/pages/admin/ → ../../config/firebaseConfig (naik 2 level ke src/)
import { db } from '../../config/firebaseConfig';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

// ─────────────────────────────────────────────────────────────
// CLOUDINARY CONFIG
// Ganti dengan Cloud Name & Upload Preset milik akun Cloudinary kamu
// Upload Preset: buat di Cloudinary Dashboard → Settings → Upload → Add upload preset
// Mode preset: UNSIGNED (agar bisa upload langsung dari browser)
// ─────────────────────────────────────────────────────────────
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'your-upload-preset';

// ── KONSTANTA MARKETING (Sinkron dengan ProjectDetail.jsx) ──
const AVAILABLE_MARKETING = [
  { id: 'damar', name: 'Damar Mahendra' },
  { id: 'fila', name: 'Fila Amelia' },
  { id: 'hazfira', name: 'Hazfira' },
  { id: 'erni', name: 'Erni' },
  { id: 'ayu', name: 'Ayu' }
];

const INITIAL_FORM_STATE = {
  slug: '', name: '', tagline: '', desc: '', location: '',
  status: 'Tersedia', badge: 'NEW PROJECT', harga: '', 
  image: '', brosurUrl: '', brosurFileName: '', brosurSize: '', websiteUrl: '',
  order: 1, isFeatured: false,
  features: [''], gallery: [''], marketingIds: [],
  about: '', aboutExtra: '',
  progress: [{ fase: '', label: '', persen: 0, status: 'rencana', tgl: '', ket: '' }],
  faq: [{ q: '', a: '' }]
};

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [activeTab, setActiveTab] = useState('umum'); // Tab form

  // ── CLOUDINARY: Load widget script sekali saat komponen mount ──
  const cloudinaryWidgetRef = useRef(null);
  useEffect(() => {
    if (document.getElementById('cloudinary-widget-script')) return;
    const script = document.createElement('script');
    script.id = 'cloudinary-widget-script';
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // ── CLOUDINARY: Buka widget upload ──
  // mode: 'image' | 'pdf'
  // onSuccess: callback(url, originalFilename, bytes)
  const openCloudinaryWidget = useCallback((mode, onSuccess) => {
    if (!window.cloudinary) {
      toast.error('Widget Cloudinary belum siap, coba lagi sebentar.');
      return;
    }
    const isImage = mode === 'image';
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        resourceType: isImage ? 'image' : 'raw',
        clientAllowedFormats: isImage ? ['jpg', 'jpeg', 'png', 'webp'] : ['pdf'],
        maxFileSize: isImage ? 5000000 : 20000000, // 5MB gambar / 20MB PDF
        cropping: false,
        showSkipCropButton: false,
        language: 'en',
        text: {
          en: {
            or: 'Atau',
            back: 'Kembali',
            advanced: 'Lanjutan',
            close: 'Tutup',
            no_results: 'Tidak ada hasil',
            search_placeholder: 'Cari file...',
            about_uw: 'Upload Widget',
          }
        },
        styles: {
          palette: {
            window: '#FFFFFF',
            windowBorder: '#E5E7EB',
            tabIcon: '#C9A84C',
            menuIcons: '#5A616A',
            textDark: '#000000',
            textLight: '#FFFFFF',
            link: '#C9A84C',
            action: '#C9A84C',
            inactiveTabIcon: '#9CA3AF',
            error: '#EF4444',
            inProgress: '#C9A84C',
            complete: '#10B981',
            sourceBg: '#F9FAFB',
          },
          fonts: { default: null, "'Poppins', sans-serif": { url: 'https://fonts.googleapis.com/css?family=Poppins', active: true } }
        },
      },
      (error, result) => {
        if (error) {
          toast.error('Upload gagal: ' + (error.message || 'Unknown error'));
          return;
        }
        if (result.event === 'success') {
          const info = result.info;
          onSuccess(info.secure_url, info.original_filename, info.bytes);
          widget.close();
          toast.success('✅ File berhasil diupload ke Cloudinary!');
        }
      }
    );
    widget.open();
  }, []);

  // ── CLOUDINARY: Upload galeri — buka widget pilih banyak foto ──
  const openGalleryWidget = useCallback((index) => {
    if (!window.cloudinary) {
      toast.error('Widget Cloudinary belum siap, coba lagi sebentar.');
      return;
    }
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'],
        multiple: index === -1, // -1 = tambah banyak sekaligus, angka = ganti 1 slot
        resourceType: 'image',
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        maxFileSize: 5000000,
        styles: {
          palette: { window: '#FFFFFF', windowBorder: '#E5E7EB', tabIcon: '#C9A84C', link: '#C9A84C', action: '#C9A84C', complete: '#10B981', inProgress: '#C9A84C', error: '#EF4444', sourceBg: '#F9FAFB', textDark: '#000000', textLight: '#FFFFFF', menuIcons: '#5A616A', inactiveTabIcon: '#9CA3AF' },
        },
      },
      (error, result) => {
        if (error) { toast.error('Upload gagal'); return; }
        if (result.event === 'success') {
          const url = result.info.secure_url;
          if (index === -1) {
            // Tambah ke array gallery
            setFormData(prev => ({ ...prev, gallery: [...prev.gallery, url] }));
          } else {
            // Ganti slot tertentu
            handleArrayChange(index, 'gallery', url);
          }
          toast.success('✅ Foto berhasil diupload!');
        }
      }
    );
    widget.open();
  }, []);

  // 1. FETCH DATA REAL-TIME DARI FIREBASE
  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Urutkan berdasarkan field 'order'
        data.sort((a, b) => a.order - b.order);
        setProjects(data);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching projects:", error);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (error) {
      console.warn("Jalankan di environment Firebase yang valid", error);
      setLoading(false);
    }
  }, []);

  // 2. HANDLERS UNTUK INPUT SEDERHANA
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 3. HANDLERS UNTUK ARRAY SEDERHANA (Features, Gallery)
  const handleArrayChange = (index, field, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };
  const addArrayItem = (field) => setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  const removeArrayItem = (index, field) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  // 4. HANDLERS UNTUK ARRAY OF OBJECTS (Progress, FAQ)
  const handleObjectArrayChange = (index, field, subField, value) => {
    const newArray = [...formData[field]];
    newArray[index][subField] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };
  const addProgress = () => {
    setFormData(prev => ({
      ...prev, 
      progress: [...prev.progress, { fase: '', label: '', persen: 0, status: 'rencana', tgl: '', ket: '' }]
    }));
  };
  const addFAQ = () => {
    setFormData(prev => ({ ...prev, faq: [...prev.faq, { q: '', a: '' }] }));
  };
  const removeObjectArrayItem = (index, field) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  // 5. HANDLER CHECKBOX MARKETING
  const handleMarketingChange = (id) => {
    setFormData(prev => {
      const isSelected = prev.marketingIds.includes(id);
      if (isSelected) return { ...prev, marketingIds: prev.marketingIds.filter(m => m !== id) };
      return { ...prev, marketingIds: [...prev.marketingIds, id] };
    });
  };

  // 6. CRUD OPERATIONS
  const openAddModal = () => {
    setFormData(INITIAL_FORM_STATE);
    setIsEditing(false);
    setEditId(null);
    setActiveTab('umum');
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    // Pastikan array tidak undefined jika data lama belum punya
    setFormData({
      ...INITIAL_FORM_STATE,
      ...project,
      features: project.features || [''],
      gallery: project.gallery || [''],
      marketingIds: project.marketingIds || [],
      progress: project.progress || INITIAL_FORM_STATE.progress,
      faq: project.faq || INITIAL_FORM_STATE.faq
    });
    setIsEditing(true);
    setEditId(project.id);
    setActiveTab('umum');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!db) {
       toast.error("Database belum siap.");
       return;
    }
    if (window.confirm('Yakin ingin menghapus proyek ini secara permanen?')) {
      try {
        await deleteDoc(doc(db, 'projects', id));
        toast.success('Proyek berhasil dihapus');
      } catch (error) {
        toast.error('Gagal menghapus proyek');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!db) {
       toast.error("Database belum siap.");
       return;
    }
    setIsSaving(true);
    
    // Pembersihan data kosong di array
    const cleanedData = {
      ...formData,
      features: formData.features.filter(f => f.trim() !== ''),
      gallery: formData.gallery.filter(g => g.trim() !== ''),
      order: Number(formData.order)
    };

    try {
      if (isEditing) {
        await updateDoc(doc(db, 'projects', editId), { ...cleanedData, updatedAt: serverTimestamp() });
        toast.success('Data proyek berhasil diperbarui!');
      } else {
        await addDoc(collection(db, 'projects'), { ...cleanedData, createdAt: serverTimestamp() });
        toast.success('Proyek baru berhasil ditambahkan!');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Terjadi kesalahan saat menyimpan data.');
    } finally {
      setIsSaving(false);
    }
  };

  // KOMPONEN TABS UNTUK FORM (Agar rapi)
  const TABS = [
    { id: 'umum', label: 'Data Umum', icon: <List size={16} /> },
    { id: 'media', label: 'Media & Brosur', icon: <ImageIcon size={16} /> },
    { id: 'detail', label: 'Detail & Fitur', icon: <List size={16} /> },
    { id: 'marketing', label: 'Marketing & Progress', icon: <Users size={16} /> },
    { id: 'faq', label: 'FAQ', icon: <HelpCircle size={16} /> },
  ];

  return (
    <div className="relative">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Kelola Project AFKAR LAND</h1>
          <p className="text-gray-500 mt-1">Atur data project yang tampil di website secara real-time.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b09240] text-black px-6 py-3 rounded-xl transition-all font-bold shadow-lg shadow-[#C9A84C]/20"
        >
          <Plus size={20} /> Tambah Project Baru
        </button>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <th className="p-5 w-16 text-center">Urutan</th>
                <th className="p-5">Nama Project & Lokasi</th>
                <th className="p-5">Status & Badge</th>
                <th className="p-5 text-center">Harga</th>
                <th className="p-5 text-center">Marketing</th>
                <th className="p-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="p-10 text-center text-gray-400 animate-pulse">Menghubungkan ke database...</td></tr>
              ) : projects.length === 0 ? (
                <tr><td colSpan="6" className="p-10 text-center text-gray-400">Belum ada project terdaftar.</td></tr>
              ) : (
                projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-5 text-center font-bold text-gray-400">{proj.order}</td>
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <img src={proj.image || 'https://via.placeholder.com/150'} alt={proj.name} className="w-14 h-14 rounded-lg object-cover bg-gray-100" />
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{proj.name} {proj.isFeatured && <span className="text-yellow-500 text-xs">⭐</span>}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{proj.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${proj.status === 'Tersedia' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {proj.status}
                        </span>
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-gray-100 text-gray-700">
                          {proj.badge}
                        </span>
                      </div>
                    </td>
                    <td className="p-5 text-center font-bold text-gray-700 text-sm">{proj.harga}</td>
                    <td className="p-5 text-center text-sm text-gray-500">{proj.marketingIds?.length || 0} Orang</td>
                    <td className="p-5">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openEditModal(proj)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete(proj.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          MODAL FORM RAKSASA DENGAN TABS
      ════════════════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl h-[90vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {isEditing ? <Edit2 className="text-[#C9A84C]" size={20} /> : <Plus className="text-[#C9A84C]" size={20} />}
                {isEditing ? 'Edit Data Project' : 'Tambah Project Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20}/></button>
            </div>

            {/* Modal Tabs Header */}
            <div className="flex overflow-x-auto border-b border-gray-100 bg-white shrink-0 px-6 no-scrollbar">
              {TABS.map(tab => (
                <button 
                  key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.id ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Form Body (Scrollable) */}
            <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
              <form id="projectForm" onSubmit={handleSubmit} className="space-y-6">
                
                {/* ── TAB 1: DATA UMUM ── */}
                <div className={activeTab === 'umum' ? 'block' : 'hidden'}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Nama Project *</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C9A84C] outline-none" placeholder="Contoh: Masagena Green Hills" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Slug URL * <span className="font-normal text-gray-400">(Tanpa spasi)</span></label>
                      <input type="text" name="slug" required value={formData.slug} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C9A84C] outline-none" placeholder="contoh-nama-project" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Lokasi</label>
                      <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none" placeholder="Contoh: Makassar" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Harga Mulai</label>
                      <input type="text" name="harga" value={formData.harga} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none" placeholder="Contoh: Mulai Rp 350 Juta" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Tagline</label>
                      <input type="text" name="tagline" value={formData.tagline} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none" placeholder="Contoh: Hunian Asri Bernuansa Hijau" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Website URL Khusus</label>
                      <input type="url" name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none" placeholder="https://..." />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-1">Deskripsi Singkat (Card)</label>
                      <textarea name="desc" rows="2" value={formData.desc} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none resize-none" placeholder="Muncul di kotak grid depan..." />
                    </div>
                    
                    {/* Settings Row */}
                    <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm mt-2">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Status Ketersediaan</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border outline-none text-sm">
                          <option value="Tersedia">🟢 Tersedia</option>
                          <option value="Sisa Sedikit">🔴 Sisa Sedikit</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Badge Spesial</label>
                        <select name="badge" value={formData.badge} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border outline-none text-sm">
                          <option value="PROPERTY SYARIAH">PROPERTY SYARIAH</option>
                          <option value="NEW PROJECT">NEW PROJECT</option>
                          <option value="BEST SELLER">BEST SELLER</option>
                          <option value="COMING SOON">COMING SOON</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Urutan Tampil (Order)</label>
                        <input type="number" name="order" value={formData.order} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border outline-none text-sm" />
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <label className="block text-xs font-bold text-gray-500 mb-2">Featured Project? ⭐</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C9A84C]"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── TAB 2: MEDIA & BROSUR ── */}
                <div className={activeTab === 'media' ? 'block' : 'hidden'}>
                  <div className="space-y-6">

                    {/* ── GAMBAR COVER UTAMA ── */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                      <h3 className="font-bold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
                        <ImageIcon size={16} className="text-[#C9A84C]" /> Gambar Utama (Cover)
                      </h3>
                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        {/* Preview */}
                        <div className="w-full md:w-48 h-36 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center">
                          {formData.image
                            ? <img src={formData.image} alt="Cover" className="w-full h-full object-cover" />
                            : <div className="text-center text-gray-300"><ImageIcon size={28} className="mx-auto mb-1" /><p className="text-xs">Belum ada gambar</p></div>
                          }
                        </div>
                        {/* Controls */}
                        <div className="flex-1 space-y-3">
                          <button
                            type="button"
                            onClick={() => openCloudinaryWidget('image', (url) => setFormData(prev => ({ ...prev, image: url })))}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#C9A84C] hover:bg-[#b09240] text-black font-bold text-sm rounded-xl transition-all shadow-sm"
                          >
                            <Upload size={16} /> Pilih / Upload Gambar dari Cloudinary
                          </button>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-px bg-gray-100" />
                            <span className="text-xs text-gray-400">atau tempel URL manual</span>
                            <div className="flex-1 h-px bg-gray-100" />
                          </div>
                          <input
                            type="url" name="image" value={formData.image} onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm text-gray-600"
                            placeholder="https://res.cloudinary.com/..."
                          />
                          {formData.image && (
                            <a href={formData.image} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline">
                              <ExternalLink size={11} /> Buka gambar di tab baru
                            </a>
                          )}
                          <p className="text-[10px] text-gray-400">Format: JPG, PNG, WEBP · Maks. 5 MB · Rasio ideal 4:3</p>
                        </div>
                      </div>
                    </div>

                    {/* ── GALERI FOTO ── */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-center border-b pb-2 mb-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                          <ImageIcon size={16} className="text-blue-500" /> Galeri Foto Slider (Halaman Detail)
                        </h3>
                        <button
                          type="button"
                          onClick={() => openGalleryWidget(-1)}
                          className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 transition-colors"
                        >
                          <Upload size={12} /> Tambah Foto
                        </button>
                      </div>

                      {/* Grid Preview Galeri */}
                      {formData.gallery.filter(u => u).length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                          {formData.gallery.map((url, i) => url && (
                            <div key={i} className="relative group aspect-video rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                              <img src={url} alt={`Galeri ${i + 1}`} className="w-full h-full object-cover" />
                              {/* Overlay actions */}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => openGalleryWidget(i)}
                                  className="p-2 bg-white/90 rounded-lg text-blue-600 hover:bg-white transition-colors"
                                  title="Ganti foto"
                                >
                                  <Upload size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeArrayItem(i, 'gallery')}
                                  className="p-2 bg-white/90 rounded-lg text-red-500 hover:bg-white transition-colors"
                                  title="Hapus foto"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                              <div className="absolute bottom-1 left-1 bg-black/50 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                                {i + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div
                          onClick={() => openGalleryWidget(-1)}
                          className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/5 transition-all group mb-4"
                        >
                          <Upload size={24} className="mx-auto mb-2 text-gray-300 group-hover:text-[#C9A84C] transition-colors" />
                          <p className="text-sm text-gray-400 group-hover:text-gray-600 font-medium">Klik untuk upload foto galeri</p>
                          <p className="text-xs text-gray-300 mt-1">JPG, PNG, WEBP · Maks. 5 MB per foto</p>
                        </div>
                      )}

                      {/* URL manual fallback untuk galeri */}
                      <details className="mt-2">
                        <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 select-none">
                          ▸ Tambah via URL manual (opsional)
                        </summary>
                        <div className="space-y-2 mt-3">
                          {formData.gallery.map((url, i) => (
                            <div key={i} className="flex gap-2">
                              <input
                                type="url" value={url}
                                onChange={(e) => handleArrayChange(i, 'gallery', e.target.value)}
                                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 outline-none text-xs text-gray-600"
                                placeholder="https://res.cloudinary.com/..."
                              />
                              <button type="button" onClick={() => removeArrayItem(i, 'gallery')} className="p-2 text-red-400 bg-red-50 rounded-xl hover:bg-red-100">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                          <button type="button" onClick={() => addArrayItem('gallery')}
                            className="text-xs text-blue-500 hover:text-blue-700 font-medium">
                            + Tambah baris URL
                          </button>
                        </div>
                      </details>
                    </div>

                    {/* ── FILE BROSUR PDF ── */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                      <h3 className="font-bold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
                        <FileText size={16} className="text-red-500" /> File Brosur (PDF)
                      </h3>

                      {/* Preview jika sudah ada */}
                      {formData.brosurUrl && (
                        <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-xl mb-4">
                          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText size={18} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-800 truncate">{formData.brosurFileName || 'Brosur.pdf'}</p>
                            <p className="text-xs text-gray-500">{formData.brosurSize || 'Ukuran tidak diketahui'}</p>
                          </div>
                          <a href={formData.brosurUrl} target="_blank" rel="noopener noreferrer"
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0">
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      )}

                      {/* Tombol upload */}
                      <button
                        type="button"
                        onClick={() => openCloudinaryWidget('pdf', (url, filename, bytes) => {
                          const sizeMB = (bytes / 1048576).toFixed(1);
                          setFormData(prev => ({
                            ...prev,
                            brosurUrl: url,
                            brosurFileName: filename ? `${filename}.pdf` : 'Brosur.pdf',
                            brosurSize: `${sizeMB} MB`,
                          }));
                        })}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm rounded-xl border border-red-200 transition-all"
                      >
                        <Upload size={16} />
                        {formData.brosurUrl ? 'Ganti File Brosur PDF' : 'Upload Brosur PDF ke Cloudinary'}
                      </button>

                      {/* URL manual fallback */}
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-px bg-gray-100" />
                          <span className="text-xs text-gray-400">atau isi manual</span>
                          <div className="flex-1 h-px bg-gray-100" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-gray-500 mb-1">URL File PDF</label>
                            <input type="text" name="brosurUrl" value={formData.brosurUrl} onChange={handleChange}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm"
                              placeholder="https://res.cloudinary.com/... atau /assets/brosur/nama-file.pdf" />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 mb-1">Nama File Download</label>
                            <input type="text" name="brosurFileName" value={formData.brosurFileName} onChange={handleChange}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm"
                              placeholder="Brosur-Project.pdf" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Ukuran File</label>
                            <input type="text" name="brosurSize" value={formData.brosurSize} onChange={handleChange}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm"
                              placeholder="Contoh: 2.4 MB" />
                          </div>
                        </div>
                      </div>

                      {/* Website URL project */}
                      <div className="mt-4">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Website URL Project (Opsional)</label>
                        <input type="url" name="websiteUrl" value={formData.websiteUrl} onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm"
                          placeholder="https://masagena.afkarland.id" />
                      </div>
                    </div>

                  </div>
                </div>

                {/* ── TAB 3: DETAIL & FITUR ── */}
                <div className={activeTab === 'detail' ? 'block' : 'hidden'}>
                  <div className="space-y-6">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                      <h3 className="font-bold text-gray-900 border-b pb-2">Copywriting "Tentang Project"</h3>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Paragraf 1</label>
                        <textarea name="about" rows="3" value={formData.about} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none resize-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Paragraf 2</label>
                        <textarea name="aboutExtra" rows="3" value={formData.aboutExtra} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none resize-none" />
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-center border-b pb-2 mb-4">
                        <h3 className="font-bold text-gray-900">Label Fitur 2x2 (Muncul di Card Depan)</h3>
                        <button type="button" onClick={() => addArrayItem('features')} className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-bold hover:bg-blue-100">+ Tambah Fitur</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {formData.features.map((feat, i) => (
                          <div key={i} className="flex gap-2">
                            <input type="text" value={feat} onChange={(e) => handleArrayChange(i, 'features', e.target.value)} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 outline-none text-sm" placeholder="Contoh: Area Berkembang" />
                            <button type="button" onClick={() => removeArrayItem(i, 'features')} className="p-2 text-red-500 bg-red-50 rounded-xl hover:bg-red-100"><Trash2 size={16} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── TAB 4: MARKETING & PROGRESS ── */}
                <div className={activeTab === 'marketing' ? 'block' : 'hidden'}>
                  <div className="space-y-6">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                      <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Tim Marketing yang Ditugaskan</h3>
                      <p className="text-sm text-gray-500 mb-4">Pilih marketing siapa saja yang akan muncul di halaman detail project ini.</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {AVAILABLE_MARKETING.map(mk => (
                          <label key={mk.id} className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:bg-gray-50 transition-colors">
                            <input 
                              type="checkbox" checked={formData.marketingIds.includes(mk.id)}
                              onChange={() => handleMarketingChange(mk.id)}
                              className="w-5 h-5 text-[#C9A84C] rounded border-gray-300 focus:ring-[#C9A84C]"
                            />
                            <span className="text-sm font-bold text-gray-700">{mk.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-center border-b pb-2 mb-4">
                        <h3 className="font-bold text-gray-900">Timeline Progress Pembangunan</h3>
                        <button type="button" onClick={addProgress} className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-bold hover:bg-blue-100">+ Tambah Fase</button>
                      </div>
                      <div className="space-y-4">
                        {formData.progress.map((prog, i) => (
                          <div key={i} className="flex flex-col gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 relative">
                            <button type="button" onClick={() => removeObjectArrayItem(i, 'progress')} className="absolute top-3 right-3 text-red-500 p-1 bg-white rounded-md hover:bg-red-50"><Trash2 size={14}/></button>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pr-8">
                              <input type="text" value={prog.fase} onChange={e => handleObjectArrayChange(i, 'progress', 'fase', e.target.value)} placeholder="Fase (Cth: Fase 1)" className="px-3 py-2 rounded-lg border outline-none text-sm" />
                              <input type="text" value={prog.label} onChange={e => handleObjectArrayChange(i, 'progress', 'label', e.target.value)} placeholder="Judul (Cth: Land Clearing)" className="px-3 py-2 rounded-lg border outline-none text-sm" />
                              <input type="number" value={prog.persen} onChange={e => handleObjectArrayChange(i, 'progress', 'persen', Number(e.target.value))} placeholder="% Selesai" className="px-3 py-2 rounded-lg border outline-none text-sm" />
                              <input type="text" value={prog.tgl} onChange={e => handleObjectArrayChange(i, 'progress', 'tgl', e.target.value)} placeholder="Bulan (Cth: Jan 2024)" className="px-3 py-2 rounded-lg border outline-none text-sm" />
                            </div>
                            <div className="flex gap-3">
                              <select value={prog.status} onChange={e => handleObjectArrayChange(i, 'progress', 'status', e.target.value)} className="px-3 py-2 rounded-lg border outline-none text-sm w-1/4">
                                <option value="selesai">Selesai</option>
                                <option value="berjalan">Berjalan</option>
                                <option value="rencana">Rencana</option>
                              </select>
                              <input type="text" value={prog.ket} onChange={e => handleObjectArrayChange(i, 'progress', 'ket', e.target.value)} placeholder="Keterangan progress..." className="flex-1 px-3 py-2 rounded-lg border outline-none text-sm" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── TAB 5: FAQ ── */}
                <div className={activeTab === 'faq' ? 'block' : 'hidden'}>
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center border-b pb-2 mb-4">
                      <h3 className="font-bold text-gray-900">Frequently Asked Questions (FAQ)</h3>
                      <button type="button" onClick={addFAQ} className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-bold hover:bg-blue-100">+ Tambah Pertanyaan</button>
                    </div>
                    <div className="space-y-4">
                      {formData.faq.map((item, i) => (
                        <div key={i} className="flex gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="flex-1 space-y-2">
                            <input type="text" value={item.q} onChange={e => handleObjectArrayChange(i, 'faq', 'q', e.target.value)} placeholder="Pertanyaan..." className="w-full px-4 py-2 rounded-lg border outline-none text-sm font-bold" />
                            <textarea rows="2" value={item.a} onChange={e => handleObjectArrayChange(i, 'faq', 'a', e.target.value)} placeholder="Jawaban lengkap..." className="w-full px-4 py-2 rounded-lg border outline-none text-sm resize-none" />
                          </div>
                          <button type="button" onClick={() => removeObjectArrayItem(i, 'faq')} className="p-3 text-red-500 bg-white border border-gray-200 rounded-xl hover:bg-red-50 h-fit"><Trash2 size={18}/></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </form>
            </div>

            {/* Modal Footer / Submit Button */}
            <div className="p-6 border-t border-gray-100 bg-white shrink-0">
              <button 
                type="submit" form="projectForm" disabled={isSaving}
                className="w-full py-4 bg-black text-[#C9A84C] hover:bg-gray-900 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isSaving ? 'Menyimpan ke Database...' : <><Save size={18} /> Simpan Data Project</>}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}