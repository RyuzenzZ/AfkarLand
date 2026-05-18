// Settings.jsx — AFKAR LAND Admin Panel
// Pengaturan OPERASIONAL sistem: Kontak, WhatsApp, Maintenance
// ⚠️ Branding, Logo, Sosmed, Footer → kelola di Manajemen Website (ManageHomepage)

import React, { useState, useEffect } from 'react';
import {
  FiSave, FiSettings, FiPhone, FiMail,
  FiMapPin, FiAlertTriangle, FiEye,
  FiExternalLink, FiInfo, FiCheckCircle,
} from 'react-icons/fi';
import { RiWhatsappLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

// ── Default nilai ────────────────────────────────────────────────
const DEFAULT = {
  // Kontak Operasional
  emailUtama:       'halo@afkarland.com',
  teleponUtama:     '+62 812-3456-7890',
  teleponKantor:    '',
  alamat:           'Makassar, Sulawesi Selatan, Indonesia',
  googleMapsEmbed:  '',
  jamOperasional:   'Senin–Jumat, 08.00–17.00 WITA',

  // WhatsApp
  nomorWa:          '6281234567890',
  nomorWa2:         '',
  pesanWaDefault:   'Halo AFKAR LAND, saya ingin bertanya mengenai properti Anda.',
  pesanWaLead:      'Halo AFKAR LAND, saya tertarik dengan proyek {proyek}. Boleh minta informasi lebih lanjut?',
  pesanWaKarir:     'Halo AFKAR LAND, saya ingin menanyakan status lamaran saya untuk posisi {posisi}.',
  tampilkanTombolWa: true,

  // Maintenance
  maintenanceMode:      false,
  pesanMaintenance:     'Website sedang dalam pemeliharaan. Silakan coba beberapa saat lagi.',
  maintenanceEmail:     '',
  maintenanceEstimasi:  '',

  // Email Notifikasi
  emailNotifLead:       '',
  emailNotifPesan:      '',
  emailNotifLamaran:    '',
  aktifkanEmailNotif:   false,
};

// ── Komponen ──────────────────────────────────────────────────────
const SectionCard = ({ title, icon, children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">{icon}</div>
      <h2 className="font-heading font-bold text-gray-800 text-sm">{title}</h2>
    </div>
    <div className="p-6 space-y-5">{children}</div>
  </div>
);

const Field = ({ label, hint, children }) => (
  <div>
    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">{label}</label>
    {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
    {children}
  </div>
);

const inputCls = "w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-400 outline-none text-sm transition-colors";

const IconInput = ({ icon, ...props }) => (
  <div className="relative">
    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
    <input className={`${inputCls} pl-10`} {...props} />
  </div>
);

const Toggle = ({ checked, onChange, label, sublabel }) => (
  <div className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer
    ${checked ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-100'}`}
    onClick={() => onChange(!checked)}>
    <div>
      <div className="font-bold text-gray-800 text-sm">{label}</div>
      {sublabel && <div className="text-xs text-gray-500 mt-0.5">{sublabel}</div>}
    </div>
    <div className={`relative w-14 h-7 rounded-full transition-all duration-300 shrink-0
      ${checked ? 'bg-emerald-500' : 'bg-gray-300'}`}>
      <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300
        ${checked ? 'left-7' : 'left-0.5'}`}/>
    </div>
  </div>
);

const TABS = [
  { id: 'kontak',      label: '📞 Kontak & Lokasi'   },
  { id: 'whatsapp',    label: '💬 WhatsApp'           },
  { id: 'notifikasi',  label: '🔔 Notifikasi'         },
  { id: 'maintenance', label: '⚙️ Maintenance'        },
];

export default function Settings() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading]       = useState(true);
  const [activeTab, setActiveTab]       = useState('kontak');
  const [formData, setFormData]         = useState(DEFAULT);

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

  const handleSubmit = async (e) => {
    e?.preventDefault();
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
            <h1 className="text-3xl font-heading font-bold text-gray-900">Pengaturan Sistem</h1>
            <p className="text-gray-500 mt-0.5 text-sm">Kontak operasional, WhatsApp, notifikasi & maintenance.</p>
          </div>
        </div>
        <button onClick={handleSubmit} disabled={isSubmitting}
          className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-60">
          <FiSave size={15}/> {isSubmitting ? 'Menyimpan...' : 'Simpan Semua'}
        </button>
      </div>

      {/* BANNER — arahkan ke ManageHomepage untuk branding */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4 flex items-start gap-3">
        <FiInfo size={16} className="text-blue-500 shrink-0 mt-0.5"/>
        <div>
          <p className="text-sm text-blue-700 font-semibold">Pengaturan Branding ada di Manajemen Website</p>
          <p className="text-xs text-blue-600 mt-0.5">
            Logo, favicon, warna brand, navbar, footer, hero banner, statistik, dan FAQ dikelola di
            <Link to="/admin/homepage" className="font-bold underline ml-1">Manajemen Website →</Link>
          </p>
        </div>
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

        {/* ── TAB: KONTAK & LOKASI ─────────────────────────────── */}
        {activeTab === 'kontak' && (
          <>
            <SectionCard title="Informasi Kontak Publik" icon={<FiPhone size={15}/>}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Email Utama (tampil di website)">
                  <IconInput icon={<FiMail size={14}/>} type="email" name="emailUtama"
                    value={formData.emailUtama} onChange={handleChange}
                    placeholder="halo@afkarland.com"/>
                </Field>
                <Field label="Nomor Telepon Utama">
                  <IconInput icon={<FiPhone size={14}/>} name="teleponUtama"
                    value={formData.teleponUtama} onChange={handleChange}
                    placeholder="+62 812-3456-7890"/>
                </Field>
                <Field label="Nomor Telepon Kantor (opsional)">
                  <IconInput icon={<FiPhone size={14}/>} name="teleponKantor"
                    value={formData.teleponKantor} onChange={handleChange}
                    placeholder="+62 411-xxxxxx"/>
                </Field>
                <Field label="Jam Operasional">
                  <input className={inputCls} name="jamOperasional"
                    value={formData.jamOperasional} onChange={handleChange}
                    placeholder="Senin–Jumat, 08.00–17.00 WITA"/>
                </Field>
              </div>
              <Field label="Alamat Kantor Lengkap">
                <div className="relative">
                  <FiMapPin size={14} className="absolute left-3.5 top-3 text-gray-400"/>
                  <textarea className={`${inputCls} pl-10`} name="alamat" rows={2}
                    value={formData.alamat} onChange={handleChange}
                    placeholder="Jl. Contoh No.1, Makassar, Sulawesi Selatan"/>
                </div>
              </Field>
            </SectionCard>

            <SectionCard title="Embed Google Maps" icon={<FiMapPin size={15}/>}>
              <Field label="URL Embed Google Maps"
                hint="Google Maps → Bagikan → Sematkan Peta → salin nilai src saja (bukan seluruh iframe).">
                <input className={inputCls} name="googleMapsEmbed"
                  value={formData.googleMapsEmbed} onChange={handleChange}
                  placeholder="https://www.google.com/maps/embed?pb=..."/>
              </Field>
              {formData.googleMapsEmbed && (
                <div className="mt-3 rounded-xl overflow-hidden border border-gray-100 h-52">
                  <iframe src={formData.googleMapsEmbed} width="100%" height="100%"
                    style={{ border: 0 }} allowFullScreen loading="lazy" title="Lokasi Kantor"/>
                </div>
              )}
            </SectionCard>
          </>
        )}

        {/* ── TAB: WHATSAPP ────────────────────────────────────── */}
        {activeTab === 'whatsapp' && (
          <>
            <SectionCard title="Nomor WhatsApp" icon={<RiWhatsappLine size={15}/>}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Nomor WA Utama" hint="Format: 628xxxxxxxxxx (tanpa + atau spasi)">
                  <IconInput icon={<RiWhatsappLine size={15}/>} name="nomorWa"
                    value={formData.nomorWa} onChange={handleChange}
                    placeholder="6281234567890"/>
                  {formData.nomorWa && (
                    <a href={`https://wa.me/${formData.nomorWa}`} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 mt-2 hover:text-emerald-700">
                      <FiExternalLink size={11}/> Tes link WA
                    </a>
                  )}
                </Field>
                <Field label="Nomor WA Kedua (backup, opsional)" hint="Tampil sebagai alternatif kontak.">
                  <IconInput icon={<RiWhatsappLine size={15}/>} name="nomorWa2"
                    value={formData.nomorWa2} onChange={handleChange}
                    placeholder="6285xxxxxxxxxx"/>
                </Field>
              </div>
              <Toggle
                checked={formData.tampilkanTombolWa}
                onChange={v => set('tampilkanTombolWa', v)}
                label={formData.tampilkanTombolWa ? '✅ Tombol WA ditampilkan di web' : '🚫 Tombol WA disembunyikan'}
                sublabel="Tombol floating WhatsApp di kanan bawah halaman publik"/>
            </SectionCard>

            <SectionCard title="Template Pesan WhatsApp" icon={<RiWhatsappLine size={15}/>}>
              <p className="text-xs text-gray-400 -mt-2 mb-2">
                Gunakan <code className="bg-gray-100 px-1 rounded text-red-600">{'{proyek}'}</code> dan <code className="bg-gray-100 px-1 rounded text-red-600">{'{posisi}'}</code> sebagai placeholder yang akan otomatis diisi.
              </p>

              <Field label="Pesan Default (tombol WA umum)">
                <textarea className={inputCls} name="pesanWaDefault" rows={2}
                  value={formData.pesanWaDefault} onChange={handleChange}
                  placeholder="Halo AFKAR LAND, saya ingin bertanya..."/>
              </Field>

              <Field label="Pesan dari Halaman Lead / Proyek"
                hint="Dikirim saat pengunjung klik WA dari halaman proyek.">
                <textarea className={inputCls} name="pesanWaLead" rows={2}
                  value={formData.pesanWaLead} onChange={handleChange}
                  placeholder="Halo, saya tertarik dengan {proyek}..."/>
              </Field>

              <Field label="Pesan Balasan Lamaran Kerja"
                hint="Digunakan admin saat menghubungi pelamar dari ManageApplications.">
                <textarea className={inputCls} name="pesanWaKarir" rows={2}
                  value={formData.pesanWaKarir} onChange={handleChange}
                  placeholder="Halo, kami dari AFKAR LAND ingin menghubungi terkait lamaran posisi {posisi}..."/>
              </Field>

              {/* Preview test WA */}
              {formData.nomorWa && formData.pesanWaDefault && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Test Pesan Default</p>
                  <a href={`https://wa.me/${formData.nomorWa}?text=${encodeURIComponent(formData.pesanWaDefault)}`}
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 rounded-xl transition-colors">
                    <RiWhatsappLine size={15}/> Test Kirim via WhatsApp
                  </a>
                </div>
              )}
            </SectionCard>
          </>
        )}

        {/* ── TAB: NOTIFIKASI ──────────────────────────────────── */}
        {activeTab === 'notifikasi' && (
          <SectionCard title="Notifikasi Email Admin" icon={<FiMail size={15}/>}>
            <Toggle
              checked={formData.aktifkanEmailNotif}
              onChange={v => set('aktifkanEmailNotif', v)}
              label={formData.aktifkanEmailNotif ? '✅ Email notifikasi aktif' : '🔕 Email notifikasi nonaktif'}
              sublabel="Terima email setiap ada lead, pesan, atau lamaran baru"/>

            {formData.aktifkanEmailNotif && (
              <div className="space-y-4 pt-2">
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  ⚠️ Fitur ini memerlukan integrasi layanan email (Firebase Functions + Nodemailer). Isi dulu sebagai konfigurasi awal.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Email notif Lead Baru">
                    <IconInput icon={<FiMail size={13}/>} type="email" name="emailNotifLead"
                      value={formData.emailNotifLead} onChange={handleChange}
                      placeholder="admin@afkarland.com"/>
                  </Field>
                  <Field label="Email notif Pesan Masuk">
                    <IconInput icon={<FiMail size={13}/>} type="email" name="emailNotifPesan"
                      value={formData.emailNotifPesan} onChange={handleChange}
                      placeholder="admin@afkarland.com"/>
                  </Field>
                  <Field label="Email notif Lamaran Kerja">
                    <IconInput icon={<FiMail size={13}/>} type="email" name="emailNotifLamaran"
                      value={formData.emailNotifLamaran} onChange={handleChange}
                      placeholder="hrd@afkarland.com"/>
                  </Field>
                </div>
              </div>
            )}

            {!formData.aktifkanEmailNotif && (
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex gap-3">
                <FiCheckCircle size={15} className="text-gray-400 shrink-0 mt-0.5"/>
                <p className="text-xs text-gray-500">
                  Notifikasi di dalam panel admin tetap berjalan real-time melalui halaman
                  <Link to="/admin/notifications" className="font-bold text-red-600 ml-1">Notifikasi →</Link>
                </p>
              </div>
            )}
          </SectionCard>
        )}

        {/* ── TAB: MAINTENANCE ─────────────────────────────────── */}
        {activeTab === 'maintenance' && (
          <SectionCard title="Mode Maintenance Website" icon={<FiAlertTriangle size={15}/>}>
            <Toggle
              checked={formData.maintenanceMode}
              onChange={v => set('maintenanceMode', v)}
              label={formData.maintenanceMode ? '🔴 Maintenance AKTIF — website tidak bisa diakses publik' : '🟢 Website Online Normal'}
              sublabel={formData.maintenanceMode
                ? 'Pengunjung melihat halaman maintenance. Admin tetap bisa login.'
                : 'Semua pengunjung dapat mengakses halaman publik.'}/>

            {formData.maintenanceMode && (
              <div className="space-y-4">
                <Field label="Pesan Maintenance" hint="Ditampilkan kepada pengunjung saat website dalam mode maintenance.">
                  <textarea className={inputCls} name="pesanMaintenance" rows={3}
                    value={formData.pesanMaintenance} onChange={handleChange}
                    placeholder="Website sedang dalam pemeliharaan..."/>
                </Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Estimasi Selesai (opsional)">
                    <input className={inputCls} name="maintenanceEstimasi"
                      value={formData.maintenanceEstimasi} onChange={handleChange}
                      placeholder="Senin 20 Mei 2025, pukul 10.00 WITA"/>
                  </Field>
                  <Field label="Email Kontak saat Maintenance">
                    <IconInput icon={<FiMail size={13}/>} name="maintenanceEmail"
                      value={formData.maintenanceEmail} onChange={handleChange}
                      placeholder="info@afkarland.com"/>
                  </Field>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                  <FiAlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5"/>
                  <div className="text-xs text-amber-700 leading-relaxed">
                    <strong>Perhatian:</strong> Mode maintenance aktif. Pengunjung tidak dapat mengakses halaman publik.
                    Panel admin tetap bisa diakses melalui <strong>/admin/login</strong>.
                    Matikan toggle ini setelah maintenance selesai.
                  </div>
                </div>
              </div>
            )}

            {!formData.maintenanceMode && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3">
                <FiEye size={16} className="text-emerald-500 shrink-0 mt-0.5"/>
                <p className="text-xs text-emerald-700">Website dalam kondisi normal. Semua halaman publik dapat diakses pengunjung.</p>
              </div>
            )}
          </SectionCard>
        )}

        {/* TOMBOL SIMPAN BAWAH */}
        <div className="flex justify-end pt-2 pb-6">
          <button type="submit" disabled={isSubmitting}
            className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-60">
            <FiSave size={15}/> {isSubmitting ? 'Menyimpan ke Cloud...' : 'Simpan Perubahan'}
          </button>
        </div>

      </form>
    </div>
  );
}