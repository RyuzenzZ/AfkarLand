import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLock, FiMoon, FiSun } from 'react-icons/fi';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { useThemeMode } from '../../hooks/useThemeMode';
import OptimizedImage from '../ui/OptimizedImage';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navbarTheme, setNavbarTheme] = useState(null);
  const location = useLocation();
  const { theme, toggleTheme } = useThemeMode();
  const activeTheme = navbarTheme || theme;
  const navbarIsLight = activeTheme === 'light';

  const { settings } = useSiteSettings();
  const { navbar, branding } = settings;
  const logoUrl  = navbar.logoUrl || branding.logoUrl;
  const siteName = branding.siteName || 'AFKAR LAND';
  const navLinks = navbar.links || [];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  useEffect(() => { setNavbarTheme(theme); }, [theme]);

  const handleThemeToggle = () => {
    setNavbarTheme((currentTheme) => (currentTheme || theme) === 'dark' ? 'light' : 'dark');
    toggleTheme();
  };

  const renderSiteName = () => {
    const parts = siteName.split(' ');
    if (parts.length < 2) {
      return <span className={navbarIsLight ? 'text-[#991b1b]' : 'text-white'}>{siteName}</span>;
    }
    return (
      <>
        <span className={navbarIsLight ? 'text-[#991b1b]' : 'text-white drop-shadow-[0_0_14px_rgba(255,255,255,0.24)]'}>
          {parts[0]}
        </span>
        <span className={navbarIsLight
          ? 'rounded-md bg-[#991b1b] px-1.5 py-0.5 text-white shadow-[0_10px_24px_rgba(153,27,27,0.18)]'
          : 'rounded-md bg-white px-1.5 py-0.5 text-[#D80D0D] shadow-[0_0_24px_rgba(255,255,255,0.24)]'
        }>
          {parts.slice(1).join(' ')}
        </span>
      </>
    );
  };

  const headerClass = navbarIsLight
    ? `${isScrolled ? 'bg-white/95 py-4 shadow-lg shadow-slate-900/10' : 'bg-white/90 py-5 shadow-sm shadow-slate-900/5'} border-b border-slate-200/80 backdrop-blur-xl`
    : isScrolled
      ? 'bg-[#7f1d1d] shadow-lg shadow-red-950/20 py-4'
      : 'bg-gradient-to-r from-[#7f1d1d] via-[#991b1b] to-[#111111] py-6';

  const navLinkClass = navbarIsLight
    ? 'text-sm font-bold text-slate-700 hover:text-[#991b1b] transition-colors uppercase tracking-wider relative group'
    : 'text-sm font-bold text-white hover:text-red-100 transition-colors uppercase tracking-wider relative group';

  const underlineClass = navbarIsLight ? 'bg-[#991b1b]' : 'bg-white';

  const mobileIconClass = navbarIsLight
    ? 'md:hidden flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/85 text-slate-900 shadow-sm shadow-slate-900/10 transition-all duration-300 hover:border-[#991b1b]/30 hover:bg-red-50 hover:text-[#991b1b]'
    : 'md:hidden flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white shadow-lg shadow-red-950/20 backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/20';

  const mobileMenuClass = navbarIsLight
    ? 'md:hidden bg-white absolute top-full left-0 w-full shadow-2xl border-t border-slate-200 overflow-hidden'
    : 'md:hidden bg-[#7f1d1d] absolute top-full left-0 w-full shadow-2xl border-t border-white/20 overflow-hidden';

  const ThemeToggle = ({ mobile = false }) => (
    <button
      type="button"
      onClick={handleThemeToggle}
      className={
        navbarIsLight
          ? mobile
            ? 'flex items-center justify-center gap-2 mt-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-base py-3 rounded-xl transition-all duration-300'
            : 'flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-800 transition-all duration-300 hover:border-[#991b1b]/30 hover:bg-red-50 hover:text-[#991b1b]'
          : mobile
            ? 'flex items-center justify-center gap-2 mt-3 bg-white/15 hover:bg-white/25 border border-white/30 hover:border-white/70 text-white font-bold text-base py-3 rounded-xl transition-all duration-300'
            : 'flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-sm transition-all duration-300 hover:border-white/70 hover:bg-white/25'
      }
      aria-label={navbarIsLight ? 'Aktifkan tampilan dark' : 'Aktifkan tampilan light'}
      title={navbarIsLight ? 'Dark mode' : 'Light mode'}
    >
      {navbarIsLight ? <FiMoon size={mobile ? 16 : 15} /> : <FiSun size={mobile ? 16 : 15} />}
      {mobile && <span>{navbarIsLight ? 'Dark Mode' : 'Light Mode'}</span>}
    </button>
  );

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${headerClass}`}>
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">

        {/* LOGO */}
        <Link
          to="/"
          className="afkar-nav-brand group flex items-center gap-3 transition-transform duration-300 hover:scale-[1.025] shrink-0"
        >
          <div
            className={`afkar-nav-logo w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-sm shrink-0 ring-1 ring-white/50 transition-transform duration-300 group-hover:scale-105 ${navbarIsLight ? 'afkar-nav-logo-light' : 'afkar-nav-logo-dark'}`}
          >
            <OptimizedImage
              src={logoUrl || '/images/Logomerahafkar.jpeg'}
              alt={branding.logoAlt || siteName}
              loading="eager"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center gap-1.5 text-2xl font-heading font-extrabold leading-none tracking-normal">
            {renderSiteName()}
          </div>
        </Link>

        {/* NAVIGASI DESKTOP */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={navLinkClass}
            >
              {link.label}
              <span className={`absolute -bottom-1 left-0 h-0.5 ${underlineClass} transition-all duration-300 ${
                location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </Link>
          ))}
          <ThemeToggle />
          <Link
            to="/admin/login"
            className={navbarIsLight
              ? 'flex items-center gap-2 bg-[#991b1b] hover:bg-[#7f1d1d] border border-[#991b1b] text-white text-sm font-bold px-4 py-2 rounded-full transition-all duration-300 uppercase tracking-wider shadow-sm shadow-red-900/10'
              : 'flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 hover:border-white/70 text-white text-sm font-bold px-4 py-2 rounded-full transition-all duration-300 uppercase tracking-wider backdrop-blur-sm'
            }
          >
            <FiLock size={14} /><span>Login</span>
          </Link>
        </nav>

        {/* HAMBURGER MOBILE */}
        <button
          type="button"
          className={mobileIconClass}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          <span className="relative block h-5 w-6" aria-hidden="true">
            <span className={`absolute left-0 h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
              isOpen ? 'top-2.5 rotate-45' : 'top-0'
            }`} />
            <span className={`absolute left-0 top-2.5 h-0.5 rounded-full bg-current transition-all duration-300 ${
              isOpen ? 'w-0 opacity-0' : 'w-6 opacity-100'
            }`} />
            <span className={`absolute left-0 h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
              isOpen ? 'top-2.5 -rotate-45' : 'top-5'
            }`} />
          </span>
        </button>
      </div>

      {/* MENU DROPDOWN MOBILE */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={mobileMenuClass}
          >
            <div className="flex flex-col px-6 py-6 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={navbarIsLight
                    ? `font-bold text-lg py-3 border-b border-slate-100 transition-colors ${location.pathname === link.path ? 'text-[#991b1b]' : 'text-slate-800 hover:text-[#991b1b]'}`
                    : `text-white font-bold text-lg py-3 border-b border-white/10 transition-colors ${location.pathname === link.path ? 'text-red-100' : 'hover:text-red-100'}`
                  }
                >
                  {link.label}
                </Link>
              ))}
              <ThemeToggle mobile />
              <Link
                to="/admin/login"
                className={navbarIsLight
                  ? 'flex items-center justify-center gap-2 mt-4 bg-[#991b1b] hover:bg-[#7f1d1d] border border-[#991b1b] text-white font-bold text-base py-3 rounded-xl transition-all duration-300'
                  : 'flex items-center justify-center gap-2 mt-4 bg-white/15 hover:bg-white/25 border border-white/30 hover:border-white/70 text-white font-bold text-base py-3 rounded-xl transition-all duration-300'
                }
              >
                <FiLock size={16} /><span>Login Admin</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
