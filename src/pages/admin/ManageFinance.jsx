// ManageFinance.jsx — AFKAR LAND Admin Panel
// Kelola keuangan: auto-generate dari booking + input manual transaksi
// Data dari Firestore: 'bookings' (sumber) + 'transactions' (catatan keuangan)
// Built with Webapp GASP Builder Era v2.0 Masterpiece Edition by @damarmahendra

import React, { useState, useEffect, useMemo } from 'react';
import {
  collection, onSnapshot, addDoc, updateDoc,
  deleteDoc, doc, serverTimestamp, query, orderBy
} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import {
  FiDollarSign, FiTrendingUp, FiTrendingDown, FiPlus,
  FiTrash2, FiX, FiSave, FiEdit2, FiSearch, FiDownload,
  FiFilter, FiPhone, FiFileText, FiCreditCard, FiMapPin
} from 'react-icons/fi';
import { Receipt, Wallet, BarChart3, ArrowUpRight, ArrowDownRight, Building2 } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import toast from 'react-hot-toast';

// ── Konfigurasi ──────────────────────────────────────────────────
const MONTHS_ID = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

const PROYEK_LIST = [
  'Masagena Green Hills',
  'Wotu Islamic Village',
  'The Hasanah Panakkukang',
  'Afkar Madani Estate',
];

const KATEGORI_PEMASUKAN = ['Uang Tanda Jadi (UTJ)', 'DP / Uang Muka', 'Cicilan', 'Pelunasan', 'Lain-lain'];
const KATEGORI_PENGELUARAN = ['Komisi Agen', 'Biaya Operasional', 'Marketing', 'Legal / Notaris', 'Konstruksi', 'Lain-lain'];
const TIPE_TRANSAKSI = ['Pemasukan', 'Pengeluaran'];
const STATUS_BAYAR = ['Lunas', 'Partial', 'Pending'];
const METODE_PEMBAYARAN = ['Transfer Bank', 'Tunai / Cash', 'QRIS', 'Cicilan Langsung', 'Cek / Giro', 'Lain-lain'];

const inputCls = "w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-400 outline-none text-sm transition-colors";
const labelCls = "block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider";

const INITIAL_FORM = {
  tipe: 'Pemasukan',
  kategori: 'DP / Uang Muka',
  jumlah: '',
  keterangan: '',
  proyek: 'Masagena Green Hills',
  namaPembeli: '',
  nomorTelepon: '',
  blokUnit: '',
  statusBayar: 'Lunas',
  metodePembayaran: 'Transfer Bank',
  buktiTransfer: '',
  catatan: '',
  tanggal: new Date().toISOString().split('T')[0],
};

// ── Helpers ──────────────────────────────────────────────────────
const formatRp = (num) => {
  const n = Number(String(num || 0).replace(/\D/g, ''));
  return `Rp ${n.toLocaleString('id-ID')}`;
};

const toMonthLabel = (ts) => {
  const d = ts?.toDate ? ts.toDate() : new Date(ts?.seconds ? ts.seconds * 1000 : (ts || 0));
  return `${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
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

// ── Kartu ringkas ─────────────────────────────────────────────────
const SummaryCard = ({ label, value, sub, icon, color }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</div>
        <div className={`text-2xl font-black ${color}`}>{value}</div>
        {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
      </div>
      <div className="p-2.5 rounded-xl bg-gray-50">{icon}</div>
    </div>
  </div>
);

// ── Badge status ──────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    Lunas:   'bg-emerald-50 text-emerald-700 border border-emerald-200',
    Partial: 'bg-amber-50 text-amber-700 border border-amber-200',
    Pending: 'bg-gray-50 text-gray-500 border border-gray-200',
  };
  return <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${map[status] || ''}`}>{status}</span>;
};

// ── Badge proyek ──────────────────────────────────────────────────
const PROYEK_COLOR = {
  'Masagena Green Hills':    'bg-green-50 text-green-700',
  'Wotu Islamic Village':    'bg-blue-50 text-blue-700',
  'The Hasanah Panakkukang': 'bg-purple-50 text-purple-700',
  'Afkar Madani Estate':     'bg-amber-50 text-amber-700',
};
const ProyekBadge = ({ proyek }) => (
  <span className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-bold truncate max-w-[120px] ${PROYEK_COLOR[proyek] || 'bg-gray-50 text-gray-600'}`}>
    {proyek || '-'}
  </span>
);

// ── MAIN COMPONENT ────────────────────────────────────────────────
export default function ManageFinance() {
  const [transactions, setTransactions] = useState([]);
  const [bookings, setBookings]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filterTipe, setFilterTipe]     = useState('Semua');
  const [filterBulan, setFilterBulan]   = useState('Semua');
  const [filterProyek, setFilterProyek] = useState('Semua');
  const [searchQ, setSearchQ]           = useState('');
  const [isModalAdd, setIsModalAdd]     = useState(false);
  const [modalHapus, setModalHapus]     = useState(null);
  const [editTx, setEditTx]             = useState(null);
  const [form, setForm]                 = useState(INITIAL_FORM);
  const [saving, setSaving]             = useState(false);
  const [tabView, setTabView]           = useState('semua');

  const months6 = getLast6Months();

  // ── Listeners ────────────────────────────────────────────────────
  useEffect(() => {
    let done = 0;
    const check = () => { done++; if (done >= 2) setLoading(false); };

    const u1 = onSnapshot(
      query(collection(db, 'transactions'), orderBy('createdAt', 'desc')),
      snap => { setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() }))); check(); },
      () => check()
    );
    const u2 = onSnapshot(
      collection(db, 'bookings'),
      snap => { setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() }))); check(); },
      () => check()
    );
    return () => { u1(); u2(); };
  }, []);

  // ── Computed ──────────────────────────────────────────────────────
  const allData = useMemo(() => transactions, [transactions]);

  const filtered = useMemo(() => {
    let arr = allData;
    if (tabView !== 'semua')        arr = arr.filter(t => t.tipe?.toLowerCase() === tabView);
    if (filterBulan !== 'Semua')    arr = arr.filter(t => toMonthLabel(t.createdAt) === filterBulan);
    if (filterProyek !== 'Semua')   arr = arr.filter(t => t.proyek === filterProyek);
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase();
      arr = arr.filter(t =>
        (t.keterangan || '').toLowerCase().includes(q) ||
        (t.namaPembeli || '').toLowerCase().includes(q) ||
        (t.kategori || '').toLowerCase().includes(q) ||
        (t.blokUnit || '').toLowerCase().includes(q) ||
        (t.nomorTelepon || '').toLowerCase().includes(q) ||
        (t.catatan || '').toLowerCase().includes(q)
      );
    }
    return arr;
  }, [allData, tabView, filterBulan, filterProyek, searchQ]);

  const totalMasuk  = allData.filter(t => t.tipe === 'Pemasukan').reduce((s, t) => s + Number(String(t.jumlah || 0).replace(/\D/g, '')), 0);
  const totalKeluar = allData.filter(t => t.tipe === 'Pengeluaran').reduce((s, t) => s + Number(String(t.jumlah || 0).replace(/\D/g, '')), 0);
  const saldo       = totalMasuk - totalKeluar;

  // ── Per-proyek summary ────────────────────────────────────────────
  const proyekSummary = useMemo(() => PROYEK_LIST.map(p => ({
    nama: p,
    masuk:  allData.filter(t => t.proyek === p && t.tipe === 'Pemasukan').reduce((s, t) => s + Number(String(t.jumlah || 0).replace(/\D/g, '')), 0),
    keluar: allData.filter(t => t.proyek === p && t.tipe === 'Pengeluaran').reduce((s, t) => s + Number(String(t.jumlah || 0).replace(/\D/g, '')), 0),
    txCount: allData.filter(t => t.proyek === p).length,
  })), [allData]);

  // ── Chart 6 bulan ─────────────────────────────────────────────────
  const chartData = months6.map(m => ({
    bulan:       m,
    Pemasukan:   allData.filter(t => t.tipe === 'Pemasukan'  && toMonthLabel(t.createdAt) === m)
                        .reduce((s, t) => s + Number(String(t.jumlah || 0).replace(/\D/g, '')), 0) / 1_000_000,
    Pengeluaran: allData.filter(t => t.tipe === 'Pengeluaran' && toMonthLabel(t.createdAt) === m)
                        .reduce((s, t) => s + Number(String(t.jumlah || 0).replace(/\D/g, '')), 0) / 1_000_000,
  }));

  // ── CRUD ──────────────────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.jumlah) { toast.error('Jumlah wajib diisi'); return; }
    setSaving(true);
    try {
      const data = {
        ...form,
        jumlah: Number(String(form.jumlah).replace(/\D/g, '')),
        updatedAt: serverTimestamp(),
      };
      if (editTx) {
        await updateDoc(doc(db, 'transactions', editTx.id), data);
        toast.success('Transaksi diperbarui!');
      } else {
        await addDoc(collection(db, 'transactions'), { ...data, createdAt: serverTimestamp() });
        toast.success('Transaksi ditambahkan!');
      }
      setIsModalAdd(false);
      setForm(INITIAL_FORM);
      setEditTx(null);
    } catch { toast.error('Gagal menyimpan.'); }
    finally { setSaving(false); }
  };

  const openEdit = (tx) => {
    setEditTx(tx);
    setForm({
      tipe:             tx.tipe             || 'Pemasukan',
      kategori:         tx.kategori         || '',
      jumlah:           tx.jumlah           || '',
      keterangan:       tx.keterangan       || '',
      proyek:           tx.proyek           || 'Masagena Green Hills',
      namaPembeli:      tx.namaPembeli      || '',
      nomorTelepon:     tx.nomorTelepon     || '',
      blokUnit:         tx.blokUnit         || '',
      statusBayar:      tx.statusBayar      || 'Lunas',
      metodePembayaran: tx.metodePembayaran || 'Transfer Bank',
      buktiTransfer:    tx.buktiTransfer    || '',
      catatan:          tx.catatan          || '',
      tanggal:          tx.tanggal          || new Date().toISOString().split('T')[0],
    });
    setIsModalAdd(true);
  };

  const handleHapus = async () => {
    try {
      await deleteDoc(doc(db, 'transactions', modalHapus));
      toast.success('Dihapus.'); setModalHapus(null);
    } catch { toast.error('Gagal.'); }
  };

  // ── Auto-import dari booking Lunas ────────────────────────────────
  const importFromBookings = async () => {
    const existing = new Set(transactions.map(t => t.bookingId).filter(Boolean));
    const lunas    = bookings.filter(b => b.status === 'Lunas' && !existing.has(b.id));
    if (!lunas.length) { toast('Tidak ada booking baru untuk di-import.'); return; }
    try {
      await Promise.all(lunas.map(b => addDoc(collection(db, 'transactions'), {
        tipe: 'Pemasukan',
        kategori: 'Pelunasan',
        jumlah: Number(String(b.harga || 0).replace(/\D/g, '')),
        keterangan: `Import booking: ${b.nama} - Blok ${b.blok}-${b.nomor}`,
        proyek: b.proyek || '',
        namaPembeli: b.nama || '',
        nomorTelepon: b.telepon || b.nomorTelepon || '',
        blokUnit: `${b.blok}-${b.nomor}`,
        statusBayar: 'Lunas',
        metodePembayaran: 'Transfer Bank',
        buktiTransfer: '',
        catatan: '',
        bookingId: b.id,
        tanggal: new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp(),
      })));
      toast.success(`${lunas.length} transaksi di-import dari booking Lunas!`);
    } catch { toast.error('Gagal import.'); }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const kategoriList = form.tipe === 'Pemasukan' ? KATEGORI_PEMASUKAN : KATEGORI_PENGELUARAN;

  return (
    <div className="space-y-6">

      {/* ── HEADER ── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Keuangan</h1>
          <p className="text-gray-500 mt-1 text-sm">Rekap pemasukan, pengeluaran, dan saldo proyek AFKAR LAND.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={importFromBookings}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50"
          >
            <FiDownload size={14} /> Import dari Booking
          </button>
          <button
            onClick={() => { setIsModalAdd(true); setEditTx(null); setForm(INITIAL_FORM); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm shadow-sm"
          >
            <FiPlus size={16} /> Tambah Transaksi
          </button>
        </div>
      </div>

      {/* ── SUMMARY CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          label="Total Pemasukan"
          value={formatRp(totalMasuk)}
          sub={`${allData.filter(t => t.tipe === 'Pemasukan').length} transaksi`}
          icon={<ArrowUpRight className="text-emerald-500" size={20} />}
          color="text-emerald-600"
        />
        <SummaryCard
          label="Total Pengeluaran"
          value={formatRp(totalKeluar)}
          sub={`${allData.filter(t => t.tipe === 'Pengeluaran').length} transaksi`}
          icon={<ArrowDownRight className="text-red-500" size={20} />}
          color="text-red-600"
        />
        <SummaryCard
          label="Saldo Bersih"
          value={formatRp(Math.abs(saldo))}
          sub={saldo >= 0 ? 'Positif ✓' : 'Negatif ⚠️'}
          icon={<Wallet className={saldo >= 0 ? 'text-emerald-500' : 'text-red-500'} size={20} />}
          color={saldo >= 0 ? 'text-emerald-600' : 'text-red-600'}
        />
      </div>

      {/* ── PER-PROYEK SUMMARY ── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <Building2 size={16} className="text-red-500" />
          <h3 className="font-heading font-bold text-gray-800 text-sm">Ringkasan Per Proyek</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {proyekSummary.map((p, i) => (
            <div key={i}
              onClick={() => setFilterProyek(filterProyek === p.nama ? 'Semua' : p.nama)}
              className={`p-5 cursor-pointer transition-colors hover:bg-gray-50 ${filterProyek === p.nama ? 'bg-red-50 ring-1 ring-inset ring-red-200' : ''}`}
            >
              <div className={`text-[10px] font-extrabold uppercase tracking-widest mb-2 truncate ${filterProyek === p.nama ? 'text-red-600' : 'text-gray-400'}`}>
                {p.nama}
              </div>
              <div className="text-emerald-600 font-black text-sm">{formatRp(p.masuk)}</div>
              {p.keluar > 0 && <div className="text-red-400 font-bold text-xs mt-0.5">- {formatRp(p.keluar)}</div>}
              <div className="text-gray-400 text-[10px] mt-1">{p.txCount} transaksi</div>
            </div>
          ))}
        </div>
        {filterProyek !== 'Semua' && (
          <div className="px-6 py-2.5 bg-red-50 border-t border-red-100 flex items-center justify-between">
            <span className="text-xs text-red-600 font-bold">Filter aktif: {filterProyek}</span>
            <button onClick={() => setFilterProyek('Semua')} className="text-xs text-red-500 hover:text-red-700 font-bold underline">Reset</button>
          </div>
        )}
      </div>

      {/* ── CHART ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h3 className="font-heading font-bold text-gray-800 text-sm mb-5">Tren Keuangan 6 Bulan (dalam juta)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="masuk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="keluar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="bulan" tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(val) => [`Rp ${(val * 1_000_000).toLocaleString('id-ID')}`, '']}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
            />
            <Area type="monotone" dataKey="Pemasukan"   stroke="#059669" strokeWidth={2} fill="url(#masuk)"  />
            <Area type="monotone" dataKey="Pengeluaran" stroke="#ef4444" strokeWidth={2} fill="url(#keluar)" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-5 justify-center mt-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded bg-emerald-500" /> Pemasukan</div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded bg-red-500" /> Pengeluaran</div>
        </div>
      </div>

      {/* ── TABEL TRANSAKSI ── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Filter bar */}
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center">
          {/* Tab tipe */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {['semua', 'pemasukan', 'pengeluaran'].map(t => (
              <button
                key={t}
                onClick={() => setTabView(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all
                  ${tabView === t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {t}
              </button>
            ))}
          </div>
          {/* Filter bulan */}
          <select
            value={filterBulan}
            onChange={e => setFilterBulan(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs focus:border-red-400 outline-none"
          >
            <option value="Semua">Semua Bulan</option>
            {months6.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          {/* Filter proyek */}
          <select
            value={filterProyek}
            onChange={e => setFilterProyek(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs focus:border-red-400 outline-none"
          >
            <option value="Semua">Semua Proyek</option>
            {PROYEK_LIST.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          {/* Search */}
          <div className="relative flex-1 min-w-[160px]">
            <FiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Cari nama, catatan, unit..."
              className="w-full pl-8 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs focus:border-red-400 outline-none"
            />
          </div>
          <div className="text-xs text-gray-400 shrink-0">{filtered.length} transaksi</div>
        </div>

        {/* Tabel */}
        {loading ? (
          <div className="p-8 space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <Receipt size={36} className="mx-auto mb-3 opacity-20" />
            <p>Belum ada transaksi.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/60 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Pembeli / Pihak</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Proyek</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Unit</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Metode</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Jumlah</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(tx => {
                  const isPemasukan = tx.tipe === 'Pemasukan';
                  const tgl = tx.tanggal || (tx.createdAt?.toDate ? tx.createdAt.toDate().toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' }) : '-');
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{tgl}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold
                          ${isPemasukan ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                          {isPemasukan ? <ArrowUpRight size={11}/> : <ArrowDownRight size={11}/>}
                          {tx.kategori}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-800 text-xs font-medium">{tx.namaPembeli || '-'}</div>
                        {tx.nomorTelepon && (
                          <div className="text-gray-400 text-[10px] flex items-center gap-1 mt-0.5">
                            <FiPhone size={9}/> {tx.nomorTelepon}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3"><ProyekBadge proyek={tx.proyek} /></td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{tx.blokUnit || '-'}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{tx.metodePembayaran || '-'}</td>
                      <td className={`px-4 py-3 font-black text-right whitespace-nowrap ${isPemasukan ? 'text-emerald-600' : 'text-red-500'}`}>
                        {isPemasukan ? '+' : '-'}{formatRp(tx.jumlah)}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={tx.statusBayar} /></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 justify-end">
                          <button onClick={() => openEdit(tx)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><FiEdit2 size={12}/></button>
                          <button onClick={() => setModalHapus(tx.id)} className="p-1.5 bg-red-50 text-red-400 rounded-lg hover:bg-red-100"><FiTrash2 size={12}/></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ═══ MODAL TAMBAH / EDIT ═══ */}
      {isModalAdd && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <h2 className="font-heading font-bold text-gray-900">{editTx ? 'Edit Transaksi' : 'Tambah Transaksi'}</h2>
                <p className="text-xs text-gray-400 mt-0.5">Isi detail transaksi keuangan</p>
              </div>
              <button onClick={() => { setIsModalAdd(false); setEditTx(null); }} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"><FiX /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">

              {/* ── Tipe: Pemasukan / Pengeluaran ── */}
              <div>
                <label className={labelCls}>Tipe Transaksi *</label>
                <div className="grid grid-cols-2 gap-2">
                  {TIPE_TRANSAKSI.map(t => (
                    <button key={t} type="button"
                      onClick={() => { set('tipe', t); set('kategori', t === 'Pemasukan' ? KATEGORI_PEMASUKAN[0] : KATEGORI_PENGELUARAN[0]); }}
                      className={`py-2.5 rounded-xl border-2 font-bold text-sm transition-all
                        ${form.tipe === t
                          ? t === 'Pemasukan' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 bg-gray-50 text-gray-500'}`}>
                      {t === 'Pemasukan' ? '+ ' : '- '}{t}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Kategori + Proyek ── */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Kategori *</label>
                  <select className={inputCls} value={form.kategori} onChange={e => set('kategori', e.target.value)}>
                    {kategoriList.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Proyek</label>
                  <select className={inputCls} value={form.proyek} onChange={e => set('proyek', e.target.value)}>
                    {PROYEK_LIST.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* ── Jumlah ── */}
              <div>
                <label className={labelCls}>Jumlah (Rp) *</label>
                <input className={inputCls} value={form.jumlah}
                  onChange={e => set('jumlah', e.target.value)}
                  required placeholder="350000000" inputMode="numeric" />
                {form.jumlah && (
                  <p className="text-xs text-gray-400 mt-1">{formatRp(form.jumlah)}</p>
                )}
              </div>

              {/* ── Nama Pembeli + No. Telepon ── */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Nama Pembeli / Pihak</label>
                  <input className={inputCls} value={form.namaPembeli}
                    onChange={e => set('namaPembeli', e.target.value)}
                    placeholder="Bapak Hasan" />
                </div>
                <div>
                  <label className={labelCls}>Nomor Telepon</label>
                  <div className="relative">
                    <FiPhone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input className={`${inputCls} pl-8`} value={form.nomorTelepon}
                      onChange={e => set('nomorTelepon', e.target.value)}
                      placeholder="0812-xxxx-xxxx" inputMode="tel" />
                  </div>
                </div>
              </div>

              {/* ── Blok Unit + Status Bayar ── */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Blok / Unit</label>
                  <div className="relative">
                    <FiMapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input className={`${inputCls} pl-8`} value={form.blokUnit}
                      onChange={e => set('blokUnit', e.target.value)}
                      placeholder="A-12" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Status Bayar</label>
                  <select className={inputCls} value={form.statusBayar} onChange={e => set('statusBayar', e.target.value)}>
                    {STATUS_BAYAR.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* ── Metode Pembayaran + Tanggal ── */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Metode Pembayaran</label>
                  <div className="relative">
                    <FiCreditCard size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select className={`${inputCls} pl-8`} value={form.metodePembayaran} onChange={e => set('metodePembayaran', e.target.value)}>
                      {METODE_PEMBAYARAN.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Tanggal</label>
                  <input type="date" className={inputCls} value={form.tanggal} onChange={e => set('tanggal', e.target.value)} />
                </div>
              </div>

              {/* ── Bukti Transfer ── */}
              <div>
                <label className={labelCls}>URL Bukti Transfer (opsional)</label>
                <input className={inputCls} value={form.buktiTransfer}
                  onChange={e => set('buktiTransfer', e.target.value)}
                  placeholder="https://drive.google.com/..." />
                {form.buktiTransfer && (
                  <a href={form.buktiTransfer} target="_blank" rel="noreferrer"
                    className="text-xs text-blue-500 hover:underline mt-1 inline-block">
                    Buka Bukti Transfer ↗
                  </a>
                )}
              </div>

              {/* ── Keterangan ── */}
              <div>
                <label className={labelCls}>Keterangan</label>
                <input className={inputCls} value={form.keterangan}
                  onChange={e => set('keterangan', e.target.value)}
                  placeholder="DP dari Bapak Hasan untuk unit A-12..." />
              </div>

              {/* ── Catatan Admin ── */}
              <div>
                <label className={labelCls}>
                  <div className="flex items-center gap-1.5">
                    <FiFileText size={11} /> Catatan Admin (internal)
                  </div>
                </label>
                <textarea className={`${inputCls} resize-none`} rows={2} value={form.catatan}
                  onChange={e => set('catatan', e.target.value)}
                  placeholder="Catatan internal yang hanya dilihat admin..." />
              </div>

              <div className="pt-4 border-t border-gray-100 flex gap-3">
                <button type="button" onClick={() => { setIsModalAdd(false); setEditTx(null); }}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50">
                  Batal
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                  <FiSave size={15} /> {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ MODAL HAPUS ═══ */}
      {modalHapus && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrash2 className="text-red-500" size={24} />
            </div>
            <h2 className="text-xl font-heading font-bold text-gray-900 mb-2">Hapus Transaksi?</h2>
            <p className="text-gray-500 text-sm mb-6">Transaksi ini akan dihapus permanen.</p>
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