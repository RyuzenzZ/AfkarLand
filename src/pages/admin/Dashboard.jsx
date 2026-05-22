import { Link } from 'react-router-dom';
import {
  FiActivity,
  FiAlertCircle,
  FiArrowRight,
  FiBell,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiExternalLink,
  FiFileText,
  FiGlobe,
  FiHome,
  FiImage,
  FiLayers,
  FiMessageSquare,
  FiSearch,
  FiSettings,
  FiShield,
  FiStar,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi';
import { MdApartment } from 'react-icons/md';
import { useAdminOverview } from '../../hooks/useAdminOverview';
import { useSiteSettings } from '../../hooks/useSiteSettings';

const TEAM_PORTAL_URL = import.meta.env.VITE_TEAM_PORTAL_URL || 'https://portal.afkarland.com';

const moduleIcons = {
  projects: <MdApartment size={18} />,
  articles: <FiFileText size={18} />,
  services: <FiShield size={18} />,
  gallery: <FiImage size={18} />,
  testimonials: <FiStar size={18} />,
  leads: <FiUsers size={18} />,
  messages: <FiMessageSquare size={18} />,
  applications: <FiBriefcase size={18} />,
  bookings: <FiHome size={18} />,
  units: <FiLayers size={18} />,
  transactions: <FiTrendingUp size={18} />,
  marketingTeam: <FiActivity size={18} />,
};

const manageSections = [
  {
    title: 'Manage Website Publik',
    desc: 'Konten yang tampil langsung di website utama.',
    items: [
      { label: 'Homepage', path: '/admin/homepage', icon: <FiHome size={18} />, desc: 'Hero, CTA, statistik, konten beranda' },
      { label: 'Proyek Website', path: '/admin/projects', icon: <MdApartment size={18} />, moduleKey: 'projects', desc: 'Listing proyek publik' },
      { label: 'Layanan', path: '/admin/services', icon: <FiShield size={18} />, moduleKey: 'services', desc: 'Layanan perusahaan' },
      { label: 'Artikel / Blog', path: '/admin/articles', icon: <FiFileText size={18} />, moduleKey: 'articles', desc: 'Publikasi dan edukasi' },
      { label: 'Galeri Media', path: '/admin/gallery', icon: <FiImage size={18} />, moduleKey: 'gallery', desc: 'Foto dan media publik' },
      { label: 'Testimoni', path: '/admin/testimonials', icon: <FiStar size={18} />, moduleKey: 'testimonials', desc: 'Bukti sosial website' },
    ],
  },
  {
    title: 'Manage SEO, Analytics, Sistem',
    desc: 'Optimasi website utama, tracking, dan konfigurasi publik.',
    items: [
      { label: 'SEO Manager', path: '/admin/seo', icon: <FiSearch size={18} />, desc: 'Meta tag, canonical, Search Console' },
      { label: 'Analytics Website', path: '/admin/analytics', icon: <FiActivity size={18} />, desc: 'Pantauan performa website' },
      { label: 'Notifikasi', path: '/admin/notifications', icon: <FiBell size={18} />, desc: 'Inbox notifikasi form publik' },
      { label: 'Pengaturan Web', path: '/admin/settings', icon: <FiSettings size={18} />, desc: 'Branding, kontak, maintenance' },
    ],
  },
  {
    title: 'Manage Transisi Portal Tim',
    desc: 'Modul internal yang nanti dipindahkan ke subdomain portal.',
    items: [
      { label: 'Leads & CRM', path: '/admin/leads', icon: <FiUsers size={18} />, moduleKey: 'leads', desc: 'Pipeline prospek marketing' },
      { label: 'Pesan Kontak', path: '/admin/messages', icon: <FiMessageSquare size={18} />, moduleKey: 'messages', desc: 'Pesan operasional dari publik' },
      { label: 'Lamaran HRD', path: '/admin/applications', icon: <FiBriefcase size={18} />, moduleKey: 'applications', desc: 'Kandidat dan rekrutmen' },
      { label: 'Siteplan Proyek', path: '/admin/siteplan', icon: <FiLayers size={18} />, moduleKey: 'units', desc: 'Unit, booking, kavling' },
      { label: 'Laporan Keuangan', path: '/admin/finance', icon: <FiTrendingUp size={18} />, moduleKey: 'transactions', desc: 'Transaksi dan laporan internal' },
      { label: 'Performa Tim', path: '/admin/performance', icon: <FiActivity size={18} />, moduleKey: 'marketingTeam', desc: 'KPI dan performa divisi' },
    ],
  },
];

const SummaryCard = ({ icon, label, value, desc, tone = 'red', loading }) => {
  const tones = {
    red: 'bg-red-50 text-red-600 border-red-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    gray: 'bg-gray-50 text-gray-600 border-gray-100',
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${tones[tone]}`}>
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Live</span>
      </div>
      <div className="text-3xl font-black text-gray-950">
        {loading ? <span className="block h-8 w-14 animate-pulse rounded-lg bg-gray-100" /> : value}
      </div>
      <div className="mt-1 text-sm font-bold text-gray-700">{label}</div>
      <div className="mt-1 text-xs leading-relaxed text-gray-400">{desc}</div>
    </div>
  );
};

const ManageCard = ({ item, module }) => (
  <Link
    to={item.path}
    className="group flex min-h-[112px] flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-red-100 hover:shadow-md"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
        {item.icon}
      </div>
      <FiArrowRight size={15} className="mt-2 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-red-500" />
    </div>
    <div>
      <div className="mt-4 flex items-center gap-2">
        <h4 className="text-sm font-black text-gray-900">{item.label}</h4>
        {module && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-black text-gray-500">
            {module.count}
          </span>
        )}
      </div>
      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-400">{item.desc}</p>
      {module?.unread > 0 && (
        <p className="mt-2 text-[11px] font-bold text-red-600">{module.unread} perlu ditinjau</p>
      )}
    </div>
  </Link>
);

const StatusPill = ({ active, label }) => (
  <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
    {active ? (
      <FiCheckCircle size={14} className="text-emerald-600" />
    ) : (
      <FiAlertCircle size={14} className="text-amber-600" />
    )}
    <span className="text-xs font-semibold text-gray-600">{label}</span>
  </div>
);

export default function Dashboard() {
  const { modules, activity, summary, loading } = useAdminOverview();
  const { settings, loading: settingsLoading } = useSiteSettings();
  const modulesByKey = modules.reduce((acc, module) => ({ ...acc, [module.key]: module }), {});

  const siteStatus = [
    { label: 'Branding website', active: Boolean(settings?.branding?.siteName) },
    { label: 'Hero homepage', active: Boolean(settings?.hero?.judul || settings?.pages?.home?.heroImage) },
    { label: 'Kontak publik', active: Boolean(settings?.contact?.whatsapp || settings?.contact?.phone || settings?.contact?.email) },
    { label: 'SEO dasar', active: Boolean(settings?.seo?.siteTitle || settings?.seo?.defaultTitle || settings?.branding?.siteName) },
  ];

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[1.75rem] border border-red-100 bg-white shadow-sm">
        <div className="relative p-6 md:p-8">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-red-600/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.28em] text-red-600">Pusat Monitoring Admin</p>
              <h1 className="text-3xl font-black tracking-tight text-gray-950 md:text-4xl">
                Dashboard kendali seluruh website AFKAR LAND
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                Pantau data publik, aktivitas masuk, SEO, pengaturan, dan seluruh halaman manage dari satu pusat kontrol.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/admin/notifications"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-black text-gray-700 transition-all hover:border-red-200 hover:text-red-600"
              >
                <FiBell size={16} /> Notifikasi
              </Link>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-700"
              >
                Lihat Website <FiExternalLink size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={<FiGlobe size={20} />}
          label="Data Website Publik"
          value={summary.contentTotal}
          desc="Proyek, artikel, layanan, galeri, dan testimoni."
          loading={loading}
        />
        <SummaryCard
          icon={<FiUsers size={20} />}
          label="Data Portal Transisi"
          value={summary.portalTotal}
          desc="Lead, pesan, HRD, siteplan, finance, dan performa."
          tone="gray"
          loading={loading}
        />
        <SummaryCard
          icon={<FiBell size={20} />}
          label="Perlu Ditindaklanjuti"
          value={summary.unreadTotal}
          desc="Item masuk yang belum ditandai selesai atau terbaca."
          tone={summary.unreadTotal > 0 ? 'amber' : 'emerald'}
          loading={loading}
        />
        <SummaryCard
          icon={<FiShield size={20} />}
          label="Status Integrasi"
          value={summary.errorTotal > 0 ? `${summary.errorTotal} Error` : 'Sehat'}
          desc={`Update terakhir: ${summary.latestLabel}.`}
          tone={summary.errorTotal > 0 ? 'amber' : 'emerald'}
          loading={loading}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-gray-950">Peta Semua Manage</h2>
              <p className="mt-1 text-sm text-gray-400">Akses cepat semua modul admin tanpa membuka sidebar satu per satu.</p>
            </div>
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600">
              {summary.dataTotal} data
            </span>
          </div>

          <div className="space-y-7">
            {manageSections.map((section) => (
              <div key={section.title}>
                <div className="mb-3">
                  <h3 className="text-sm font-black text-gray-900">{section.title}</h3>
                  <p className="text-xs text-gray-400">{section.desc}</p>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
                  {section.items.map((item) => (
                    <ManageCard
                      key={item.path + item.label}
                      item={item}
                      module={item.moduleKey ? modulesByKey[item.moduleKey] : null}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-gray-950">Aktivitas Terbaru</h2>
                <p className="text-sm text-gray-400">Update real-time dari koleksi utama.</p>
              </div>
              <FiClock className="text-gray-300" size={19} />
            </div>
            <div className="space-y-3">
              {activity.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-200 p-5 text-center text-sm text-gray-400">
                  Belum ada aktivitas terbaru.
                </div>
              )}
              {activity.map((item) => (
                <Link
                  key={`${item.moduleKey}-${item.id}`}
                  to={item.path}
                  className="group flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3 transition-all hover:border-red-100 hover:bg-white"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
                    {moduleIcons[item.moduleKey] || <FiActivity size={18} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-black text-gray-800">{item.title}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] font-semibold text-gray-400">
                      <span>{item.moduleLabel}</span>
                      <span className="h-1 w-1 rounded-full bg-gray-300" />
                      <span>{item.relativeTime}</span>
                    </div>
                  </div>
                  {item.unread && <span className="mt-1 h-2 w-2 rounded-full bg-red-500" />}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-black text-gray-950">Status Website Utama</h2>
              <p className="text-sm text-gray-400">Ringkasan kesiapan konfigurasi publik.</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {siteStatus.map((item) => (
                <StatusPill key={item.label} active={!settingsLoading && item.active} label={item.label} />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-red-100 bg-red-600 p-5 text-white shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/65">Subdomain Tim</p>
            <h2 className="mt-2 text-xl font-black">Portal Tim Afkar Land</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              Modul internal seperti CRM, HRD, siteplan, finance, dan performa tim disiapkan untuk dipindahkan ke portal khusus karyawan.
            </p>
            <a
              href={TEAM_PORTAL_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-red-600 transition-all hover:bg-red-50"
            >
              Buka Portal Tim <FiExternalLink size={15} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
