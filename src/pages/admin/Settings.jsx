import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  FiAlignJustify,
  FiGlobe,
  FiImage,
  FiLink,
  FiMail,
  FiMapPin,
  FiPlus,
  FiSave,
  FiSettings,
  FiTrash2,
} from 'react-icons/fi';
import { RiWhatsappLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { db } from '../../config/firebaseConfig';

const SETTINGS_CACHE_KEY = 'afkar_site_settings_v1';

const DEFAULT = {
  branding: {
    logoUrl: '',
    logoAlt: 'AFKAR LAND',
    siteName: 'AFKAR LAND',
    tagline: 'Properti Syariah Terbaik di Sulawesi',
    faviconUrl: '',
    primaryColor: '#dc2626',
  },
  navbar: {
    logoUrl: '',
    links: [
      { label: 'Beranda', path: '/' },
      { label: 'Tentang Kami', path: '/tentang-kami' },
      { label: 'Proyek', path: '/proyek' },
      { label: 'Layanan', path: '/layanan' },
      { label: 'Galeri', path: '/galeri' },
      { label: 'Artikel', path: '/artikel' },
      { label: 'Karir', path: '/karir' },
      { label: 'Kontak', path: '/kontak' },
    ],
  },
  contact: {
    heroJudul: 'Kami Siap Membantu',
    heroSubjudul: 'Tinggalkan pesan atau kunjungi kantor pemasaran kami untuk informasi lebih lanjut mengenai project property syariah AFKAR LAND.',
    waNumber: '6285705218281',
    emailAddress: 'Afkargroupindonesia@gmail.com',
    alamat: 'Makassar, Sulawesi Selatan, Indonesia',
    mapsEmbed: '',
    jamSenin: '09.00 - 17.00',
    jamSabtu: '09.00 - 16.00',
    jamMinggu: 'By Confirmation',
  },
  whatsapp: {
    nomorWa: '6285705218281',
    nomorWa2: '',
    pesanWaDefault: 'Halo AFKAR LAND, saya ingin bertanya mengenai properti Anda.',
    pesanWaLead: 'Halo AFKAR LAND, saya tertarik dengan proyek {proyek}. Boleh minta informasi lebih lanjut?',
    pesanWaKarir: 'Halo AFKAR LAND, saya ingin menanyakan informasi lowongan {posisi}.',
    tampilkanTombolWa: true,
  },
  footer: {
    description: 'Membangun hunian berkualitas dengan prinsip syariah untuk keluarga Indonesia.',
    phone: '+62 812-3456-7890',
    email: 'info@afkarland.com',
    address: 'Makassar, Sulawesi Selatan',
    instagram: '',
    facebook: '',
    youtube: '',
    tiktok: '',
    copyright: `Copyright ${new Date().getFullYear()} AFKAR LAND. All rights reserved.`,
  },
  maintenance: {
    enabled: false,
    message: 'Website sedang dalam pemeliharaan. Silakan coba beberapa saat lagi.',
    email: '',
    eta: '',
  },
};

const TABS = [
  { id: 'branding', label: 'Branding', icon: <FiGlobe size={14} /> },
  { id: 'navbar', label: 'Navbar', icon: <FiLink size={14} /> },
  { id: 'contact', label: 'Kontak', icon: <FiMapPin size={14} /> },
  { id: 'footer', label: 'Footer', icon: <FiAlignJustify size={14} /> },
  { id: 'maintenance', label: 'Maintenance', icon: <FiSettings size={14} /> },
];

const inputCls = 'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-red-400 focus:ring-4 focus:ring-red-500/10';

const mergeSection = (section, value) => ({ ...DEFAULT[section], ...(value || {}) });

function normalizeSettings(data = {}, legacy = {}) {
  const contact = {
    ...DEFAULT.contact,
    ...(data.contact || {}),
    emailAddress: data.contact?.emailAddress || legacy.emailUtama || data.footer?.email || DEFAULT.contact.emailAddress,
    waNumber: data.contact?.waNumber || legacy.nomorWa || DEFAULT.contact.waNumber,
    alamat: data.contact?.alamat || legacy.alamat || data.footer?.address || DEFAULT.contact.alamat,
    mapsEmbed: data.contact?.mapsEmbed || legacy.googleMapsEmbed || data.contact?.googleMapsEmbed || DEFAULT.contact.mapsEmbed,
  };

  const whatsapp = {
    ...DEFAULT.whatsapp,
    ...(data.whatsapp || {}),
    nomorWa: data.whatsapp?.nomorWa || legacy.nomorWa || contact.waNumber,
    nomorWa2: data.whatsapp?.nomorWa2 || legacy.nomorWa2 || '',
    pesanWaDefault: data.whatsapp?.pesanWaDefault || legacy.pesanWaDefault || DEFAULT.whatsapp.pesanWaDefault,
    pesanWaLead: data.whatsapp?.pesanWaLead || legacy.pesanWaLead || DEFAULT.whatsapp.pesanWaLead,
    pesanWaKarir: data.whatsapp?.pesanWaKarir || legacy.pesanWaKarir || DEFAULT.whatsapp.pesanWaKarir,
    tampilkanTombolWa: data.whatsapp?.tampilkanTombolWa ?? legacy.tampilkanTombolWa ?? true,
  };

  const footer = {
    ...DEFAULT.footer,
    ...(data.footer || {}),
    phone: data.footer?.phone || legacy.teleponUtama || DEFAULT.footer.phone,
    email: data.footer?.email || legacy.emailUtama || DEFAULT.footer.email,
    address: data.footer?.address || legacy.alamat || DEFAULT.footer.address,
  };

  const maintenance = {
    ...DEFAULT.maintenance,
    ...(data.maintenance || {}),
    enabled: data.maintenance?.enabled ?? legacy.maintenanceMode ?? false,
    message: data.maintenance?.message || legacy.pesanMaintenance || DEFAULT.maintenance.message,
    email: data.maintenance?.email || legacy.maintenanceEmail || '',
    eta: data.maintenance?.eta || legacy.maintenanceEstimasi || '',
  };

  return {
    branding: mergeSection('branding', data.branding),
    navbar: {
      ...DEFAULT.navbar,
      ...(data.navbar || {}),
      links: Array.isArray(data.navbar?.links) && data.navbar.links.length ? data.navbar.links : DEFAULT.navbar.links,
    },
    contact,
    whatsapp,
    footer,
    maintenance,
  };
}

function SectionCard({ title, icon, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600">{icon}</div>
        <h2 className="font-heading text-sm font-black text-gray-900">{title}</h2>
      </div>
      <div className="space-y-5 p-6">{children}</div>
    </section>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-600">{label}</label>
      {hint && <p className="mb-2 text-xs leading-relaxed text-gray-400">{hint}</p>}
      {children}
    </div>
  );
}

function Toggle({ checked, onChange, label, sublabel }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center justify-between rounded-2xl border-2 p-4 text-left transition-all ${
        checked ? 'border-emerald-200 bg-emerald-50' : 'border-gray-100 bg-gray-50'
      }`}
    >
      <span>
        <span className="block text-sm font-black text-gray-800">{label}</span>
        {sublabel && <span className="mt-0.5 block text-xs text-gray-500">{sublabel}</span>}
      </span>
      <span className={`relative h-7 w-14 shrink-0 rounded-full transition-all ${checked ? 'bg-emerald-500' : 'bg-gray-300'}`}>
        <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${checked ? 'left-7' : 'left-0.5'}`} />
      </span>
    </button>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('branding');
  const [formData, setFormData] = useState(DEFAULT);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [mainSnap, legacySnap] = await Promise.all([
          getDoc(doc(db, 'homepage_settings', 'main')),
          getDoc(doc(db, 'settings', 'general')),
        ]);
        setFormData(normalizeSettings(mainSnap.exists() ? mainSnap.data() : {}, legacySnap.exists() ? legacySnap.data() : {}));
      } catch {
        toast.error('Gagal memuat pengaturan global.');
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const setSection = (section, key, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  };

  const setNavLink = (index, key, value) => {
    setFormData(prev => {
      const links = [...prev.navbar.links];
      links[index] = { ...links[index], [key]: value };
      return { ...prev, navbar: { ...prev.navbar, links } };
    });
  };

  const addNavLink = () => {
    setFormData(prev => ({
      ...prev,
      navbar: { ...prev.navbar, links: [...prev.navbar.links, { label: '', path: '/' }] },
    }));
  };

  const removeNavLink = (index) => {
    setFormData(prev => ({
      ...prev,
      navbar: { ...prev.navbar, links: prev.navbar.links.filter((_, itemIndex) => itemIndex !== index) },
    }));
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        branding: formData.branding,
        navbar: {
          ...formData.navbar,
          links: formData.navbar.links.filter(link => link.label && link.path),
        },
        contact: formData.contact,
        whatsapp: formData.whatsapp,
        footer: formData.footer,
        maintenance: formData.maintenance,
      };
      await setDoc(doc(db, 'homepage_settings', 'main'), payload, { merge: true });
      const cached = JSON.parse(localStorage.getItem(SETTINGS_CACHE_KEY) || '{}');
      localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify({ ...cached, ...payload }));
      toast.success('Pengaturan global berhasil disimpan.');
    } catch {
      toast.error('Gagal menyimpan pengaturan global.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl space-y-4">
        {Array(4).fill(0).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-2xl bg-gray-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6 pb-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white">
            <FiSettings size={22} />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-black text-gray-900">Pengaturan Global</h1>
            <p className="mt-0.5 text-sm text-gray-500">Pusat branding, navbar, kontak, footer, WhatsApp, dan maintenance website.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-black text-white transition-colors hover:bg-gray-800 disabled:opacity-60"
        >
          <FiSave size={15} /> {isSubmitting ? 'Menyimpan...' : 'Simpan Semua'}
        </button>
      </div>

      <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4">
        <p className="text-sm font-bold text-red-700">Settings sekarang menjadi sumber pengaturan global.</p>
        <p className="mt-1 text-xs leading-relaxed text-red-600">
          Data disimpan ke <code className="rounded bg-white px-1">homepage_settings/main</code>, dokumen yang dibaca langsung oleh <code className="rounded bg-white px-1">useSiteSettings</code>.
        </p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto rounded-xl bg-gray-100 p-1">
        {TABS.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-xs font-black transition-all ${
              activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {activeTab === 'branding' && (
          <SectionCard title="Branding Website" icon={<FiImage size={15} />}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Nama Website">
                <input className={inputCls} value={formData.branding.siteName} onChange={event => setSection('branding', 'siteName', event.target.value)} />
              </Field>
              <Field label="Tagline">
                <input className={inputCls} value={formData.branding.tagline} onChange={event => setSection('branding', 'tagline', event.target.value)} />
              </Field>
              <Field label="URL Logo">
                <input className={inputCls} value={formData.branding.logoUrl} onChange={event => setSection('branding', 'logoUrl', event.target.value)} placeholder="https://..." />
              </Field>
              <Field label="Alt Text Logo">
                <input className={inputCls} value={formData.branding.logoAlt} onChange={event => setSection('branding', 'logoAlt', event.target.value)} />
              </Field>
              <Field label="URL Favicon">
                <input className={inputCls} value={formData.branding.faviconUrl} onChange={event => setSection('branding', 'faviconUrl', event.target.value)} placeholder="https://..." />
              </Field>
              <Field label="Warna Brand Utama">
                <div className="flex gap-3">
                  <input type="color" className="h-12 w-14 rounded-xl border border-gray-200 bg-white p-1" value={formData.branding.primaryColor} onChange={event => setSection('branding', 'primaryColor', event.target.value)} />
                  <input className={inputCls} value={formData.branding.primaryColor} onChange={event => setSection('branding', 'primaryColor', event.target.value)} />
                </div>
              </Field>
            </div>
          </SectionCard>
        )}

        {activeTab === 'navbar' && (
          <SectionCard title="Navbar Publik" icon={<FiLink size={15} />}>
            <Field label="Logo Navbar Opsional" hint="Jika kosong, navbar memakai logo dari Branding.">
              <input className={inputCls} value={formData.navbar.logoUrl || ''} onChange={event => setSection('navbar', 'logoUrl', event.target.value)} placeholder="https://..." />
            </Field>
            <div className="space-y-3">
              {formData.navbar.links.map((link, index) => (
                <div key={`${link.path}-${index}`} className="grid grid-cols-[1fr_1fr_auto] gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3">
                  <input className={inputCls} value={link.label} onChange={event => setNavLink(index, 'label', event.target.value)} placeholder="Label" />
                  <input className={inputCls} value={link.path} onChange={event => setNavLink(index, 'path', event.target.value)} placeholder="/route" />
                  <button type="button" onClick={() => removeNavLink(index)} className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100" aria-label="Hapus menu">
                    <FiTrash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addNavLink} className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-xs font-black text-white">
              <FiPlus size={14} /> Tambah Menu
            </button>
          </SectionCard>
        )}

        {activeTab === 'contact' && (
          <>
            <SectionCard title="Kontak Publik" icon={<FiMapPin size={15} />}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Judul Hero Kontak">
                  <input className={inputCls} value={formData.contact.heroJudul} onChange={event => setSection('contact', 'heroJudul', event.target.value)} />
                </Field>
                <Field label="Nomor WhatsApp Utama">
                  <input className={inputCls} value={formData.contact.waNumber} onChange={event => {
                    setSection('contact', 'waNumber', event.target.value);
                    setSection('whatsapp', 'nomorWa', event.target.value);
                  }} placeholder="628xxxxxxxxxx" />
                </Field>
                <Field label="Email Publik">
                  <input className={inputCls} type="email" value={formData.contact.emailAddress} onChange={event => setSection('contact', 'emailAddress', event.target.value)} />
                </Field>
                <Field label="Jam Senin-Jumat">
                  <input className={inputCls} value={formData.contact.jamSenin} onChange={event => setSection('contact', 'jamSenin', event.target.value)} />
                </Field>
                <Field label="Jam Sabtu">
                  <input className={inputCls} value={formData.contact.jamSabtu} onChange={event => setSection('contact', 'jamSabtu', event.target.value)} />
                </Field>
                <Field label="Jam Minggu">
                  <input className={inputCls} value={formData.contact.jamMinggu} onChange={event => setSection('contact', 'jamMinggu', event.target.value)} />
                </Field>
              </div>
              <Field label="Subjudul Hero Kontak">
                <textarea className={inputCls} rows={2} value={formData.contact.heroSubjudul} onChange={event => setSection('contact', 'heroSubjudul', event.target.value)} />
              </Field>
              <Field label="Alamat">
                <textarea className={inputCls} rows={2} value={formData.contact.alamat} onChange={event => setSection('contact', 'alamat', event.target.value)} />
              </Field>
              <Field label="Google Maps Embed URL" hint="Isi nilai src dari iframe Google Maps.">
                <input className={inputCls} value={formData.contact.mapsEmbed} onChange={event => setSection('contact', 'mapsEmbed', event.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." />
              </Field>
            </SectionCard>

            <SectionCard title="WhatsApp" icon={<RiWhatsappLine size={15} />}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Nomor WA Utama">
                  <input className={inputCls} value={formData.whatsapp.nomorWa} onChange={event => setSection('whatsapp', 'nomorWa', event.target.value)} />
                </Field>
                <Field label="Nomor WA Cadangan">
                  <input className={inputCls} value={formData.whatsapp.nomorWa2} onChange={event => setSection('whatsapp', 'nomorWa2', event.target.value)} />
                </Field>
              </div>
              <Field label="Pesan WA Default">
                <textarea className={inputCls} rows={2} value={formData.whatsapp.pesanWaDefault} onChange={event => setSection('whatsapp', 'pesanWaDefault', event.target.value)} />
              </Field>
              <Field label="Pesan WA Lead Proyek">
                <textarea className={inputCls} rows={2} value={formData.whatsapp.pesanWaLead} onChange={event => setSection('whatsapp', 'pesanWaLead', event.target.value)} />
              </Field>
              <Toggle checked={formData.whatsapp.tampilkanTombolWa} onChange={value => setSection('whatsapp', 'tampilkanTombolWa', value)} label="Tampilkan tombol WhatsApp publik" sublabel="Dipakai oleh komponen publik yang membutuhkan tombol WA global." />
            </SectionCard>
          </>
        )}

        {activeTab === 'footer' && (
          <SectionCard title="Footer dan Sosial Media" icon={<FiAlignJustify size={15} />}>
            <Field label="Deskripsi Footer">
              <textarea className={inputCls} rows={2} value={formData.footer.description} onChange={event => setSection('footer', 'description', event.target.value)} />
            </Field>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Telepon / WhatsApp">
                <input className={inputCls} value={formData.footer.phone} onChange={event => setSection('footer', 'phone', event.target.value)} />
              </Field>
              <Field label="Email Footer">
                <input className={inputCls} type="email" value={formData.footer.email} onChange={event => setSection('footer', 'email', event.target.value)} />
              </Field>
              <Field label="Alamat Footer">
                <input className={inputCls} value={formData.footer.address} onChange={event => setSection('footer', 'address', event.target.value)} />
              </Field>
              <Field label="Copyright">
                <input className={inputCls} value={formData.footer.copyright} onChange={event => setSection('footer', 'copyright', event.target.value)} />
              </Field>
              <Field label="Instagram">
                <input className={inputCls} value={formData.footer.instagram} onChange={event => setSection('footer', 'instagram', event.target.value)} placeholder="https://instagram.com/..." />
              </Field>
              <Field label="Facebook">
                <input className={inputCls} value={formData.footer.facebook} onChange={event => setSection('footer', 'facebook', event.target.value)} placeholder="https://facebook.com/..." />
              </Field>
              <Field label="YouTube">
                <input className={inputCls} value={formData.footer.youtube} onChange={event => setSection('footer', 'youtube', event.target.value)} placeholder="https://youtube.com/..." />
              </Field>
              <Field label="TikTok">
                <input className={inputCls} value={formData.footer.tiktok} onChange={event => setSection('footer', 'tiktok', event.target.value)} placeholder="https://tiktok.com/..." />
              </Field>
            </div>
          </SectionCard>
        )}

        {activeTab === 'maintenance' && (
          <SectionCard title="Maintenance Website" icon={<FiSettings size={15} />}>
            <Toggle
              checked={formData.maintenance.enabled}
              onChange={value => setSection('maintenance', 'enabled', value)}
              label={formData.maintenance.enabled ? 'Mode maintenance aktif' : 'Website online normal'}
              sublabel="Konfigurasi ini sudah tersimpan global dan siap dipakai guard publik."
            />
            <Field label="Pesan Maintenance">
              <textarea className={inputCls} rows={3} value={formData.maintenance.message} onChange={event => setSection('maintenance', 'message', event.target.value)} />
            </Field>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Estimasi Selesai">
                <input className={inputCls} value={formData.maintenance.eta} onChange={event => setSection('maintenance', 'eta', event.target.value)} />
              </Field>
              <Field label="Email Kontak">
                <input className={inputCls} type="email" value={formData.maintenance.email} onChange={event => setSection('maintenance', 'email', event.target.value)} />
              </Field>
            </div>
          </SectionCard>
        )}

        <div className="flex justify-end pb-6">
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-black px-8 py-3 text-sm font-black text-white hover:bg-gray-800 disabled:opacity-60">
            <FiSave size={15} /> {isSubmitting ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>
      </form>
    </div>
  );
}
