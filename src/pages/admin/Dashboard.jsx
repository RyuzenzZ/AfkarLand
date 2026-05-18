// Dashboard.jsx — AFKAR LAND Admin Panel
// Built with Webapp GASP Builder Era v2.0 Masterpiece Edition by @damarmahendra

import React, { useState, useEffect } from 'react';
import {
  FiUsers, FiMessageSquare, FiFileText, FiBriefcase,
  FiArrowRight, FiTrendingUp, FiBell, FiZap,
  FiShield, FiActivity, FiDownload, FiClock,
} from 'react-icons/fi';
import { MdApartment } from 'react-icons/md';
import {
  BarChart2, Wallet, Bot, BookOpen, Star,
  Video, Map, MessageCircle, Flame, Layers,
  Cpu, FileBarChart,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

// ── Komponen ────────────────────────────────────────────────────

const StatCard = ({ stat, loading }) => (
  <Link
    to={stat.link}
    className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm
               hover:shadow-md hover:border-red-100 transition-all duration-300 overflow-hidden relative"
  >
    <div className={`absolute top-0 left-0 right-0 h-0.5 ${stat.accent} opacity-0 group-hover:opacity-100 transition-opacity`} />
    <div className="flex items-center justify-between mb-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
        {stat.icon}
      </div>
      <FiArrowRight size={14} className="text-gray-300 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all"/>
    </div>
    <div>
      <div className="text-2xl font-extrabold text-gray-900">
        {loading
          ? <span className="inline-block w-10 h-7 bg-gray-100 rounded animate-pulse"/>
          : stat.value
        }
      </div>
      <div className="text-xs font-semibold text-gray-700 mt-1">{stat.title}</div>
      <div className="text-xs text-gray-400 mt-0.5">{stat.desc}</div>
    </div>
  </Link>
);

const StatusDot = ({ label }) => (
  <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"/>
    <span className="text-xs font-medium text-gray-600">{label}</span>
    <span className="ml-auto text-xs font-bold text-emerald-600">Aktif</span>
  </div>
);

// Kartu fitur coming soon — abu-abu, badge "Segera"
const ComingSoonCard = ({ icon, label, desc, badge, iconBg }) => (
  <div className="flex flex-col items-center gap-2 p-4 bg-white border border-dashed border-gray-200
                  rounded-2xl text-center relative group hover:border-gray-300 transition-all">
    {/* Badge */}
    <span className="absolute top-2 right-2 text-[9px] bg-amber-50 text-amber-500 border border-amber-200
                     px-1.5 py-0.5 rounded-full font-bold">
      {badge}
    </span>
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg} opacity-60 group-hover:opacity-80 transition-opacity`}>
      {icon}
    </div>
    <span className="text-xs font-medium text-gray-400 leading-tight">{label}</span>
    {desc && <span className="text-[10px] text-gray-300">{desc}</span>}
    <span className="flex items-center gap-1 text-[9px] text-gray-300 font-medium mt-0.5">
      <FiClock size={9}/> Segera Hadir
    </span>
  </div>
);

// ── Dashboard ───────────────────────────────────────────────────
export default function Dashboard() {
  const [counts, setCounts] = useState({
    leads: 0, messages: 0, applications: 0,
    articles: 0, projects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let resolved = 0;
    const check = () => { resolved++; if (resolved >= 5) setLoading(false); };

    const u1 = onSnapshot(collection(db, 'leads'),        s => { setCounts(p => ({ ...p, leads: s.size }));        check(); });
    const u2 = onSnapshot(collection(db, 'messages'),     s => { setCounts(p => ({ ...p, messages: s.size }));     check(); });
    const u3 = onSnapshot(collection(db, 'applications'), s => { setCounts(p => ({ ...p, applications: s.size })); check(); });
    const u4 = onSnapshot(collection(db, 'articles'),     s => { setCounts(p => ({ ...p, articles: s.size }));     check(); });
    const u5 = onSnapshot(collection(db, 'projects'),     s => { setCounts(p => ({ ...p, projects: s.size }));     check(); });

    return () => { u1(); u2(); u3(); u4(); u5(); };
  }, []);

  // 5 stat cards — semua link ke halaman yang ada di sidebar
  const stats = [
    { title: 'Total Proyek',   value: counts.projects,     icon: <MdApartment size={20} className="text-red-600"/>,      iconBg: 'bg-red-50',     accent: 'bg-red-500',     link: '/admin/projects',     desc: 'Proyek properti aktif' },
    { title: 'Lead Masuk',     value: counts.leads,        icon: <FiUsers size={20} className="text-blue-600"/>,         iconBg: 'bg-blue-50',    accent: 'bg-blue-500',    link: '/admin/leads',        desc: 'Calon konsumen baru' },
    { title: 'Pesan Masuk',    value: counts.messages,     icon: <FiMessageSquare size={20} className="text-amber-600"/>, iconBg: 'bg-amber-50',   accent: 'bg-amber-500',   link: '/admin/messages',     desc: 'Dari halaman kontak' },
    { title: 'Lamaran Kerja',  value: counts.applications, icon: <FiBriefcase size={20} className="text-purple-600"/>,   iconBg: 'bg-purple-50',  accent: 'bg-purple-500',  link: '/admin/applications', desc: 'Calon tim AFKAR LAND' },
    { title: 'Artikel Publik', value: counts.articles,     icon: <FiFileText size={20} className="text-pink-600"/>,      iconBg: 'bg-pink-50',    accent: 'bg-pink-500',    link: '/admin/articles',     desc: 'Konten blog aktif' },
  ];

  // Fitur yang sedang dalam pengembangan — belum ada di sidebar
  const comingSoon = [
    { icon: <Bot size={18} className="text-violet-600"/>,        label: 'AI Content Generator', desc: 'F.30', badge: 'AI',    iconBg: 'bg-violet-50' },
    { icon: <MessageCircle size={18} className="text-green-600"/>, label: 'WA Automation',      desc: 'F.29', badge: 'Auto',  iconBg: 'bg-green-50' },
    { icon: <Video size={18} className="text-red-600"/>,          label: 'Video Manager',       desc: 'F.39', badge: 'Media', iconBg: 'bg-red-50' },
    { icon: <Flame size={18} className="text-orange-600"/>,       label: 'Heatmap Analytics',   desc: 'F.42', badge: 'Data',  iconBg: 'bg-orange-50' },
    { icon: <FiDownload size={18} className="text-cyan-600"/>,    label: 'Download Tracking',   desc: 'F.41', badge: 'Track', iconBg: 'bg-cyan-50' },
    { icon: <BookOpen size={18} className="text-orange-600"/>,    label: 'Form Builder',        desc: 'F.31', badge: 'Tools', iconBg: 'bg-orange-50' },
    { icon: <Map size={18} className="text-blue-600"/>,           label: 'Peta Interaktif',     desc: 'F.44', badge: 'Maps',  iconBg: 'bg-blue-50' },
    { icon: <Cpu size={18} className="text-gray-600"/>,           label: 'CRM Lanjutan',        desc: 'F.45', badge: 'CRM',   iconBg: 'bg-gray-50' },
    { icon: <FileBarChart size={18} className="text-teal-600"/>,  label: 'Laporan PDF Otomatis',desc: 'F.47', badge: 'PDF',   iconBg: 'bg-teal-50' },
    { icon: <Layers size={18} className="text-indigo-600"/>,      label: 'Multi-Tenant Panel',  desc: 'F.49', badge: 'Pro',   iconBg: 'bg-indigo-50' },
    { icon: <FiZap size={18} className="text-yellow-600"/>,       label: 'Push Notification',   desc: 'F.33', badge: 'Push',  iconBg: 'bg-yellow-50' },
    { icon: <Star size={18} className="text-pink-600"/>,          label: 'Video Testimoni',     desc: 'F.48', badge: 'Video', iconBg: 'bg-pink-50' },
  ];

  return (
    <div className="space-y-8">

      {/* ── HEADER ── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-red-500 font-bold tracking-widest uppercase mb-1">AFKAR LAND</p>
          <h1 className="text-3xl font-heading font-black text-gray-900">Dashboard Utama</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Pantau aktivitas dan statistik website AFKAR LAND secara real-time.
          </p>
        </div>
        <Link
          to="/admin/notifications"
          className="relative hidden md:flex items-center gap-2 px-4 py-3 bg-white border border-gray-200
                     rounded-xl hover:border-red-200 hover:shadow-sm transition-all text-gray-500 hover:text-gray-800"
        >
          <FiBell size={18}/>
          <span className="text-sm font-medium">Notifikasi</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"/>
        </Link>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} stat={stat} loading={loading}/>
        ))}
      </div>

      {/* ── STATUS SISTEM ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-400 rounded-t-2xl"/>
        <div className="flex items-start gap-4 mt-2 mb-5">
          <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center text-red-600 shrink-0">
            <FiShield size={20}/>
          </div>
          <div>
            <h3 className="text-base font-heading font-bold text-gray-900 mb-1">
              Sistem Integrasi Firebase Aktif
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Semua data tersimpan di Firebase Firestore secara real-time dan langsung terhubung ke halaman publik website AFKAR LAND.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {['Database Firestore', 'Firebase Auth', 'Real-time Sync', 'Data Terenkripsi', 'Backup Harian', 'Notifikasi Aktif'].map(label => (
            <StatusDot key={label} label={label}/>
          ))}
        </div>
      </div>

      {/* ── FITUR DALAM PENGEMBANGAN ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-heading font-bold text-gray-900 flex items-center gap-2">
            <FiZap size={15} className="text-amber-500"/>
            Fitur dalam Pengembangan
          </h3>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <FiClock size={11}/> Segera tersedia
          </span>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {comingSoon.map((f, i) => (
            <ComingSoonCard key={i} {...f}/>
          ))}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="text-center pt-4 border-t border-gray-100">
        <p className="text-[11px] text-gray-300">
         AFKAR LAND
        </p>
      </div>

    </div>
  );
}