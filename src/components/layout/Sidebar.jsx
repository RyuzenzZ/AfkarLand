// Sidebar.jsx — AFKAR LAND Admin Panel
// Navigasi lengkap dengan semua modul company profile

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiGrid, FiUsers, FiMessageSquare, FiFileText,
  FiBriefcase, FiSettings, FiLogOut, FiChevronDown,
  FiChevronRight, FiImage, FiStar, FiSearch,
  FiLayers, FiMonitor, FiInfo, FiHome
} from 'react-icons/fi';
import { MdApartment } from 'react-icons/md';
import { CalendarCheck, BarChart2, Wrench } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Struktur menu lengkap admin company profile
const MENU_GROUPS = [
  {
    group: 'Overview',
    items: [
      { label: 'Dashboard',       path: '/admin/dashboard',    icon: <FiGrid size={16}/> },
    ]
  },
  {
    group: 'Konten Website',
    items: [
      { label: 'Homepage',        path: '/admin/homepage',     icon: <FiHome size={16}/> },
      { label: 'Proyek',          path: '/admin/projects',     icon: <MdApartment size={16}/> },
      { label: 'Unit Properti',   path: '/admin/units',        icon: <FiLayers size={16}/> },
      { label: 'Layanan',         path: '/admin/services',     icon: <Wrench size={16}/> },
      { label: 'Artikel / Blog',  path: '/admin/articles',     icon: <FiFileText size={16}/> },
      { label: 'Galeri Media',    path: '/admin/gallery',      icon: <FiImage size={16}/> },
      { label: 'Testimoni',       path: '/admin/testimonials', icon: <FiStar size={16}/> },
    ]
  },
  {
    group: 'CRM & Leads',
    items: [
      { label: 'Leads Masuk',     path: '/admin/leads',        icon: <FiUsers size={16}/> },
      { label: 'Pesan Kontak',    path: '/admin/messages',     icon: <FiMessageSquare size={16}/> },
      { label: 'Lamaran Kerja',   path: '/admin/applications', icon: <FiBriefcase size={16}/> },
      { label: 'Booking Unit',    path: '/admin/bookings',     icon: <CalendarCheck size={16}/> },
    ]
  },
  {
    group: 'Optimasi & Analitik',
    items: [
      { label: 'SEO Manager',     path: '/admin/seo',          icon: <FiSearch size={16}/> },
      { label: 'Analytics',       path: '/admin/analytics',    icon: <BarChart2 size={16}/> },
    ]
  },
  {
    group: 'Sistem',
    items: [
      { label: 'Pengaturan Web',  path: '/admin/settings',     icon: <FiSettings size={16}/> },
    ]
  },
];

const MenuItem = ({ item, isActive, depth = 0 }) => (
  <Link
    to={item.path}
    className={`
      flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
      ${isActive
        ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
      }
    `}
    style={{ paddingLeft: depth > 0 ? `${12 + depth * 16}px` : undefined }}
  >
    <span className={isActive ? 'text-white' : 'text-gray-400'}>{item.icon}</span>
    <span className="truncate">{item.label}</span>
    {item.badge && (
      <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'}`}>
        {item.badge}
      </span>
    )}
  </Link>
);

export default function Sidebar({ onClose }) {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = async () => {
    try { await logout(); } catch {}
  };

  return (
    <aside className="flex flex-col h-full bg-white border-r border-gray-100 w-64">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shrink-0">
          <MdApartment size={20} className="text-white"/>
        </div>
        <div>
          <div className="font-heading font-extrabold text-gray-900 text-base leading-none">AFKAR LAND</div>
          <div className="text-[10px] text-gray-400 font-medium mt-0.5">Admin Panel</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-auto p-1 text-gray-400 hover:text-gray-700 lg:hidden">
            ✕
          </button>
        )}
      </div>

      {/* Menu Groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {MENU_GROUPS.map((group) => (
          <div key={group.group}>
            <p className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest px-3 mb-2">
              {group.group}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <MenuItem key={item.path} item={item} isActive={isActive(item.path)} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100 shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <FiLogOut size={16}/>
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}