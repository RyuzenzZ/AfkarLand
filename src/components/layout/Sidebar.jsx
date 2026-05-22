import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiBell,
  FiExternalLink,
  FiFileText,
  FiGrid,
  FiHome,
  FiImage,
  FiLogOut,
  FiSearch,
  FiSettings,
  FiStar,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import { MdApartment } from 'react-icons/md';
import { BarChart2, Wrench } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TEAM_PORTAL_URL = import.meta.env.VITE_TEAM_PORTAL_URL || 'https://portal.afkarland.com';

const sidebarVariants = {
  hidden: { opacity: 0, x: -14 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.32, ease: 'easeOut', staggerChildren: 0.045 },
  },
};

const groupVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.26, ease: 'easeOut' } },
};

const itemMotion = {
  rest: { x: 0, scale: 1 },
  hover: { x: 4, scale: 1.01, transition: { duration: 0.18, ease: 'easeOut' } },
  tap: { scale: 0.985 },
};

const MENU_GROUPS = [
  {
    group: 'Admin Web Utama',
    items: [
      { label: 'Pusat Monitoring', path: '/admin/dashboard', icon: <FiGrid size={16} /> },
      { label: 'Notifikasi', path: '/admin/notifications', icon: <FiBell size={16} /> },
    ],
  },
  {
    group: 'Konten & SEO Website',
    items: [
      { label: 'Homepage', path: '/admin/homepage', icon: <FiHome size={16} /> },
      { label: 'Proyek Website', path: '/admin/projects', icon: <MdApartment size={16} /> },
      { label: 'Layanan', path: '/admin/services', icon: <Wrench size={16} /> },
      { label: 'Artikel / Blog', path: '/admin/articles', icon: <FiFileText size={16} /> },
      { label: 'Galeri Media', path: '/admin/gallery', icon: <FiImage size={16} /> },
      { label: 'Testimoni', path: '/admin/testimonials', icon: <FiStar size={16} /> },
      { label: 'SEO Manager', path: '/admin/seo', icon: <FiSearch size={16} /> },
      { label: 'Analytics Website', path: '/admin/analytics', icon: <BarChart2 size={16} /> },
    ],
  },
  {
    group: 'Sistem Website',
    items: [
      { label: 'Pengaturan Web', path: '/admin/settings', icon: <FiSettings size={16} /> },
    ],
  },
  {
    group: 'Portal Tim',
    items: [
      {
        label: 'Portal Tim Afkar Land',
        path: TEAM_PORTAL_URL,
        icon: <FiUsers size={16} />,
        badge: 'Subdomain',
        external: true,
      },
    ],
  },
];

const MenuItem = ({ item, isActive }) => {
  const className = `
    group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200
    ${isActive
      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
    }
  `;

  const content = (
    <>
      {isActive && (
        <motion.span
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-white/90"
        />
      )}
      <span className={`relative z-10 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-red-600'}`}>
        {item.icon}
      </span>
      <span className="relative z-10 truncate">{item.label}</span>
      {item.external && <FiExternalLink size={13} className="relative z-10 ml-auto text-gray-400" />}
      {item.badge && (
        <span className={`relative z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-full
          ${isActive ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'}`}>
          {item.badge}
        </span>
      )}
    </>
  );

  if (item.external) {
    return (
      <motion.div initial="rest" whileHover="hover" whileTap="tap" variants={itemMotion}>
        <a href={item.path} target="_blank" rel="noreferrer" className={className}>
          {content}
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div initial="rest" whileHover="hover" whileTap="tap" variants={itemMotion}>
      <Link to={item.path} className={className}>
        {content}
      </Link>
    </motion.div>
  );
};

export default function Sidebar({ onClose }) {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Auth context handles failed sign-out state.
    }
  };

  return (
    <motion.aside
      className="flex h-full w-64 flex-col border-r border-gray-100 bg-white"
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={groupVariants} className="flex shrink-0 items-center gap-3 border-b border-gray-100 px-5 py-5">
        <motion.div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-600/20"
          whileHover={{ rotate: -3, scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          <MdApartment size={20} className="text-white" />
        </motion.div>
        <div>
          <div className="font-heading text-base font-extrabold leading-none text-gray-900">
            AFKAR <span className="text-red-600">LAND</span>
          </div>
          <div className="mt-0.5 text-[10px] font-medium text-gray-400">Admin Panel</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 lg:hidden"
            aria-label="Tutup menu admin"
          >
            <FiX size={18} />
          </button>
        )}
      </motion.div>

      <motion.nav variants={sidebarVariants} className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {MENU_GROUPS.map((group) => (
          <motion.div key={group.group} variants={groupVariants}>
            <p className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-widest text-gray-300">
              {group.group}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <MenuItem
                  key={item.path}
                  item={item}
                  isActive={!item.external && isActive(item.path)}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </motion.nav>

      <motion.div variants={groupVariants} className="shrink-0 border-t border-gray-100 px-3 py-4">
        <motion.button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.985 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          <FiLogOut size={16} />
          <span>Keluar</span>
        </motion.button>
      </motion.div>
    </motion.aside>
  );
}
