import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export const ADMIN_OVERVIEW_MODULES = [
  { key: 'projects', collectionId: 'projects', label: 'Proyek Website', path: '/admin/projects', area: 'content' },
  { key: 'articles', collectionId: 'articles', label: 'Artikel / Blog', path: '/admin/articles', area: 'content' },
  { key: 'services', collectionId: 'services', label: 'Layanan', path: '/admin/services', area: 'content' },
  { key: 'gallery', collectionId: 'gallery', label: 'Galeri Media', path: '/admin/gallery', area: 'content' },
  { key: 'testimonials', collectionId: 'testimonials', label: 'Testimoni', path: '/admin/testimonials', area: 'content' },
  { key: 'leads', collectionId: 'leads', label: 'Leads & CRM', path: '/admin/leads', area: 'portal' },
  { key: 'messages', collectionId: 'messages', label: 'Pesan Kontak', path: '/admin/messages', area: 'portal' },
  { key: 'applications', collectionId: 'applications', label: 'Lamaran HRD', path: '/admin/applications', area: 'portal' },
  { key: 'bookings', collectionId: 'bookings', label: 'Booking Unit', path: '/admin/siteplan', area: 'portal' },
  { key: 'units', collectionId: 'units', label: 'Unit Siteplan', path: '/admin/siteplan', area: 'portal' },
  { key: 'transactions', collectionId: 'transactions', label: 'Laporan Keuangan', path: '/admin/finance', area: 'portal' },
  { key: 'marketingTeam', collectionId: 'marketing_team', label: 'Performa Tim', path: '/admin/performance', area: 'portal' },
];

const initialModuleState = ADMIN_OVERVIEW_MODULES.reduce((acc, module) => ({
  ...acc,
  [module.key]: {
    ...module,
    count: 0,
    unread: 0,
    latestAt: 0,
    latestLabel: '-',
    loading: true,
    error: '',
  },
}), {});

const toMillis = (value) => {
  if (!value) return 0;
  if (typeof value.toMillis === 'function') return value.toMillis();
  if (typeof value.seconds === 'number') return value.seconds * 1000;
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number') return value;
  return 0;
};

const getCreatedAt = (data) => (
  toMillis(data.createdAt) ||
  toMillis(data.updatedAt) ||
  toMillis(data.timestamp) ||
  toMillis(data.date)
);

const getItemTitle = (collectionId, data) => (
  data.title ||
  data.judul ||
  data.nama ||
  data.name ||
  data.namaProject ||
  data.proyek ||
  data.projectName ||
  data.unit ||
  data.blok ||
  data.posisi ||
  data.email ||
  collectionId
);

const formatRelativeTime = (time) => {
  if (!time) return 'Belum ada data';

  const diff = Date.now() - time;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return 'Baru saja';
  if (diff < hour) return `${Math.max(1, Math.floor(diff / minute))} menit lalu`;
  if (diff < day) return `${Math.floor(diff / hour)} jam lalu`;
  if (diff < 7 * day) return `${Math.floor(diff / day)} hari lalu`;

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(time));
};

export function useAdminOverview() {
  const [modules, setModules] = useState(initialModuleState);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const latestByModule = {};
    const unsubscribers = ADMIN_OVERVIEW_MODULES.map((module) => (
      onSnapshot(
        collection(db, module.collectionId),
        (snapshot) => {
          const docs = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              moduleKey: module.key,
              moduleLabel: module.label,
              path: module.path,
              title: getItemTitle(module.collectionId, data),
              createdAt: getCreatedAt(data),
              unread: data.notifHidden !== true && data.notifRead === false,
            };
          });

          const sortedDocs = [...docs].sort((a, b) => b.createdAt - a.createdAt);
          latestByModule[module.key] = sortedDocs.slice(0, 4);

          setModules((prev) => ({
            ...prev,
            [module.key]: {
              ...prev[module.key],
              count: snapshot.size,
              unread: docs.filter((item) => item.unread).length,
              latestAt: sortedDocs[0]?.createdAt || 0,
              latestLabel: sortedDocs[0]?.title || '-',
              loading: false,
              error: '',
            },
          }));

          setActivity(
            Object.values(latestByModule)
              .flat()
              .sort((a, b) => b.createdAt - a.createdAt)
              .slice(0, 8)
          );
        },
        (error) => {
          setModules((prev) => ({
            ...prev,
            [module.key]: {
              ...prev[module.key],
              loading: false,
              error: error.message || 'Gagal memuat data',
            },
          }));
        }
      )
    ));

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, []);

  return useMemo(() => {
    const list = ADMIN_OVERVIEW_MODULES.map((module) => modules[module.key]);
    const contentModules = list.filter((module) => module.area === 'content');
    const portalModules = list.filter((module) => module.area === 'portal');
    const unreadTotal = list.reduce((total, module) => total + module.unread, 0);
    const dataTotal = list.reduce((total, module) => total + module.count, 0);
    const contentTotal = contentModules.reduce((total, module) => total + module.count, 0);
    const portalTotal = portalModules.reduce((total, module) => total + module.count, 0);
    const errorTotal = list.filter((module) => module.error).length;
    const loading = list.some((module) => module.loading);
    const latestAt = Math.max(...list.map((module) => module.latestAt), 0);

    return {
      modules: list,
      contentModules,
      portalModules,
      activity: activity.map((item) => ({
        ...item,
        relativeTime: formatRelativeTime(item.createdAt),
      })),
      summary: {
        dataTotal,
        contentTotal,
        portalTotal,
        unreadTotal,
        errorTotal,
        latestAt,
        latestLabel: formatRelativeTime(latestAt),
      },
      loading,
    };
  }, [activity, modules]);
}
