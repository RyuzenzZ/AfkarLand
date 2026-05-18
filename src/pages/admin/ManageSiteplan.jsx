// ManageSiteplan.jsx — AFKAR LAND Admin Panel v3.0 PREMIUM
// UPDATE v3.0:
//   1. Hapus Blok Massal di Grid Management
//   2. Premium Glassmorphism Dashboard
//   3. Hapus Riwayat Live Activity
//   4. Form Tambah Unit Premium (7 Section + Smart Payment)
//   5. Auto Draft Berita ke Manage Articles saat unit update
//   6. Premium Project Selector + Modal Tambah Proyek
//   7. Generate Form Custom (Nama Blok + Jumlah Unit)
//   8. Smart Payment Scheme di Form Tambah & Edit Unit
// Built with Webapp GASP Builder Era v2.0 Masterpiece Edition by @damarmahendra

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import {
  collection, onSnapshot, addDoc, updateDoc, setDoc,
  deleteDoc, doc, serverTimestamp, query, where, writeBatch
} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import {
  FiGrid, FiPlus, FiX, FiSave, FiTrash2, FiEdit2,
  FiSearch, FiDownload, FiRefreshCw, FiMap, FiZoomIn,
  FiZoomOut, FiMaximize2, FiActivity, FiBell, FiUser,
  FiPhone, FiMinus, FiCheckSquare, FiSquare, FiSliders,
  FiList, FiFileText, FiCreditCard, FiSettings, FiMapPin,
  FiHome, FiMessageSquare, FiCopy, FiAlertTriangle,
} from 'react-icons/fi';
import {
  MapPin, Home, CheckCircle, Clock, XCircle, AlertCircle,
  TrendingUp, Users, BarChart2, Building2,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ── Konfigurasi Proyek Awal ──────────────────────────────────────────────
const PROYEK_CONFIG_INITIAL = {
  'Masagena Green Hills': {
    bloks: ['A', 'B', 'C', 'D', 'E'],
    unitPerBlok: { A: 20, B: 18, C: 16, D: 20, E: 15 },
    tipeDefault: '36/72', color: 'emerald', imageUrl: null,
    blokPositions: {
      A: { x: 27, y: 50, zoom: 2.2 }, B: { x: 43, y: 14, zoom: 2.2 },
      C: { x: 62, y: 47, zoom: 2.2 }, D: { x: 68, y: 64, zoom: 2.2 }, E: { x: 72, y: 80, zoom: 2.2 },
    },
  },
  'Wotu Islamic Village': {
    bloks: ['A', 'B', 'C'],
    unitPerBlok: { A: 15, B: 12, C: 10 },
    tipeDefault: '45/90', color: 'blue', imageUrl: null,
    blokPositions: {
      A: { x: 20, y: 35, zoom: 2.2 }, B: { x: 50, y: 40, zoom: 2.2 }, C: { x: 75, y: 45, zoom: 2.2 },
    },
  },
  'The Hasanah Panakkukang': {
    bloks: ['A', 'B'],
    unitPerBlok: { A: 10, B: 8 },
    tipeDefault: '60/120', color: 'purple', imageUrl: null,
    blokPositions: {
      A: { x: 30, y: 40, zoom: 2.2 }, B: { x: 65, y: 45, zoom: 2.2 },
    },
  },
  'Afkar Madani Estate': {
    bloks: ['A', 'B', 'C', 'D'],
    unitPerBlok: { A: 12, B: 14, C: 10, D: 12 },
    tipeDefault: '48/96', color: 'amber', imageUrl: null,
    blokPositions: {
      A: { x: 20, y: 30, zoom: 2.2 }, B: { x: 50, y: 28, zoom: 2.2 },
      C: { x: 22, y: 60, zoom: 2.2 }, D: { x: 55, y: 62, zoom: 2.2 },
    },
  },
};

// ── Project color map ────────────────────────────────────────────────────
const PROJECT_COLORS = {
  emerald: { from: '#059669', to: '#34d399', ring: '#10b981', badge: 'bg-emerald-500' },
  blue:    { from: '#2563eb', to: '#60a5fa', ring: '#3b82f6', badge: 'bg-blue-500'    },
  purple:  { from: '#7c3aed', to: '#a78bfa', ring: '#8b5cf6', badge: 'bg-purple-500'  },
  amber:   { from: '#d97706', to: '#fcd34d', ring: '#f59e0b', badge: 'bg-amber-500'   },
  red:     { from: '#dc2626', to: '#f87171', ring: '#ef4444', badge: 'bg-red-500'     },
  slate:   { from: '#475569', to: '#94a3b8', ring: '#64748b', badge: 'bg-slate-500'   },
  rose:    { from: '#e11d48', to: '#fb7185', ring: '#f43f5e', badge: 'bg-rose-500'    },
  cyan:    { from: '#0891b2', to: '#22d3ee', ring: '#06b6d4', badge: 'bg-cyan-500'    },
};

// ── Smart Payment Scheme ─────────────────────────────────────────────────
const PAYMENT_SCHEME = {
  cash_keras: { label: 'Cash Keras', icon: '💰', color: '#10b981' },
  cash_lunak: { label: 'Cash Lunak', icon: '📅', color: '#3b82f6' },
  dp_cicilan: { label: 'DP / Cicilan', icon: '📘', color: '#8b5cf6' },
};

// ── Status Kavling ───────────────────────────────────────────────────────
const STATUS = {
  Tersedia: { label: 'Tersedia', color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-300', icon: <CheckCircle size={13} />, dot: '#10b981', svgFill: '#d1fae5', svgStroke: '#10b981' },
  Keep:     { label: 'Keep',     color: 'bg-blue-500',    text: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-300',    icon: <Clock size={13} />,        dot: '#3b82f6', svgFill: '#dbeafe', svgStroke: '#3b82f6' },
  Booking:  { label: 'Booking',  color: 'bg-amber-400',   text: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-300',   icon: <AlertCircle size={13} />,  dot: '#f59e0b', svgFill: '#fef3c7', svgStroke: '#f59e0b' },
  SoldOut:  { label: 'Sold Out', color: 'bg-red-500',     text: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-300',     icon: <XCircle size={13} />,      dot: '#ef4444', svgFill: '#fee2e2', svgStroke: '#ef4444' },
};

const STATUS_LIST      = Object.keys(STATUS);
const TIPE_OPTIONS     = ['36/72', '36/84', '45/90', '48/96', '60/120', '70/140', 'Ruko'];
const MARKETING_LIST   = ['Fulan', 'Akbar', 'Nia', 'Tim Hasanah'];
const DOT_MIN = 8, DOT_MAX = 32, ADMIN_CANVAS_H = 660;

// ── Input class helpers ──────────────────────────────────────────────────
const inputCls    = 'w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-400 outline-none text-sm transition-colors';
const lightLabel  = 'block text-[10px] font-black text-gray-500 mb-1.5 uppercase tracking-widest';
const darkInput   = 'w-full px-4 py-3 rounded-xl bg-white/8 border border-white/15 focus:border-white/40 outline-none text-sm text-white placeholder-white/30 transition-all';
const darkLabel   = 'block text-[10px] font-black text-white/50 mb-1.5 uppercase tracking-widest';
const darkSection = 'bg-white/5 border border-white/8 rounded-2xl p-5 space-y-4';

// ── Form Default ─────────────────────────────────────────────────────────
const FORM_DEFAULT = {
  blok: 'A', nomor: '', tipe: '36/72', harga: '', diskon: '',
  status: 'Tersedia', catatan: '',
  namaUser: '', noWa: '', alamat: '',
  namaMarketing: '', kodeMarketing: '',
  skema: '', tanggalBooking: '', noHp: '',
  paymentScheme: '', paymentStatus: 'belum_lunas',
  uangMasuk: '', jatuhTempo: '', dpMasuk: '',
  dpStatus: 'belum_lunas', tenor: '',
};

// ── Helpers ──────────────────────────────────────────────────────────────
const formatRupiah = (val) => {
  if (!val) return '-';
  const num = Number(String(val).replace(/\D/g, ''));
  return isNaN(num) ? val : `Rp ${num.toLocaleString('id-ID')}`;
};
const formatRupiahInput = (val) => {
  if (!val) return '';
  const num = Number(String(val).replace(/\D/g, ''));
  return isNaN(num) ? '' : num.toLocaleString('id-ID');
};
const toNum   = (v) => Number(String(v || '').replace(/\D/g, '')) || 0;
const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').replace(/(^-|-$)/g, '');

// ══════════════════════════════════════════════════════════════════════
// ── SUB COMPONENTS
// ══════════════════════════════════════════════════════════════════════

// ── UnitDot ─────────────────────────────────────────────────────────────
const UnitDot = ({ unit, posX, posY, onClick, isPublicMode, isSelected, dotSize = 16, dimmed = false }) => {
  const [hovered, setHovered] = React.useState(false);
  const st  = STATUS[unit?.status] || STATUS.Tersedia;
  const DOT = dotSize;
  return (
    <div style={{
      position: 'absolute', left: `${posX}%`, top: `${posY}%`,
      transform: 'translate(-50%, -50%)',
      zIndex: hovered || isSelected ? 80 : (dimmed ? 1 : 6),
      pointerEvents: isPublicMode ? 'none' : 'all',
      opacity: dimmed ? 0.15 : 1, filter: dimmed ? 'grayscale(0.5)' : 'none',
      transition: 'opacity 0.3s ease, filter 0.3s ease',
    }}>
      <button
        onClick={e => { e.stopPropagation(); if (!isPublicMode) onClick(unit); }}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{
          width: DOT, height: DOT, borderRadius: '50%', background: st.dot,
          border: isSelected ? '2px solid #fbbf24' : 'none',
          boxShadow: isSelected ? '0 0 0 2.5px rgba(251,191,36,0.5)' : 'none',
          outline: 'none', cursor: isPublicMode ? 'default' : 'pointer',
          display: 'block', padding: 0,
          animation: unit?.status === 'Booking' ? 'dotPulse 1.8s ease-in-out infinite' : 'none',
          transition: 'transform 0.1s, width 0.2s, height 0.2s',
          transform: hovered && !isPublicMode ? 'scale(1.55)' : 'scale(1)',
        }}
        title={isPublicMode ? undefined : `${unit?.blok}-${unit?.nomor} · ${unit?.status}`}
      />
      {!isPublicMode && hovered && (
        <div style={{
          position: 'absolute', bottom: DOT + 5, left: '50%', transform: 'translateX(-50%)',
          background: '#0f172a', color: 'white', borderRadius: 7, padding: '4px 9px',
          fontSize: 10, fontWeight: 700, lineHeight: 1.4, whiteSpace: 'nowrap',
          pointerEvents: 'none', zIndex: 200, boxShadow: '0 3px 12px rgba(0,0,0,0.35)',
        }}>
          <span style={{ color: st.dot !== '#10b981' ? st.dot : '#4ade80' }}>●</span>{' '}
          {unit?.blok}-{unit?.nomor}
          {unit?.namaUser && <span style={{ color: '#94a3b8' }}> · {unit.namaUser}</span>}
          <br/>
          <span style={{ color: '#64748b', fontSize: 9 }}>{st.label}{unit?.tipe ? ` · ${unit.tipe}` : ''}</span>
          <div style={{ position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: 8, height: 8, background: '#0f172a' }} />
        </div>
      )}
    </div>
  );
};

// ── PublicLegend ─────────────────────────────────────────────────────────
const PublicLegend = () => (
  <div style={{
    display: 'flex', gap: 20, flexWrap: 'wrap',
    background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
    borderRadius: 12, padding: '10px 16px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid rgba(255,255,255,0.8)',
  }}>
    {Object.entries(STATUS).map(([key, s]) => (
      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <div style={{ width: 14, height: 14, borderRadius: '50%', background: s.dot }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#334155' }}>{s.label}</span>
      </div>
    ))}
  </div>
);

// ── KavlingCell ──────────────────────────────────────────────────────────
const KavlingCell = ({ unit, onClick, bulkMode, isSelected, onToggleSelect }) => {
  const st       = STATUS[unit.status] || STATUS.Tersedia;
  const hasOwner = !!unit.namaUser;
  return (
    <button
      onClick={() => bulkMode ? onToggleSelect(unit.id) : onClick(unit)}
      title={`Blok ${unit.blok}-${unit.nomor} | ${unit.status}${unit.namaUser ? ` | ${unit.namaUser}` : ''}`}
      className={`
        relative group w-full aspect-square rounded-xl transition-all duration-150
        hover:scale-105 hover:z-10 flex flex-col items-center justify-center gap-0.5
        ${isSelected ? 'ring-2 ring-offset-1 ring-gray-900 scale-105' : 'hover:shadow-md'}
        ${unit.status === 'Tersedia' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
        ${unit.status === 'Keep'     ? 'bg-blue-500   hover:bg-blue-600'    : ''}
        ${unit.status === 'Booking'  ? 'bg-amber-400  hover:bg-amber-500'   : ''}
        ${unit.status === 'SoldOut'  ? 'bg-red-500    hover:bg-red-600'     : ''}
      `}
    >
      {bulkMode && (
        <div className={`absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-sm flex items-center justify-center ${isSelected ? 'bg-white' : 'bg-black/20'}`}>
          {isSelected && <div className="w-2 h-2 bg-gray-900 rounded-[2px]" />}
        </div>
      )}
      <span className="text-white font-black text-[11px] leading-none">{unit.nomor}</span>
      {hasOwner && <div className="w-1 h-1 rounded-full bg-white/60" />}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 pointer-events-none">
        <div className="bg-gray-900 text-white text-[10px] rounded-xl px-3 py-2 whitespace-nowrap shadow-2xl min-w-[120px]">
          <div className="font-black text-xs mb-0.5">Blok {unit.blok}-{unit.nomor}</div>
          <div className="flex items-center gap-1.5 text-gray-300">
            <span className="w-2 h-2 rounded-full" style={{ background: st.dot }} />{st.label}{unit.tipe ? ` · ${unit.tipe}` : ''}
          </div>
          {unit.harga && <div className="text-emerald-400 font-bold mt-0.5">{formatRupiah(unit.harga)}</div>}
          {unit.namaUser && <div className="text-blue-300 truncate max-w-[140px]">{unit.namaUser}</div>}
          {unit.namaMarketing && <div className="text-gray-500 text-[9px]">{unit.namaMarketing}</div>}
        </div>
        <div className="w-2 h-2 bg-gray-900 rotate-45 mx-auto -mt-1" />
      </div>
    </button>
  );
};

// ── ActivityItem ─────────────────────────────────────────────────────────
const ActivityItem = ({ unit, timestamp }) => {
  if (!unit) return null;
  const st      = STATUS[unit.status] || STATUS.Tersedia;
  const timeStr = timestamp?.toDate ? timestamp.toDate().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '';
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${st.color}`} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-gray-800">Blok {unit.blok}-{unit.nomor} → {unit.status}</p>
        {unit.namaUser && <p className="text-xs text-gray-500 truncate">{unit.namaUser} · {unit.namaMarketing || '-'}</p>}
      </div>
      <span className="text-[10px] text-gray-400 shrink-0">{timeStr}</span>
    </div>
  );
};

// ── SmartPaymentSection ──────────────────────────────────────────────────
const SmartPaymentSection = ({ data, onChange, hargaAkhir, isDark = false }) => {
  const lbl  = isDark ? darkLabel  : lightLabel;
  const inp  = isDark ? darkInput  : inputCls;
  const card = isDark
    ? 'bg-white/8 border border-white/10 rounded-xl p-4'
    : 'bg-gray-50 border border-gray-200 rounded-xl p-4';

  const hargaNum  = toNum(hargaAkhir);
  const uangNum   = toNum(data.uangMasuk);
  const dpNum     = toNum(data.dpMasuk);
  const tenorNum  = toNum(data.tenor);
  const sisaCK    = Math.max(0, hargaNum - uangNum);
  const sisaCL    = Math.max(0, hargaNum - uangNum);
  const sisaDP    = Math.max(0, hargaNum - dpNum);
  const angsuran  = tenorNum > 0 ? Math.round(sisaDP / tenorNum) : 0;

  const schemeBtn = (key) => {
    const sc       = PAYMENT_SCHEME[key];
    const isActive = data.paymentScheme === key;
    if (isDark) {
      return (
        <button key={key} type="button" onClick={() => onChange('paymentScheme', key)}
          className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all font-bold text-xs"
          style={{
            background: isActive ? `${sc.color}22` : 'rgba(255,255,255,0.04)',
            border: isActive ? `1.5px solid ${sc.color}60` : '1.5px solid rgba(255,255,255,0.08)',
            color: isActive ? sc.color : 'rgba(255,255,255,0.4)',
          }}>
          <span className="text-lg">{sc.icon}</span>{sc.label}
        </button>
      );
    }
    return (
      <button key={key} type="button" onClick={() => onChange('paymentScheme', key)}
        className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all font-bold text-xs border
          ${isActive ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}>
        <span className="text-lg">{sc.icon}</span>{sc.label}
      </button>
    );
  };

  const payStatusBtn = (val, label) => {
    const field   = data.paymentScheme === 'dp_cicilan' ? 'dpStatus' : 'paymentStatus';
    const current = data.paymentScheme === 'dp_cicilan' ? data.dpStatus : data.paymentStatus;
    const isActive = current === val;
    if (isDark) {
      return (
        <button type="button" onClick={() => onChange(field, val)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all"
          style={{
            background: isActive ? (val === 'lunas' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)') : 'rgba(255,255,255,0.04)',
            border: isActive ? (val === 'lunas' ? '1.5px solid rgba(16,185,129,0.5)' : '1.5px solid rgba(245,158,11,0.5)') : '1.5px solid rgba(255,255,255,0.08)',
            color: isActive ? (val === 'lunas' ? '#34d399' : '#fbbf24') : 'rgba(255,255,255,0.4)',
          }}>
          {val === 'lunas' ? '🟢' : '🟡'} {label}
        </button>
      );
    }
    return (
      <button type="button" onClick={() => onChange(field, val)}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border transition-all
          ${isActive
            ? (val === 'lunas' ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : 'bg-amber-50 border-amber-400 text-amber-700')
            : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}>
        {val === 'lunas' ? '🟢' : '🟡'} {label}
      </button>
    );
  };

  const summaryRow = (label, value, highlight = false) => (
    <div className={`flex justify-between items-center text-sm ${highlight ? 'font-black' : 'font-medium'}`}>
      <span style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#6b7280' }}>{label}</span>
      <span style={{ color: isDark ? (highlight ? '#34d399' : 'white') : (highlight ? '#dc2626' : '#111827') }}>{value}</span>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Pilih Skema */}
      <div>
        <label className={lbl}>Skema Pembayaran</label>
        <div className="flex gap-2">
          {Object.keys(PAYMENT_SCHEME).map(k => schemeBtn(k))}
        </div>
      </div>

      {/* Cash Keras */}
      {data.paymentScheme === 'cash_keras' && (
        <div className={card}>
          <div className="text-xs font-bold mb-3" style={{ color: isDark ? '#34d399' : '#059669' }}>💰 Cash Keras</div>
          <div>
            <label className={lbl}>Status Pelunasan</label>
            <div className="flex gap-2">{payStatusBtn('lunas', 'Sudah Lunas')}{payStatusBtn('belum_lunas', 'Belum Lunas')}</div>
          </div>
          {data.paymentStatus === 'belum_lunas' && (
            <div className="mt-4 space-y-3">
              <div>
                <label className={lbl}>Uang Masuk</label>
                <input className={inp} placeholder="Rp 0" value={formatRupiahInput(data.uangMasuk)}
                  onChange={e => onChange('uangMasuk', e.target.value.replace(/\D/g, ''))} />
              </div>
              <div className={`mt-2 pt-3 border-t ${isDark ? 'border-white/10' : 'border-gray-200'} space-y-1`}>
                {summaryRow('Harga Unit', formatRupiah(hargaAkhir))}
                {summaryRow('Uang Masuk', formatRupiah(data.uangMasuk))}
                {summaryRow('Sisa Pembayaran', formatRupiah(sisaCK), true)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cash Lunak */}
      {data.paymentScheme === 'cash_lunak' && (
        <div className={card}>
          <div className="text-xs font-bold mb-3" style={{ color: isDark ? '#60a5fa' : '#2563eb' }}>📅 Cash Lunak</div>
          <div className="space-y-3">
            <div>
              <label className={lbl}>Uang Masuk</label>
              <input className={inp} placeholder="Rp 0" value={formatRupiahInput(data.uangMasuk)}
                onChange={e => onChange('uangMasuk', e.target.value.replace(/\D/g, ''))} />
            </div>
            <div>
              <label className={lbl}>Jatuh Tempo</label>
              <input type="date" className={inp} value={data.jatuhTempo}
                onChange={e => onChange('jatuhTempo', e.target.value)} />
            </div>
            <div className={`pt-3 border-t ${isDark ? 'border-white/10' : 'border-gray-200'} space-y-1`}>
              {summaryRow('Harga Unit', formatRupiah(hargaAkhir))}
              {summaryRow('Uang Masuk', formatRupiah(data.uangMasuk))}
              {summaryRow('Sisa Pembayaran', formatRupiah(sisaCL), true)}
              {data.jatuhTempo && summaryRow('Jatuh Tempo', new Date(data.jatuhTempo).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }))}
            </div>
          </div>
        </div>
      )}

      {/* DP / Cicilan */}
      {data.paymentScheme === 'dp_cicilan' && (
        <div className={card}>
          <div className="text-xs font-bold mb-3" style={{ color: isDark ? '#a78bfa' : '#7c3aed' }}>📘 DP / Cicilan</div>
          <div className="space-y-3">
            <div>
              <label className={lbl}>DP Masuk</label>
              <input className={inp} placeholder="Rp 0" value={formatRupiahInput(data.dpMasuk)}
                onChange={e => onChange('dpMasuk', e.target.value.replace(/\D/g, ''))} />
            </div>
            <div>
              <label className={lbl}>Status DP</label>
              <div className="flex gap-2">{payStatusBtn('lunas', 'Sudah Lunas')}{payStatusBtn('belum_lunas', 'Belum Lunas')}</div>
            </div>
            <div>
              <label className={lbl}>Tenor (Bulan)</label>
              <input className={inp} type="number" min="1" max="360" placeholder="24"
                value={data.tenor} onChange={e => onChange('tenor', e.target.value)} />
            </div>
            <div className={`pt-3 border-t ${isDark ? 'border-white/10' : 'border-gray-200'} space-y-1.5`}>
              {summaryRow('Harga Unit', formatRupiah(hargaAkhir))}
              {summaryRow('DP Masuk', formatRupiah(data.dpMasuk))}
              {summaryRow('Sisa', formatRupiah(sisaDP))}
              {summaryRow('Tenor', `${data.tenor || '—'} Bulan`)}
              {summaryRow('Angsuran / Bulan', angsuran > 0 ? formatRupiah(angsuran) : '—', true)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════
// ── MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════
export default function ManageSiteplan() {

  // ── Proyek config (stateful — supports custom projects) ──────────────
  const [proyekConfig, setProyekConfig] = useState(PROYEK_CONFIG_INITIAL);
  const PROYEK_LIST = Object.keys(proyekConfig);

  // ── Data ─────────────────────────────────────────────────────────────
  const [units, setUnits]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  // ── Navigation ───────────────────────────────────────────────────────
  const [activeProyek, setActiveProyek] = useState(PROYEK_LIST[0]);
  const [activeBlok, setActiveBlok]     = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [searchQ, setSearchQ]           = useState('');

  // ── View mode ────────────────────────────────────────────────────────
  const [pageMode, setPageMode] = useState('grid');
  const [view, setView]         = useState('grid');

  // ── Modals ───────────────────────────────────────────────────────────
  const [modalUnit, setModalUnit]     = useState(null);
  const [modalTambah, setModalTambah] = useState(false);
  const [modalSeed, setModalSeed]     = useState(false);
  const [modalHapus, setModalHapus]   = useState(null);
  const [saving, setSaving]           = useState(false);

  // ── Premium modals ───────────────────────────────────────────────────
  const [modalTambahProyek, setModalTambahProyek] = useState(false);
  const [modalBulkHapus, setModalBulkHapus]       = useState(false);

  // ── Grid states ──────────────────────────────────────────────────────
  const [sortBy, setSortBy]                       = useState('nomor');
  const [bulkMode, setBulkMode]                   = useState(false);
  const [bulkSelected, setBulkSelected]           = useState(new Set());
  const [bulkTargetStatus, setBulkTargetStatus]   = useState('');

  // ── Custom generate config ───────────────────────────────────────────
  const [seedConfig, setSeedConfig]           = useState({});
  const [seedCustomBlok, setSeedCustomBlok]   = useState('');
  const [seedCustomJumlah, setSeedCustomJumlah] = useState('');

  // ── SVG/Image Zoom & Pan ─────────────────────────────────────────────
  const [svgScale, setSvgScale]   = useState(1);
  const [svgOffset, setSvgOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart                  = useRef(null);
  const svgContainerRef           = useRef(null);

  // ── Image Siteplan HD (persisted to localStorage) ────
  const [customImages, setCustomImages] = useState(() => {
    try {
      const raw = localStorage.getItem('afkar_siteplan_images');
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  });
  const imgRef       = useRef(null);
  const fileInputRef = useRef(null);

  // ── Unit Dot system ──────────────────────────────────────────────────
  const [dotPositions, setDotPositions]   = useState({});
  const [placingUnit, setPlacingUnit]     = useState(null);
  const [lockedDots, setLockedDots]       = useState(false);
  const [isPublicMode, setIsPublicMode]   = useState(false);
  const [showPlacePanel, setShowPlacePanel] = useState(false);
  const [dotFilter, setDotFilter]         = useState('');
  const [selectedBlock, setSelectedBlock] = useState('Semua');
  const placePanelRef                     = useRef(null);

  // ── Dynamic Dot Scale ────────────────────────────────────────────────
  const [dotSize, setDotSize] = useState(10);

  // ── Public Export Engine ─────────────────────────────────────────────
  const [isExporting, setIsExporting]       = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [exportFilter, setExportFilter]     = useState('Semua');
  const [exportScale, setExportScale]       = useState(2);
  const publicDisplayRef                    = useRef(null);
  const siteplanCaptureRef                  = useRef(null);
  const exportPanelRef                      = useRef(null);
  const publicImgRef                        = useRef(null);
  const [publicImgDisplayH, setPublicImgDisplayH] = useState(0);
  const [publicTime, setPublicTime]         = useState(new Date());

  // ── Notifications ────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif]         = useState(false);

  // ── Live activity clear ──────────────────────────────────────────────
  const [activityCleared, setActivityCleared] = useState(false);
  const [clearedAt, setClearedAt]             = useState(null);

  // ── Form states ──────────────────────────────────────────────────────
  const [form, setForm] = useState(FORM_DEFAULT);

  // ── Add project form ─────────────────────────────────────────────────
  const [proyekForm, setProyekForm] = useState({
    nama: '', color: 'red', tipeDefault: '36/72',
    bloks: [{ nama: 'A', jumlah: 10 }],
  });

  // ── Derived config ───────────────────────────────────────────────────
  const cfg      = proyekConfig[activeProyek];
  const blokList = cfg?.bloks || [];

  // ── Firestore: Load custom projects ──────────────────────────────────
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'projects'), snap => {
      if (snap.empty) return;
      const custom = {};
      snap.docs.forEach(d => {
        const data = d.data();
        if (!data.nama) return;
        custom[data.nama] = {
          bloks: data.bloks || ['A'],
          unitPerBlok: data.unitPerBlok || { A: 10 },
          tipeDefault: data.tipeDefault || '36/72',
          color: data.color || 'slate',
          imageUrl: null,
          blokPositions: data.blokPositions || {},
        };
      });
      setProyekConfig(prev => ({ ...PROYEK_CONFIG_INITIAL, ...custom }));
    });
    return () => unsub();
  }, []);

  // ── Firestore: Realtime Units ─────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'units'), where('proyek', '==', activeProyek));
    const unsub = onSnapshot(q,
      snap => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setUnits(data);
        setLoading(false);
        snap.docChanges().forEach(change => {
          if (change.type === 'modified') {
            const u = { id: change.doc.id, ...change.doc.data() };
            if (['Booking', 'SoldOut', 'Keep'].includes(u.status)) {
              const notif = {
                id: Date.now(),
                message: `🔔 Blok ${u.blok}-${u.nomor} → ${u.status}${u.namaUser ? ` oleh ${u.namaUser}` : ''}`,
                unit: u, time: new Date(),
              };
              setNotifications(prev => [notif, ...prev].slice(0, 20));
            }
          }
        });
      },
      () => { toast.error('Gagal memuat data siteplan'); setLoading(false); }
    );
    return () => unsub();
  }, [activeProyek]);

  // ── Firestore: dot positions + dotSize ───────────────────────────────
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'siteplanConfig', activeProyek.replace(/\s+/g, '_')),
      snap => {
        if (snap.exists()) {
          setDotPositions(snap.data().dots || {});
          setLockedDots(snap.data().locked || false);
          if (snap.data().dotSize) setDotSize(snap.data().dotSize);
        } else { setDotPositions({}); }
      }
    );
    return () => unsub();
  }, [activeProyek]);

  // ── Public mode clock ────────────────────────────────────────────────
  useEffect(() => {
    if (!isPublicMode) return;
    const interval = setInterval(() => setPublicTime(new Date()), 30000);
    return () => clearInterval(interval);
  }, [isPublicMode]);

  // ── ESC key ──────────────────────────────────────────────────────────
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') { setPlacingUnit(null); setIsPublicMode(false); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // ── Click outside panels ─────────────────────────────────────────────
  useEffect(() => {
    if (!showPlacePanel) return;
    const h = (e) => { if (placePanelRef.current && !placePanelRef.current.contains(e.target)) setShowPlacePanel(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [showPlacePanel]);

  useEffect(() => {
    if (!showExportPanel) return;
    const h = (e) => { if (exportPanelRef.current && !exportPanelRef.current.contains(e.target)) setShowExportPanel(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [showExportPanel]);

  useEffect(() => { setSelectedBlock('Semua'); }, [activeProyek]);

  // ── Computed ─────────────────────────────────────────────────────────
  const unitsByBlok = useMemo(() => {
    const map = {};
    blokList.forEach(b => { map[b] = []; });
    units.forEach(u => {
      if (map[u.blok]) map[u.blok].push(u);
      else map[u.blok] = [u];
    });
    Object.keys(map).forEach(b => map[b].sort((a, z) => Number(a.nomor) - Number(z.nomor) || a.nomor.localeCompare(z.nomor)));
    return map;
  }, [units, blokList]);

  const filteredUnits = useMemo(() => {
    let arr = activeBlok === 'Semua' ? units : units.filter(u => u.blok === activeBlok);
    if (filterStatus !== 'Semua') arr = arr.filter(u => u.status === filterStatus);
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase();
      arr = arr.filter(u => `${u.blok}-${u.nomor}`.toLowerCase().includes(q) || (u.namaUser || '').toLowerCase().includes(q) || (u.namaMarketing || '').toLowerCase().includes(q));
    }
    return arr.sort((a, z) => a.blok.localeCompare(z.blok) || Number(a.nomor) - Number(z.nomor));
  }, [units, activeBlok, filterStatus, searchQ]);

  const sortedFilteredUnits = useMemo(() => {
    const arr = [...filteredUnits];
    if (sortBy === 'status')  arr.sort((a, b) => STATUS_LIST.indexOf(a.status) - STATUS_LIST.indexOf(b.status) || a.blok.localeCompare(b.blok) || Number(a.nomor) - Number(b.nomor));
    else if (sortBy === 'harga') arr.sort((a, b) => Number(b.harga || 0) - Number(a.harga || 0));
    else if (sortBy === 'nama')  arr.sort((a, b) => (a.namaUser || '').localeCompare(b.namaUser || ''));
    return arr;
  }, [filteredUnits, sortBy]);

  const suggestNextNomor = useCallback((blok) => {
    const existing = units.filter(u => u.blok === blok).map(u => Number(u.nomor)).filter(Boolean);
    if (existing.length === 0) return '1';
    return String(Math.max(...existing) + 1);
  }, [units]);

  const totalStats = {
    total:    units.length,
    Tersedia: units.filter(u => u.status === 'Tersedia').length,
    Keep:     units.filter(u => u.status === 'Keep').length,
    Booking:  units.filter(u => u.status === 'Booking').length,
    SoldOut:  units.filter(u => u.status === 'SoldOut').length,
  };

  const today          = new Date().toISOString().split('T')[0];
  const bookingHariIni = units.filter(u => u.tanggalBooking === today).length;

  const marketingPerf = useMemo(() => {
    const map = {};
    units.filter(u => u.namaMarketing && ['Booking', 'SoldOut'].includes(u.status)).forEach(u => {
      map[u.namaMarketing] = (map[u.namaMarketing] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [units]);

  const recentActivity = useMemo(() => {
    let arr = [...units].filter(u => u.updatedAt);
    if (activityCleared && clearedAt) {
      arr = arr.filter(u => {
        const t = u.updatedAt?.toDate ? u.updatedAt.toDate() : new Date(0);
        return t > clearedAt;
      });
    }
    return arr.sort((a, b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0)).slice(0, 8);
  }, [units, activityCleared, clearedAt]);

  const publicVisibleUnits = useMemo(() => {
    if (exportFilter === 'Semua')    return units;
    if (exportFilter === 'Tersedia') return units.filter(u => u.status === 'Tersedia');
    if (exportFilter === 'Sold')     return units.filter(u => u.status === 'SoldOut');
    if (exportFilter === 'Aktif')    return units.filter(u => ['Keep', 'Booking'].includes(u.status));
    return units;
  }, [units, exportFilter]);

  const filteredSiteplanUnits = useMemo(() => {
    if (selectedBlock === 'Semua') return units;
    return units.filter(u => u.blok === selectedBlock);
  }, [units, selectedBlock]);

  const blockStats = useMemo(() => {
    const stats = {};
    blokList.forEach(blok => {
      const bu      = units.filter(u => u.blok === blok);
      const soldPct = bu.length > 0 ? Math.round(((bu.filter(u => u.status === 'SoldOut').length + bu.filter(u => u.status === 'Booking').length) / bu.length) * 100) : 0;
      stats[blok]   = {
        total: bu.length, soldPct,
        Tersedia: bu.filter(u => u.status === 'Tersedia').length,
        Keep:     bu.filter(u => u.status === 'Keep').length,
        Booking:  bu.filter(u => u.status === 'Booking').length,
        SoldOut:  bu.filter(u => u.status === 'SoldOut').length,
      };
    });
    return stats;
  }, [units, blokList]);

  const publicDotSize = useMemo(() => {
    const h     = publicImgDisplayH > 0 ? publicImgDisplayH : ADMIN_CANVAS_H;
    const ratio = h / ADMIN_CANVAS_H;
    return Math.max(4, Math.min(28, Math.round(dotSize * ratio)));
  }, [dotSize, publicImgDisplayH]);

  // ── Harga akhir realtime ─────────────────────────────────────────────
  const hargaAkhirForm = useMemo(() => {
    const h = toNum(form.harga);
    const d = toNum(form.diskon);
    return Math.max(0, h - d);
  }, [form.harga, form.diskon]);

  const hargaAkhirModal = useMemo(() => {
    if (!modalUnit) return 0;
    const h = toNum(modalUnit.harga);
    const d = toNum(modalUnit.diskon);
    return Math.max(0, h - d);
  }, [modalUnit]);

  const unitIdPreview = form.blok && form.nomor ? `${form.blok}${form.nomor}` : '—';

  // ══════════════════════════════════════════════════════════════
  // ── HANDLERS
  // ══════════════════════════════════════════════════════════════

  // ── Auto save draft artikel ──────────────────────────────────────────
  const saveDraftArtikel = useCallback(async (unit) => {
    const isSold   = unit.status === 'SoldOut';
    const isBooked = unit.status === 'Booking';
    if (!isSold && !isBooked) return;
    const namaUser = unit.namaUser || 'Pelanggan Setia AFKAR LAND';
    const label    = isSold ? 'Terjual' : 'Dipesan';
    const judul    = `Alhamdulillah! Unit Blok ${unit.blok}-${unit.nomor} ${activeProyek} Sudah ${label} ✨`;
    const konten   = isSold
      ? `Bismillahirrahmanirrahim...\n\nAlhamdulillah wa syukurillah — segala puji bagi Allah Subhanahu wa Ta'ala.\n\nDengan penuh rasa syukur, kami mengumumkan bahwa **Unit Blok ${unit.blok}-${unit.nomor}** di **${activeProyek}** telah resmi **TERJUAL** 🏠\n\nJazakallahu khairan kepada **${namaUser}** yang telah mempercayakan pilihannya bersama AFKAR LAND.\n\nSemoga menjadi hunian yang penuh rahmat, sakinah, mawaddah wa rahmah. Aamiin.\n\n📍 **${activeProyek}** · AFKAR LAND\n💚 Konsep Islami · Modern · Berkah\n\n**AFKAR LAND — Hunian Berkah, Investasi Cerdas.**\n\n#AfkarLand #HunianSyariah #Alhamdulillah`
      : `Bismillahirrahmanirrahim...\n\nAlhamdulillah! **Unit Blok ${unit.blok}-${unit.nomor}** di **${activeProyek}** telah resmi masuk status **BOOKING** ✅\n\nTerima kasih kepada **${namaUser}** yang telah memilih AFKAR LAND. Semoga senantiasa dimudahkan dan diberkahi. Aamiin.\n\n📍 **${activeProyek}** · AFKAR LAND\n\n**AFKAR LAND — Hunian Berkah, Investasi Cerdas.**\n\n#AfkarLand #Booking #HunianSyariah`;
    try {
      await addDoc(collection(db, 'articles'), {
        judul, slug: slugify(judul), kategori: 'Berita',
        status: 'Draft', konten, thumbnail: '',
        sourceUnit: `${unit.blok}-${unit.nomor}`,
        sourceProyek: activeProyek,
        createdAt: serverTimestamp(),
      });
      toast.success('📰 Draft berita otomatis tersimpan di Manage Articles!', { duration: 5000 });
    } catch (err) { console.error('Gagal simpan draft artikel:', err); }
  }, [activeProyek]);

  // ── Tambah Unit Manual ────────────────────────────────────────────────
  const handleTambah = async (e, mode = 'save') => {
    if (e && e.preventDefault) e.preventDefault();
    if (!form.nomor) { toast.error('Nomor unit wajib diisi'); return; }
    const key = `${form.blok}-${form.nomor}`;
    if (units.find(u => u.blok === form.blok && u.nomor === form.nomor)) { toast.error(`Unit ${key} sudah ada`); return; }
    setSaving(true);
    try {
      const hargaNum = toNum(form.harga);
      const newUnit  = {
        proyek: activeProyek,
        blok: form.blok, nomor: form.nomor, tipe: form.tipe,
        harga: String(hargaNum), diskon: String(toNum(form.diskon)),
        status: form.status, catatan: form.catatan,
        namaUser: form.namaUser, noWa: form.noWa, alamat: form.alamat, noHp: form.noHp || '',
        namaMarketing: form.namaMarketing, kodeMarketing: form.kodeMarketing,
        skema: form.skema, tanggalBooking: form.tanggalBooking,
        paymentScheme: form.paymentScheme, paymentStatus: form.paymentStatus,
        uangMasuk: String(toNum(form.uangMasuk)), jatuhTempo: form.jatuhTempo,
        dpMasuk: String(toNum(form.dpMasuk)), dpStatus: form.dpStatus,
        tenor: form.tenor,
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, 'units'), newUnit);
      if (['Booking', 'SoldOut'].includes(form.status)) {
        await saveDraftArtikel({ ...newUnit, blok: form.blok, nomor: form.nomor });
      }
      toast.success(`✅ Unit ${key} ditambahkan!`);
      if (mode === 'place') {
        setModalTambah(false);
        const addedUnit = units.find(u => u.blok === form.blok && u.nomor === form.nomor);
        if (addedUnit) setPlacingUnit(addedUnit);
        setPageMode('siteplan');
      } else if (mode === 'add_again') {
        setForm(f => ({ ...FORM_DEFAULT, blok: f.blok }));
        toast('Siap input unit berikutnya!', { icon: '➕' });
      } else {
        setModalTambah(false);
        setForm(FORM_DEFAULT);
      }
    } catch { toast.error('Gagal menyimpan unit'); }
    finally { setSaving(false); }
  };

  // ── Update Unit ───────────────────────────────────────────────────────
  const handleUpdateUnit = async (e) => {
    e.preventDefault();
    if (!modalUnit?.id) return;
    setSaving(true);
    const prevStatus = units.find(u => u.id === modalUnit.id)?.status;
    try {
      await updateDoc(doc(db, 'units', modalUnit.id), {
        status: modalUnit.status, tipe: modalUnit.tipe || '',
        harga: String(toNum(modalUnit.harga)), diskon: String(toNum(modalUnit.diskon || '')),
        catatan: modalUnit.catatan || '',
        namaUser: modalUnit.namaUser || '', noHp: modalUnit.noHp || '',
        noWa: modalUnit.noWa || '', alamat: modalUnit.alamat || '',
        namaMarketing: modalUnit.namaMarketing || '', kodeMarketing: modalUnit.kodeMarketing || '',
        skema: modalUnit.skema || '', tanggalBooking: modalUnit.tanggalBooking || '',
        paymentScheme: modalUnit.paymentScheme || '',
        paymentStatus: modalUnit.paymentStatus || '',
        uangMasuk: String(toNum(modalUnit.uangMasuk || '')),
        jatuhTempo: modalUnit.jatuhTempo || '',
        dpMasuk: String(toNum(modalUnit.dpMasuk || '')),
        dpStatus: modalUnit.dpStatus || '', tenor: modalUnit.tenor || '',
        updatedAt: serverTimestamp(),
      });
      if (prevStatus !== modalUnit.status && ['Booking', 'SoldOut'].includes(modalUnit.status)) {
        await saveDraftArtikel(modalUnit);
      }
      toast.success(`Unit Blok ${modalUnit.blok}-${modalUnit.nomor} diperbarui!`);
      setModalUnit(null);
    } catch { toast.error('Gagal memperbarui'); }
    finally { setSaving(false); }
  };

  // ── Hapus Unit ────────────────────────────────────────────────────────
  const handleHapus = async () => {
    if (!modalHapus) return;
    try {
      await deleteDoc(doc(db, 'units', modalHapus.id));
      toast.success('Unit dihapus.');
      setModalHapus(null);
      if (modalUnit?.id === modalHapus.id) setModalUnit(null);
    } catch { toast.error('Gagal menghapus'); }
  };

  // ── Bulk select ───────────────────────────────────────────────────────
  const handleToggleSelect = useCallback((id) => {
    setBulkSelected(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (bulkSelected.size === sortedFilteredUnits.length) setBulkSelected(new Set());
    else setBulkSelected(new Set(sortedFilteredUnits.map(u => u.id)));
  }, [bulkSelected, sortedFilteredUnits]);

  // ── Bulk: ubah status massal ──────────────────────────────────────────
  const handleBulkStatus = useCallback(async (newStatus) => {
    if (bulkSelected.size === 0 || !newStatus) return;
    setSaving(true);
    try {
      const batch = writeBatch(db);
      bulkSelected.forEach(id => batch.update(doc(db, 'units', id), { status: newStatus, updatedAt: serverTimestamp() }));
      await batch.commit();
      toast.success(`✅ ${bulkSelected.size} unit → ${STATUS[newStatus].label}`);
      setBulkSelected(new Set()); setBulkMode(false); setBulkTargetStatus('');
    } catch { toast.error('Gagal update massal'); }
    finally { setSaving(false); }
  }, [bulkSelected]);

  // ── Bulk hapus massal ─────────────────────────────────────────────────
  const handleBulkHapus = useCallback(async () => {
    if (bulkSelected.size === 0) return;
    try {
      const batch = writeBatch(db);
      bulkSelected.forEach(id => batch.delete(doc(db, 'units', id)));
      await batch.commit();
      toast.success(`🗑️ ${bulkSelected.size} unit berhasil dihapus`);
      setBulkSelected(new Set()); setBulkMode(false); setModalBulkHapus(false);
    } catch { toast.error('Gagal menghapus massal'); }
  }, [bulkSelected]);

  // ── Clear activity ────────────────────────────────────────────────────
  const handleClearActivity = useCallback(() => {
    setActivityCleared(true);
    setClearedAt(new Date());
    toast.success('Riwayat aktivitas dibersihkan');
  }, []);

  // ── Export CSV ────────────────────────────────────────────────────────
  const handleExportCSV = useCallback(() => {
    const headers = ['Blok','Nomor','Tipe','Status','Harga','Diskon','Harga Akhir','Pembeli','No. WA','Alamat','Marketing','Kode Marketing','Skema','Tgl Booking','Skema Payment','Status Bayar','Catatan'];
    const rows    = sortedFilteredUnits.map(u => {
      const h = toNum(u.harga); const d = toNum(u.diskon || '');
      return [
        u.blok, u.nomor, u.tipe || '', u.status,
        h ? h.toLocaleString('id-ID') : '', d ? d.toLocaleString('id-ID') : '',
        (h - d) > 0 ? (h - d).toLocaleString('id-ID') : '',
        u.namaUser || '', u.noWa || '', u.alamat || '',
        u.namaMarketing || '', u.kodeMarketing || '',
        u.skema || '', u.tanggalBooking || '',
        u.paymentScheme || '', u.paymentStatus || '',
        (u.catatan || '').replace(/[,\n]/g, ' '),
      ];
    });
    const csv  = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `${activeProyek.replace(/\s+/g, '-')}-${new Date().toLocaleDateString('id-ID').replace(/\//g, '-')}.csv`;
    a.click(); URL.revokeObjectURL(url);
    toast.success(`Export ${sortedFilteredUnits.length} unit berhasil!`);
  }, [sortedFilteredUnits, activeProyek]);

  // ── Open tambah unit untuk blok ──────────────────────────────────────
  const handleOpenTambahForBlok = useCallback((blok) => {
    const suggestedNomor = suggestNextNomor(blok);
    setForm(f => ({ ...f, blok, nomor: suggestedNomor }));
    setModalTambah(true);
  }, [suggestNextNomor]);

  // ── Generate kavling (custom config) ─────────────────────────────────
  const handleSeed = async () => {
    if (!cfg && Object.keys(seedConfig).length === 0) return;
    setSeeding(true);
    try {
      const batch       = writeBatch(db);
      const existingKeys = new Set(units.map(u => `${u.blok}-${u.nomor}`));
      let count         = 0;
      Object.entries(seedConfig).forEach(([blok, conf]) => {
        if (!conf.enabled) return;
        const jumlah = conf.jumlah || 10;
        for (let i = 1; i <= jumlah; i++) {
          const key = `${blok}-${i}`;
          if (!existingKeys.has(key)) {
            const ref = doc(collection(db, 'units'));
            batch.set(ref, {
              proyek: activeProyek, blok, nomor: String(i),
              tipe: cfg?.tipeDefault || '36/72', status: 'Tersedia',
              harga: '', catatan: '', namaUser: '', namaMarketing: '',
              skema: '', tanggalBooking: '', paymentScheme: '',
              createdAt: serverTimestamp(),
            });
            count++;
          }
        }
      });
      await batch.commit();
      toast.success(`🎉 ${count} kavling berhasil di-generate!`);
      setModalSeed(false);
    } catch (err) { toast.error('Gagal generate kavling'); console.error(err); }
    finally { setSeeding(false); }
  };

  // ── Tambah proyek baru ────────────────────────────────────────────────
  const handleTambahProyek = async () => {
    if (!proyekForm.nama.trim()) { toast.error('Nama proyek wajib diisi'); return; }
    if (proyekConfig[proyekForm.nama]) { toast.error('Nama proyek sudah ada'); return; }
    if (proyekForm.bloks.length === 0) { toast.error('Minimal 1 blok diperlukan'); return; }
    const bloks       = proyekForm.bloks.map(b => b.nama.toUpperCase()).filter(Boolean);
    const unitPerBlok = {};
    proyekForm.bloks.forEach(b => { unitPerBlok[b.nama.toUpperCase()] = Number(b.jumlah) || 10; });
    try {
      await addDoc(collection(db, 'projects'), {
        nama: proyekForm.nama, bloks, unitPerBlok,
        tipeDefault: proyekForm.tipeDefault, color: proyekForm.color,
        blokPositions: {}, createdAt: serverTimestamp(),
      });
      toast.success(`✅ Proyek "${proyekForm.nama}" berhasil ditambahkan!`);
      setActiveProyek(proyekForm.nama);
      setActiveBlok('Semua'); setFilterStatus('Semua');
      setModalTambahProyek(false);
      setProyekForm({ nama: '', color: 'red', tipeDefault: '36/72', bloks: [{ nama: 'A', jumlah: 10 }] });
    } catch { toast.error('Gagal menambah proyek'); }
  };

  // ── Dot handlers ─────────────────────────────────────────────────────
  const saveDots = useCallback(async (newDots, newLocked, newDotSize) => {
    try {
      await setDoc(
        doc(db, 'siteplanConfig', activeProyek.replace(/\s+/g, '_')),
        { dots: newDots, locked: newLocked ?? lockedDots, dotSize: newDotSize ?? dotSize, proyek: activeProyek },
        { merge: true }
      );
    } catch { toast.error('Gagal menyimpan konfigurasi'); }
  }, [activeProyek, lockedDots, dotSize]);

  const handleChangeDotSize = useCallback(async (delta) => {
    const next = Math.min(DOT_MAX, Math.max(DOT_MIN, dotSize + delta));
    setDotSize(next);
    try {
      await setDoc(doc(db, 'siteplanConfig', activeProyek.replace(/\s+/g, '_')), { dotSize: next }, { merge: true });
    } catch { toast.error('Gagal menyimpan ukuran titik'); }
  }, [dotSize, activeProyek]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      setCustomImages(prev => {
        const next = { ...prev, [activeProyek]: base64 };
        try { localStorage.setItem('afkar_siteplan_images', JSON.stringify(next)); }
        catch { toast.error('Gambar terlalu besar untuk disimpan lokal, coba kompres dulu.'); }
        return next;
      });
      setSvgScale(1); setSvgOffset({ x: 0, y: 0 });
      toast.success('Gambar siteplan berhasil diunggah & disimpan!');
    };
    reader.readAsDataURL(file);
  };

  const handleImageClick = useCallback((e) => {
    if (!placingUnit || lockedDots) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x    = parseFloat(((e.clientX - rect.left) / rect.width * 100).toFixed(2));
    const y    = parseFloat(((e.clientY - rect.top) / rect.height * 100).toFixed(2));
    const key  = `${placingUnit.blok}-${placingUnit.nomor}`;
    const newDots = { ...dotPositions, [key]: { x, y } };
    setDotPositions(newDots);
    saveDots(newDots);
    toast.success(`Titik ${key} ditempatkan!`);
    setPlacingUnit(null);
  }, [placingUnit, lockedDots, dotPositions, saveDots]);

  const handleToggleLock = useCallback(async () => {
    const next = !lockedDots;
    setLockedDots(next);
    await saveDots(dotPositions, next);
    toast.success(next ? '🔒 Posisi titik dikunci' : '🔓 Posisi titik dibuka');
  }, [lockedDots, dotPositions, saveDots]);

  const handleSelectBlock = useCallback((blok) => {
    setSelectedBlock(blok);
    if (blok === 'Semua') { setSvgScale(1); setSvgOffset({ x: 0, y: 0 }); return; }
    const pos       = cfg?.blokPositions?.[blok];
    if (!pos) return;
    const container = svgContainerRef.current;
    const img       = imgRef.current;
    if (!container || !img) return;
    const cW = container.offsetWidth, cH = container.offsetHeight;
    const iW = img.offsetWidth, iH = img.offsetHeight;
    const newScale = pos.zoom || 2.2;
    const targetX  = (pos.x / 100) * iW, targetY = (pos.y / 100) * iH;
    setSvgScale(newScale);
    setSvgOffset({ x: cW / 2 - targetX * newScale, y: cH / 2 - targetY * newScale });
  }, [cfg, imgRef, svgContainerRef]);

  const handleExportSiteplan = useCallback(async () => {
    if (!siteplanCaptureRef.current) { toast.error('Tidak ada tampilan untuk diexport'); return; }
    setShowExportPanel(false);
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    setIsExporting(true);
    const qualityLabel = exportScale === 4 ? '4K' : 'HD';
    toast.loading(`Menyiapkan export ${qualityLabel}...`, { id: 'export' });
    try {
      const canvas   = await html2canvas(siteplanCaptureRef.current, {
        scale: exportScale, useCORS: true, allowTaint: true,
        backgroundColor: '#0f172a', logging: false, imageTimeout: 15000,
      });
      const dateStr  = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
      const fileName = `${activeProyek.replace(/\s+/g, '-')}-Siteplan-${qualityLabel}-${dateStr}.png`;
      const link     = document.createElement('a');
      link.download  = fileName;
      link.href      = canvas.toDataURL('image/png', 1.0);
      link.click();
      toast.success(`✅ Export ${qualityLabel} berhasil!`, { id: 'export' });
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Gagal export. Coba refresh lalu upload ulang gambar.', { id: 'export' });
    } finally { setIsExporting(false); }
  }, [activeProyek, exportScale]);

  // ── Open seed modal helper ────────────────────────────────────────────
  const openSeedModal = () => {
    const config = {};
    blokList.forEach(b => { config[b] = { enabled: true, jumlah: cfg?.unitPerBlok[b] || 10 }; });
    setSeedConfig(config);
    setSeedCustomBlok(''); setSeedCustomJumlah('');
    setModalSeed(true);
  };

  const seedTotal = Object.values(seedConfig).filter(c => c.enabled).reduce((s, c) => s + (Number(c.jumlah) || 0), 0);

  // ══════════════════════════════════════════════════════════════
  // ── RENDER
  // ══════════════════════════════════════════════════════════════
  return (
    <div className="space-y-6">

      {/* ══ HEADER ══ */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Siteplan Interaktif</h1>
          <p className="text-gray-500 mt-1 text-sm">Kelola status kavling secara real-time untuk semua proyek AFKAR LAND.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Notifikasi */}
          <div className="relative">
            <button onClick={() => setShowNotif(v => !v)}
              className="relative flex items-center gap-2 px-3 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
              <FiBell size={16} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {notifications.length > 9 ? '9+' : notifications.length}
                </span>
              )}
            </button>
            {showNotif && (
              <div className="absolute right-0 top-12 w-72 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-900">Aktivitas Terbaru</span>
                  <button onClick={() => setNotifications([])} className="text-xs text-gray-400 hover:text-red-500">Hapus semua</button>
                </div>
                <div className="max-h-64 overflow-y-auto p-2">
                  {notifications.length === 0 ? (
                    <p className="text-center text-gray-400 text-xs py-6">Belum ada aktivitas</p>
                  ) : notifications.map(n => (
                    <div key={n.id} className="px-2 py-2 text-xs text-gray-700 border-b border-gray-50 last:border-0">
                      {n.message}
                      <div className="text-gray-400 mt-0.5">{n.time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button onClick={openSeedModal}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
            <FiRefreshCw size={14} /> Generate
          </button>
          <button onClick={() => { setForm({ ...FORM_DEFAULT, blok: blokList[0] || 'A', nomor: suggestNextNomor(blokList[0] || 'A') }); setModalTambah(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors shadow-sm">
            <FiPlus size={16} /> Tambah Unit
          </button>
        </div>
      </div>

      {/* ══ PREMIUM PROJECT SELECTOR ══ */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {PROYEK_LIST.map(p => {
          const pcfg    = proyekConfig[p];
          const pCol    = PROJECT_COLORS[pcfg?.color] || PROJECT_COLORS.slate;
          const isActive = activeProyek === p;
          const totalU  = Object.values(pcfg?.unitPerBlok || {}).reduce((s, v) => s + v, 0);
          return (
            <button key={p}
              onClick={() => { setActiveProyek(p); setActiveBlok('Semua'); setFilterStatus('Semua'); }}
              className="shrink-0 relative flex flex-col gap-2 px-5 pt-4 pb-4 rounded-2xl transition-all duration-200 text-left min-w-[180px] overflow-hidden"
              style={{
                background: isActive ? `linear-gradient(135deg, ${pCol.from}, ${pCol.to})` : 'white',
                border: isActive ? 'none' : '1.5px solid #e5e7eb',
                boxShadow: isActive ? `0 8px 24px ${pCol.from}40` : '0 1px 4px rgba(0,0,0,0.06)',
                transform: isActive ? 'translateY(-2px)' : 'none',
              }}>
              {isActive && (
                <div className="absolute inset-0 opacity-10">
                  <svg width="100%" height="100%">
                    <defs><pattern id={`pg${p}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="white" /></pattern></defs>
                    <rect width="100%" height="100%" fill={`url(#pg${p})`} />
                  </svg>
                </div>
              )}
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
                    style={{ background: isActive ? 'rgba(255,255,255,0.25)' : `${pCol.from}15`, color: isActive ? 'white' : pCol.from }}>
                    {p.charAt(0)}
                  </div>
                  <span className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
                    {pcfg?.bloks?.length || 0} Blok
                  </span>
                </div>
                <div className={`font-black text-sm leading-tight ${isActive ? 'text-white' : 'text-gray-800'}`} style={{ maxWidth: 140 }}>{p}</div>
                <div className={`text-xs mt-1 font-bold ${isActive ? 'text-white/60' : 'text-gray-400'}`}>{totalU} unit total</div>
              </div>
              {!isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b"
                  style={{ background: `linear-gradient(to right, ${pCol.from}, ${pCol.to})` }} />
              )}
            </button>
          );
        })}
        {/* + Tambah Proyek */}
        <button onClick={() => setModalTambahProyek(true)}
          className="shrink-0 flex flex-col items-center justify-center gap-2 px-5 py-4 rounded-2xl transition-all duration-200 min-w-[130px]"
          style={{ border: '1.5px dashed #d1d5db', background: 'transparent', color: '#9ca3af' }}>
          <div className="w-8 h-8 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
            <FiPlus size={16} className="text-gray-400" />
          </div>
          <span className="text-xs font-bold">Tambah Proyek</span>
        </button>
      </div>

      {/* ══ DUAL MODE TOGGLE ══ */}
      <div className="flex items-center gap-3 p-1 bg-gray-100 rounded-2xl w-fit">
        <button onClick={() => setPageMode('grid')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${pageMode === 'grid' ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <FiGrid size={15} /> Grid Management
        </button>
        <button onClick={() => setPageMode('siteplan')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${pageMode === 'siteplan' ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <FiMap size={15} /> Real Siteplan
        </button>
      </div>

      {/* ══ PREMIUM CLEAN DASHBOARD ══ */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%">
            <defs><pattern id="dashGrid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0L0 0 0 32" fill="none" stroke="#374151" strokeWidth="0.5" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#dashGrid)" />
          </svg>
        </div>
        {/* Subtle accent blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-[0.04] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #dc2626, transparent)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-[0.03] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)', transform: 'translate(-30%, 30%)' }} />

        <div className="relative z-10 p-6 space-y-5">
          {/* Title row */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Realtime Dashboard</div>
              <div className="text-gray-900 font-black text-xl">{activeProyek}</div>
            </div>
            <div className="text-right">
              <div className="text-gray-400 text-[10px]">Total Unit</div>
              <div className="text-gray-900 font-black text-3xl">{totalStats.total}</div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATUS_LIST.map(s => {
              const st  = STATUS[s];
              const cnt = totalStats[s];
              const pct = totalStats.total > 0 ? Math.round((cnt / totalStats.total) * 100) : 0;
              return (
                <div key={s} className="rounded-2xl p-4 relative overflow-hidden"
                  style={{ background: `${st.dot}0d`, border: `1px solid ${st.dot}25` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${st.dot}20` }}>
                      {React.cloneElement(st.icon, { style: { color: st.dot } })}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: `${st.dot}cc` }}>{st.label}</span>
                  </div>
                  <div className="text-3xl font-black text-gray-900 mb-2">{cnt}</div>
                  <div className="h-1 rounded-full" style={{ background: 'rgba(0,0,0,0.06)' }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: st.dot }} />
                  </div>
                  <div className="text-[10px] font-bold mt-1.5" style={{ color: `${st.dot}99` }}>{pct}%</div>
                </div>
              );
            })}
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Aktivitas */}
            <div className="rounded-2xl p-4 bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gray-100">
                  <BarChart2 size={16} className="text-gray-500" />
                </div>
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Aktivitas</span>
              </div>
              <div className="flex items-end gap-2">
                <div>
                  <div className="text-gray-400 text-[10px]">Booking hari ini</div>
                  <div className="text-gray-900 font-black text-2xl">{bookingHariIni}</div>
                </div>
                <div className="ml-auto">
                  <div className="text-gray-400 text-[10px]">Terjual + Booking</div>
                  <div className="text-gray-900 font-black text-2xl">{totalStats.SoldOut + totalStats.Booking}</div>
                </div>
              </div>
            </div>

            {/* Progress penjualan */}
            <div className="rounded-2xl p-4 bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(220,38,38,0.08)' }}>
                  <TrendingUp size={16} className="text-red-500" />
                </div>
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Progress Penjualan</span>
              </div>
              <div className="text-gray-900 font-black text-3xl mb-2">
                {totalStats.total > 0 ? Math.round(((totalStats.SoldOut + totalStats.Booking) / totalStats.total) * 100) : 0}%
              </div>
              <div className="h-2 rounded-full overflow-hidden bg-gray-200">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${totalStats.total > 0 ? ((totalStats.SoldOut + totalStats.Booking) / totalStats.total) * 100 : 0}%`, background: 'linear-gradient(to right, #f59e0b, #ef4444)' }} />
              </div>
              <div className="text-gray-400 text-[10px] mt-1.5">{totalStats.SoldOut + totalStats.Booking} dari {totalStats.total} unit</div>
            </div>

            {/* Marketing performance */}
            <div className="rounded-2xl p-4 bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.08)' }}>
                  <Users size={16} className="text-blue-500" />
                </div>
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Top Marketing</span>
              </div>
              {marketingPerf.length === 0 ? (
                <p className="text-gray-400 text-xs">Belum ada data</p>
              ) : (
                <div className="space-y-1.5">
                  {marketingPerf.map(([name, count]) => (
                    <div key={name} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 font-medium">{name}</span>
                      <span className="font-black text-red-500">{count} unit</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── MODE 1: GRID MANAGEMENT ── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {pageMode === 'grid' && (
        <>
          {/* Toolbar */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Cari unit, pembeli, atau marketing..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-red-400 outline-none" />
                {searchQ && <button onClick={() => setSearchQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><FiX size={13} /></button>}
              </div>
              <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5">
                <FiSliders size={12} className="text-gray-400" />
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="text-xs font-bold text-gray-600 bg-transparent outline-none pr-1 cursor-pointer">
                  <option value="nomor">Urut: Nomor</option>
                  <option value="status">Urut: Status</option>
                  <option value="harga">Urut: Harga</option>
                  <option value="nama">Urut: Nama</option>
                </select>
              </div>
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                <button onClick={() => setView('grid')} className={`p-1.5 rounded-lg transition-colors ${view === 'grid' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}><FiGrid size={14} /></button>
                <button onClick={() => setView('list')} className={`p-1.5 rounded-lg transition-colors ${view === 'list' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}><FiList size={14} /></button>
              </div>
              <button onClick={() => { setBulkMode(v => !v); setBulkSelected(new Set()); }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors border ${bulkMode ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                <FiCheckSquare size={13} />
                {bulkMode ? `Pilih (${bulkSelected.size})` : 'Pilih Massal'}
              </button>
              <button onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                <FiDownload size={13} /> Export CSV
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                {['Semua', ...blokList].map(b => (
                  <button key={b} onClick={() => setActiveBlok(b)}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeBlok === b ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    {b === 'Semua' ? 'Semua Blok' : `Blok ${b}`}
                    {b !== 'Semua' && <span className={`ml-1.5 ${activeBlok === b ? 'text-gray-300' : 'text-gray-400'}`}>{(unitsByBlok[b] || []).length}</span>}
                  </button>
                ))}
              </div>
              <div className="w-px h-5 bg-gray-200 mx-1" />
              {['Semua', ...STATUS_LIST].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                    ${filterStatus === s ? (s === 'Semua' ? 'bg-gray-900 text-white' : `${STATUS[s]?.bg} ${STATUS[s]?.text} border ${STATUS[s]?.border}`) : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                  {s !== 'Semua' && <span className="w-2 h-2 rounded-full" style={{ background: STATUS[s]?.dot }} />}
                  {s === 'Semua' ? 'Semua Status' : STATUS[s]?.label}
                  {s !== 'Semua' && <span className="ml-0.5 opacity-70">{units.filter(u => u.status === s).length}</span>}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400 pt-1 border-t border-gray-50">
              <span>Menampilkan <strong className="text-gray-700">{sortedFilteredUnits.length}</strong> dari {units.length} unit{searchQ && <span> · hasil "<strong>{searchQ}</strong>"</span>}</span>
              {bulkSelected.size > 0 && <span className="text-gray-600 font-medium">{bulkSelected.size} unit dipilih</span>}
            </div>
          </div>

          {/* ── Bulk Action Bar (includes HAPUS MASSAL) ── */}
          {bulkMode && bulkSelected.size > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-wrap items-center gap-3 shadow-sm">
              <button onClick={handleSelectAll} className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors">
                <FiCheckSquare size={13} />
                {bulkSelected.size === sortedFilteredUnits.length ? 'Deselect Semua' : 'Pilih Semua'}
              </button>
              <div className="w-px h-4 bg-gray-200" />
              <span className="text-xs text-gray-500 font-medium">{bulkSelected.size} unit — Ubah status ke:</span>
              <div className="flex gap-2 flex-wrap">
                {STATUS_LIST.map(s => (
                  <button key={s} onClick={() => handleBulkStatus(s)} disabled={saving}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105 disabled:opacity-50"
                    style={{ background: `${STATUS[s].dot}15`, color: STATUS[s].dot, border: `1px solid ${STATUS[s].dot}40` }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: STATUS[s].dot }} />
                    {STATUS[s].label}
                  </button>
                ))}
              </div>
              <div className="w-px h-4 bg-gray-200" />
              {/* ── HAPUS MASSAL ── */}
              <button onClick={() => setModalBulkHapus(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors">
                <FiTrash2 size={12} /> Hapus {bulkSelected.size} Unit
              </button>
              <button onClick={() => { setBulkMode(false); setBulkSelected(new Set()); }}
                className="ml-auto text-xs text-gray-400 hover:text-gray-700 font-medium flex items-center gap-1">
                <FiX size={12} /> Batal
              </button>
            </div>
          )}

          {/* ── Grid/List Content ── */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />)}
            </div>
          ) : units.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-16 text-center">
              <MapPin size={40} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 font-medium">Belum ada unit untuk proyek ini.</p>
              <p className="text-gray-400 text-sm mt-1">Klik "Generate" untuk membuat unit secara otomatis.</p>
              <button onClick={openSeedModal} className="mt-5 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm">Generate Kavling</button>
            </div>
          ) : view === 'grid' ? (
            <div className="space-y-4">
              {(activeBlok === 'Semua' ? blokList : [activeBlok]).map(blok => {
                const blokUnits = (unitsByBlok[blok] || []).filter(u => {
                  if (filterStatus !== 'Semua' && u.status !== filterStatus) return false;
                  if (searchQ.trim()) {
                    const q = searchQ.toLowerCase();
                    return `${u.blok}-${u.nomor}`.includes(q) || (u.namaUser || '').toLowerCase().includes(q) || (u.namaMarketing || '').toLowerCase().includes(q);
                  }
                  return true;
                });
                if (blokUnits.length === 0) return null;
                const totalBlok = (unitsByBlok[blok] || []).length;
                const soldBlok  = (unitsByBlok[blok] || []).filter(u => ['SoldOut', 'Booking'].includes(u.status)).length;
                const pctBlok   = totalBlok > 0 ? Math.round(soldBlok / totalBlok * 100) : 0;
                return (
                  <div key={blok} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-600 text-white rounded-2xl flex items-center justify-center font-black text-base">{blok}</div>
                        <div>
                          <div className="font-black text-gray-900">Blok {blok}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{blokUnits.length} unit ditampilkan · {totalBlok} total</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="hidden sm:flex gap-1.5 text-xs">
                          {STATUS_LIST.map(s => {
                            const c = (unitsByBlok[blok] || []).filter(u => u.status === s).length;
                            if (!c) return null;
                            return <span key={s} className={`px-2 py-0.5 rounded-full font-bold ${STATUS[s].bg} ${STATUS[s].text}`}>{c}</span>;
                          })}
                        </div>
                        <button onClick={() => handleOpenTambahForBlok(blok)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors">
                          <FiPlus size={11} /> Unit
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-400 to-red-500 rounded-full transition-all duration-700" style={{ width: `${pctBlok}%` }} />
                      </div>
                      <span className="text-xs font-bold text-gray-500 shrink-0">{pctBlok}% terjual</span>
                    </div>
                    <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))' }}>
                      {blokUnits.map(unit => (
                        <KavlingCell key={unit.id} unit={unit} onClick={setModalUnit}
                          bulkMode={bulkMode} isSelected={bulkSelected.has(unit.id)} onToggleSelect={handleToggleSelect} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/80">
                      {bulkMode && <th className="px-4 py-3 w-10"><button onClick={handleSelectAll} className="text-gray-400 hover:text-gray-700">{bulkSelected.size === sortedFilteredUnits.length && sortedFilteredUnits.length > 0 ? <FiCheckSquare size={14} className="text-gray-900" /> : <FiSquare size={14} />}</button></th>}
                      <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Unit</th>
                      <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Tipe</th>
                      <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Harga Akhir</th>
                      <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Pembeli</th>
                      <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Marketing</th>
                      <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Payment</th>
                      <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {sortedFilteredUnits.map(unit => {
                      const st     = STATUS[unit.status] || STATUS.Tersedia;
                      const hAkhir = Math.max(0, toNum(unit.harga) - toNum(unit.diskon || ''));
                      return (
                        <tr key={unit.id} className={`hover:bg-gray-50/50 transition-colors ${bulkSelected.has(unit.id) ? 'bg-blue-50/40' : ''}`}>
                          {bulkMode && (
                            <td className="px-4 py-3">
                              <button onClick={() => handleToggleSelect(unit.id)} className="text-gray-400 hover:text-gray-700">
                                {bulkSelected.has(unit.id) ? <FiCheckSquare size={14} className="text-gray-900" /> : <FiSquare size={14} />}
                              </button>
                            </td>
                          )}
                          <td className="px-4 py-3 font-black text-gray-900">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ background: st.dot }} />
                              {unit.blok}-{unit.nomor}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${st.bg} ${st.text} border ${st.border}`}>
                              {st.icon} {st.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600">{unit.tipe || '—'}</td>
                          <td className="px-4 py-3 text-xs font-bold text-gray-800">{hAkhir > 0 ? formatRupiah(hAkhir) : '—'}</td>
                          <td className="px-4 py-3 text-xs text-gray-600 max-w-[140px] truncate">{unit.namaUser || '—'}</td>
                          <td className="px-4 py-3 text-xs text-gray-600">{unit.namaMarketing || '—'}</td>
                          <td className="px-4 py-3 text-xs text-gray-500">
                            {unit.paymentScheme ? PAYMENT_SCHEME[unit.paymentScheme]?.icon + ' ' + PAYMENT_SCHEME[unit.paymentScheme]?.label : '—'}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button onClick={() => setModalUnit(unit)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition-colors"><FiEdit2 size={13} /></button>
                              <button onClick={() => setModalHapus(unit)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"><FiTrash2 size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── MODE 2: REAL SITEPLAN ── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {pageMode === 'siteplan' && (
        <>
          {/* Siteplan toolbar */}
          <div className="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                {customImages[activeProyek] ? 'Ganti Gambar' : 'Upload Siteplan'}
              </button>
              {customImages[activeProyek] && (
                <button
                  onClick={() => {
                    setCustomImages(prev => {
                      const next = { ...prev };
                      delete next[activeProyek];
                      try { localStorage.setItem('afkar_siteplan_images', JSON.stringify(next)); } catch {}
                      return next;
                    });
                    toast.success('Gambar siteplan dihapus');
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 border border-red-200 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors">
                  <FiTrash2 size={12} /> Hapus Gambar
                </button>
              )}
              {/* Place dot panel */}
              <div className="relative" ref={placePanelRef}>
                <button onClick={() => setShowPlacePanel(v => !v)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${placingUnit ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  <MapPin size={12} /> {placingUnit ? `Placing: ${placingUnit.blok}-${placingUnit.nomor}` : 'Tempatkan Titik'}
                </button>
                {showPlacePanel && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-gray-100">
                      <div className="text-xs font-black text-gray-700 mb-2">Pilih Unit</div>
                      <input placeholder="Cari unit..." value={dotFilter} onChange={e => setDotFilter(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-red-400" />
                    </div>
                    <div className="max-h-48 overflow-y-auto p-2">
                      {units.filter(u => !dotFilter || `${u.blok}-${u.nomor}`.toLowerCase().includes(dotFilter.toLowerCase()) || (u.namaUser || '').toLowerCase().includes(dotFilter.toLowerCase())).map(u => {
                        const st     = STATUS[u.status] || STATUS.Tersedia;
                        const hasDot = !!dotPositions[`${u.blok}-${u.nomor}`];
                        return (
                          <button key={u.id}
                            onClick={() => { setPlacingUnit(u); setShowPlacePanel(false); }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs hover:bg-gray-50 text-left ${placingUnit?.id === u.id ? 'bg-blue-50' : ''}`}>
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: st.dot }} />
                            <span className="font-bold text-gray-800 flex-1">{u.blok}-{u.nomor}</span>
                            {hasDot ? <span className="text-emerald-500 text-[10px] font-bold">✓ placed</span> : <span className="text-gray-300 text-[10px]">no dot</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              {/* Lock / Dot Size */}
              <button onClick={handleToggleLock}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${lockedDots ? 'bg-amber-50 border-amber-300 text-amber-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                {lockedDots ? '🔒 Terkunci' : '🔓 Kunci Posisi'}
              </button>
              <div className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-xl">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mr-0.5">Titik</span>
                <button onClick={() => handleChangeDotSize(-2)} disabled={dotSize <= DOT_MIN}
                  className="w-6 h-6 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-30 text-gray-600"><FiMinus size={10} /></button>
                <span className="text-xs font-mono font-bold text-gray-700 w-8 text-center">{dotSize}px</span>
                <button onClick={() => handleChangeDotSize(2)} disabled={dotSize >= DOT_MAX}
                  className="w-6 h-6 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-30 text-gray-600"><FiPlus size={10} /></button>
                <div style={{ width: Math.min(dotSize, 20), height: Math.min(dotSize, 20), borderRadius: '50%', background: '#10b981', transition: 'all 0.2s', flexShrink: 0, marginLeft: 2 }} />
              </div>
              <div className="flex-1" />
              <button onClick={() => setIsPublicMode(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                Layar Publik
              </button>
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                <button onClick={() => setSvgScale(s => Math.min(5, s + 0.25))} className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50 text-gray-600"><FiZoomIn size={13} /></button>
                <span className="text-xs font-mono text-gray-500 w-10 text-center">{Math.round(svgScale * 100)}%</span>
                <button onClick={() => setSvgScale(s => Math.max(0.2, s - 0.25))} className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50 text-gray-600"><FiZoomOut size={13} /></button>
                <button onClick={() => { setSvgScale(1); setSvgOffset({ x: 0, y: 0 }); }} className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50 text-gray-600"><FiMaximize2 size={13} /></button>
              </div>
            </div>
          </div>

          {/* Block Navigator */}
          <div className="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider mr-1">Blok:</span>
              {['Semua', ...blokList].map(blok => (
                <button key={blok} onClick={() => handleSelectBlock(blok)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedBlock === blok ? 'bg-gray-900 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {blok === 'Semua' ? 'Semua' : `Blok ${blok}`}
                  {blok !== 'Semua' && blockStats[blok] && <span className={`ml-1.5 text-[10px] ${selectedBlock === blok ? 'text-gray-300' : 'text-gray-400'}`}>{blockStats[blok].total}</span>}
                </button>
              ))}
              {selectedBlock !== 'Semua' && (
                <button onClick={() => handleSelectBlock('Semua')} className="ml-auto text-[10px] text-gray-400 hover:text-gray-600 font-medium flex items-center gap-1">
                  <FiX size={10} /> Reset
                </button>
              )}
            </div>
            {selectedBlock !== 'Semua' && blockStats[selectedBlock] && (
              <div className="mt-3 pt-3 border-t border-gray-50 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-gray-700">Blok {selectedBlock}</span>
                  <span className="text-xs text-gray-400">— {blockStats[selectedBlock].total} unit</span>
                </div>
                {STATUS_LIST.map(s => blockStats[selectedBlock][s] > 0 && (
                  <div key={s} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS[s].dot }} />
                    <span className="text-xs text-gray-600 font-medium">{STATUS[s].label}</span>
                    <span className="text-xs font-black text-gray-900">{blockStats[selectedBlock][s]}</span>
                  </div>
                ))}
                <div className="ml-auto flex items-center gap-2 min-w-[120px]">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-red-500 rounded-full transition-all duration-500" style={{ width: `${blockStats[selectedBlock].soldPct}%` }} />
                  </div>
                  <span className="text-xs font-bold text-gray-700 shrink-0">{blockStats[selectedBlock].soldPct}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Siteplan Canvas */}
          <div ref={svgContainerRef} className="rounded-2xl shadow-sm overflow-hidden relative"
            style={{ height: '660px', background: '#111827', cursor: placingUnit && !lockedDots ? 'crosshair' : (isPanning ? 'grabbing' : 'grab'), border: placingUnit ? '2px solid #3b82f6' : '1px solid #e5e7eb' }}
            onMouseDown={e => { if (placingUnit) return; setIsPanning(true); panStart.current = { x: e.clientX - svgOffset.x, y: e.clientY - svgOffset.y }; }}
            onMouseMove={e => { if (!isPanning || !panStart.current) return; setSvgOffset({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y }); }}
            onMouseUp={() => setIsPanning(false)} onMouseLeave={() => setIsPanning(false)}
            onWheel={e => { e.preventDefault(); const d = e.deltaY > 0 ? -0.12 : 0.12; setSvgScale(s => Math.min(5, Math.max(0.2, s + d))); }}>
            {loading && <div className="absolute inset-0 flex items-center justify-center z-20"><div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin" /></div>}
            <div style={{ transform: `translate(${svgOffset.x}px, ${svgOffset.y}px) scale(${svgScale})`, transformOrigin: '0 0', transition: isPanning ? 'none' : 'transform 0.07s ease', userSelect: 'none', position: 'relative', display: 'inline-block' }}
              onClick={placingUnit && !lockedDots ? handleImageClick : undefined}>
              {customImages[activeProyek] || cfg?.imageUrl ? (
                <>
                  <img ref={imgRef} src={customImages[activeProyek] || cfg?.imageUrl} alt={`Siteplan ${activeProyek}`} draggable={false}
                    style={{ display: 'block', height: 'auto', minWidth: 600, maxWidth: '100%', imageRendering: 'high-quality' }} />
                  <div style={{ position: 'absolute', inset: 0, pointerEvents: placingUnit ? 'none' : 'all' }}>
                    {units.map(u => {
                      const key    = `${u.blok}-${u.nomor}`;
                      const pos    = dotPositions[key];
                      if (!pos) return null;
                      const isDimmed = selectedBlock !== 'Semua' && u.blok !== selectedBlock;
                      return <UnitDot key={u.id || key} unit={u} posX={pos.x} posY={pos.y} isPublicMode={false} isSelected={false} dotSize={dotSize} dimmed={isDimmed} onClick={(unit) => setModalUnit(unit)} />;
                    })}
                  </div>
                </>
              ) : (
                <div style={{ width: 760, height: 540, background: 'linear-gradient(140deg,#0f172a,#1e3a5f)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, position: 'relative' }}>
                  <svg style={{ position: 'absolute', inset: 0, opacity: 0.05 }} width="760" height="540">
                    <defs><pattern id="g" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0L0 0 0 36" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs>
                    <rect width="760" height="540" fill="url(#g)" />
                  </svg>
                  <div style={{ textAlign: 'center', zIndex: 1 }}>
                    <div style={{ width: 60, height: 60, borderRadius: 18, background: 'rgba(255,255,255,0.07)', border: '1.5px dashed rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 600 }}>Upload gambar siteplan HD</p>
                    <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, marginTop: 4 }}>JPG · PNG · WebP · Resolusi tinggi disarankan</p>
                    <button onClick={() => fileInputRef.current?.click()} style={{ marginTop: 16, padding: '8px 20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Pilih Gambar</button>
                  </div>
                </div>
              )}
            </div>
            {placingUnit && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg text-white text-xs font-bold z-30"
                style={{ background: '#1d4ed8', boxShadow: '0 4px 20px rgba(29,78,216,0.5)' }}>
                <span className="w-3 h-3 rounded-full animate-pulse" style={{ background: STATUS[placingUnit.status]?.dot || '#3b82f6' }} />
                Klik pada siteplan → Unit {placingUnit.blok}-{placingUnit.nomor}
                <button onClick={() => setPlacingUnit(null)} className="ml-2 opacity-70 hover:opacity-100">ESC</button>
              </div>
            )}
            <div className="absolute bottom-3 right-4 text-[10px] text-white/20 font-bold pointer-events-none select-none tracking-widest uppercase">{activeProyek} · AFKAR LAND</div>
            {!placingUnit && (
              <div className="absolute bottom-3 left-4 bg-black/40 backdrop-blur-sm text-white/60 text-[10px] px-2.5 py-1.5 rounded-lg pointer-events-none">
                Scroll zoom · Drag pan · Klik titik untuk edit
              </div>
            )}
          </div>

          {/* Live Activity + Dot Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" /> Status Titik Terpasang
              </h3>
              <div className="space-y-2">
                {STATUS_LIST.map(s => {
                  const c     = units.filter(u => u.status === s && dotPositions[`${u.blok}-${u.nomor}`]).length;
                  const total = units.filter(u => u.status === s).length;
                  return total > 0 ? (
                    <div key={s} className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ background: STATUS[s].dot }} />
                      <span className="text-xs text-gray-600 flex-1">{STATUS[s].label}</span>
                      <span className="text-xs font-bold text-gray-800">{c}/{total}</span>
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${total > 0 ? (c / total) * 100 : 0}%`, background: STATUS[s].dot }} />
                      </div>
                    </div>
                  ) : null;
                })}
                {units.length === 0 && <p className="text-xs text-gray-400 text-center py-2">Belum ada unit</p>}
              </div>
            </div>

            {/* ── LIVE ACTIVITY dengan Clear Button ── */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <FiActivity size={14} className="text-red-600" />
                <h3 className="font-bold text-sm text-gray-900">Live Activity</h3>
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse ml-auto" />
                {/* ── CLEAR BUTTON ── */}
                <button onClick={handleClearActivity}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-200 hover:border-red-200 transition-all">
                  <FiTrash2 size={10} /> Hapus Riwayat
                </button>
              </div>
              <div className="divide-y divide-gray-50">
                {recentActivity.length === 0
                  ? <p className="text-xs text-gray-400 text-center py-4">
                      {activityCleared ? 'Riwayat aktivitas telah dibersihkan' : 'Belum ada aktivitas'}
                    </p>
                  : recentActivity.map(unit => <ActivityItem key={unit.id} unit={unit} timestamp={unit.updatedAt} />)}
              </div>
            </div>
          </div>

          <style>{`
            @keyframes dotPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(250,204,21,0.7); } 50% { box-shadow: 0 0 0 5px rgba(250,204,21,0); } }
          `}</style>
        </>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── LAYAR PUBLIK ── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {isPublicMode && (
        <div ref={publicDisplayRef} style={{ position: 'fixed', inset: 0, background: '#0f172a', zIndex: 9999, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontWeight: 900, fontSize: 13 }}>A</span>
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: 800, fontSize: 14, lineHeight: 1 }}>{activeProyek}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 2 }}>AFKAR LAND · Status Kavling Real-time</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <PublicLegend />
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: 'white' }}>{units.filter(u => u.status !== 'Tersedia').length}/{units.length}</div>
                <div>unit terjual/ditahan</div>
              </div>
              <div className="relative" ref={exportPanelRef}>
                <button onClick={() => setShowExportPanel(v => !v)} disabled={isExporting}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, background: isExporting ? 'rgba(255,255,255,0.05)' : 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: 10, padding: '8px 14px', color: isExporting ? 'rgba(255,255,255,0.3)' : '#4ade80', fontSize: 11, fontWeight: 700, cursor: isExporting ? 'not-allowed' : 'pointer' }}>
                  <FiDownload size={12} /> Download PNG
                </button>
                {showExportPanel && !isExporting && (
                  <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: 16, width: 240, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 10001 }}>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Filter & Kualitas</div>
                    {[
                      { key: 'Semua', label: '🗺️ Semua Unit', desc: `${units.length} titik` },
                      { key: 'Tersedia', label: '🟢 Hanya Tersedia', desc: `${units.filter(u => u.status === 'Tersedia').length} titik` },
                      { key: 'Sold', label: '🔴 Hanya Sold Out', desc: `${units.filter(u => u.status === 'SoldOut').length} titik` },
                      { key: 'Aktif', label: '🟡 Keep + Booking', desc: `${units.filter(u => ['Keep', 'Booking'].includes(u.status)).length} titik` },
                    ].map(opt => (
                      <button key={opt.key} onClick={() => setExportFilter(opt.key)}
                        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderRadius: 8, marginBottom: 4, background: exportFilter === opt.key ? 'rgba(34,197,94,0.15)' : 'transparent', border: exportFilter === opt.key ? '1px solid rgba(34,197,94,0.3)' : '1px solid transparent', color: exportFilter === opt.key ? '#4ade80' : 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>
                        <span>{opt.label}</span><span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>{opt.desc}</span>
                      </button>
                    ))}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 8, paddingTop: 10 }}>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                        {[{ scale: 2, label: 'HD', sub: '~1920px' }, { scale: 4, label: '4K', sub: '~3840px' }].map(opt => (
                          <button key={opt.scale} onClick={() => setExportScale(opt.scale)}
                            style={{ flex: 1, padding: '7px 6px', borderRadius: 8, cursor: 'pointer', background: exportScale === opt.scale ? 'rgba(34,197,94,0.18)' : 'rgba(255,255,255,0.05)', border: exportScale === opt.scale ? '1px solid rgba(34,197,94,0.45)' : '1px solid rgba(255,255,255,0.1)', color: exportScale === opt.scale ? '#4ade80' : 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
                            <div style={{ fontSize: 13, fontWeight: 900 }}>{opt.label}</div>
                            <div style={{ fontSize: 8, opacity: 0.7 }}>{opt.sub}</div>
                          </button>
                        ))}
                      </div>
                      <button onClick={handleExportSiteplan} style={{ width: '100%', padding: '10px', background: '#16a34a', border: 'none', borderRadius: 9, color: 'white', fontSize: 12, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                        <FiDownload size={13} /> Export {exportScale === 4 ? '4K' : 'HD'} Sekarang
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button onClick={() => setIsPublicMode(false)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '8px 14px', color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>✕ Tutup</button>
            </div>
          </div>
          <div ref={siteplanCaptureRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {customImages[activeProyek] || cfg?.imageUrl ? (
                <div style={{ position: 'relative', lineHeight: 0, display: 'inline-block' }}>
                  <img ref={publicImgRef} src={customImages[activeProyek] || cfg?.imageUrl} alt="Siteplan"
                    {...(!(customImages[activeProyek] || cfg?.imageUrl || '').startsWith('blob:') && { crossOrigin: 'anonymous' })}
                    onLoad={(e) => setPublicImgDisplayH(e.currentTarget.clientHeight)}
                    style={{ display: 'block', maxHeight: 'calc(100vh - 120px)', maxWidth: 'calc(100vw - 48px)' }} draggable={false} />
                  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                    {publicVisibleUnits.map(u => {
                      const key = `${u.blok}-${u.nomor}`;
                      const pos = dotPositions[key];
                      if (!pos) return null;
                      return <UnitDot key={u.id || key} unit={u} posX={pos.x} posY={pos.y} isPublicMode={true} isSelected={false} dotSize={publicDotSize} onClick={() => {}} />;
                    })}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                  <p style={{ fontSize: 16, fontWeight: 600 }}>Belum ada gambar siteplan</p>
                  <p style={{ fontSize: 12, marginTop: 8 }}>Upload gambar siteplan terlebih dahulu</p>
                </div>
              )}
            </div>
            <div style={{ padding: '10px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              {STATUS_LIST.map(s => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: STATUS[s].dot }} />
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 600 }}>{STATUS[s].label}</span>
                  <span style={{ color: 'white', fontSize: 14, fontWeight: 900 }}>{units.filter(u => u.status === s).length}</span>
                </div>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>
                  <span style={{ color: '#4ade80', marginRight: 5 }}>●</span>
                  Update otomatis · {publicTime.toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.15)', fontSize: 9, letterSpacing: '0.05em' }}>Built with Webapp GASP Builder Era v2.0 by @damarmahendra</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── MODAL: EDIT UNIT (with Smart Payment) ── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {modalUnit && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <div>
                <h2 className="font-heading font-bold text-gray-900 text-lg">Blok {modalUnit.blok}-{modalUnit.nomor}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{activeProyek}</p>
              </div>
              <button onClick={() => setModalUnit(null)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"><FiX /></button>
            </div>
            <form onSubmit={handleUpdateUnit} className="p-6 space-y-5">
              {/* Status */}
              <div>
                <label className={lightLabel}>Status Kavling</label>
                <div className="grid grid-cols-2 gap-2">
                  {STATUS_LIST.map(s => {
                    const st       = STATUS[s];
                    const isActive = modalUnit.status === s;
                    return (
                      <button key={s} type="button" onClick={() => setModalUnit(u => ({ ...u, status: s }))}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 font-bold text-sm transition-all ${isActive ? `${st.bg} ${st.border} ${st.text}` : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                        <span className="w-3 h-3 rounded-full" style={{ background: st.dot }} />
                        {st.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Harga + Diskon */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lightLabel}>Harga Unit</label>
                  <input className={inputCls} placeholder="Rp 0" value={formatRupiahInput(modalUnit.harga)}
                    onChange={e => setModalUnit(u => ({ ...u, harga: e.target.value.replace(/\D/g, '') }))} />
                </div>
                <div>
                  <label className={lightLabel}>Diskon</label>
                  <input className={inputCls} placeholder="Rp 0" value={formatRupiahInput(modalUnit.diskon || '')}
                    onChange={e => setModalUnit(u => ({ ...u, diskon: e.target.value.replace(/\D/g, '') }))} />
                </div>
              </div>
              {hargaAkhirModal > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 flex justify-between items-center">
                  <span className="text-xs font-bold text-emerald-600">Harga Akhir</span>
                  <span className="text-sm font-black text-emerald-700">{formatRupiah(hargaAkhirModal)}</span>
                </div>
              )}
              {/* Tipe */}
              <div>
                <label className={lightLabel}>Tipe Unit</label>
                <select className={inputCls} value={modalUnit.tipe || ''} onChange={e => setModalUnit(u => ({ ...u, tipe: e.target.value }))}>
                  {TIPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              {/* Customer (jika bukan Tersedia) */}
              {modalUnit.status !== 'Tersedia' && (
                <>
                  <div className="border-t border-gray-100 pt-4">
                    <div className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Informasi Customer</div>
                    <div className="space-y-3">
                      <div>
                        <label className={lightLabel}>Nama Customer</label>
                        <input className={inputCls} placeholder="Nama calon pembeli..." value={modalUnit.namaUser || ''}
                          onChange={e => setModalUnit(u => ({ ...u, namaUser: e.target.value }))} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={lightLabel}>No. WhatsApp</label>
                          <input className={inputCls} placeholder="081234..." value={modalUnit.noWa || ''}
                            onChange={e => setModalUnit(u => ({ ...u, noWa: e.target.value }))} />
                        </div>
                        <div>
                          <label className={lightLabel}>Tanggal Booking</label>
                          <input type="date" className={inputCls} value={modalUnit.tanggalBooking || ''}
                            onChange={e => setModalUnit(u => ({ ...u, tanggalBooking: e.target.value }))} />
                        </div>
                      </div>
                      <div>
                        <label className={lightLabel}>Alamat</label>
                        <input className={inputCls} placeholder="Alamat customer..." value={modalUnit.alamat || ''}
                          onChange={e => setModalUnit(u => ({ ...u, alamat: e.target.value }))} />
                      </div>
                    </div>
                  </div>
                  {/* Marketing */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lightLabel}>Nama Marketing</label>
                      <input className={inputCls} placeholder="Masukkan nama marketing..." value={modalUnit.namaMarketing || ''}
                        onChange={e => setModalUnit(u => ({ ...u, namaMarketing: e.target.value }))} />
                    </div>
                    <div>
                      <label className={lightLabel}>Nama Agency</label>
                      <input className={inputCls} placeholder="Nama agency / kantor..." value={modalUnit.kodeMarketing || ''}
                        onChange={e => setModalUnit(u => ({ ...u, kodeMarketing: e.target.value }))} />
                    </div>
                  </div>
                  {/* Smart Payment */}
                  <div className="border-t border-gray-100 pt-4">
                    <div className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Smart Payment</div>
                    <SmartPaymentSection
                      data={modalUnit}
                      onChange={(field, val) => setModalUnit(u => ({ ...u, [field]: val }))}
                      hargaAkhir={hargaAkhirModal}
                      isDark={false}
                    />
                  </div>
                </>
              )}
              {/* Catatan */}
              <div>
                <label className={lightLabel}>Catatan</label>
                <textarea className={inputCls} rows={2} value={modalUnit.catatan || ''}
                  onChange={e => setModalUnit(u => ({ ...u, catatan: e.target.value }))} placeholder="Catatan untuk unit ini..." />
              </div>
              <div className="pt-4 border-t border-gray-100 flex gap-3">
                <button type="button" onClick={() => setModalHapus(modalUnit)} className="px-4 py-2.5 border border-red-200 text-red-500 rounded-xl font-bold text-sm hover:bg-red-50 flex items-center gap-2">
                  <FiTrash2 size={14} /> Hapus
                </button>
                <button type="button" onClick={() => setModalUnit(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50">Batal</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                  <FiSave size={14} /> {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── MODAL: TAMBAH UNIT ── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {modalTambah && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl bg-white border border-gray-100">

            {/* Header */}
            <div className="sticky top-0 z-10 flex justify-between items-center px-7 py-5 bg-white rounded-t-3xl border-b border-gray-100">
              <div>
                <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">AFKAR LAND · {activeProyek}</div>
                <h2 className="text-gray-900 font-black text-xl">Tambah Unit Manual</h2>
              </div>
              <div className="flex items-center gap-3">
                {unitIdPreview !== '—' && (
                  <div className="px-4 py-2 rounded-xl font-black text-lg bg-red-50 text-red-600 border border-red-200">
                    {unitIdPreview}
                  </div>
                )}
                <button onClick={() => setModalTambah(false)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                  <FiX size={18} />
                </button>
              </div>
            </div>

            <div className="p-7 space-y-6">
              {/* 1. INFORMASI UNIT */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
                <div className={lightLabel}>① Informasi Unit</div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={lightLabel}>Blok *</label>
                    <select className={inputCls} value={form.blok} onChange={e => setForm(f => ({ ...f, blok: e.target.value }))}>
                      {blokList.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={lightLabel}>Nomor *</label>
                    <input className={inputCls} value={form.nomor} onChange={e => setForm(f => ({ ...f, nomor: e.target.value }))} placeholder="1" />
                  </div>
                  <div>
                    <label className={lightLabel}>Tipe Unit</label>
                    <select className={inputCls} value={form.tipe} onChange={e => setForm(f => ({ ...f, tipe: e.target.value }))}>
                      {TIPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. INFORMASI HARGA */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
                <div className={lightLabel}>② Informasi Harga</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={lightLabel}>Harga Unit</label>
                    <input className={inputCls} placeholder="Rp 0" value={formatRupiahInput(form.harga)}
                      onChange={e => setForm(f => ({ ...f, harga: e.target.value.replace(/\D/g, '') }))} />
                  </div>
                  <div>
                    <label className={lightLabel}>Diskon</label>
                    <input className={inputCls} placeholder="Rp 0" value={formatRupiahInput(form.diskon)}
                      onChange={e => setForm(f => ({ ...f, diskon: e.target.value.replace(/\D/g, '') }))} />
                  </div>
                </div>
                {hargaAkhirForm > 0 && (
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[11px] font-black text-emerald-600 uppercase tracking-wider">Harga Akhir (Otomatis)</span>
                    <span className="text-emerald-700 font-black text-lg">{formatRupiah(hargaAkhirForm)}</span>
                  </div>
                )}
              </div>

              {/* 3. STATUS */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
                <div className={lightLabel}>③ Status Unit</div>
                <div className="grid grid-cols-2 gap-2">
                  {STATUS_LIST.map(s => {
                    const st       = STATUS[s];
                    const isActive = form.status === s;
                    return (
                      <button key={s} type="button" onClick={() => setForm(f => ({ ...f, status: s }))}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 font-bold text-sm transition-all ${isActive ? `${st.bg} ${st.border} ${st.text}` : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}>
                        <span className="w-3 h-3 rounded-full" style={{ background: st.dot }} />
                        {st.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. INFORMASI CUSTOMER */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
                <div className={lightLabel}>④ Informasi Customer</div>
                <div>
                  <label className={lightLabel}>Nama Customer</label>
                  <input className={inputCls} placeholder="Nama calon pembeli..." value={form.namaUser}
                    onChange={e => setForm(f => ({ ...f, namaUser: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={lightLabel}>No. WhatsApp</label>
                    <input className={inputCls} placeholder="081234567890" value={form.noWa}
                      onChange={e => setForm(f => ({ ...f, noWa: e.target.value }))} />
                  </div>
                  <div>
                    <label className={lightLabel}>No. HP</label>
                    <input className={inputCls} placeholder="081234567890" value={form.noHp}
                      onChange={e => setForm(f => ({ ...f, noHp: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className={lightLabel}>Alamat</label>
                  <input className={inputCls} placeholder="Alamat lengkap customer..." value={form.alamat}
                    onChange={e => setForm(f => ({ ...f, alamat: e.target.value }))} />
                </div>
              </div>

              {/* 5. INFORMASI MARKETING */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
                <div className={lightLabel}>⑤ Informasi Marketing</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={lightLabel}>Nama Marketing</label>
                    <input className={inputCls} placeholder="Masukkan nama marketing..." value={form.namaMarketing}
                      onChange={e => setForm(f => ({ ...f, namaMarketing: e.target.value }))} />
                  </div>
                  <div>
                    <label className={lightLabel}>Nama Agency</label>
                    <input className={inputCls} placeholder="Nama agency / kantor..." value={form.kodeMarketing}
                      onChange={e => setForm(f => ({ ...f, kodeMarketing: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className={lightLabel}>Tanggal Booking</label>
                  <input type="date" className={inputCls} value={form.tanggalBooking}
                    onChange={e => setForm(f => ({ ...f, tanggalBooking: e.target.value }))} />
                </div>
              </div>

              {/* 6. SMART PAYMENT (jika status bukan Tersedia) */}
              {form.status !== 'Tersedia' && (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
                  <div className={lightLabel}>⑥ Smart Payment</div>
                  <SmartPaymentSection
                    data={form}
                    onChange={(field, val) => setForm(f => ({ ...f, [field]: val }))}
                    hargaAkhir={hargaAkhirForm}
                    isDark={false}
                  />
                </div>
              )}

              {/* 7. CATATAN TAMBAHAN */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
                <div className={lightLabel}>⑦ Catatan Tambahan</div>
                <textarea className={inputCls} rows={3} placeholder="Catatan internal untuk unit ini..." value={form.catatan}
                  onChange={e => setForm(f => ({ ...f, catatan: e.target.value }))} />
              </div>

              {/* QUICK ACTIONS */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <button type="button" onClick={() => handleTambah(null, 'save')} disabled={saving}
                  className="flex flex-col items-center gap-1.5 py-4 rounded-2xl font-bold text-sm transition-all disabled:opacity-50 bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200">
                  <FiSave size={18} />
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button type="button" onClick={() => handleTambah(null, 'place')} disabled={saving}
                  className="flex flex-col items-center gap-1.5 py-4 rounded-2xl font-bold text-sm transition-all disabled:opacity-50 bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100">
                  <MapPin size={18} />
                  Simpan & Tempatkan
                </button>
                <button type="button" onClick={() => handleTambah(null, 'add_again')} disabled={saving}
                  className="flex flex-col items-center gap-1.5 py-4 rounded-2xl font-bold text-sm transition-all disabled:opacity-50 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100">
                  <FiPlus size={18} />
                  Simpan & Tambah Lagi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── MODAL: GENERATE KAVLING PREMIUM (Custom Config) ── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {modalSeed && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto">
            <div className="flex items-center gap-3 p-6 border-b border-gray-100">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                <FiRefreshCw className="text-red-600" size={22} />
              </div>
              <div>
                <h2 className="font-heading font-bold text-gray-900">Generate Kavling</h2>
                <p className="text-xs text-gray-400">{activeProyek} · Konfigurasi per blok</p>
              </div>
            </div>
            <div className="p-6 space-y-5">
              {/* Blok config rows */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black text-gray-600 uppercase tracking-wider">Konfigurasi Blok</div>
                  <div className="text-xs text-gray-400">Toggle untuk aktifkan/nonaktifkan</div>
                </div>
                {Object.entries(seedConfig).map(([blok, conf]) => (
                  <div key={blok} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${conf.enabled ? 'bg-gray-50 border-gray-200' : 'bg-gray-50/40 border-gray-100 opacity-50'}`}>
                    <button type="button" onClick={() => setSeedConfig(prev => ({ ...prev, [blok]: { ...prev[blok], enabled: !prev[blok].enabled } }))}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm transition-all ${conf.enabled ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                      {blok}
                    </button>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-gray-700">Blok {blok}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-medium">Jumlah unit:</span>
                      <input type="number" min="1" max="999"
                        className="w-16 px-2 py-1.5 rounded-lg border border-gray-200 text-sm font-bold text-center focus:border-red-400 outline-none bg-white disabled:bg-gray-50"
                        disabled={!conf.enabled}
                        value={conf.jumlah}
                        onChange={e => setSeedConfig(prev => ({ ...prev, [blok]: { ...prev[blok], jumlah: Number(e.target.value) || 1 } }))} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Tambah blok custom */}
              <div className="border-t border-gray-100 pt-4">
                <div className="text-xs font-black text-gray-600 uppercase tracking-wider mb-3">Tambah Blok Baru</div>
                <div className="flex gap-2">
                  <input className={inputCls} style={{ flex: 1 }} placeholder="Nama blok (misal: F)" value={seedCustomBlok}
                    onChange={e => setSeedCustomBlok(e.target.value.toUpperCase().slice(0, 4))} maxLength={4} />
                  <input type="number" className={inputCls} style={{ width: 80 }} placeholder="Jml" min="1" max="999"
                    value={seedCustomJumlah} onChange={e => setSeedCustomJumlah(e.target.value)} />
                  <button type="button"
                    onClick={() => {
                      if (!seedCustomBlok || seedConfig[seedCustomBlok]) { toast.error('Nama blok sudah ada atau kosong'); return; }
                      setSeedConfig(prev => ({ ...prev, [seedCustomBlok]: { enabled: true, jumlah: Number(seedCustomJumlah) || 10 } }));
                      setSeedCustomBlok(''); setSeedCustomJumlah('');
                    }}
                    className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors whitespace-nowrap">
                    + Tambah
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <div className="flex justify-between items-center text-sm font-bold mb-2">
                  <span className="text-red-700">Total yang akan di-generate:</span>
                  <span className="text-red-600 text-xl font-black">{seedTotal} unit</span>
                </div>
                <div className="space-y-0.5">
                  {Object.entries(seedConfig).filter(([, c]) => c.enabled).map(([blok, c]) => (
                    <div key={blok} className="flex justify-between text-xs text-red-600/70">
                      <span>Blok {blok}</span><span>{c.jumlah} unit</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-400">Unit yang sudah ada tidak akan ditimpa. Hanya kavling baru dengan status "Tersedia" yang akan dibuat.</p>

              <div className="flex gap-3">
                <button type="button" onClick={() => setModalSeed(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50">Batal</button>
                <button type="button" onClick={handleSeed} disabled={seeding || seedTotal === 0}
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 disabled:opacity-60 flex items-center justify-center gap-2">
                  <FiRefreshCw size={14} className={seeding ? 'animate-spin' : ''} />
                  {seeding ? 'Generating...' : `Generate ${seedTotal} Unit`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── MODAL: HAPUS UNIT ── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {modalHapus && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><FiTrash2 className="text-red-500" size={24} /></div>
            <h2 className="text-xl font-heading font-bold text-gray-900 mb-2">Hapus Unit?</h2>
            <p className="text-gray-500 text-sm mb-6">Unit Blok <strong>{modalHapus.blok}-{modalHapus.nomor}</strong> akan dihapus permanen.</p>
            <div className="flex gap-3">
              <button onClick={() => setModalHapus(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 text-sm">Batal</button>
              <button onClick={handleHapus} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 text-sm">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── MODAL: HAPUS MASSAL ── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {modalBulkHapus && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiTrash2 className="text-red-500" size={28} />
            </div>
            <h2 className="text-xl font-heading font-bold text-gray-900 mb-2">Hapus {bulkSelected.size} Unit?</h2>
            <p className="text-gray-500 text-sm mb-2">Tindakan ini <strong>tidak bisa dibatalkan</strong>.</p>
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
              <p className="text-red-700 text-sm font-bold">{bulkSelected.size} unit akan dihapus permanen dari database.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setModalBulkHapus(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 text-sm">Batal</button>
              <button onClick={handleBulkHapus} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 text-sm">
                🗑️ Ya, Hapus Semua
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── MODAL: TAMBAH PROYEK ── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {modalTambahProyek && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="font-heading font-bold text-gray-900">Tambah Proyek Baru</h2>
                <p className="text-xs text-gray-400 mt-0.5">Konfigurasi proyek properti baru</p>
              </div>
              <button onClick={() => setModalTambahProyek(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"><FiX /></button>
            </div>
            <div className="p-6 space-y-5">
              {/* Nama Proyek */}
              <div>
                <label className={lightLabel}>Nama Proyek *</label>
                <input className={inputCls} placeholder="Contoh: Griya Hasanah Timur" value={proyekForm.nama}
                  onChange={e => setProyekForm(f => ({ ...f, nama: e.target.value }))} />
              </div>

              {/* Tipe + Warna */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lightLabel}>Tipe Unit Default</label>
                  <select className={inputCls} value={proyekForm.tipeDefault}
                    onChange={e => setProyekForm(f => ({ ...f, tipeDefault: e.target.value }))}>
                    {TIPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={lightLabel}>Warna Tema</label>
                  <select className={inputCls} value={proyekForm.color}
                    onChange={e => setProyekForm(f => ({ ...f, color: e.target.value }))}>
                    {Object.keys(PROJECT_COLORS).map(c => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                  {/* Color preview bar */}
                  <div className="mt-2 h-2 rounded-full transition-all" style={{ background: `linear-gradient(to right, ${PROJECT_COLORS[proyekForm.color]?.from}, ${PROJECT_COLORS[proyekForm.color]?.to})` }} />
                </div>
              </div>

              {/* Konfigurasi Blok */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className={lightLabel}>Konfigurasi Blok *</label>
                  <button type="button"
                    onClick={() => setProyekForm(f => ({ ...f, bloks: [...f.bloks, { nama: '', jumlah: 10 }] }))}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors">
                    <FiPlus size={11} /> Tambah Blok
                  </button>
                </div>
                <div className="space-y-2">
                  {proyekForm.bloks.map((blok, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                      <div className="flex-1">
                        <input
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm font-bold text-gray-800 focus:border-red-400 outline-none uppercase"
                          placeholder="Nama blok (A, B, ...)"
                          value={blok.nama}
                          maxLength={4}
                          onChange={e => {
                            const next = [...proyekForm.bloks];
                            next[idx] = { ...next[idx], nama: e.target.value.toUpperCase() };
                            setProyekForm(f => ({ ...f, bloks: next }));
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-500 whitespace-nowrap">Unit:</span>
                        <input
                          type="number" min="1" max="999"
                          className="w-16 px-2 py-1.5 rounded-lg border border-gray-200 bg-white text-sm font-bold text-center focus:border-red-400 outline-none"
                          value={blok.jumlah}
                          onChange={e => {
                            const next = [...proyekForm.bloks];
                            next[idx] = { ...next[idx], jumlah: Number(e.target.value) || 1 };
                            setProyekForm(f => ({ ...f, bloks: next }));
                          }}
                        />
                      </div>
                      {proyekForm.bloks.length > 1 && (
                        <button type="button"
                          onClick={() => setProyekForm(f => ({ ...f, bloks: f.bloks.filter((_, i) => i !== idx) }))}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                          <FiX size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview Card */}
              {proyekForm.nama && (
                <div className="rounded-2xl p-4 relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${PROJECT_COLORS[proyekForm.color]?.from}, ${PROJECT_COLORS[proyekForm.color]?.to})` }}>
                  <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%">
                      <defs><pattern id="prev" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="white" /></pattern></defs>
                      <rect width="100%" height="100%" fill="url(#prev)" />
                    </svg>
                  </div>
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm"
                      style={{ background: 'rgba(255,255,255,0.25)', color: 'white' }}>
                      {proyekForm.nama.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-black text-sm">{proyekForm.nama}</div>
                      <div className="text-white/60 text-xs">{proyekForm.bloks.length} blok · {proyekForm.bloks.reduce((s, b) => s + (Number(b.jumlah) || 0), 0)} unit total</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={() => setModalTambahProyek(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50">
                  Batal
                </button>
                <button type="button" onClick={handleTambahProyek}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                  <FiPlus size={14} /> Tambah Proyek
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer branding ────────────────────────────────────────── */}
      {/* Architected by GASP Builder Era v2.0 - Masterpiece Edition @damarmahendra */}
    </div>
  );
}