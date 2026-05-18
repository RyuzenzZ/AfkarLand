import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail, FiInstagram, FiFacebook, FiYoutube } from 'react-icons/fi';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export default function Footer() {
  const { settings } = useSiteSettings();
  const { footer, navbar, branding } = settings;

  const logoUrl  = navbar.logoUrl || branding.logoUrl;
  const siteName = branding.siteName || 'AFKAR LAND';
  const navLinks = navbar.links || [];

  const socials = [
    { key: 'instagram', icon: <FiInstagram size={18}/>, label: 'Instagram' },
    { key: 'facebook',  icon: <FiFacebook size={18}/>,  label: 'Facebook'  },
    { key: 'youtube',   icon: <FiYoutube size={18}/>,   label: 'YouTube'   },
  ].filter(s => footer[s.key]);

  return (
    <footer className="bg-[#0A0A0A] text-gray-400 pt-16 pb-8 border-t border-gray-900">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand kolom */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity">
              {logoUrl
                ? <img src={logoUrl} alt={branding.logoAlt || siteName} className="h-8 object-contain"/>
                : <span className="text-3xl font-heading font-extrabold text-white tracking-tight">
                    {siteName.split(' ')[0]} <span className="text-brand-primary">{siteName.split(' ').slice(1).join(' ')}</span>
                  </span>
              }
            </Link>
            <p className="text-sm leading-relaxed mb-6">{footer.description || '100% Syariah, Tanpa Riba, Tanpa Sita.'}</p>
            {socials.length > 0 && (
              <div className="flex gap-3">
                {socials.map(s => (
                  <a key={s.key} href={footer[s.key]} target="_blank" rel="noreferrer"
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-600 hover:border-red-600 text-gray-400 hover:text-white transition-all"
                    aria-label={s.label}>
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Jelajahi */}
          <div>
            <h3 className="text-white font-heading font-semibold text-lg mb-6">Jelajahi</h3>
            <ul className="space-y-3 text-sm">
              {navLinks.map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-brand-primary transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-white font-heading font-semibold text-lg mb-6">Kontak</h3>
            <ul className="space-y-4 text-sm">
              {footer.address && (
                <li className="flex items-start gap-3">
                  <FiMapPin className="text-brand-primary mt-1 shrink-0" size={18}/>
                  <span>{footer.address}</span>
                </li>
              )}
              {footer.phone && (
                <li className="flex items-center gap-3">
                  <FiPhone className="text-brand-primary shrink-0" size={18}/>
                  <a href={`tel:${footer.phone.replace(/\D/g,'')}`} className="hover:text-white transition-colors">{footer.phone}</a>
                </li>
              )}
              {footer.email && (
                <li className="flex items-center gap-3">
                  <FiMail className="text-brand-primary shrink-0" size={18}/>
                  <a href={`mailto:${footer.email}`} className="hover:text-white transition-colors">{footer.email}</a>
                </li>
              )}
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-xs">
          <p>{footer.copyright || `© ${new Date().getFullYear()} AFKAR LAND. All rights reserved.`}</p>
        </div>
      </div>
    </footer>
  );
}