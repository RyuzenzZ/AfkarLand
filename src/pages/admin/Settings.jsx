// Settings.jsx — AFKAR LAND Admin Panel
// Pengaturan website lengkap: Info Perusahaan, Kontak, Sosial Media,
// WhatsApp CTA, Tampilan, dan Maintenance Mode

import React, { useState, useEffect } from 'react';
import { FiSave, FiSettings, FiGlobe, FiPhone, FiMail,
         FiMapPin, FiInstagram, FiYoutube, FiFacebook,
         FiAlertTriangle, FiEye, FiEyeOff } from 'react-icons/fi';
import { RiWhatsappLine, RiTiktokLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

// ── Default nilai jika Firestore kosong ──────────────────────────
const DEFAULT = {
  // Info Perusahaan
  namaPerusahaan: 'AFKAR LAND',
  tagline: 'Bersama AFKAR GROUP INDONESIA, wujudkan properti syariah di seluruh wilayah sulawesi.',
  deskripsiSingkat: 'Developer properti syariah terpercaya di Sulawesi sejak 2015.',
  emailUtama: 'halo@afkarland.com',
  teleponUtama: '+62 812-3456-7890',
  alamat: 'Makassar, Sulawesi Selatan, Indonesia',
  googleMapsEmbed: '',

  // WhatsApp
  nomorWa: '6281234567890',
  pesanWaDefault: 'Halo AFKAR LAND, saya ingin bertanya mengenai properti Anda.',

  // Sosial Media
  instagram: 'https://instagram.com/afkarland',
  facebook: '',
  youtube: '',
  tiktok: '',

  // Tampilan
  logoUrl: '',
  faviconUrl: '',
  warnaPrimer: '#dc2626',

  // Maintenance
  maintenanceMode: false,
  pesanMaintenance: 'Website sedang dalam pemeliharaan. Silakan coba beberapa saat lagi.',
};

// ── Komponen Section Card ─────────────────────────────────────────
const SectionCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
        {icon}
      </div>
      <h2 className="font-heading font-bold text-gray-800 text-sm">{title}</h2>
    </div>
    <div className="p-6 space-y-5">{children}</div>
  </div>
);

// ── Komponen Field Label ──────────────────────────────────────────
const Field = ({ label, hint, children }) => (
  <div>
    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
      {label}
    </label>
    {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
    {children}
  </div>
);

const inputCls = "w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-400 outline-none text-sm transition-colors";

// ── Komponen Input dengan Icon ────────────────────────────────────
const IconInput = ({ icon, ...props }) => (
  <div className="relative">
    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
    <input className={`${inputCls} pl-10`} {...props} />
  </div>
);

// ── TABS ─────────────────────────────────────────────────────────
const TABS = [
  { id: 'perusahaan', label: '🏢 Perusahaan'   },
  { id: 'kontak',     label: '📞 Kontak & WA'  },
  { id: 'sosmed',     label: '📱 Sosial Media' },
  { id: 'tampilan',   label: '🎨 Tampilan'     },
  { id: 'maintenance',label: '⚙️ Maintenance'  },
];

export default function Settings() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading]       = useState(true);
  const [activeTab, setActiveTab]       = useState('perusahaan');
  const [formData, setFormData]         = useState(DEFAULT);

  // Ambil data dari Firestore saat mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'general'));
        if (snap.exists()) setFormData({ ...DEFAULT, ...snap.data() });
      } catch {
        toast.error('Gagal memuat pengaturan.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const set = (key, val) => setFormData(f => ({ ...f, [key]: val }));
  const handleChange = (e) => set(e.target.name, e.target.value);

  // Simpan ke Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await setDoc(doc(db, 'settings', 'general'), formData, { merge: true });
      toast.success('Pengaturan berhasil disimpan!');
    } catch {
      toast.error('Gagal menyimpan pengaturan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="space-y-4 max-w-4xl">
      {Array(3).fill(0).map((_, i) => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse"/>)}
    </div>
  );

  return (
    <div className="max-w-4xl space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center">
            <FiSettings size={22}/>
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900">Pengaturan Website</h1>
            <p className="text-gray-500 mt-0.5 text-sm">Perubahan tersimpan langsung ke server Firebase.</p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-60">
          <FiSave size={15}/> {isSubmitting ? 'Menyimpan...' : 'Simpan Semua'}
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl overflow-x-auto">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all
              ${activeTab === tab.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── TAB: PERUSAHAAN ──────────────────────────────────── */}
        {activeTab === 'perusahaan' && (
          <SectionCard title="Informasi Perusahaan" icon={<FiGlobe size={15}/>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Nama Perusahaan *">
                <input className={inputCls} name="namaPerusahaan" value={formData.namaPerusahaan}
                  onChange={handleChange} required placeholder="AFKAR LAND"/>
              </Field>
              <Field label="Email Publik">
                <IconInput icon={<FiMail size={14}/>} type="email" name="emailUtama"
                  value={formData.emailUtama} onChange={handleChange} placeholder="halo@afkarland.com"/>
              </Field>
            </div>
            <Field label="Tagline / Slogan">
              <input className={inputCls} name="tagline" value={formData.tagline}
                onChange={handleChange} placeholder="Properti syariah terpercaya..."/>
            </Field>
            <Field label="Deskripsi Singkat" hint="Tampil di section About dan footer website.">
              <textarea className={inputCls} name="deskripsiSingkat" rows={3}
                value={formData.deskripsiSingkat} onChange={handleChange}
                placeholder="Developer properti syariah terpercaya..."/>
            </Field>
            <Field label="Alamat Kantor Lengkap">
              <div className="relative">
                <FiMapPin size={14} className="absolute left-3.5 top-3 text-gray-400"/>
                <textarea className={`${inputCls} pl-10`} name="alamat" rows={2}
                  value={formData.alamat} onChange={handleChange}
                  placeholder="Jl. Contoh No.1, Makassar, Sulawesi Selatan"/>
              </div>
            </Field>
            <Field label="Embed Google Maps URL" hint="Ambil dari Google Maps → Bagikan → Sematkan peta → salin src URL saja.">
              <input className={inputCls} name="googleMapsEmbed" value={formData.googleMapsEmbed}
                onChange={handleChange} placeholder="https://www.google.com/maps/embed?..."/>
              {formData.googleMapsEmbed && (
                <div className="mt-3 rounded-xl overflow-hidden border border-gray-100 h-48">
                  <iframe src={formData.googleMapsEmbed} width="100%" height="100%"
                    style={{ border: 0 }} allowFullScreen loading="lazy" title="Lokasi Kantor"/>
                </div>
              )}
            </Field>
          </SectionCard>
        )}

        {/* ── TAB: KONTAK & WA ─────────────────────────────────── */}
        {activeTab === 'kontak' && (
          <>
            <SectionCard title="Nomor Kontak" icon={<FiPhone size={15}/>}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Nomor Telepon Utama">
                  <IconInput icon={<FiPhone size={14}/>} type="text" name="teleponUtama"
                    value={formData.teleponUtama} onChange={handleChange} placeholder="+62 812-3456-7890"/>
                </Field>
                <Field label="Nomor WhatsApp" hint="Format: 628xxxxx (tanpa + atau spasi)">
                  <IconInput icon={<RiWhatsappLine size={15}/>} type="text" name="nomorWa"
                    value={formData.nomorWa} onChange={handleChange} placeholder="6281234567890"/>
                </Field>
              </div>
            </SectionCard>

            <SectionCard title="Pesan WhatsApp Default" icon={<RiWhatsappLine size={15}/>}>
              <Field label="Teks Pesan Otomatis" hint="Pesan ini akan muncul saat pengunjung klik tombol WhatsApp di website.">
                <textarea className={inputCls} name="pesanWaDefault" rows={3}
                  value={formData.pesanWaDefault} onChange={handleChange}
                  placeholder="Halo AFKAR LAND, saya ingin bertanya..."/>
              </Field>
              {/* Preview link WA */}
              {formData.nomorWa && (
                <a
                  href={`https://wa.me/${formData.nomorWa}?text=${encodeURIComponent(formData.pesanWaDefault)}`}
                  target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg transition-colors">
                  <RiWhatsappLine size={14}/> Test Link WhatsApp
                </a>
              )}
            </SectionCard>
          </>
        )}

        {/* ── TAB: SOSIAL MEDIA ────────────────────────────────── */}
        {activeTab === 'sosmed' && (
          <SectionCard title="Akun Sosial Media" icon={<FiInstagram size={15}/>}>
            <p className="text-xs text-gray-400 -mt-2">Link ini akan tampil di footer dan halaman kontak website.</p>
            <Field label="Instagram">
              <IconInput icon={<FiInstagram size={14}/>} type="url" name="instagram"
                value={formData.instagram} onChange={handleChange}
                placeholder="https://instagram.com/afkarland"/>
            </Field>
            <Field label="Facebook">
              <IconInput icon={<FiFacebook size={14}/>} type="url" name="facebook"
                value={formData.facebook} onChange={handleChange}
                placeholder="https://facebook.com/afkarland"/>
            </Field>
            <Field label="YouTube">
              <IconInput icon={<FiYoutube size={14}/>} type="url" name="youtube"
                value={formData.youtube} onChange={handleChange}
                placeholder="https://youtube.com/@afkarland"/>
            </Field>
            <Field label="TikTok">
              <IconInput icon={<RiTiktokLine size={14}/>} type="url" name="tiktok"
                value={formData.tiktok} onChange={handleChange}
                placeholder="https://tiktok.com/@afkarland"/>
            </Field>

            {/* Preview sosmed aktif */}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Aktif</p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: 'instagram', icon: <FiInstagram size={16}/>, color: 'text-pink-600 bg-pink-50', label: 'Instagram' },
                  { key: 'facebook',  icon: <FiFacebook size={16}/>,  color: 'text-blue-600 bg-blue-50',  label: 'Facebook'  },
                  { key: 'youtube',   icon: <FiYoutube size={16}/>,   color: 'text-red-600 bg-red-50',    label: 'YouTube'   },
                  { key: 'tiktok',    icon: <RiTiktokLine size={16}/>,color: 'text-gray-800 bg-gray-100', label: 'TikTok'    },
                ].map(s => formData[s.key] && (
                  <a key={s.key} href={formData[s.key]} target="_blank" rel="noreferrer"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold ${s.color} transition-opacity hover:opacity-80`}>
                    {s.icon} {s.label}
                  </a>
                ))}
              </div>
            </div>
          </SectionCard>
        )}

        {/* ── TAB: TAMPILAN ────────────────────────────────────── */}
        {activeTab === 'tampilan' && (
          <SectionCard title="Aset & Warna Website" icon={<span className="text-sm">🎨</span>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="URL Logo" hint="Rekomendasikan format PNG transparan, minimal 200×60px.">
                <input className={inputCls} name="logoUrl" value={formData.logoUrl}
                  onChange={handleChange} placeholder="https://contoh.com/logo.png"/>
                {formData.logoUrl && (
                  <img src={formData.logoUrl} alt="Logo preview"
                    className="mt-2 h-12 object-contain rounded-lg border border-gray-100 p-1 bg-gray-50"
                    onError={e => e.target.style.display='none'}/>
                )}
              </Field>
              <Field label="URL Favicon" hint="Format ICO atau PNG 32×32px.">
                <input className={inputCls} name="faviconUrl" value={formData.faviconUrl}
                  onChange={handleChange} placeholder="https://contoh.com/favicon.ico"/>
                {formData.faviconUrl && (
                  <img src={formData.faviconUrl} alt="Favicon preview"
                    className="mt-2 w-8 h-8 object-contain rounded border border-gray-100"
                    onError={e => e.target.style.display='none'}/>
                )}
              </Field>
            </div>
            <Field label="Warna Aksen Primer" hint="Warna ini digunakan untuk tombol, highlight, dan elemen utama website.">
              <div className="flex items-center gap-3">
                <input type="color" value={formData.warnaPrimer}
                  onChange={e => set('warnaPrimer', e.target.value)}
                  className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-gray-50"/>
                <input className={`${inputCls} flex-1`} value={formData.warnaPrimer}
                  onChange={e => set('warnaPrimer', e.target.value)} placeholder="#dc2626"/>
                <div className="w-10 h-10 rounded-lg border border-gray-100 shrink-0"
                  style={{ backgroundColor: formData.warnaPrimer }}/>
              </div>
            </Field>
          </SectionCard>
        )}

        {/* ── TAB: MAINTENANCE ─────────────────────────────────── */}
        {activeTab === 'maintenance' && (
          <SectionCard title="Mode Maintenance" icon={<FiAlertTriangle size={15}/>}>
            {/* Toggle */}
            <div className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all
              ${formData.maintenanceMode ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'}`}>
              <div>
                <div className="font-bold text-gray-800 text-sm">
                  {formData.maintenanceMode ? '🔴 Maintenance Aktif' : '🟢 Website Online Normal'}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {formData.maintenanceMode
                    ? 'Halaman publik menampilkan pesan maintenance.'
                    : 'Semua pengunjung dapat mengakses website normal.'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => set('maintenanceMode', !formData.maintenanceMode)}
                className={`relative w-14 h-7 rounded-full transition-all duration-300 shrink-0
                  ${formData.maintenanceMode ? 'bg-red-500' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300
                  ${formData.maintenanceMode ? 'left-7' : 'left-0.5'}`}/>
              </button>
            </div>

            {formData.maintenanceMode && (
              <>
                <Field label="Pesan Maintenance" hint="Ditampilkan kepada pengunjung saat website dalam mode maintenance.">
                  <textarea className={inputCls} name="pesanMaintenance" rows={3}
                    value={formData.pesanMaintenance} onChange={handleChange}
                    placeholder="Website sedang dalam pemeliharaan..."/>
                </Field>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                  <FiAlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5"/>
                  <div className="text-xs text-amber-700 leading-relaxed">
                    <strong>Perhatian:</strong> Mode maintenance aktif. Pengunjung tidak dapat mengakses halaman publik.
                    Halaman admin tetap bisa diakses melalui <strong>/admin/login</strong>.
                  </div>
                </div>
              </>
            )}

            {/* Preview */}
            {!formData.maintenanceMode && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3">
                <FiEye size={16} className="text-emerald-500 shrink-0 mt-0.5"/>
                <p className="text-xs text-emerald-700">Website dalam kondisi normal. Semua halaman publik dapat diakses.</p>
              </div>
            )}
          </SectionCard>
        )}

        {/* TOMBOL SIMPAN BAWAH */}
        <div className="flex justify-end pt-2 pb-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-60">
            <FiSave size={15}/> {isSubmitting ? 'Menyimpan ke Cloud...' : 'Simpan Perubahan'}
          </button>
        </div>

      </form>
    </div>
  );
}