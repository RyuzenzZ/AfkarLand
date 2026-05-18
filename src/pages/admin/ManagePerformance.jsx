// ManagePerformance.jsx — AFKAR LAND Admin Panel
// Leaderboard tim marketing: ranking berdasarkan leads, booking, konversi
// Data dari Firestore koleksi 'leads' & 'bookings' → field 'agen' / 'marketing'
// Full Overhaul v2 — Podium Visual, Per-Divisi Breakdown, Form Detail Agen
// Built with Webapp GASP Builder Era v2.0 Masterpiece Edition by @damarmahendra

import React, { useState, useEffect, useMemo } from 'react';
import {
  collection, onSnapshot, query, orderBy,
  addDoc, updateDoc, deleteDoc, doc, serverTimestamp
} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import {
  FiTrendingUp, FiUsers, FiAward, FiPlus,
  FiTrash2, FiX, FiSave, FiEdit2, FiImage, FiTarget
} from 'react-icons/fi';
import { BarChart2, Trophy, Medal, Star, Target, Building2, Layers, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import toast from 'react-hot-toast';

// ── Konstanta ───────────────────────────────────────────────────
const MONTHS_ID = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

const DIVISI_LIST = [
  'Marketing Executive',
  'Digital Marketing',
  'Sales Leader',
  'Marcomm',
  'Pimpinan Proyek / Teknis',
];

const PROYEK_LIST = [
  'Semua Proyek',
  'Masagena Green Hills',
  'Wotu Islamic Village',
  'The Hasanah Panakkukang',
  'Afkar Madani Estate',
];

const DIVISI_COLOR = {
  'Marketing Executive':     'bg-blue-50 text-blue-700',
  'Digital Marketing':       'bg-purple-50 text-purple-700',
  'Sales Leader':            'bg-amber-50 text-amber-700',
  'Marcomm':                 'bg-pink-50 text-pink-700',
  'Pimpinan Proyek / Teknis':'bg-gray-100 text-gray-600',
};

const inputCls = "w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-400 outline-none text-sm transition-colors";
const labelCls = "block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider";

// ── Medal config ─────────────────────────────────────────────────
const MEDAL = {
  0: { icon: <Trophy size={18} className="text-amber-500" />, bg: 'bg-amber-50', border: 'border-amber-200', badge: '🥇', color: '#f59e0b', podiumH: 'h-28' },
  1: { icon: <Medal size={18} className="text-gray-400" />,   bg: 'bg-gray-50',  border: 'border-gray-200',  badge: '🥈', color: '#9ca3af', podiumH: 'h-20' },
  2: { icon: <Medal size={18} className="text-orange-400" />, bg: 'bg-orange-50',border: 'border-orange-200',badge: '🥉', color: '#f97316', podiumH: 'h-16' },
};

const getLast6Months = () => {
  const result = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push(`${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`);
  }
  return result;
};

const toMonthLabel = (ts) => {
  const d = ts?.toDate ? ts.toDate() : new Date(ts || 0);
  return `${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
};

// ── Komponen Avatar ──────────────────────────────────────────────
const AgentAvatar = ({ agent, size = 'md' }) => {
  const s = size === 'lg' ? 'w-16 h-16 text-xl' : size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';
  if (agent?.fotoUrl) {
    return (
      <img src={agent.fotoUrl} alt={agent.nama}
        className={`${s} rounded-full object-cover border-2 border-gray-200`}
        onError={e => { e.target.style.display='none'; }} />
    );
  }
  return (
    <div className={`${s} rounded-full bg-gray-800 text-white flex items-center justify-center font-extrabold shrink-0`}>
      {(agent?.nama || '?').charAt(0).toUpperCase()}
    </div>
  );
};

// ── Komponen Podium Visual (Top 3) ───────────────────────────────
const Podium = ({ top3, agentsMap }) => {
  // Urutan tampil: #2 (kiri), #1 (tengah/tertinggi), #3 (kanan)
  const order = [top3[1], top3[0], top3[2]].filter(Boolean);
  const ranks = [1, 0, 2]; // index di leaderboard masing-masing

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Trophy size={16} className="text-amber-500" />
        <h3 className="font-heading font-bold text-gray-800 text-sm">Podium Terbaik</h3>
      </div>

      <div className="flex items-end justify-center gap-3">
        {order.map((agen, i) => {
          const rank = ranks[i];
          const medal = MEDAL[rank];
          const agentDetail = agentsMap[agen?.nama];
          return (
            <div key={agen?.nama || i} className="flex flex-col items-center gap-2 flex-1">
              {/* Kartu agen */}
              <div className="text-center mb-1">
                <div className="text-lg mb-1">{medal.badge}</div>
                <div className="relative mx-auto w-fit">
                  <AgentAvatar agent={agentDetail || { nama: agen?.nama }} size={rank === 0 ? 'lg' : 'md'} />
                  {rank === 0 && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-[9px]">👑</div>
                  )}
                </div>
                <div className={`font-bold text-gray-900 mt-2 truncate max-w-[80px] mx-auto ${rank === 0 ? 'text-sm' : 'text-xs'}`}>
                  {agen?.nama}
                </div>
                {agentDetail?.divisi && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${DIVISI_COLOR[agentDetail.divisi] || 'bg-gray-100 text-gray-500'}`}>
                    {agentDetail.divisi}
                  </span>
                )}
                <div className="text-xs text-blue-600 font-black mt-1">{agen?.leads} leads</div>
                <div className="text-[10px] text-emerald-600 font-bold">{agen?.bookings} booking</div>
              </div>
              {/* Podium block */}
              <div
                className={`w-full rounded-t-xl flex items-center justify-center font-black text-white text-xs ${medal.podiumH}`}
                style={{ backgroundColor: medal.color }}
              >
                #{rank + 1}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── MAIN COMPONENT ────────────────────────────────────────────────
export default function ManagePerformance() {
  const [leads, setLeads]         = useState([]);
  const [bookings, setBookings]   = useState([]);
  const [agents, setAgents]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [period, setPeriod]       = useState('semua');
  const [filterDivisi, setFilterDivisi] = useState('Semua');
  const [sortBy, setSortBy]       = useState('leads'); // 'leads' | 'bookings' | 'konversi'
  const [isModalAdd, setIsModalAdd] = useState(false);
  const [modalHapus, setModalHapus] = useState(null);
  const [editAgent, setEditAgent] = useState(null);

  // Form state
  const [formNama, setFormNama]           = useState('');
  const [formDivisi, setFormDivisi]       = useState('Marketing Executive');
  const [formProyek, setFormProyek]       = useState('Semua Proyek');
  const [formFoto, setFormFoto]           = useState('');
  const [formTarget, setFormTarget]       = useState(10);
  const [formTargetBooking, setFormTargetBooking] = useState(3);

  const months6 = getLast6Months();

  // ── Listener Firestore ─────────────────────────────────────────
  useEffect(() => {
    let loaded = 0;
    const check = () => { loaded++; if (loaded >= 3) setLoading(false); };

    const u1 = onSnapshot(
      query(collection(db, 'leads'), orderBy('createdAt', 'desc')),
      snap => { setLeads(snap.docs.map(d => ({ id: d.id, ...d.data() }))); check(); },
      () => { check(); }
    );
    const u2 = onSnapshot(
      collection(db, 'bookings'),
      snap => { setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() }))); check(); },
      () => { check(); }
    );
    const u3 = onSnapshot(
      collection(db, 'marketing_team'),
      snap => { setAgents(snap.docs.map(d => ({ id: d.id, ...d.data() }))); check(); },
      () => { check(); }
    );
    return () => { u1(); u2(); u3(); };
  }, []);

  // ── Agents Map (lookup by nama) ────────────────────────────────
  const agentsMap = useMemo(() => {
    const map = {};
    agents.forEach(a => { map[a.nama] = a; });
    return map;
  }, [agents]);

  // ── Filter periode ─────────────────────────────────────────────
  const filterDocs = (docs) => {
    if (period === 'semua') return docs;
    const now = new Date();
    return docs.filter(d => {
      const t = d.createdAt?.toDate?.() || new Date(d.createdAt || 0);
      if (period === 'bulan') return t.getMonth() === now.getMonth() && t.getFullYear() === now.getFullYear();
      if (period === '6bulan') return months6.includes(toMonthLabel(d.createdAt));
      return true;
    });
  };

  const filteredLeads    = filterDocs(leads);
  const filteredBookings = filterDocs(bookings);

  // ── Leaderboard ────────────────────────────────────────────────
  const leaderboard = useMemo(() => {
    const agenNames = new Set([
      ...agents.map(a => a.nama),
      ...leads.map(l => l.agen || l.marketing).filter(Boolean),
      ...bookings.map(b => b.agen || b.marketing).filter(Boolean),
    ]);

    let board = Array.from(agenNames).map(nama => {
      const agentLeads    = filteredLeads.filter(l => (l.agen || l.marketing) === nama);
      const agentBookings = filteredBookings.filter(b => (b.agen || b.marketing) === nama);
      const agentData     = agentsMap[nama] || {};
      const target        = agentData.target || 10;
      const targetBooking = agentData.targetBooking || 3;
      const konversi      = agentLeads.length > 0
        ? Math.round((agentBookings.length / agentLeads.length) * 100) : 0;
      const targetPctLeads   = target > 0 ? Math.min(Math.round((agentLeads.length / target) * 100), 100) : 0;
      const targetPctBooking = targetBooking > 0 ? Math.min(Math.round((agentBookings.length / targetBooking) * 100), 100) : 0;

      return {
        nama,
        divisi:  agentData.divisi  || '',
        proyek:  agentData.proyek  || 'Semua Proyek',
        fotoUrl: agentData.fotoUrl || '',
        leads:   agentLeads.length,
        bookings: agentBookings.length,
        konversi,
        target,
        targetBooking,
        targetPctLeads,
        targetPctBooking,
      };
    });

    // Filter divisi
    if (filterDivisi !== 'Semua') {
      board = board.filter(a => agentsMap[a.nama]?.divisi === filterDivisi);
    }

    // Sort
    if (sortBy === 'leads')    board.sort((a, b) => b.leads - a.leads || b.bookings - a.bookings);
    if (sortBy === 'bookings') board.sort((a, b) => b.bookings - a.bookings || b.leads - a.leads);
    if (sortBy === 'konversi') board.sort((a, b) => b.konversi - a.konversi);

    return board;
  }, [agents, leads, bookings, filteredLeads, filteredBookings, agentsMap, filterDivisi, sortBy]);

  // ── Per-divisi summary ─────────────────────────────────────────
  const divisiSummary = useMemo(() => DIVISI_LIST.map(div => {
    const members = agents.filter(a => a.divisi === div).map(a => a.nama);
    const totalLeadsDiv = filteredLeads.filter(l => members.includes(l.agen || l.marketing)).length;
    const totalBookDiv  = filteredBookings.filter(b => members.includes(b.agen || b.marketing)).length;
    return { div, members: members.length, leads: totalLeadsDiv, bookings: totalBookDiv };
  }), [agents, filteredLeads, filteredBookings]);

  // ── Chart 6 bulan (total tim) ──────────────────────────────────
  const chartData = months6.map(m => ({
    bulan: m,
    Leads:   leads.filter(l => toMonthLabel(l.createdAt) === m).length,
    Booking: bookings.filter(b => toMonthLabel(b.createdAt) === m).length,
  }));

  // ── KPI overview ───────────────────────────────────────────────
  const totalLeadsAll    = filteredLeads.length;
  const totalBookingsAll = filteredBookings.length;
  const avgKonversi      = leaderboard.length > 0
    ? Math.round(leaderboard.reduce((s, a) => s + a.konversi, 0) / leaderboard.length) : 0;
  const topAgen          = leaderboard[0]?.nama || '-';

  // ── Reset form ─────────────────────────────────────────────────
  const resetForm = () => {
    setFormNama(''); setFormDivisi('Marketing Executive');
    setFormProyek('Semua Proyek'); setFormFoto('');
    setFormTarget(10); setFormTargetBooking(3);
    setEditAgent(null);
  };

  // ── Tambah / Edit Anggota Tim ──────────────────────────────────
  const handleSaveAgent = async (e) => {
    e.preventDefault();
    if (!formNama.trim()) return;
    const payload = {
      nama:          formNama.trim(),
      divisi:        formDivisi,
      proyek:        formProyek,
      fotoUrl:       formFoto.trim(),
      target:        Number(formTarget),
      targetBooking: Number(formTargetBooking),
      updatedAt:     serverTimestamp(),
    };
    try {
      if (editAgent) {
        await updateDoc(doc(db, 'marketing_team', editAgent.id), payload);
        toast.success('Data tim diperbarui!');
      } else {
        await addDoc(collection(db, 'marketing_team'), { ...payload, createdAt: serverTimestamp() });
        toast.success('Anggota tim ditambahkan!');
      }
      setIsModalAdd(false); resetForm();
    } catch { toast.error('Gagal menyimpan.'); }
  };

  const openEdit = (agent) => {
    setEditAgent(agent);
    setFormNama(agent.nama || '');
    setFormDivisi(agent.divisi || 'Marketing Executive');
    setFormProyek(agent.proyek || 'Semua Proyek');
    setFormFoto(agent.fotoUrl || '');
    setFormTarget(agent.target || 10);
    setFormTargetBooking(agent.targetBooking || 3);
    setIsModalAdd(true);
  };

  const handleHapus = async () => {
    try {
      await deleteDoc(doc(db, 'marketing_team', modalHapus));
      toast.success('Anggota dihapus.'); setModalHapus(null);
    } catch { toast.error('Gagal.'); }
  };

  const top3 = leaderboard.filter((_, i) => i < 3);

  return (
    <div className="space-y-6">

      {/* ── HEADER ── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Performa Tim Marketing</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Leaderboard agen, per-divisi breakdown, dan pencapaian target booking.
          </p>
        </div>
        <button onClick={() => { resetForm(); setIsModalAdd(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors shadow-sm">
          <FiPlus size={16} /> Tambah Anggota
        </button>
      </div>

      {/* ── FILTER PERIODE ── */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {[
            { id: 'bulan',  label: 'Bulan Ini' },
            { id: '6bulan', label: '6 Bulan' },
            { id: 'semua',  label: 'Semua Waktu' },
          ].map(p => (
            <button key={p.id} onClick={() => setPeriod(p.id)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all
                ${period === p.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {p.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {[
            { id: 'leads',    label: 'Leads' },
            { id: 'bookings', label: 'Booking' },
            { id: 'konversi', label: 'Konversi' },
          ].map(s => (
            <button key={s.id} onClick={() => setSortBy(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                ${sortBy === s.id ? 'bg-white shadow-sm text-red-600' : 'text-gray-500 hover:text-gray-700'}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads',    value: totalLeadsAll,    icon: <FiUsers size={18}/>,    color: 'bg-blue-50 text-blue-600',    sub: `${period === 'bulan' ? 'Bulan ini' : period === '6bulan' ? '6 bulan' : 'Semua waktu'}` },
          { label: 'Total Booking',  value: totalBookingsAll, icon: <Target size={18}/>,     color: 'bg-emerald-50 text-emerald-600', sub: `dari ${totalLeadsAll} leads` },
          { label: 'Agen Aktif',     value: leaderboard.length, icon: <BarChart2 size={18}/>, color: 'bg-purple-50 text-purple-600', sub: `${agents.length} terdaftar` },
          { label: 'Avg Konversi',   value: `${avgKonversi}%`, icon: <TrendingUp size={18}/>, color: 'bg-red-50 text-red-600',       sub: `Top: ${topAgen}` },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
            <div className="text-2xl font-black text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</div>
            <div className="text-[10px] text-gray-300 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── PODIUM + CHART ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Podium visual */}
        {top3.length >= 1 && <Podium top3={top3} agentsMap={agentsMap} />}

        {/* Chart bar 6 bulan */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-heading font-bold text-gray-800 text-sm mb-5">Tren 6 Bulan</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={10} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="bulan" tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Bar dataKey="Leads"   fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Booking" fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 justify-center mt-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded bg-blue-500" /> Leads</div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded bg-emerald-500" /> Booking</div>
          </div>
        </div>
      </div>

      {/* ── PER-DIVISI SUMMARY ── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-purple-500" />
            <h3 className="font-heading font-bold text-gray-800 text-sm">Performa Per Divisi</h3>
          </div>
          <div className="flex gap-1 flex-wrap">
            {['Semua', ...DIVISI_LIST].map(d => (
              <button key={d} onClick={() => setFilterDivisi(d)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap
                  ${filterDivisi === d ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                {d === 'Semua' ? 'Semua Divisi' : d}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-gray-100">
          {divisiSummary.map((d, i) => (
            <div key={i}
              onClick={() => setFilterDivisi(filterDivisi === d.div ? 'Semua' : d.div)}
              className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${filterDivisi === d.div ? 'bg-purple-50' : ''}`}
            >
              <div className={`text-[9px] font-extrabold uppercase tracking-widest mb-2 ${filterDivisi === d.div ? 'text-purple-600' : 'text-gray-400'}`}>
                {d.div}
              </div>
              <div className="text-blue-600 font-black text-sm">{d.leads}</div>
              <div className="text-[10px] text-gray-400">leads</div>
              <div className="text-emerald-600 font-bold text-xs mt-1">{d.bookings} booking</div>
              <div className="text-[10px] text-gray-300">{d.members} agen</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── LEADERBOARD FULL ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-amber-500" />
            <h3 className="font-heading font-bold text-gray-800 text-sm">
              Ranking Tim Marketing
              {filterDivisi !== 'Semua' && (
                <span className="ml-2 text-xs font-normal text-purple-600">— {filterDivisi}</span>
              )}
            </h3>
          </div>
          <span className="text-xs text-gray-400">{leaderboard.length} agen</span>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <FiAward size={36} className="mx-auto mb-3 opacity-20" />
            <p>Belum ada data leads dengan field "agen" atau "marketing".</p>
            <p className="text-xs mt-1">Pastikan form leads menyimpan nama agen, atau tambahkan anggota tim terlebih dahulu.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {leaderboard.map((agen, idx) => {
              const medal = MEDAL[idx];
              const pctLeads = leaderboard[0].leads > 0
                ? Math.round((agen.leads / leaderboard[0].leads) * 100) : 0;
              const agentDetail = agentsMap[agen.nama];

              return (
                <div key={agen.nama}
                  className={`flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-gray-50/50
                    ${medal ? `${medal.bg}` : ''}`}
                >
                  {/* Rank badge */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${medal?.border || 'border-gray-200'} ${medal?.bg || 'bg-gray-50'}`}>
                    {medal ? <span className="text-base">{medal.badge}</span> : <span className="text-xs font-black text-gray-500">#{idx + 1}</span>}
                  </div>

                  {/* Avatar */}
                  <AgentAvatar agent={agentDetail || { nama: agen.nama, fotoUrl: agen.fotoUrl }} size="md" />

                  {/* Info nama + divisi */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gray-900 text-sm">{agen.nama}</span>
                      {agen.divisi && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${DIVISI_COLOR[agen.divisi] || 'bg-gray-100 text-gray-500'}`}>
                          {agen.divisi}
                        </span>
                      )}
                      {agen.proyek && agen.proyek !== 'Semua Proyek' && (
                        <span className="text-[9px] font-medium text-gray-400 truncate max-w-[100px]">{agen.proyek}</span>
                      )}
                    </div>
                    {/* Progress bar leads */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all duration-700"
                          style={{ width: `${pctLeads}%` }} />
                      </div>
                      <span className="text-[10px] text-gray-400 shrink-0">Target leads: {agen.targetPctLeads}%</span>
                    </div>
                    {/* Progress bar booking */}
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                          style={{ width: `${agen.targetPctBooking}%` }} />
                      </div>
                      <span className="text-[10px] text-gray-400 shrink-0">Target booking: {agen.targetPctBooking}%</span>
                    </div>
                  </div>

                  {/* Stat angka */}
                  <div className="text-right shrink-0 min-w-[70px]">
                    <div className="text-sm font-black text-gray-900">{agen.leads} leads</div>
                    <div className="text-xs text-emerald-600 font-bold">{agen.bookings} booking</div>
                    <div className={`text-xs font-black ${agen.konversi >= 50 ? 'text-emerald-600' : agen.konversi >= 20 ? 'text-amber-500' : 'text-red-400'}`}>
                      {agen.konversi}% konv.
                    </div>
                  </div>

                  {/* Edit / hapus */}
                  {agentDetail && (
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => openEdit(agentDetail)}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><FiEdit2 size={12} /></button>
                      <button onClick={() => setModalHapus(agentDetail.id)}
                        className="p-1.5 bg-red-50 text-red-400 rounded-lg hover:bg-red-100"><FiTrash2 size={12} /></button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── MODAL TAMBAH / EDIT AGEN ── */}
      {isModalAdd && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <h2 className="font-heading font-bold text-gray-900">
                  {editAgent ? 'Edit Anggota Tim' : 'Tambah Anggota Tim'}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Data agen marketing AFKAR LAND</p>
              </div>
              <button onClick={() => { setIsModalAdd(false); resetForm(); }}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"><FiX /></button>
            </div>
            <form onSubmit={handleSaveAgent} className="p-6 space-y-4">

              {/* Preview foto */}
              {formFoto && (
                <div className="flex justify-center">
                  <img src={formFoto} alt="preview"
                    className="w-20 h-20 rounded-full object-cover border-4 border-red-100"
                    onError={e => { e.target.style.display = 'none'; }} />
                </div>
              )}

              {/* Nama */}
              <div>
                <label className={labelCls}>Nama Lengkap *</label>
                <input className={inputCls} value={formNama}
                  onChange={e => setFormNama(e.target.value)}
                  required placeholder="Nama lengkap agen marketing" />
              </div>

              {/* Divisi + Proyek */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Divisi</label>
                  <select className={inputCls} value={formDivisi} onChange={e => setFormDivisi(e.target.value)}>
                    {DIVISI_LIST.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Proyek Utama</label>
                  <select className={inputCls} value={formProyek} onChange={e => setFormProyek(e.target.value)}>
                    {PROYEK_LIST.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Foto URL */}
              <div>
                <label className={labelCls}>
                  <div className="flex items-center gap-1.5"><FiImage size={11}/> URL Foto Profil (opsional)</div>
                </label>
                <input className={inputCls} value={formFoto}
                  onChange={e => setFormFoto(e.target.value)}
                  placeholder="https://storage.googleapis.com/..." />
                <p className="text-xs text-gray-400 mt-1">Bisa dari Firebase Storage, Google Drive (format direct link), dll.</p>
              </div>

              {/* Target Leads + Target Booking */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>
                    <div className="flex items-center gap-1"><FiUsers size={10}/> Target Leads / Bulan</div>
                  </label>
                  <input type="number" className={inputCls} value={formTarget}
                    onChange={e => setFormTarget(e.target.value)} min={1} />
                  <p className="text-xs text-gray-400 mt-1">Progress bar leads.</p>
                </div>
                <div>
                  <label className={labelCls}>
                    <div className="flex items-center gap-1"><FiTarget size={10}/> Target Booking / Bulan</div>
                  </label>
                  <input type="number" className={inputCls} value={formTargetBooking}
                    onChange={e => setFormTargetBooking(e.target.value)} min={0} />
                  <p className="text-xs text-gray-400 mt-1">Progress bar booking.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex gap-3">
                <button type="button" onClick={() => { setIsModalAdd(false); resetForm(); }}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50">
                  Batal
                </button>
                <button type="submit"
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                  <FiSave size={15} /> Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL HAPUS ── */}
      {modalHapus && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrash2 className="text-red-500" size={24} />
            </div>
            <h2 className="text-xl font-heading font-bold text-gray-900 mb-2">Hapus Anggota?</h2>
            <p className="text-gray-500 text-sm mb-6">Anggota ini dihapus dari daftar tim. Data leads & booking tetap tersimpan.</p>
            <div className="flex gap-3">
              <button onClick={() => setModalHapus(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 text-sm">Batal</button>
              <button onClick={handleHapus} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 text-sm">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}