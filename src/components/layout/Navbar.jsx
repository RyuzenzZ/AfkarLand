import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiLock, FiMoon, FiSun } from 'react-icons/fi';
import { gsap } from 'gsap';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { useThemeMode } from '../../hooks/useThemeMode';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const brandRef = useRef(null);
  const logoRef = useRef(null);
  const location = useLocation();
  const { isLight, toggleTheme } = useThemeMode();

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

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        brandRef.current,
        { autoAlpha: 0, y: -10, filter: 'blur(8px)' },
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.55, ease: 'power3.out' }
      );

      gsap.to(logoRef.current, {
        boxShadow: '0 0 24px rgba(255,255,255,0.34), 0 0 34px rgba(216,13,13,0.36)',
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, brandRef);

    return () => context.revert();
  }, []);

  const renderSiteName = () => {
    const parts = siteName.split(' ');
    if (parts.length < 2) return <span className="text-white">{siteName}</span>;
    return (
      <>
        <span className="text-white drop-shadow-[0_0_14px_rgba(255,255,255,0.24)]">
          {parts[0]}
        </span>
        <span className="rounded-md bg-white px-1.5 py-0.5 text-[#D80D0D] shadow-[0_0_24px_rgba(255,255,255,0.24)]">
          {parts.slice(1).join(' ')}
        </span>
      </>
    );
  };

  const ThemeToggle = ({ mobile = false }) => (
    <button
      type="button"
      onClick={toggleTheme}
      className={
        mobile
          ? 'flex items-center justify-center gap-2 mt-3 bg-white/15 hover:bg-white/25 border border-white/30 hover:border-white/70 text-white font-bold text-base py-3 rounded-xl transition-all duration-300'
          : 'flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-sm transition-all duration-300 hover:border-white/70 hover:bg-white/25'
      }
      aria-label={isLight ? 'Aktifkan tampilan dark' : 'Aktifkan tampilan light'}
      title={isLight ? 'Dark mode' : 'Light mode'}
    >
      {isLight ? <FiMoon size={mobile ? 16 : 15} /> : <FiSun size={mobile ? 16 : 15} />}
      {mobile && <span>{isLight ? 'Dark Mode' : 'Light Mode'}</span>}
    </button>
  );

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-[#A90000] shadow-lg shadow-red-950/20 py-4'
        : 'bg-gradient-to-r from-[#D80D0D] via-[#C70D0D] to-[#A90000] py-6'
    }`}>
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">

        {/* LOGO */}
        <Link
          ref={brandRef}
          to="/"
          className="group flex items-center gap-3 transition-transform duration-300 hover:scale-[1.025] shrink-0"
        >
          <div
            ref={logoRef}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-sm shrink-0 ring-1 ring-white/50 transition-transform duration-300 group-hover:scale-105"
          >
            <img
              src={logoUrl || '/images/Logomerahafkar.jpeg'}
              alt={branding.logoAlt || siteName}
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
              className="text-sm font-bold text-white hover:text-red-100 transition-colors uppercase tracking-wider relative group"
            >
              {link.label}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${
                location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </Link>
          ))}
          <ThemeToggle />
          <Link
            to="/admin/login"
            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 hover:border-white/70 text-white text-sm font-bold px-4 py-2 rounded-full transition-all duration-300 uppercase tracking-wider backdrop-blur-sm"
          >
            <FiLock size={14} /><span>Login</span>
          </Link>
        </nav>

        {/* HAMBURGER MOBILE */}
        <button
          className="md:hidden text-white hover:text-red-100 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      {/* MENU DROPDOWN MOBILE */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#A90000] absolute top-full left-0 w-full shadow-2xl border-t border-white/20 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-6 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-white font-bold text-lg py-3 border-b border-white/10 transition-colors ${
                    location.pathname === link.path ? 'text-red-100' : 'hover:text-red-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <ThemeToggle mobile />
              <Link
                to="/admin/login"
                className="flex items-center justify-center gap-2 mt-4 bg-white/15 hover:bg-white/25 border border-white/30 hover:border-white/70 text-white font-bold text-base py-3 rounded-xl transition-all duration-300"
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
