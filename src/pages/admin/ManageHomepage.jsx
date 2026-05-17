// ManageHomepage.jsx — AFKAR LAND Admin Panel
// Kelola konten homepage: Hero, Statistik, CTA, FAQ
// Semua tersimpan di Firestore koleksi 'homepage_settings'

import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { FiSave, FiPlus, FiTrash2, FiHome, FiEye } from 'react-icons/fi';
import { LayoutDashboard } from 'lucide-react';
import toast from 'react-hot-toast';

const SectionCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
        {icon}
      </div>
      <h2 className="font-heading font-bold text-gray-800 text-sm">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
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

const DEFAULT_DATA = {
  hero: {
    judul: 'Properti Syariah Terbaik di Sulawesi',
    subjudul: 'Bersama AFKAR GROUP INDONESIA, wujudkan hunian impian dengan prinsip syariah yang amanah.',
    ctaUtama: 'Lihat Proyek Kami',
    ctaUtamaLink: '/proyek',
    ctaKedua: 'Hubungi Kami',
    ctaKeduaLink: '/kontak',
    badge: 'Terpercaya Sejak 2015',
  },
  statistik: [
    { label: 'Unit Terjual',     value: '500+' },
    { label: 'Proyek Aktif',     value: '4'    },
    { label: 'Kota Jangkauan',   value: '8+'   },
    { label: 'Kepuasan Klien',   value: '98%'  },
  ],
  faq: [
    { pertanyaan: 'Apakah produk AFKAR LAND bersertifikat syariah?', jawaban: 'Ya, semua produk kami telah melalui kajian syariah dan bebas dari riba.' },
    { pertanyaan: 'Bagaimana cara pemesanan unit?',                   jawaban: 'Anda bisa mengisi formulir booking di halaman detail proyek atau menghubungi tim kami.' },
  ],
};

export default function ManageHomepage() {
  const [data, setData]           = useState(DEFAULT_DATA);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  const TABS = [
    { id: 'hero',       label: '🏠 Hero Banner' },
    { id: 'statistik',  label: '📊 Statistik'   },
    { id: 'faq',        label: '❓ FAQ'          },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDoc(doc(db, 'homepage_settings', 'main'));
        if (snap.exists()) setData(snap.data());
      } catch { /* gunakan default */ }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'homepage_settings', 'main'), data, { merge: true });
      toast.success('Konten homepage berhasil disimpan!');
    } catch {
      toast.error('Gagal menyimpan.');
    } finally {
      setSaving(false);
    }
  };

  const setHero = (key, val) => setData(d => ({ ...d, hero: { ...d.hero, [key]: val } }));

  // --- Statistik helpers ---
  const setStat = (i, key, val) => setData(d => {
    const s = [...d.statistik];
    s[i] = { ...s[i], [key]: val };
    return { ...d, statistik: s };
  });
  const addStat    = () => setData(d => ({ ...d, statistik: [...d.statistik, { label: '', value: '' }] }));
  const removeStat = (i) => setData(d => ({ ...d, statistik: d.statistik.filter((_, idx) => idx !== i) }));

  // --- FAQ helpers ---
  const setFaq = (i, key, val) => setData(d => {
    const f = [...d.faq];
    f[i] = { ...f[i], [key]: val };
    return { ...d, faq: f };
  });
  const addFaq    = () => setData(d => ({ ...d, faq: [...d.faq, { pertanyaan: '', jawaban: '' }] }));
  const removeFaq = (i) => setData(d => ({ ...d, faq: d.faq.filter((_, idx) => idx !== i) }));

  if (loading) return <div className="p-8 text-gray-400 animate-pulse">Memuat data homepage...</div>;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Manajemen Homepage</h1>
          <p className="text-gray-500 mt-1 text-sm">Edit konten halaman utama website AFKAR LAND.</p>
        </div>
        <div className="flex gap-3">
          <a href="/" target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <FiEye size={15}/> Preview
          </a>
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-60">
            <FiSave size={15}/> {saving ? 'Menyimpan...' : 'Simpan Semua'}
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: HERO */}
      {activeTab === 'hero' && (
        <SectionCard title="Hero Banner — Tampilan Utama" icon={<FiHome size={16}/>}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Judul Utama">
              <input className={inputCls} value={data.hero.judul} onChange={e => setHero('judul', e.target.value)} placeholder="Properti Syariah Terbaik..." />
            </Field>
            <Field label="Badge / Label Kecil">
              <input className={inputCls} value={data.hero.badge} onChange={e => setHero('badge', e.target.value)} placeholder="Terpercaya Sejak 2015" />
            </Field>
            <div className="md:col-span-2">
              <Field label="Sub-judul / Deskripsi">
                <textarea className={inputCls} rows={3} value={data.hero.subjudul} onChange={e => setHero('subjudul', e.target.value)} />
              </Field>
            </div>
            <Field label="Teks CTA Utama">
              <input className={inputCls} value={data.hero.ctaUtama} onChange={e => setHero('ctaUtama', e.target.value)} placeholder="Lihat Proyek Kami" />
            </Field>
            <Field label="Link CTA Utama">
              <input className={inputCls} value={data.hero.ctaUtamaLink} onChange={e => setHero('ctaUtamaLink', e.target.value)} placeholder="/proyek" />
            </Field>
            <Field label="Teks CTA Kedua">
              <input className={inputCls} value={data.hero.ctaKedua} onChange={e => setHero('ctaKedua', e.target.value)} placeholder="Hubungi Kami" />
            </Field>
            <Field label="Link CTA Kedua">
              <input className={inputCls} value={data.hero.ctaKeduaLink} onChange={e => setHero('ctaKeduaLink', e.target.value)} placeholder="/kontak" />
            </Field>
          </div>
        </SectionCard>
      )}

      {/* TAB: STATISTIK */}
      {activeTab === 'statistik' && (
        <SectionCard title="Statistik Perusahaan" icon={<LayoutDashboard size={16}/>}>
          <div className="space-y-3">
            {data.statistik.map((stat, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <input className={inputCls} value={stat.value} onChange={e => setStat(i, 'value', e.target.value)} placeholder="500+" />
                  <input className={inputCls} value={stat.label} onChange={e => setStat(i, 'label', e.target.value)} placeholder="Unit Terjual" />
                </div>
                <button onClick={() => removeStat(i)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors shrink-0">
                  <FiTrash2 size={15}/>
                </button>
              </div>
            ))}
            <button onClick={addStat}
              className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors w-full justify-center">
              <FiPlus size={15}/> Tambah Statistik
            </button>
          </div>
        </SectionCard>
      )}

      {/* TAB: FAQ */}
      {activeTab === 'faq' && (
        <SectionCard title="FAQ — Pertanyaan Umum" icon={<span className="text-sm">❓</span>}>
          <div className="space-y-4">
            {data.faq.map((item, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase">FAQ #{i + 1}</span>
                  <button onClick={() => removeFaq(i)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg">
                    <FiTrash2 size={13}/>
                  </button>
                </div>
                <input className={inputCls} value={item.pertanyaan} onChange={e => setFaq(i, 'pertanyaan', e.target.value)} placeholder="Pertanyaan..." />
                <textarea className={inputCls} rows={2} value={item.jawaban} onChange={e => setFaq(i, 'jawaban', e.target.value)} placeholder="Jawaban..." />
              </div>
            ))}
            <button onClick={addFaq}
              className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors w-full justify-center">
              <FiPlus size={15}/> Tambah FAQ
            </button>
          </div>
        </SectionCard>
      )}
    </div>
  );
}