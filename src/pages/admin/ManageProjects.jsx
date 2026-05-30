import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Plus, Edit2, Trash2, X, Save, Image as ImageIcon,
  List, Users, HelpCircle, Upload, ExternalLink,
  Home, DollarSign, Link as LinkIcon, Star
} from 'lucide-react';

import { db } from '../../config/firebaseConfig';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { compareProjectsByFreshness } from '../../utils/projectData';

// ─────────────────────────────────────────────────────────────
// CLOUDINARY CONFIG — hanya untuk upload gambar (bukan PDF)
// ─────────────────────────────────────────────────────────────
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'your-upload-preset';

// ── KONSTANTA MARKETING (Sinkron dengan ProjectDetail.jsx) ──
const AVAILABLE_MARKETING = [
  {
    id: 'damar', name: 'Damar Mahendra', role: 'Marketing Executive',
    specialty: 'Properti Syariah & Investasi',
    photo: 'https://ui-avatars.com/api/?name=Damar+Mahendra&background=C0392B&color=fff&size=200&bold=true',
    online: true
  },
  {
    id: 'fila', name: 'Fila Amelia', role: 'Marketing Executive',
    specialty: 'Akad Syariah & Cash Bertahap',
    photo: 'https://ui-avatars.com/api/?name=Fila+Amelia&background=C0392B&color=fff&size=200&bold=true',
    online: true
  },
  {
    id: 'hazfira', name: 'Hazfira', role: 'Marketing Executive',
    specialty: 'Investasi & Cash Bertahap',
    photo: 'https://ui-avatars.com/api/?name=Hazfira&background=C0392B&color=fff&size=200&bold=true',
    online: true
  },
  {
    id: 'erni', name: 'Erni', role: 'Marketing Executive',
    specialty: 'Konsultasi Properti Syariah',
    photo: 'https://ui-avatars.com/api/?name=Erni&background=C0392B&color=fff&size=200&bold=true',
    online: true
  },
  {
    id: 'ayu', name: 'Ayu', role: 'Marketing Executive',
    specialty: 'Survey Lokasi & Negosiasi',
    photo: 'https://ui-avatars.com/api/?name=Ayu&background=C0392B&color=fff&size=200&bold=true',
    online: true
  }
];

const PROJECT_PRESETS = [
  'MASAGENA GREEN HILLS',
  'WOTU ISLAMIC VILLAGE',
  'AFKAR MADANI ESTATE',
  'THE HASANAH PANAKKUKANG',
];

const slugify = (value = '') => String(value)
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const normalizeMarketingProfile = (item = {}, index = 0) => {
  const name = String(item.name || '').trim();
  const id = item.id || `manual-${slugify(name || `marketing-${index + 1}`)}`;
  const photo = item.photo || item.foto || '';
  return {
    ...INITIAL_CUSTOM_MARKETING,
    ...item,
    id,
    name,
    role: item.role || 'Marketing Executive',
    specialty: item.specialty || item.ahli || item.spesialisasi || '',
    photo,
    foto: photo,
    wa: item.wa || '',
    phone: item.phone || '',
    online: item.online !== false,
  };
};

const hasPricelistContent = (item = {}) => [
  'tipe', 'lantai', 'kamar', 'luasBangunan', 'luasTanah', 'normal', 'hargaMulai',
  'cashKeras', 'cashLunak', 'cashBertahap', 'kprSyariah', 'dp', 'angsuran',
  'tenor', 'bookingFee', 'stok', 'angsuran12', 'angsuran24', 'angsuran36',
  'biayaAkad', 'bphtb', 'promoBonus', 'promoNote'
].some(field => String(item[field] || '').trim() !== '');

// ── INITIAL FORM STATE ──
// tipeUnit: sesuai struktur ProjectDetail.jsx (t.tipe, t.lantai, t.kamar, t.normal, t.cashKeras, t.cashLunak)
const INITIAL_TIPE_UNIT = {
  tipe: '', lantai: '', kamar: '', luasBangunan: '', luasTanah: '',
  normal: '', hargaMulai: '', cashKeras: '', cashLunak: '',
  dp: '', angsuran: '', tenor: '', bookingFee: '', stok: '',
  cashBertahap: '', kprSyariah: '', angsuran12: '', angsuran24: '', angsuran36: '',
  biayaAkad: '', bphtb: '', promoBonus: '', promoNote: ''
};
const INITIAL_ADVANTAGE = { emoji: '', title: '', desc: '' };
const INITIAL_FACILITY = { emoji: '', label: '' };
const INITIAL_CUSTOM_MARKETING = {
  id: '', name: '', role: 'Marketing Executive', specialty: '',
  photo: '', foto: '', wa: '', phone: '', online: true
};

const INITIAL_FORM_STATE = {
  slug: '', name: '', projectPreset: '', tagline: '', desc: '', location: '', locationDetail: '',
  address: '', area: '', city: '', province: '', mapsUrl: '', latitude: '', longitude: '',
  status: 'Tersedia', statusLabel: '', badge: 'NEW PROJECT', launchingDate: '', harga: '',
  image: '',
  // Brosur: cukup isi link manual (tidak lagi upload ke Cloudinary)
  brosurUrl: '', brosurFileName: '', brosurSize: '',
  websiteUrl: '',
  order: 1, isFeatured: false,
  features: [''], gallery: [''], marketingIds: [], customMarketing: [],
  about: '', aboutExtra: '',
  advantages: [], facilities: [],
  // Tipe unit: array sesuai struktur ProjectDetail.jsx
  tipeUnit: [],
  progress: [{ fase: '', label: '', persen: 0, status: 'rencana', tgl: '', ket: '' }],
  faq: [{ q: '', a: '' }]
};

const toStringArray = (value, fallback = []) => {
  if (!Array.isArray(value)) return [...fallback];
  return value.map(item => (typeof item === 'string' ? item : String(item ?? '')));
};

const toObjectArray = (value, fallback = []) => {
  if (!Array.isArray(value)) return fallback.map(item => ({ ...item }));
  return value
    .filter(item => item && typeof item === 'object' && !Array.isArray(item))
    .map(item => ({ ...item }));
};

const createInitialFormState = () => ({
  ...INITIAL_FORM_STATE,
  features: [...INITIAL_FORM_STATE.features],
  gallery: [...INITIAL_FORM_STATE.gallery],
  marketingIds: [...INITIAL_FORM_STATE.marketingIds],
  customMarketing: [...INITIAL_FORM_STATE.customMarketing],
  advantages: [...INITIAL_FORM_STATE.advantages],
  facilities: [...INITIAL_FORM_STATE.facilities],
  tipeUnit: [...INITIAL_FORM_STATE.tipeUnit],
  progress: INITIAL_FORM_STATE.progress.map(item => ({ ...item })),
  faq: INITIAL_FORM_STATE.faq.map(item => ({ ...item })),
});

const normalizeProjectForm = (project = {}) => ({
  ...createInitialFormState(),
  ...project,
  features: toStringArray(project.features, INITIAL_FORM_STATE.features),
  gallery: toStringArray(project.gallery, INITIAL_FORM_STATE.gallery),
  marketingIds: toStringArray(project.marketingIds),
  customMarketing: toObjectArray(project.customMarketing).map(normalizeMarketingProfile),
  advantages: toObjectArray(project.advantages),
  facilities: toObjectArray(project.facilities),
  tipeUnit: toObjectArray(project.tipeUnit),
  progress: toObjectArray(project.progress, INITIAL_FORM_STATE.progress),
  faq: toObjectArray(project.faq, INITIAL_FORM_STATE.faq),
  order: Number(project.order || 1),
});

const isWebsiteProject = (project = {}) => Boolean(
  project.name || project.slug || project.tagline || project.desc ||
  project.harga || project.image || project.websiteUrl || project.brosurUrl
);

// ─────────────────────────────────────────────────────────────
// KOMPONEN BANTU: Label Section dalam form
// ─────────────────────────────────────────────────────────────
function SectionCard({ title, icon, description, children, action }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      <div className="flex flex-col gap-2 border-b border-gray-100 bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white shadow-sm">
            {icon}
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-extrabold text-gray-900">{title}</h3>
            {description && <p className="mt-1 text-xs leading-relaxed text-gray-500">{description}</p>}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="space-y-3 p-3 sm:p-4">{children}</div>
    </div>
  );
}

// Komponen input field yang bersih
function FormField({ label, required, hint, children }) {
  return (
    <div>
      <label className="block text-[11px] font-extrabold text-gray-500 mb-2 uppercase tracking-wider">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-[11px] leading-relaxed text-gray-400">{hint}</p>}
    </div>
  );
}

const inputClass = "min-h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 caret-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-red-500 focus:ring-3 focus:ring-red-500/10";
const selectClass = "min-h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 outline-none transition-all focus:border-red-500 focus:ring-3 focus:ring-red-500/10";

// ─────────────────────────────────────────────────────────────
// KOMPONEN UTAMA
// ─────────────────────────────────────────────────────────────
export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [hiddenOperationalProjects, setHiddenOperationalProjects] = useState(0);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(createInitialFormState);
  const [activeTab, setActiveTab] = useState('umum');
  const formScrollRef = useRef(null);

  // ── Load Cloudinary widget script (untuk gambar saja) ──
  useEffect(() => {
    if (document.getElementById('cloudinary-widget-script')) return;
    const script = document.createElement('script');
    script.id = 'cloudinary-widget-script';
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // ── Cloudinary: Upload gambar ──
  const openCloudinaryWidget = useCallback((onSuccess) => {
    if (!window.cloudinary) {
      toast.error('Widget Cloudinary belum siap, coba lagi sebentar.');
      return;
    }
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        resourceType: 'image',
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        maxFileSize: 5000000,
        cropping: false,
        styles: {
          palette: {
            window: '#FFFFFF', windowBorder: '#E5E7EB', tabIcon: '#C9A84C',
            link: '#C9A84C', action: '#C9A84C', complete: '#10B981',
            inProgress: '#C9A84C', error: '#EF4444', sourceBg: '#F9FAFB',
            textDark: '#000000', textLight: '#FFFFFF', menuIcons: '#5A616A', inactiveTabIcon: '#9CA3AF'
          }
        },
      },
      (error, result) => {
        if (error) { toast.error('Upload gagal: ' + (error.message || 'Unknown error')); return; }
        if (result.event === 'success') {
          onSuccess(result.info.secure_url);
          widget.close();
          toast.success('✅ Gambar berhasil diupload!');
        }
      }
    );
    widget.open();
  }, []);

  // ── Cloudinary: Upload galeri ──
  const openGalleryWidget = useCallback((index) => {
    if (!window.cloudinary) { toast.error('Widget Cloudinary belum siap.'); return; }
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'],
        multiple: index === -1,
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
            setFormData(prev => ({ ...prev, gallery: [...prev.gallery.filter(g => g), url] }));
          } else {
            handleArrayChange(index, 'gallery', url);
          }
          toast.success('✅ Foto berhasil diupload!');
        }
      }
    );
    widget.open();
  }, []);

  // ── FETCH REALTIME FIREBASE ──
  useEffect(() => {
    if (!db) { setLoading(false); return; }
    try {
      const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
        const rawData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const websiteProjects = rawData.filter(isWebsiteProject);
        websiteProjects.sort((a, b) => (a.order || 0) - (b.order || 0));
        setHiddenOperationalProjects(rawData.length - websiteProjects.length);
        setProjects(websiteProjects);
        setLoading(false);
      }, (error) => {
        console.error('Error fetching projects:', error);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (error) {
      console.warn('Jalankan di environment Firebase yang valid', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    formScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // ── HANDLERS ──
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      if (name === 'name') {
        return {
          ...prev,
          name: value,
          slug: slugify(value),
          projectPreset: PROJECT_PRESETS.includes(value) ? value : '__manual__',
        };
      }
      if (name === 'slug') {
        return { ...prev, slug: slugify(value) };
      }
      return { ...prev, [name]: type === 'checkbox' ? checked : value };
    });
  };

  const handleProjectPresetChange = (e) => {
    const value = e.target.value;
    if (value === '__manual__') {
      setFormData(prev => ({
        ...prev,
        projectPreset: '__manual__',
        name: PROJECT_PRESETS.includes(prev.name) ? '' : prev.name,
        slug: PROJECT_PRESETS.includes(prev.name) ? '' : prev.slug,
      }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      projectPreset: value,
      name: value,
      slug: slugify(value),
      websiteUrl: prev.websiteUrl || `/proyek/${slugify(value)}`,
    }));
  };

  const handleArrayChange = (index, field, value) => {
    const newArray = toStringArray(formData[field]);
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };
  const addArrayItem = (field) => setFormData(prev => ({ ...prev, [field]: [...toStringArray(prev[field]), ''] }));
  const removeArrayItem = (index, field) => {
    setFormData(prev => ({ ...prev, [field]: toStringArray(prev[field]).filter((_, i) => i !== index) }));
  };

  const handleObjectArrayChange = (index, field, subField, value) => {
    const newArray = toObjectArray(formData[field]);
    newArray[index] = { ...newArray[index], [subField]: value };
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };
  const removeObjectArrayItem = (index, field) => {
    setFormData(prev => ({ ...prev, [field]: toObjectArray(prev[field]).filter((_, i) => i !== index) }));
  };

  const addProgress = () => {
    setFormData(prev => ({ ...prev, progress: [...toObjectArray(prev.progress), { fase: '', label: '', persen: 0, status: 'rencana', tgl: '', ket: '' }] }));
  };
  const addFAQ = () => {
    setFormData(prev => ({ ...prev, faq: [...toObjectArray(prev.faq), { q: '', a: '' }] }));
  };
  const addAdvantage = () => {
    setFormData(prev => ({ ...prev, advantages: [...toObjectArray(prev.advantages), { ...INITIAL_ADVANTAGE }] }));
  };
  const addFacility = () => {
    setFormData(prev => ({ ...prev, facilities: [...toObjectArray(prev.facilities), { ...INITIAL_FACILITY }] }));
  };

  // ── HANDLERS TIPE UNIT ──
  const addTipeUnit = () => {
    setFormData(prev => ({ ...prev, tipeUnit: [...toObjectArray(prev.tipeUnit), { ...INITIAL_TIPE_UNIT }] }));
  };
  const handleTipeUnitChange = (index, field, value) => {
    const newArray = toObjectArray(formData.tipeUnit);
    newArray[index] = { ...newArray[index], [field]: value };
    setFormData(prev => ({ ...prev, tipeUnit: newArray }));
  };
  const removeTipeUnit = (index) => {
    setFormData(prev => ({ ...prev, tipeUnit: toObjectArray(prev.tipeUnit).filter((_, i) => i !== index) }));
  };

  const handleMarketingChange = (id) => {
    setFormData(prev => {
      const marketingIds = toStringArray(prev.marketingIds);
      const isSelected = marketingIds.includes(id);
      return isSelected
        ? { ...prev, marketingIds: marketingIds.filter(m => m !== id) }
        : { ...prev, marketingIds: [...marketingIds, id] };
    });
  };

  const addCustomMarketing = () => {
    const id = `manual-${Date.now()}`;
    setFormData(prev => ({
      ...prev,
      customMarketing: [...toObjectArray(prev.customMarketing), { ...INITIAL_CUSTOM_MARKETING, id }],
    }));
  };

  const handleCustomMarketingChange = (index, field, value) => {
    const next = toObjectArray(formData.customMarketing).map(normalizeMarketingProfile);
    const current = normalizeMarketingProfile(next[index], index);
    const updated = { ...current, [field]: value };
    if (field === 'photo' || field === 'foto') {
      updated.photo = value;
      updated.foto = value;
    }
    next[index] = normalizeMarketingProfile(updated, index);
    setFormData(prev => ({ ...prev, customMarketing: next }));
  };

  const removeCustomMarketing = (index) => {
    setFormData(prev => {
      const customMarketing = toObjectArray(prev.customMarketing).map(normalizeMarketingProfile);
      const removedId = customMarketing[index]?.id;
      return {
        ...prev,
        customMarketing: customMarketing.filter((_, i) => i !== index),
        marketingIds: toStringArray(prev.marketingIds).filter(id => id !== removedId),
      };
    });
  };

  // ── CRUD ──
  const openAddModal = () => {
    setFormData(createInitialFormState());
    setIsEditing(false);
    setEditId(null);
    setActiveTab('umum');
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setFormData(normalizeProjectForm(project));
    setIsEditing(true);
    setEditId(project.id);
    setActiveTab('umum');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!db) { toast.error('Database belum siap.'); return; }
    if (window.confirm('Yakin ingin menghapus proyek ini secara permanen?')) {
      try {
        await deleteDoc(doc(db, 'projects', id));
        toast.success('Proyek berhasil dihapus');
      } catch {
        toast.error('Gagal menghapus proyek');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!db) { toast.error('Database belum siap.'); return; }
    setIsSaving(true);
    const rawTipeUnit = toObjectArray(formData.tipeUnit);
    const invalidPricelist = rawTipeUnit.find(item => hasPricelistContent(item) && !String(item.tipe || '').trim());
    if (invalidPricelist) {
      toast.error('Nama Tipe Unit wajib diisi pada setiap pricelist yang berisi harga/skema.');
      setActiveTab('tipeunit');
      setIsSaving(false);
      return;
    }
    const gallery = toStringArray(formData.gallery).filter(g => g.trim() !== '');
    const name = String(formData.name || '').trim();
    const slug = slugify(formData.slug || name);

    if (!name || !slug) {
      toast.error('Nama Project wajib diisi agar slug halaman publik bisa dibuat.');
      setActiveTab('umum');
      setIsSaving(false);
      return;
    }

    const cleanedData = {
      ...formData,
      name,
      slug,
      websiteUrl: formData.websiteUrl || `/proyek/${slug}`,
      features: toStringArray(formData.features).filter(f => f.trim() !== ''),
      gallery: gallery.length ? gallery : [formData.image].filter(Boolean),
      marketingIds: toStringArray(formData.marketingIds),
      customMarketing: toObjectArray(formData.customMarketing)
        .map(normalizeMarketingProfile)
        .filter(item => item.name),
      tipeUnit: rawTipeUnit.filter(t => String(t.tipe || '').trim() !== ''),
      advantages: toObjectArray(formData.advantages).filter(item => String(item.title || '').trim() !== ''),
      facilities: toObjectArray(formData.facilities).filter(item => String(item.label || '').trim() !== ''),
      progress: toObjectArray(formData.progress),
      faq: toObjectArray(formData.faq),
      order:     Number(formData.order)
    };
    delete cleanedData.id;
    try {
      if (isEditing) {
        await updateDoc(doc(db, 'projects', editId), { ...cleanedData, updatedAt: serverTimestamp() });
        toast.success('✅ Data proyek berhasil diperbarui!');
      } else {
        const existingSnap = await getDocs(query(collection(db, 'projects'), where('slug', '==', cleanedData.slug)));
        const existingDocs = existingSnap.docs
          .map(snapshotDoc => ({ snapshotDoc, data: { id: snapshotDoc.id, ...snapshotDoc.data() } }))
          .sort((a, b) => compareProjectsByFreshness(a.data, b.data));

        if (existingDocs.length > 0) {
          await updateDoc(existingDocs[0].snapshotDoc.ref, { ...cleanedData, updatedAt: serverTimestamp() });
          toast.success('Data proyek dengan slug yang sama berhasil diperbarui!');
        } else {
          await addDoc(collection(db, 'projects'), { ...cleanedData, createdAt: serverTimestamp() });
          toast.success('Proyek baru berhasil ditambahkan!');
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Terjadi kesalahan saat menyimpan data.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── TABS DEFINISI ──
  const TABS = [
    { id: 'umum',      label: 'Data Umum',        icon: <List size={14} /> },
    { id: 'media',     label: 'Media & Brosur',   icon: <ImageIcon size={14} /> },
    { id: 'detail',    label: 'Detail & Fitur',   icon: <Home size={14} /> },
    { id: 'tipeunit',  label: 'Pricelist',        icon: <DollarSign size={14} /> },
    { id: 'marketing', label: 'Marketing',         icon: <Users size={14} /> },
    { id: 'progress',  label: 'Progress',          icon: <List size={14} /> },
    { id: 'faq',       label: 'FAQ',              icon: <HelpCircle size={14} /> },
  ];

  const featureItems = toStringArray(formData.features);
  const galleryItems = toStringArray(formData.gallery);
  const marketingItems = toStringArray(formData.marketingIds);
  const customMarketingItems = toObjectArray(formData.customMarketing).map(normalizeMarketingProfile);
  const marketingOptions = [...AVAILABLE_MARKETING, ...customMarketingItems];
  const advantageItems = toObjectArray(formData.advantages);
  const facilityItems = toObjectArray(formData.facilities);
  const tipeUnitItems = toObjectArray(formData.tipeUnit);
  const progressItems = toObjectArray(formData.progress);
  const faqItems = toObjectArray(formData.faq);
  const selectedProjectPreset = PROJECT_PRESETS.includes(formData.name) ? formData.name : (formData.projectPreset || '__manual__');
  const projectPublicPath = formData.slug ? `/proyek/${formData.slug}` : '/proyek/...';

  // ──────────────────────────────────────────────────────────
  return (
    <div className="relative">

      {/* ── HEADER ── */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900 md:text-3xl">Kelola Project AFKAR LAND</h1>
          <p className="text-gray-500 mt-1 text-sm">Atur data project yang tampil di website secara real-time.</p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-[#C9A84C] px-4 py-2.5 text-sm font-bold text-black shadow-lg shadow-[#C9A84C]/20 transition-all hover:bg-[#b09240]"
        >
          <Plus size={18} /> Tambah Project Baru
        </button>
      </div>

      {/* ── TABLE ── */}
      {hiddenOperationalProjects > 0 && (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <span className="font-bold">{hiddenOperationalProjects} data operasional siteplan</span> disembunyikan dari Manage Project website agar form tidak membaca format data yang salah.
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                <th className="p-5 w-16 text-center">Urutan</th>
                <th className="p-5">Nama Project & Lokasi</th>
                <th className="p-5">Status & Badge</th>
                <th className="p-5 text-center">Harga</th>
                <th className="p-5 text-center">Tipe Unit</th>
                <th className="p-5 text-center">Marketing</th>
                <th className="p-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="7" className="p-10 text-center text-gray-400 animate-pulse text-sm">Menghubungkan ke database...</td></tr>
              ) : projects.length === 0 ? (
                <tr><td colSpan="7" className="p-10 text-center text-gray-400 text-sm">Belum ada project terdaftar.</td></tr>
              ) : (
                projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="p-5 text-center font-bold text-gray-300 text-sm">{proj.order}</td>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <img src={proj.image || 'https://via.placeholder.com/150'} alt={proj.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0" />
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{proj.name} {proj.isFeatured && <span className="text-yellow-500">⭐</span>}</p>
                          <p className="text-gray-400 text-xs mt-0.5">{proj.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${proj.status === 'Tersedia' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {proj.status}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-600">{proj.badge}</span>
                      </div>
                    </td>
                    <td className="p-5 text-center font-bold text-gray-700 text-sm">{proj.harga}</td>
                    <td className="p-5 text-center text-sm text-gray-400">{proj.tipeUnit?.length || 0} Tipe</td>
                    <td className="p-5 text-center text-sm text-gray-400">{proj.marketingIds?.length || 0} Orang</td>
                    <td className="p-5">
                      <div className="flex justify-center gap-2">
                        <button type="button" onClick={() => openEditModal(proj)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><Edit2 size={16} /></button>
                        <button type="button" onClick={() => handleDelete(proj.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors" title="Hapus"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          MODAL FORM
      ════════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-gray-950/70 p-2 backdrop-blur-sm md:p-4">
          <div className="my-2 w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl md:my-4 md:max-w-6xl">

            {/* Modal Header */}
            <div className="flex shrink-0 items-start justify-between border-b border-gray-100 bg-white px-5 py-4 md:px-6 md:py-5">
              <div>
                <h2 className="font-heading text-xl font-bold text-gray-900">
                  {isEditing ? 'Edit Data Proyek' : 'Tambah Proyek Baru'}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Lengkapi data utama, media, pricelist, marketing, progress, dan FAQ yang tampil di halaman proyek.
                </p>
                {isEditing && <p className="mt-1 text-xs text-gray-400">ID: {editId}</p>}
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100"><X size={18} /></button>
            </div>

            {/* Modal Tabs */}
            <div className="shrink-0 border-b border-gray-100 bg-white px-4 py-3 md:px-6">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
              {TABS.map(tab => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 text-[11px] font-extrabold whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-red-600 text-white shadow-sm shadow-red-600/20'
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
              </div>
            </div>

            {/* Form Body (Scrollable) */}
            <div ref={formScrollRef} className="bg-gray-50">
              <form id="projectForm" onSubmit={handleSubmit} noValidate className="mx-auto max-w-5xl space-y-4 p-4 md:p-6">

                {/* ══════════════════════════════════════════
                    TAB 1: DATA UMUM
                ══════════════════════════════════════════ */}
                <div className={activeTab === 'umum' ? 'block space-y-5' : 'hidden'}>

                  {/* Identitas Project */}
                  <SectionCard title="Identitas Project" icon={<Home size={14} className="text-[#C9A84C]" />}>
                    <div className="rounded-xl border border-red-100 bg-red-50/60 px-3 py-2">
                      <p className="text-[11px] font-bold text-red-700">Alur cepat</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-red-700/75">
                        Mulai dari nama proyek, lokasi, harga, dan deskripsi singkat. Slug dipakai untuk URL detail proyek, contoh: <span className="font-mono">/proyek/masagena-green-hills</span>.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                      <div className="md:col-span-2 xl:col-span-3">
                        <FormField label="Pilih Project" required hint="Pilih project utama. Jika ada project baru, pilih Tambah Manual.">
                          <select value={selectedProjectPreset} onChange={handleProjectPresetChange} className={selectClass}>
                            <option value="">Pilih project...</option>
                            {PROJECT_PRESETS.map(projectName => (
                              <option key={projectName} value={projectName}>{projectName}</option>
                            ))}
                            <option value="__manual__">+ Tambah Manual</option>
                          </select>
                        </FormField>
                      </div>
                      <FormField label="Nama Project" required>
                        <input type="text" name="name" required value={formData.name} onChange={handleChange}
                          className={inputClass} placeholder="Contoh: Masagena Green Hills" disabled={selectedProjectPreset !== '__manual__' && selectedProjectPreset !== ''} />
                      </FormField>
                      <FormField label="Slug URL" required hint="Tanpa spasi, huruf kecil">
                        <input type="text" name="slug" required value={formData.slug} onChange={handleChange}
                          className={inputClass} placeholder="masagena-green-hills" />
                      </FormField>
                      <FormField label="Link Halaman Project" hint="Route publik otomatis sesuai slug">
                        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700">
                          <span className="truncate">{projectPublicPath}</span>
                          <a href={projectPublicPath.replace('/proyek/...', '/proyek')} target="_blank" rel="noopener noreferrer"
                            className="ml-auto shrink-0 rounded-md bg-white px-2 py-1 text-[10px] text-blue-600 shadow-sm hover:text-blue-700">
                            Preview
                          </a>
                        </div>
                      </FormField>
                      <FormField label="Tagline">
                        <input type="text" name="tagline" value={formData.tagline} onChange={handleChange}
                          className={inputClass} placeholder="Hunian Asri Bernuansa Hijau" />
                      </FormField>
                      <FormField label="Lokasi">
                        <input type="text" name="location" value={formData.location} onChange={handleChange}
                          className={inputClass} placeholder="Makassar, Sul-Sel" />
                      </FormField>
                      <FormField label="Detail Lokasi" hint="Tampil di kartu dan hero detail jika diisi">
                        <input type="text" name="locationDetail" value={formData.locationDetail} onChange={handleChange}
                          className={inputClass} placeholder="Contoh: Tamalanrea, dekat kampus dan akses kota" />
                      </FormField>
                      <FormField label="Alamat Project">
                        <input type="text" name="address" value={formData.address} onChange={handleChange}
                          className={inputClass} placeholder="Alamat lengkap lokasi project" />
                      </FormField>
                      <FormField label="Area / Kecamatan">
                        <input type="text" name="area" value={formData.area} onChange={handleChange}
                          className={inputClass} placeholder="Contoh: Panakkukang" />
                      </FormField>
                      <FormField label="Kota">
                        <input type="text" name="city" value={formData.city} onChange={handleChange}
                          className={inputClass} placeholder="Makassar" />
                      </FormField>
                      <FormField label="Provinsi">
                        <input type="text" name="province" value={formData.province} onChange={handleChange}
                          className={inputClass} placeholder="Sulawesi Selatan" />
                      </FormField>
                      <FormField label="Harga Mulai">
                        <input type="text" name="harga" value={formData.harga} onChange={handleChange}
                          className={inputClass} placeholder="Mulai Rp 350 Juta" />
                      </FormField>
                      <FormField label="Website URL Khusus" hint="Opsional">
                        <input type="url" name="websiteUrl" value={formData.websiteUrl} onChange={handleChange}
                          className={inputClass} placeholder="https://masagena.afkarland.id" />
                      </FormField>
                      <FormField label="Label Status" hint="Opsional, contoh: Sisa 5 Unit">
                        <input type="text" name="statusLabel" value={formData.statusLabel} onChange={handleChange}
                          className={inputClass} placeholder="Sisa Sedikit!" />
                      </FormField>
                      <FormField label="Tanggal Launching" hint="Opsional untuk Coming Soon">
                        <input type="text" name="launchingDate" value={formData.launchingDate} onChange={handleChange}
                          className={inputClass} placeholder="Juni 2026" />
                      </FormField>
                      <div className="md:col-span-2 xl:col-span-3">
                        <FormField label="Google Maps URL" hint="Opsional, dipakai untuk tombol arah lokasi jika nanti ditampilkan.">
                          <input type="url" name="mapsUrl" value={formData.mapsUrl} onChange={handleChange}
                            className={inputClass} placeholder="https://maps.google.com/..." />
                        </FormField>
                      </div>
                      <div className="md:col-span-2 xl:col-span-3">
                        <FormField label="Deskripsi Singkat" hint="Muncul di kartu grid halaman project">
                          <textarea name="desc" rows="2" value={formData.desc} onChange={handleChange}
                            className={`${inputClass} resize-none`} placeholder="Kawasan hunian syariah modern dengan lingkungan strategis..." />
                        </FormField>
                      </div>
                    </div>
                  </SectionCard>

                  {/* Pengaturan Tampilan */}
                  <SectionCard title="Pengaturan Tampilan" icon={<List size={14} className="text-blue-500" />}>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <FormField label="Status Ketersediaan">
                        <select name="status" value={formData.status} onChange={handleChange} className={selectClass}>
                          <option value="Tersedia">🟢 Tersedia</option>
                          <option value="Sisa Sedikit">🔴 Sisa Sedikit</option>
                          <option value="Coming Soon">⏳ Coming Soon</option>
                        </select>
                      </FormField>
                      <FormField label="Badge Spesial">
                        <select name="badge" value={formData.badge} onChange={handleChange} className={selectClass}>
                          <option value="PROPERTY SYARIAH">PROPERTY SYARIAH</option>
                          <option value="NEW PROJECT">NEW PROJECT</option>
                          <option value="BEST SELLER">BEST SELLER</option>
                          <option value="COMING SOON">COMING SOON</option>
                          <option value="BEST PREMIUM LOCATION">BEST PREMIUM LOCATION</option>
                          <option value="LAUNCHING JUNI">LAUNCHING JUNI</option>
                        </select>
                      </FormField>
                      <FormField label="Urutan Tampil">
                        <input type="number" name="order" min="1" value={formData.order} onChange={handleChange} className={selectClass} />
                      </FormField>
                      <div className="flex flex-col">
                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Featured? ⭐</label>
                        <div className="flex items-center gap-3 mt-1">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="sr-only peer" />
                            <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C9A84C]"></div>
                          </label>
                          <span className="text-xs text-gray-500">{formData.isFeatured ? 'Ya' : 'Tidak'}</span>
                        </div>
                      </div>
                    </div>
                  </SectionCard>

                </div>

                {/* ══════════════════════════════════════════
                    TAB 2: MEDIA & BROSUR
                ══════════════════════════════════════════ */}
                <div className={activeTab === 'media' ? 'block space-y-5' : 'hidden'}>

                  {/* Gambar Cover */}
                  <SectionCard title="Gambar Utama (Cover)" icon={<ImageIcon size={14} className="text-[#C9A84C]" />}>
                    <div className="flex flex-col md:flex-row gap-5 items-start">
                      <div className="w-full md:w-44 h-32 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden shrink-0 bg-gray-50 flex items-center justify-center">
                        {formData.image
                          ? <img src={formData.image} alt="Cover" className="w-full h-full object-cover" />
                          : <div className="text-center text-gray-300"><ImageIcon size={24} className="mx-auto mb-1" /><p className="text-xs">Preview</p></div>
                        }
                      </div>
                      <div className="flex-1 space-y-3">
                        <button type="button"
                          onClick={() => openCloudinaryWidget((url) => setFormData(prev => ({ ...prev, image: url })))}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#C9A84C] hover:bg-[#b09240] text-black font-bold text-sm rounded-xl transition-all"
                        >
                          <Upload size={15} /> Upload Gambar Cover
                        </button>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-px bg-gray-100" />
                          <span className="text-xs text-gray-400">atau isi URL manual</span>
                          <div className="flex-1 h-px bg-gray-100" />
                        </div>
                        <input type="url" name="image" value={formData.image} onChange={handleChange}
                          className={inputClass} placeholder="https://res.cloudinary.com/..." />
                        {formData.image && (
                          <a href={formData.image} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline">
                            <ExternalLink size={11} /> Buka di tab baru
                          </a>
                        )}
                        <p className="text-[10px] text-gray-400">JPG, PNG, WEBP · Maks. 5 MB · Rasio ideal 4:3</p>
                      </div>
                    </div>
                  </SectionCard>

                  {/* Galeri Foto */}
                  <SectionCard
                    title="Galeri Foto Slider"
                    icon={<ImageIcon size={14} className="text-blue-500" />}
                    action={
                      <button type="button" onClick={() => openGalleryWidget(-1)}
                        className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 transition-colors">
                        <Upload size={12} /> Tambah Foto
                      </button>
                    }
                  >
                    {galleryItems.filter(u => u).length > 0 ? (
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5 mb-4">
                        {galleryItems.map((url, i) => url && (
                          <div key={i} className="relative group aspect-video rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                            <img src={url} alt={`Galeri ${i + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button type="button" onClick={() => openGalleryWidget(i)}
                                className="p-1.5 bg-white/90 rounded-lg text-blue-600 hover:bg-white" title="Ganti">
                                <Upload size={12} />
                              </button>
                              <button type="button" onClick={() => removeArrayItem(i, 'gallery')}
                                className="p-1.5 bg-white/90 rounded-lg text-red-500 hover:bg-white" title="Hapus">
                                <Trash2 size={12} />
                              </button>
                            </div>
                            <div className="absolute bottom-1 left-1 bg-black/50 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">{i + 1}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div onClick={() => openGalleryWidget(-1)}
                        className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/3 transition-all mb-4">
                        <Upload size={22} className="mx-auto mb-2 text-gray-300" />
                        <p className="text-sm text-gray-400">Klik untuk upload foto galeri</p>
                        <p className="text-xs text-gray-300 mt-1">JPG, PNG, WEBP · Maks. 5 MB per foto</p>
                      </div>
                    )}
                    {/* URL manual galeri */}
                    <details className="mt-1">
                      <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 select-none">▸ Tambah via URL manual</summary>
                      <div className="space-y-2 mt-3">
                        {galleryItems.map((url, i) => (
                          <div key={i} className="flex gap-2">
                            <input type="url" value={url} onChange={(e) => handleArrayChange(i, 'gallery', e.target.value)}
                              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 outline-none text-xs" placeholder="https://res.cloudinary.com/..." />
                            <button type="button" onClick={() => removeArrayItem(i, 'gallery')} className="p-2 text-red-400 bg-red-50 rounded-xl"><Trash2 size={13} /></button>
                          </div>
                        ))}
                        <button type="button" onClick={() => addArrayItem('gallery')} className="text-xs text-blue-500 hover:text-blue-700 font-medium">+ Tambah baris URL</button>
                      </div>
                    </details>
                  </SectionCard>

                  {/* ── BROSUR: Link Manual Saja ── */}
                  <SectionCard title="Brosur Project" icon={<LinkIcon size={14} className="text-red-500" />}>
                    <div className="space-y-4">
                      {/* Info */}
                      <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <span className="text-amber-500 text-sm mt-0.5">📌</span>
                        <p className="text-xs text-amber-700 leading-relaxed">
                          Isi link brosur secara manual. Bisa berupa link Google Drive, Dropbox, atau URL file PDF yang sudah diupload.
                          Link ini akan muncul sebagai tombol <strong>"Download Brosur"</strong> di halaman detail project.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <FormField label="URL Brosur (Link Langsung)" hint="PDF / Google Drive / Dropbox">
                            <div className="flex gap-2">
                              <input type="url" name="brosurUrl" value={formData.brosurUrl} onChange={handleChange}
                                className={inputClass} placeholder="https://drive.google.com/file/d/.../view" />
                              {formData.brosurUrl && (
                                <a href={formData.brosurUrl} target="_blank" rel="noopener noreferrer"
                                  className="shrink-0 p-2.5 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-100 transition-colors" title="Buka link">
                                  <ExternalLink size={16} />
                                </a>
                              )}
                            </div>
                          </FormField>
                        </div>
                        <FormField label="Nama File Brosur" hint="Tampil di halaman detail">
                          <input type="text" name="brosurFileName" value={formData.brosurFileName} onChange={handleChange}
                            className={inputClass} placeholder="Brosur Masagena Green Hills 2024" />
                        </FormField>
                        <FormField label="Ukuran File" hint="Info saja, misal 2.4 MB">
                          <input type="text" name="brosurSize" value={formData.brosurSize} onChange={handleChange}
                            className={inputClass} placeholder="2.4 MB" />
                        </FormField>
                      </div>

                      {/* Preview status */}
                      {formData.brosurUrl && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                          <span className="text-green-500">✅</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-green-700">{formData.brosurFileName || 'Brosur'}</p>
                            <p className="text-[10px] text-green-600 truncate">{formData.brosurUrl}</p>
                          </div>
                          <button type="button" onClick={() => setFormData(prev => ({ ...prev, brosurUrl: '', brosurFileName: '', brosurSize: '' }))}
                            className="shrink-0 p-1 text-red-400 hover:text-red-600">
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </SectionCard>

                </div>

                {/* ══════════════════════════════════════════
                    TAB 3: DETAIL & FITUR
                ══════════════════════════════════════════ */}
                <div className={activeTab === 'detail' ? 'block space-y-5' : 'hidden'}>

                  <SectionCard title='Copywriting "Tentang Project"' icon={<List size={14} className="text-purple-500" />}>
                    <div className="space-y-4">
                      <FormField label="Paragraf 1">
                        <textarea name="about" rows="3" value={formData.about} onChange={handleChange}
                          className={`${inputClass} resize-none`} placeholder="Deskripsi utama tentang project ini..." />
                      </FormField>
                      <FormField label="Paragraf 2" hint="Opsional">
                        <textarea name="aboutExtra" rows="3" value={formData.aboutExtra} onChange={handleChange}
                          className={`${inputClass} resize-none`} placeholder="Paragraf tambahan, keunggulan, atau informasi penting lainnya..." />
                      </FormField>
                    </div>
                  </SectionCard>

                  <SectionCard
                    title="Label Fitur (2×2 Grid pada Kartu)"
                    icon={<Home size={14} className="text-green-500" />}
                    action={
                      <button type="button" onClick={() => addArrayItem('features')}
                        className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100">
                        + Tambah Fitur
                      </button>
                    }
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {featureItems.map((feat, i) => (
                        <div key={i} className="flex gap-2">
                          <input type="text" value={feat} onChange={(e) => handleArrayChange(i, 'features', e.target.value)}
                            className={inputClass} placeholder="Contoh: Area Berkembang" />
                          <button type="button" onClick={() => removeArrayItem(i, 'features')}
                            className="p-2 text-red-400 bg-red-50 rounded-xl hover:bg-red-100"><Trash2 size={14} /></button>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-3">Maksimal 4 fitur yang akan tampil di kartu grid halaman project.</p>
                  </SectionCard>

                  <SectionCard
                    title="Keunggulan Project Detail"
                    description="Isi poin keunggulan yang tampil di halaman detail project. Jika kosong, halaman detail memakai daftar default."
                    icon={<Star size={14} className="text-yellow-500" />}
                    action={
                      <button type="button" onClick={addAdvantage}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-50 px-3 py-1.5 text-xs font-bold text-yellow-700 transition-colors hover:bg-yellow-100">
                        <Plus size={12} /> Tambah
                      </button>
                    }
                  >
                    <div className="space-y-3">
                      {advantageItems.map((item, i) => (
                        <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-gray-500 shadow-sm">Keunggulan #{i + 1}</span>
                            <button type="button" onClick={() => removeObjectArrayItem(i, 'advantages')}
                              className="rounded-lg bg-red-50 p-2 text-red-400 transition-colors hover:bg-red-100">
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-[96px_1fr_1.6fr]">
                            <FormField label="Icon">
                              <input type="text" value={item.emoji || ''} onChange={e => handleObjectArrayChange(i, 'advantages', 'emoji', e.target.value)}
                                className={inputClass} placeholder="Icon" />
                            </FormField>
                            <FormField label="Judul">
                              <input type="text" value={item.title || ''} onChange={e => handleObjectArrayChange(i, 'advantages', 'title', e.target.value)}
                                className={inputClass} placeholder="Tanpa Riba" />
                            </FormField>
                            <FormField label="Deskripsi">
                              <input type="text" value={item.desc || ''} onChange={e => handleObjectArrayChange(i, 'advantages', 'desc', e.target.value)}
                                className={inputClass} placeholder="Deskripsi singkat keunggulan" />
                            </FormField>
                          </div>
                        </div>
                      ))}
                      {advantageItems.length === 0 && (
                        <button type="button" onClick={addAdvantage}
                          className="w-full rounded-xl border-2 border-dashed border-gray-200 py-6 text-sm font-bold text-gray-400 transition-all hover:border-yellow-300 hover:bg-yellow-50/40 hover:text-yellow-700">
                          Tambah keunggulan khusus project
                        </button>
                      )}
                    </div>
                  </SectionCard>

                  <SectionCard
                    title="Fasilitas Kawasan"
                    description="Tambahkan fasilitas kawasan yang ingin ditampilkan pada halaman detail project."
                    icon={<Home size={14} className="text-emerald-500" />}
                    action={
                      <button type="button" onClick={addFacility}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100">
                        <Plus size={12} /> Tambah
                      </button>
                    }
                  >
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {facilityItems.map((item, i) => (
                        <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-gray-500 shadow-sm">Fasilitas #{i + 1}</span>
                            <button type="button" onClick={() => removeObjectArrayItem(i, 'facilities')}
                              className="rounded-lg bg-red-50 p-2 text-red-400 transition-colors hover:bg-red-100">
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="grid grid-cols-[88px_1fr] gap-3">
                            <FormField label="Icon">
                              <input type="text" value={item.emoji || ''} onChange={e => handleObjectArrayChange(i, 'facilities', 'emoji', e.target.value)}
                                className={inputClass} placeholder="Icon" />
                            </FormField>
                            <FormField label="Nama Fasilitas">
                              <input type="text" value={item.label || ''} onChange={e => handleObjectArrayChange(i, 'facilities', 'label', e.target.value)}
                                className={inputClass} placeholder="Masjid / Security 24 Jam" />
                            </FormField>
                          </div>
                        </div>
                      ))}
                    </div>
                    {facilityItems.length === 0 && (
                      <button type="button" onClick={addFacility}
                        className="w-full rounded-xl border-2 border-dashed border-gray-200 py-6 text-sm font-bold text-gray-400 transition-all hover:border-emerald-300 hover:bg-emerald-50/40 hover:text-emerald-700">
                        Tambah fasilitas project
                      </button>
                    )}
                  </SectionCard>

                </div>

                {/* ══════════════════════════════════════════
                    TAB 4: TIPE UNIT
                ══════════════════════════════════════════ */}
                <div className={activeTab === 'tipeunit' ? 'block space-y-5' : 'hidden'}>

                  <SectionCard
                    title="Pricelist & Tipe Unit"
                    description="Kelola tabel harga, promo cash keras, dan cash lunak yang tampil langsung di halaman detail project."
                    icon={<DollarSign size={14} className="text-[#C9A84C]" />}
                    action={
                      <button type="button" onClick={addTipeUnit}
                        className="flex items-center gap-1.5 rounded-lg bg-[#C9A84C]/10 px-3 py-1.5 text-xs font-bold text-[#9d7a28] transition-colors hover:bg-[#C9A84C]/20">
                        <Plus size={12} /> Tambah Pricelist
                      </button>
                    }
                  >
                    {/* Info */}
                    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                      <span className="text-amber-500 mt-0.5">💡</span>
                      <div className="text-xs text-amber-700 leading-relaxed">
                        Data ini akan tampil sebagai <strong>tabel pricelist</strong> di halaman detail project.
                        Kolom: <strong>Tipe Unit · Lantai/Kamar · Harga Normal · Promo Cash Keras · Cash Lunak</strong>.
                        Kosongkan tabel ini jika project berstatus <em>Coming Soon</em>.
                      </div>
                    </div>

                    {tipeUnitItems.length === 0 ? (
                      <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/70 py-10 text-center">
                        <DollarSign size={28} className="mx-auto mb-3 text-gray-300" />
                        <p className="text-sm text-gray-400 font-medium">Belum ada tipe unit</p>
                        <p className="text-xs text-gray-300 mt-1 mb-4">Klik tombol "Tambah Pricelist" untuk mulai mengisi harga</p>
                        <button type="button" onClick={addTipeUnit}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A84C] hover:bg-[#b09240] text-black font-bold text-sm rounded-xl transition-all">
                          <Plus size={14} /> Tambah Pricelist Pertama
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {tipeUnitItems.map((unit, i) => (
                          <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                            {/* Header baris */}
                            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-extrabold text-gray-500 shadow-sm">
                                  Pricelist #{i + 1}
                                </span>
                                <p className="mt-2 text-sm font-bold text-gray-900">{unit.tipe || 'Tipe unit belum diisi'}</p>
                              </div>
                              <button type="button" onClick={() => removeTipeUnit(i)}
                                className="self-start rounded-lg border border-red-100 bg-white p-2 text-red-400 transition-colors hover:bg-red-50 sm:self-auto">
                                <Trash2 size={13} />
                              </button>
                            </div>

                            <div className="mb-3 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2">
                              <p className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700">Spesifikasi Unit</p>
                            </div>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                              <FormField label="Nama Tipe Unit" required>
                                <input type="text" value={unit.tipe}
                                  onChange={e => handleTipeUnitChange(i, 'tipe', e.target.value)}
                                  className={inputClass} placeholder="Cth: Tipe 36/72" />
                              </FormField>
                              <FormField label="Lantai">
                                <input type="text" value={unit.lantai}
                                  onChange={e => handleTipeUnitChange(i, 'lantai', e.target.value)}
                                  className={inputClass} placeholder="Cth: 1 Lantai" />
                              </FormField>
                              <FormField label="Kamar" hint="atau - jika kavling">
                                <input type="text" value={unit.kamar}
                                  onChange={e => handleTipeUnitChange(i, 'kamar', e.target.value)}
                                  className={inputClass} placeholder="Cth: 3 KT / 2 KM" />
                              </FormField>
                              <FormField label="Luas Bangunan">
                                <input type="text" value={unit.luasBangunan || ''}
                                  onChange={e => handleTipeUnitChange(i, 'luasBangunan', e.target.value)}
                                  className={inputClass} placeholder="36 m2" />
                              </FormField>
                              <FormField label="Luas Tanah">
                                <input type="text" value={unit.luasTanah || ''}
                                  onChange={e => handleTipeUnitChange(i, 'luasTanah', e.target.value)}
                                  className={inputClass} placeholder="72 m2" />
                              </FormField>
                              <FormField label="Stok / Label Unit">
                                <input type="text" value={unit.stok || ''}
                                  onChange={e => handleTipeUnitChange(i, 'stok', e.target.value)}
                                  className={inputClass} placeholder="Sisa 5 Unit" />
                              </FormField>
                            </div>

                            <div className="mb-3 mt-5 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2">
                              <p className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700">Harga Utama</p>
                            </div>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                              <FormField label="Harga Normal">
                                <input type="text" value={unit.normal}
                                  onChange={e => handleTipeUnitChange(i, 'normal', e.target.value)}
                                  className={inputClass} placeholder="Rp 450.000.000" />
                              </FormField>
                              <FormField label="Harga Mulai">
                                <input type="text" value={unit.hargaMulai || ''}
                                  onChange={e => handleTipeUnitChange(i, 'hargaMulai', e.target.value)}
                                  className={inputClass} placeholder="Rp 350.000.000" />
                              </FormField>
                              <div>
                                <label className="block text-xs font-bold text-[#C9A84C] mb-1.5">💥 Promo Cash Keras</label>
                                <input type="text" value={unit.cashKeras}
                                  onChange={e => handleTipeUnitChange(i, 'cashKeras', e.target.value)}
                                  className="min-h-11 w-full rounded-xl border border-[#C9A84C]/40 bg-white px-3.5 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/15"
                                  placeholder="Rp 390.000.000" />
                              </div>
                              <FormField label="Cash Lunak" hint="Opsional">
                                <input type="text" value={unit.cashLunak}
                                  onChange={e => handleTipeUnitChange(i, 'cashLunak', e.target.value)}
                                  className={inputClass} placeholder="Rp 420.000.000" />
                              </FormField>
                              <FormField label="Cash Bertahap">
                                <input type="text" value={unit.cashBertahap || ''}
                                  onChange={e => handleTipeUnitChange(i, 'cashBertahap', e.target.value)}
                                  className={inputClass} placeholder="Rp 430.000.000" />
                              </FormField>
                              <FormField label="KPR Syariah">
                                <input type="text" value={unit.kprSyariah || ''}
                                  onChange={e => handleTipeUnitChange(i, 'kprSyariah', e.target.value)}
                                  className={inputClass} placeholder="Mulai Rp 3 jutaan" />
                              </FormField>
                            </div>

                            <div className="mb-3 mt-5 rounded-xl border border-green-100 bg-green-50 px-3 py-2">
                              <p className="text-[11px] font-extrabold uppercase tracking-wider text-green-700">DP, Angsuran, dan Tenor</p>
                            </div>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                              <FormField label="DP">
                                <input type="text" value={unit.dp || ''}
                                  onChange={e => handleTipeUnitChange(i, 'dp', e.target.value)}
                                  className={inputClass} placeholder="Rp 25.000.000" />
                              </FormField>
                              <FormField label="Angsuran">
                                <input type="text" value={unit.angsuran || ''}
                                  onChange={e => handleTipeUnitChange(i, 'angsuran', e.target.value)}
                                  className={inputClass} placeholder="Rp 3.500.000 / bulan" />
                              </FormField>
                              <FormField label="Tenor">
                                <input type="text" value={unit.tenor || ''}
                                  onChange={e => handleTipeUnitChange(i, 'tenor', e.target.value)}
                                  className={inputClass} placeholder="120 bulan" />
                              </FormField>
                              <FormField label="Booking Fee">
                                <input type="text" value={unit.bookingFee || ''}
                                  onChange={e => handleTipeUnitChange(i, 'bookingFee', e.target.value)}
                                  className={inputClass} placeholder="Rp 2.000.000" />
                              </FormField>
                              <FormField label="Angsuran 12 Bulan">
                                <input type="text" value={unit.angsuran12 || ''}
                                  onChange={e => handleTipeUnitChange(i, 'angsuran12', e.target.value)}
                                  className={inputClass} placeholder="Rp 30.000.000 / bulan" />
                              </FormField>
                              <FormField label="Angsuran 24 Bulan">
                                <input type="text" value={unit.angsuran24 || ''}
                                  onChange={e => handleTipeUnitChange(i, 'angsuran24', e.target.value)}
                                  className={inputClass} placeholder="Rp 15.000.000 / bulan" />
                              </FormField>
                              <FormField label="Angsuran 36 Bulan">
                                <input type="text" value={unit.angsuran36 || ''}
                                  onChange={e => handleTipeUnitChange(i, 'angsuran36', e.target.value)}
                                  className={inputClass} placeholder="Rp 10.000.000 / bulan" />
                              </FormField>
                            </div>

                            <div className="mb-3 mt-5 rounded-xl border border-purple-100 bg-purple-50 px-3 py-2">
                              <p className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700">Biaya Tambahan dan Promo</p>
                            </div>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                              <FormField label="Biaya Akad">
                                <input type="text" value={unit.biayaAkad || ''}
                                  onChange={e => handleTipeUnitChange(i, 'biayaAkad', e.target.value)}
                                  className={inputClass} placeholder="Sudah termasuk / Rp ..." />
                              </FormField>
                              <FormField label="BPHTB">
                                <input type="text" value={unit.bphtb || ''}
                                  onChange={e => handleTipeUnitChange(i, 'bphtb', e.target.value)}
                                  className={inputClass} placeholder="Sudah termasuk / Rp ..." />
                              </FormField>
                              <FormField label="Bonus Promo">
                                <input type="text" value={unit.promoBonus || ''}
                                  onChange={e => handleTipeUnitChange(i, 'promoBonus', e.target.value)}
                                  className={inputClass} placeholder="Free kanopi / cashback / subsidi" />
                              </FormField>
                            </div>
                            <div className="mt-4">
                              <FormField label="Catatan Promo">
                                <textarea rows="2" value={unit.promoNote || ''}
                                  onChange={e => handleTipeUnitChange(i, 'promoNote', e.target.value)}
                                  className={`${inputClass} resize-none`} placeholder="Contoh: Free biaya akad dan BPHTB untuk periode launching." />
                              </FormField>
                            </div>
                            <div className="mt-4 grid grid-cols-1 gap-2 rounded-xl border border-gray-100 bg-white p-3 text-xs text-gray-500 sm:grid-cols-2 xl:grid-cols-4">
                              <div><span className="font-bold text-gray-700">Normal:</span> {unit.normal || '-'}</div>
                              <div><span className="font-bold text-gray-700">Mulai:</span> {unit.hargaMulai || '-'}</div>
                              <div><span className="font-bold text-gray-700">Cash keras:</span> {unit.cashKeras || '-'}</div>
                              <div><span className="font-bold text-gray-700">Cash lunak:</span> {unit.cashLunak || '-'}</div>
                              <div><span className="font-bold text-gray-700">Cash bertahap:</span> {unit.cashBertahap || '-'}</div>
                              <div><span className="font-bold text-gray-700">KPR syariah:</span> {unit.kprSyariah || '-'}</div>
                              <div><span className="font-bold text-gray-700">DP:</span> {unit.dp || '-'}</div>
                              <div><span className="font-bold text-gray-700">Angsuran:</span> {unit.angsuran || '-'}</div>
                              <div><span className="font-bold text-gray-700">Tenor:</span> {unit.tenor || '-'}</div>
                              <div><span className="font-bold text-gray-700">Booking:</span> {unit.bookingFee || '-'}</div>
                              <div><span className="font-bold text-gray-700">Akad:</span> {unit.biayaAkad || '-'}</div>
                              <div><span className="font-bold text-gray-700">BPHTB:</span> {unit.bphtb || '-'}</div>
                              <div><span className="font-bold text-gray-700">Bonus:</span> {unit.promoBonus || '-'}</div>
                            </div>
                          </div>
                        ))}

                        {/* Tambah lagi */}
                        <button type="button" onClick={addTipeUnit}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm font-bold text-gray-400 transition-all hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/5 hover:text-[#9d7a28]">
                          <Plus size={15} /> Tambah Pricelist Lainnya
                        </button>
                      </div>
                    )}
                  </SectionCard>

                </div>

                {/* ══════════════════════════════════════════
                    TAB 5: MARKETING
                ══════════════════════════════════════════ */}
                <div className={activeTab === 'marketing' ? 'block space-y-5' : 'hidden'}>

                  <SectionCard title="Tim Marketing yang Ditugaskan" icon={<Users size={14} className="text-blue-500" />}>
                    <p className="text-sm text-gray-500 mb-4">Pilih marketing siapa saja yang akan muncul di halaman detail project ini.</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {marketingOptions.map(mk => (
                        <button key={mk.id} type="button" onClick={() => handleMarketingChange(mk.id)}
                          className={`relative flex flex-col items-center rounded-2xl border-2 p-4 text-center transition-all ${
                            marketingItems.includes(mk.id)
                              ? 'border-red-500 bg-red-50 shadow-sm shadow-red-100'
                              : 'border-gray-100 bg-white hover:border-red-200 hover:bg-gray-50'
                          }`}>
                          {marketingItems.includes(mk.id) && (
                            <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white">
                              ✓
                            </span>
                          )}
                          <div className="relative mb-3">
                            <img src={mk.photo || mk.foto} alt={mk.name}
                              className={`h-16 w-16 rounded-full border-2 object-cover ${marketingItems.includes(mk.id) ? 'border-red-500' : 'border-gray-200'}`}
                              onError={e => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mk.name)}&background=C0392B&color=fff&size=200`; }}
                            />
                            <span className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${mk.online ? 'bg-green-400' : 'bg-gray-400'}`} />
                          </div>
                          <span className="text-sm font-extrabold text-gray-900">{mk.name}</span>
                          <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">{mk.role}</span>
                          <span className="mt-2 rounded-full border border-red-100 bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-700">
                            Official Team Afkar Land
                          </span>
                          <span className="mt-2 text-xs leading-relaxed text-gray-500">{mk.specialty || mk.ahli || mk.spesialisasi || 'Marketing project'}</span>
                          <span className="mt-3 text-[10px] font-bold text-gray-400">
                            {marketingItems.includes(mk.id) ? 'Dipilih untuk project ini' : 'Klik untuk tugaskan'}
                          </span>
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-3">
                      {marketingItems.length === 0
                        ? 'Jika tidak ada yang dipilih, semua marketing akan ditampilkan.'
                        : `${marketingItems.length} marketing dipilih.`}
                    </p>
                    <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-extrabold text-gray-900">Marketing Manual</p>
                          <p className="mt-1 text-xs text-gray-500">Tambahkan marketing khusus project ini dengan nama, foto, dan kontak.</p>
                        </div>
                        <button type="button" onClick={addCustomMarketing}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-gray-800">
                          <Plus size={14} /> Tambah Marketing Manual
                        </button>
                      </div>
                      <div className="space-y-4">
                        {customMarketingItems.length === 0 ? (
                          <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white px-4 py-8 text-center text-sm font-bold text-gray-400">
                            Belum ada marketing manual.
                          </div>
                        ) : customMarketingItems.map((mk, i) => (
                          <div key={mk.id} className="rounded-2xl border border-gray-100 bg-white p-4">
                            <div className="mb-4 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <img src={mk.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(mk.name || 'Marketing')}&background=C0392B&color=fff&size=200`}
                                  alt={mk.name || 'Marketing'}
                                  className="h-12 w-12 rounded-full border border-gray-200 object-cover"
                                  onError={e => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mk.name || 'Marketing')}&background=C0392B&color=fff&size=200`; }}
                                />
                                <div>
                                  <p className="text-sm font-extrabold text-gray-900">{mk.name || `Marketing Manual #${i + 1}`}</p>
                                  <p className="text-xs text-gray-400">{mk.role}</p>
                                </div>
                              </div>
                              <button type="button" onClick={() => removeCustomMarketing(i)}
                                className="rounded-lg bg-red-50 p-2 text-red-500 transition-colors hover:bg-red-100">
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                              <FormField label="Nama Marketing" required>
                                <input type="text" value={mk.name}
                                  onChange={e => handleCustomMarketingChange(i, 'name', e.target.value)}
                                  className={inputClass} placeholder="Nama marketing" />
                              </FormField>
                              <FormField label="URL Foto">
                                <div className="flex gap-2">
                                  <input type="url" value={mk.photo}
                                    onChange={e => handleCustomMarketingChange(i, 'photo', e.target.value)}
                                    className={inputClass} placeholder="https://..." />
                                  <button type="button"
                                    onClick={() => openCloudinaryWidget((url) => handleCustomMarketingChange(i, 'photo', url))}
                                    className="shrink-0 rounded-lg bg-gray-900 px-3 text-xs font-bold text-white transition-colors hover:bg-gray-800">
                                    Upload
                                  </button>
                                </div>
                              </FormField>
                              <FormField label="Nomor WhatsApp" hint="Format internasional, contoh: 62812...">
                                <input type="text" value={mk.wa}
                                  onChange={e => handleCustomMarketingChange(i, 'wa', e.target.value)}
                                  className={inputClass} placeholder="628123456789" />
                              </FormField>
                              <FormField label="Nomor Telepon">
                                <input type="text" value={mk.phone}
                                  onChange={e => handleCustomMarketingChange(i, 'phone', e.target.value)}
                                  className={inputClass} placeholder="08123456789" />
                              </FormField>
                              <FormField label="Spesialisasi">
                                <input type="text" value={mk.specialty}
                                  onChange={e => handleCustomMarketingChange(i, 'specialty', e.target.value)}
                                  className={inputClass} placeholder="Survey lokasi / cash bertahap" />
                              </FormField>
                              <FormField label="Role">
                                <input type="text" value={mk.role}
                                  onChange={e => handleCustomMarketingChange(i, 'role', e.target.value)}
                                  className={inputClass} placeholder="Marketing Executive" />
                              </FormField>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </SectionCard>

                </div>

                {/* ══════════════════════════════════════════
                    TAB 6: PROGRESS
                ══════════════════════════════════════════ */}
                <div className={activeTab === 'progress' ? 'block space-y-5' : 'hidden'}>

                  <SectionCard
                    title="Timeline Progress Pembangunan"
                    icon={<List size={14} className="text-orange-500" />}
                    action={
                      <button type="button" onClick={addProgress}
                        className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100">
                        + Tambah Fase
                      </button>
                    }
                  >
                    <div className="space-y-3">
                      {progressItems.map((prog, i) => (
                        <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 relative">
                          <button type="button" onClick={() => removeObjectArrayItem(i, 'progress')}
                            className="absolute top-3 right-3 p-1 text-red-400 bg-white border border-red-100 rounded-lg hover:bg-red-50">
                            <Trash2 size={13} />
                          </button>
                          <div className="grid grid-cols-1 gap-3 pr-8 sm:grid-cols-2 lg:grid-cols-4">
                            <input type="text" value={prog.fase}
                              onChange={e => handleObjectArrayChange(i, 'progress', 'fase', e.target.value)}
                              placeholder="Fase 1" className={inputClass} />
                            <input type="text" value={prog.label}
                              onChange={e => handleObjectArrayChange(i, 'progress', 'label', e.target.value)}
                              placeholder="Land Clearing" className={inputClass} />
                            <input type="number" value={prog.persen} min="0" max="100"
                              onChange={e => handleObjectArrayChange(i, 'progress', 'persen', Number(e.target.value))}
                              placeholder="% Selesai" className={inputClass} />
                            <input type="text" value={prog.tgl}
                              onChange={e => handleObjectArrayChange(i, 'progress', 'tgl', e.target.value)}
                              placeholder="Jan 2024" className={inputClass} />
                          </div>
                          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[220px_1fr]">
                            <select value={prog.status}
                              onChange={e => handleObjectArrayChange(i, 'progress', 'status', e.target.value)}
                              className={selectClass}>
                              <option value="selesai">✅ Selesai</option>
                              <option value="berjalan">🔄 Berjalan</option>
                              <option value="rencana">📅 Rencana</option>
                            </select>
                            <input type="text" value={prog.ket}
                              onChange={e => handleObjectArrayChange(i, 'progress', 'ket', e.target.value)}
                              placeholder="Keterangan detail progress..." className={inputClass} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>

                </div>

                {/* ══════════════════════════════════════════
                    TAB 7: FAQ
                ══════════════════════════════════════════ */}
                <div className={activeTab === 'faq' ? 'block space-y-5' : 'hidden'}>

                  <SectionCard
                    title="Frequently Asked Questions (FAQ)"
                    icon={<HelpCircle size={14} className="text-indigo-500" />}
                    action={
                      <button type="button" onClick={addFAQ}
                        className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100">
                        + Tambah Pertanyaan
                      </button>
                    }
                  >
                    <div className="space-y-3">
                      {faqItems.map((item, i) => (
                        <div key={i} className="flex gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <div className="flex-1 space-y-2">
                            <input type="text" value={item.q}
                              onChange={e => handleObjectArrayChange(i, 'faq', 'q', e.target.value)}
                              placeholder="Pertanyaan..." className={`${inputClass} font-bold`} />
                            <textarea rows="2" value={item.a}
                              onChange={e => handleObjectArrayChange(i, 'faq', 'a', e.target.value)}
                              placeholder="Jawaban lengkap..." className={`${inputClass} resize-none`} />
                          </div>
                          <button type="button" onClick={() => removeObjectArrayItem(i, 'faq')}
                            className="p-2.5 text-red-400 bg-white border border-red-100 rounded-xl hover:bg-red-50 h-fit mt-0.5">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </SectionCard>

                </div>

                <div className="flex flex-col-reverse gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row">
                  <button type="button" onClick={() => setIsModalOpen(false)}
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50">
                    Batal
                  </button>
                  <button type="submit" disabled={isSaving}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-60">
                    {isSaving
                      ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menyimpan...</>
                      : <><Save size={16} /> Simpan Data Proyek</>
                    }
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
