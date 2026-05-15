import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiUsers, FiMessageSquare, FiFileText, FiBriefcase, FiSettings, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Berhasil keluar dari sistem');
      navigate('/admin/login');
    } catch (error) {
      toast.error('Gagal saat mencoba keluar');
    }
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: <FiGrid size={20} />, label: 'Dashboard Utama' },
    { path: '/admin/leads', icon: <FiUsers size={20} />, label: 'Data Leads' },
    { path: '/admin/messages', icon: <FiMessageSquare size={20} />, label: 'Pesan Masuk' },
    { path: '/admin/applications', icon: <FiBriefcase size={20} />, label: 'Lamaran Kerja' },
    { path: '/admin/articles', icon: <FiFileText size={20} />, label: 'Kelola Artikel' },
    { path: '/admin/settings', icon: <FiSettings size={20} />, label: 'Pengaturan Web' },
  ];

  return (
    <aside className="w-64 bg-[#0A0A0A] text-white min-h-screen fixed left-0 top-0 flex flex-col border-r border-gray-800">
      
      {/* Header Logo Admin */}
      <div className="h-20 flex items-center justify-center border-b border-gray-800 px-6">
        <div className="text-2xl font-heading font-extrabold tracking-widest text-center">
          AFKAR <span className="text-brand-primary">ADMIN</span>
        </div>
      </div>

      {/* Menu Navigasi */}
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-4">Menu Utama</p>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                  isActive 
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30' 
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Sidebar (Tombol Keluar) */}
      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-xl transition-colors font-medium"
        >
          <FiLogOut /> Keluar Sistem
        </button>
      </div>
    </aside>
  );
}