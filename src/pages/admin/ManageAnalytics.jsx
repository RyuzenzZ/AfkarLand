// ManageAnalytics.jsx — AFKAR LAND Admin Panel
// Dashboard analitik: statistik leads, pesan, artikel, booking per waktu
// Data dari Firestore — tidak butuh Google Analytics API

import React, { useState, useEffect } from 'react';
import {
  collection, onSnapshot, query, orderBy, where, Timestamp
} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  FiUsers, FiMessageSquare, FiBriefcase, FiFileText,
  FiTrendingUp, FiTrendingDown, FiMinus
} from 'react-icons/fi';
import { CalendarCheck } from 'lucide-react';

// Warna chart konsisten
const COLORS = ['#dc2626','#2563eb','#059669','#d97706','#7c3aed','#db2777'];

const MONTHS_ID = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

// Bantu: format timestamp ke label bulan
const toMonthLabel = (ts) => {
  const d = ts?.toDate ? ts.toDate() : new Date(ts || 0);
  return `${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
};

// Bantu: hitung data per bulan (6 bulan terakhir)
const groupByMonth = (docs, months) => {
  const counts = {};
  months.forEach(m => { counts[m] = 0; });
  docs.forEach(d => {
    const label = toMonthLabel(d.createdAt);
    if (counts[label] !== undefined) counts[label]++;
  });
  return months.map(m => ({ bulan: m, jumlah: counts[m] }));
};

// Bantu: label bulan terakhir berdasarkan periode
const getLastMonths = (count = 6) => {
  const result = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push(`${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`);
  }
  return result;
};

const getStartDate = (period) => {
  const now = new Date();
  if (period === '12bulan') return new Date(now.getFullYear(), now.getMonth() - 11, 1);
  if (period === '30hari') return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
  return new Date(now.getFullYear(), now.getMonth() - 5, 1);
};

const getMonthCount = (period) => (period === '12bulan' ? 12 : 6);

const StatCard = ({ label, value, icon, color, change }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
      {change !== undefined && (
        <span className={`text-xs font-bold flex items-center gap-1
          ${change > 0 ? 'text-emerald-600' : change < 0 ? 'text-red-500' : 'text-gray-400'}`}>
          {change > 0 ? <FiTrendingUp size={13}/> : change < 0 ? <FiTrendingDown size={13}/> : <FiMinus size={13}/>}
          {Math.abs(change)}%
        </span>
      )}
    </div>
    <div className="text-3xl font-black text-gray-900">{value}</div>
    <div className="text-xs text-gray-400 font-medium mt-1">{label}</div>
  </div>
);

const ChartCard = ({ title, children, action }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <div className="flex items-center justify-between mb-5">
      <h3 className="font-heading font-bold text-gray-800 text-sm">{title}</h3>
      {action}
    </div>
    {children}
  </div>
);

export default function ManageAnalytics() {
  const [data, setData]     = useState({ leads: [], messages: [], applications: [], articles: [], bookings: [], web_vitals: [] });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('6bulan');

  const months = getLastMonths(getMonthCount(period));

  useEffect(() => {
    let loaded = 0;
    const total = 6;
    const check = () => { loaded++; if (loaded >= total) setLoading(false); };

    setLoading(true);
    const startDate = Timestamp.fromDate(getStartDate(period));
    const colls = ['leads','messages','applications','articles','bookings','web_vitals'];
    const unsubs = colls.map(col => {
      const q = query(
        collection(db, col),
        where('createdAt', '>=', startDate),
        orderBy('createdAt', 'desc')
      );
      return onSnapshot(q,
        snap => { setData(d => ({ ...d, [col]: snap.docs.map(x => ({ id: x.id, ...x.data() })) })); check(); },
        ()   => check()
      );
    });
    return () => unsubs.forEach(u => u());
  }, [period]);

  // Hitung persentase perubahan bulan ini vs bulan lalu
  const calcChange = (docs) => {
    const now = new Date();
    const thisMonth  = docs.filter(d => { const t = d.createdAt?.toDate?.() || new Date(d.createdAt||0); return t.getMonth() === now.getMonth() && t.getFullYear() === now.getFullYear(); }).length;
    const lastMonth  = docs.filter(d => { const t = d.createdAt?.toDate?.() || new Date(d.createdAt||0); const lm = new Date(now.getFullYear(), now.getMonth()-1,1); return t.getMonth() === lm.getMonth() && t.getFullYear() === lm.getFullYear(); }).length;
    if (lastMonth === 0) return thisMonth > 0 ? 100 : 0;
    return Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
  };

  // Data chart gabungan per bulan
  const combinedChart = months.map(m => ({
    bulan: m,
    Leads:    0,
    Pesan:    0,
    Lamaran:  0,
    Booking:  0,
  }));

  ['leads','messages','applications','bookings'].forEach((col, ci) => {
    const keys = ['Leads','Pesan','Lamaran','Booking'];
    data[col].forEach(d => {
      const label = toMonthLabel(d.createdAt);
      const idx = combinedChart.findIndex(c => c.bulan === label);
      if (idx !== -1) combinedChart[idx][keys[ci]]++;
    });
  });

  // Data pie — distribusi sumber kontak
  const pieData = [
    { name: 'Leads',    value: data.leads.length },
    { name: 'Pesan',    value: data.messages.length },
    { name: 'Lamaran',  value: data.applications.length },
    { name: 'Booking',  value: data.bookings.length },
  ].filter(p => p.value > 0);

  // Artikel per bulan
  const artikelChart = groupByMonth(data.articles, months);

  // Top proyek dari leads
  const proyekCount = {};
  data.leads.forEach(l => { if (l.proyek) proyekCount[l.proyek] = (proyekCount[l.proyek] || 0) + 1; });
  const proyekChart = Object.entries(proyekCount).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 5);

  const latestVitals = ['LCP', 'INP', 'CLS'].map((name) => {
    const latest = data.web_vitals
      .filter(metric => metric.name === name)
      .sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.toMillis?.() || b.createdAt?.seconds || 0;
        return bTime - aTime;
      })[0];
    const suffix = name === 'CLS' ? '' : ' ms';
    return {
      name,
      value: latest ? `${latest.value}${suffix}` : '-',
      rating: latest?.rating || 'waiting',
      pagePath: latest?.pagePath || 'Belum ada data',
    };
  });

  const STAT_CARDS = [
    { label: 'Total Leads',      value: data.leads.length,        icon: <FiUsers size={18}/>,         color: 'bg-blue-50 text-blue-600',    change: calcChange(data.leads) },
    { label: 'Pesan Masuk',      value: data.messages.length,     icon: <FiMessageSquare size={18}/>, color: 'bg-amber-50 text-amber-600',  change: calcChange(data.messages) },
    { label: 'Lamaran Kerja',    value: data.applications.length, icon: <FiBriefcase size={18}/>,     color: 'bg-purple-50 text-purple-600',change: calcChange(data.applications) },
    { label: 'Booking Unit',     value: data.bookings.length,     icon: <CalendarCheck size={18}/>,   color: 'bg-emerald-50 text-emerald-600', change: calcChange(data.bookings) },
    { label: 'Artikel Publik',   value: data.articles.length,     icon: <FiFileText size={18}/>,      color: 'bg-pink-50 text-pink-600',    change: calcChange(data.articles) },
    { label: 'Konversi Lead',    value: `${data.leads.length > 0 ? Math.round((data.bookings.length / data.leads.length) * 100) : 0}%`,
      icon: <FiTrendingUp size={18}/>, color: 'bg-red-50 text-red-600' },
  ];

  if (loading) return (
    <div className="space-y-6">
      <div className="h-10 w-64 bg-gray-100 rounded-xl animate-pulse"/>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array(6).fill(0).map((_,i) => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse"/>)}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1 text-sm">Pantau performa website & aktivitas AFKAR LAND secara menyeluruh.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-600 outline-none transition-colors focus:border-red-300"
          >
            <option value="30hari">30 hari terakhir</option>
            <option value="6bulan">6 bulan terakhir</option>
            <option value="12bulan">12 bulan terakhir</option>
          </select>
          <div className="hidden text-right sm:block">
            <div className="text-xs text-gray-400">Data diperbarui</div>
            <div className="text-xs font-bold text-gray-700">{new Date().toLocaleDateString('id-ID', { day:'2-digit', month:'long', year:'numeric' })}</div>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {STAT_CARDS.map((s, i) => <StatCard key={i} {...s}/>)}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-heading font-bold text-gray-800 text-sm">Core Web Vitals Website</h3>
            <p className="text-xs text-gray-400 mt-1">LCP, INP, dan CLS dikirim dari halaman publik ke koleksi web_vitals.</p>
          </div>
          <span className="text-xs font-bold text-gray-400">{data.web_vitals.length} sampel</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {latestVitals.map(metric => (
            <div key={metric.name} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-gray-500">{metric.name}</span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  metric.rating === 'good'
                    ? 'bg-emerald-100 text-emerald-700'
                    : metric.rating === 'needs-improvement'
                      ? 'bg-amber-100 text-amber-700'
                      : metric.rating === 'poor'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-500'
                }`}>
                  {metric.rating}
                </span>
              </div>
              <div className="text-2xl font-black text-gray-900">{metric.value}</div>
              <div className="mt-1 truncate text-xs text-gray-400">{metric.pagePath}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CHART ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grafik gabungan 6 bulan */}
        <ChartCard title="Aktivitas 6 Bulan Terakhir" action={
          <span className="text-xs text-gray-400">Leads · Pesan · Lamaran · Booking</span>
        }>
          <div className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={combinedChart} barSize={8} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false}/>
                <XAxis dataKey="bulan" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}/>
                <Legend wrapperStyle={{ fontSize: 11 }}/>
                <Bar dataKey="Leads"   fill="#2563eb" radius={[4,4,0,0]}/>
                <Bar dataKey="Pesan"   fill="#d97706" radius={[4,4,0,0]}/>
                <Bar dataKey="Lamaran" fill="#7c3aed" radius={[4,4,0,0]}/>
                <Bar dataKey="Booking" fill="#059669" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Pie distribusi */}
        <ChartCard title="Distribusi Kontak Masuk">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                  dataKey="value" paddingAngle={3}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}/>
                <Legend wrapperStyle={{ fontSize: 11 }}/>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-gray-300 text-sm">Belum ada data</div>
          )}
        </ChartCard>
      </div>

      {/* CHART ROW 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tren artikel */}
        <ChartCard title="Publikasi Artikel per Bulan">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={artikelChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false}/>
              <XAxis dataKey="bulan" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}/>
              <Line type="monotone" dataKey="jumlah" stroke="#dc2626" strokeWidth={2.5}
                dot={{ fill: '#dc2626', r: 4 }} name="Artikel"/>
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Top proyek dari leads */}
        <ChartCard title="Proyek Paling Diminati (dari Leads)">
          {proyekChart.length > 0 ? (
            <div className="space-y-3">
              {proyekChart.map((p, i) => {
                const max = proyekChart[0].value;
                const pct = Math.round((p.value / max) * 100);
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700 truncate">{p.name}</span>
                      <span className="font-bold text-gray-900 shrink-0 ml-2">{p.value} lead</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-300 text-sm">Belum ada data leads dengan proyek</div>
          )}
        </ChartCard>
      </div>

      {/* TABEL RINGKASAN STATUS */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-heading font-bold text-gray-800 text-sm mb-5">Ringkasan Status Lamaran Kerja</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Review','Interview','Diterima','Ditolak'].map((s, i) => {
            const count = data.applications.filter(a => a.status === s).length;
            const colors = ['bg-amber-50 text-amber-600','bg-blue-50 text-blue-600','bg-emerald-50 text-emerald-600','bg-red-50 text-red-500'];
            return (
              <div key={s} className={`${colors[i].split(' ')[0]} rounded-xl p-4`}>
                <div className={`text-2xl font-black ${colors[i].split(' ')[1]}`}>{count}</div>
                <div className="text-xs text-gray-500 mt-1 font-medium">{s}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
