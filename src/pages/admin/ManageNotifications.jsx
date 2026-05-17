// ManageNotifications.jsx — AFKAR LAND Admin Panel
// Pusat notifikasi realtime: lead baru, pesan baru, lamaran baru, booking baru
// Data dari Firestore, auto-mark dibaca, filter per tipe

import React, { useState, useEffect } from 'react';
import {
  collection, onSnapshot, query, orderBy, limit,
  updateDoc, deleteDoc, doc, writeBatch, getDocs, where
} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import {
  FiBell, FiUsers, FiMessageSquare, FiBriefcase,
  FiCheck, FiTrash2, FiCheckCircle, FiFilter, FiX
} from 'react-icons/fi';
import { CalendarCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// ── Konfigurasi sumber notifikasi ──────────────────────────────
const SOURCES = [
  {
    id: 'leads',
    label: 'Lead Baru',
    icon: <FiUsers size={15}/>,
    color: 'bg-blue-500',
    iconBg: 'bg-blue-50',
    textColor: 'text-blue-600',
    link: '/admin/leads',
    getMessage: (d) => `${d.nama || 'Seseorang'} tertarik dengan proyek ${d.proyek || 'AFKAR LAND'}`,
  },
  {
    id: 'messages',
    label: 'Pesan Masuk',
    icon: <FiMessageSquare size={15}/>,
    color: 'bg-amber-500',
    iconBg: 'bg-amber-50',
    textColor: 'text-amber-600',
    link: '/admin/messages',
    getMessage: (d) => `${d.nama || 'Seseorang'} mengirim pesan: "${(d.pesan || '').slice(0, 50)}${(d.pesan || '').length > 50 ? '...' : ''}"`,
  },
  {
    id: 'applications',
    label: 'Lamaran Kerja',
    icon: <FiBriefcase size={15}/>,
    color: 'bg-purple-500',
    iconBg: 'bg-purple-50',
    textColor: 'text-purple-600',
    link: '/admin/applications',
    getMessage: (d) => `${d.nama || 'Pelamar'} melamar posisi ${d.posisi || '-'}`,
  },
  {
    id: 'bookings',
    label: 'Booking Unit',
    icon: <CalendarCheck size={15}/>,
    color: 'bg-emerald-500',
    iconBg: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    link: '/admin/bookings',
    getMessage: (d) => `${d.nama || 'Seseorang'} melakukan booking unit ${d.unit || d.blok || '-'}`,
  },
];

const formatWaktu = (ts) => {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60)    return 'Baru saja';
  if (diff < 3600)  return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

const NotifItem = ({ notif, onRead, onDelete }) => {
  const src = SOURCES.find(s => s.id === notif._source) || SOURCES[0];
  return (
    <div className={`flex items-start gap-4 p-4 rounded-2xl border transition-all group
      ${notif._read ? 'bg-white border-gray-100' : 'bg-blue-50/40 border-blue-100'}`}>
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${src.iconBg} ${src.textColor}`}>
        {src.icon}
      </div>
      {/* Konten */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-[10px] font-extrabold uppercase tracking-wider ${src.textColor}`}>{src.label}</span>
          {!notif._read && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"/>}
        </div>
        <p className="text-sm text-gray-700 font-medium leading-snug">{notif._message}</p>
        <p className="text-xs text-gray-400 mt-1">{formatWaktu(notif.createdAt)}</p>
      </div>
      {/* Aksi */}
      <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {!notif._read && (
          <button onClick={() => onRead(notif)} title="Tandai dibaca"
            className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100">
            <FiCheck size={13}/>
          </button>
        )}
        <button onClick={() => onDelete(notif)} title="Hapus"
          className="p-1.5 bg-red-50 text-red-400 rounded-lg hover:bg-red-100">
          <FiTrash2 size={13}/>
        </button>
      </div>
      {/* Link ke halaman terkait */}
      <Link to={src.link} className="shrink-0 text-xs text-gray-300 hover:text-gray-600 transition-colors font-medium">
        Lihat →
      </Link>
    </div>
  );
};

export default function ManageNotifications() {
  const [notifs, setNotifs]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('semua');

  // Gabungkan listener dari semua sumber
  useEffect(() => {
    const allNotifs = {};
    let loadedCount = 0;
    const total = SOURCES.length;

    const unsubs = SOURCES.map(src => {
      const q = query(collection(db, src.id), orderBy('createdAt', 'desc'), limit(30));
      return onSnapshot(q, snap => {
        allNotifs[src.id] = snap.docs.map(d => ({
          id: d.id,
          ...d.data(),
          _source: src.id,
          _message: src.getMessage(d.data()),
          _read: d.data().notifRead === true,
        }));
        loadedCount++;
        if (loadedCount >= total) setLoading(false);

        // Gabung & urutkan semua notif berdasarkan createdAt
        const merged = Object.values(allNotifs).flat().sort((a, b) => {
          const ta = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
          const tb = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
          return tb - ta;
        });
        setNotifs(merged);
      }, () => {
        loadedCount++;
        if (loadedCount >= total) setLoading(false);
      });
    });

    return () => unsubs.forEach(u => u());
  }, []);

  const handleRead = async (notif) => {
    try {
      await updateDoc(doc(db, notif._source, notif.id), { notifRead: true });
    } catch { toast.error('Gagal menandai.'); }
  };

  const handleDelete = async (notif) => {
    // Hapus notif = hanya mark dihapus, data asli tetap
    try {
      await updateDoc(doc(db, notif._source, notif.id), { notifHidden: true });
      toast.success('Notifikasi dihapus.');
    } catch { toast.error('Gagal.'); }
  };

  const readAll = async () => {
    const unread = notifs.filter(n => !n._read);
    try {
      await Promise.all(unread.map(n => updateDoc(doc(db, n._source, n.id), { notifRead: true })));
      toast.success(`${unread.length} notifikasi ditandai dibaca.`);
    } catch { toast.error('Gagal.'); }
  };

  // Filter: sembunyikan yang notifHidden=true
  const visible = notifs.filter(n => !n.notifHidden);
  const filtered = filter === 'semua'
    ? visible
    : visible.filter(n => n._source === filter);

  const unreadCount = visible.filter(n => !n._read).length;

  const FILTER_TABS = [
    { id: 'semua', label: 'Semua' },
    ...SOURCES.map(s => ({ id: s.id, label: s.label })),
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
              <FiBell size={22} className="text-white"/>
            </div>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900">Notifikasi</h1>
            <p className="text-gray-500 mt-0.5 text-sm">
              {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : 'Semua sudah dibaca'}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button onClick={readAll}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
            <FiCheckCircle size={15}/> Tandai Semua Dibaca
          </button>
        )}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {SOURCES.map(s => {
          const count = visible.filter(n => n._source === s.id && !n._read).length;
          return (
            <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.iconBg} ${s.textColor}`}>{s.icon}</div>
              <div>
                <div className="text-xl font-black text-gray-900">{count}</div>
                <div className="text-[11px] text-gray-400 font-medium">{s.label} baru</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 flex-wrap">
        <FiFilter size={13} className="text-gray-400"/>
        {FILTER_TABS.map(tab => (
          <button key={tab.id} onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all
              ${filter === tab.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            {tab.label}
            {tab.id !== 'semua' && (
              <span className="ml-1.5 opacity-60">
                ({visible.filter(n => n._source === tab.id && !n._read).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* LIST NOTIFIKASI */}
      <div className="space-y-2">
        {loading ? (
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse"/>
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 text-gray-400">
            <FiBell size={40} className="mx-auto mb-3 opacity-20"/>
            <p className="font-medium">Tidak ada notifikasi.</p>
          </div>
        ) : (
          filtered.map(n => (
            <NotifItem key={`${n._source}-${n.id}`} notif={n} onRead={handleRead} onDelete={handleDelete}/>
          ))
        )}
      </div>

      {/* Footer count */}
      {!loading && filtered.length > 0 && (
        <p className="text-xs text-gray-300 text-center">
          Menampilkan {filtered.length} notifikasi
        </p>
      )}
    </div>
  );
}