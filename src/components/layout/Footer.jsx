import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiMail, FiMapPin, FiPhone, FiYoutube } from 'react-icons/fi';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export default function Footer() {
  const { settings } = useSiteSettings();
  const { footer, navbar, branding } = settings;

  const logoUrl = navbar.logoUrl || branding.logoUrl;
  const siteName = branding.siteName || 'AFKAR LAND';
  const navLinks = navbar.links || [];

  const socials = [
    { key: 'instagram', icon: <FiInstagram size={18} />, label: 'Instagram' },
    { key: 'facebook', icon: <FiFacebook size={18} />, label: 'Facebook' },
    { key: 'youtube', icon: <FiYoutube size={18} />, label: 'YouTube' },
  ].filter((social) => footer[social.key]);

  return (
    <footer className="public-footer bg-[#090909] text-gray-400 pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity">
              {logoUrl ? (
                <img src={logoUrl} alt={branding.logoAlt || siteName} className="h-8 object-contain" />
              ) : (
                <span className="text-3xl font-heading font-extrabold text-white tracking-tight">
                  {siteName.split(' ')[0]}{' '}
                  <span className="text-[#991b1b]">{siteName.split(' ').slice(1).join(' ')}</span>
                </span>
              )}
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              {footer.description || '100% Syariah, Tanpa Riba, Tanpa Sita.'}
            </p>
            {socials.length > 0 && (
              <div className="flex gap-3">
                {socials.map((social) => (
                  <a
                    key={social.key}
                    href={footer[social.key]}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#991b1b] hover:border-white/30 text-gray-400 hover:text-white transition-all"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-white font-heading font-semibold text-lg mb-6">Jelajahi</h3>
            <ul className="space-y-3 text-sm">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-heading font-semibold text-lg mb-6">Kontak</h3>
            <ul className="space-y-4 text-sm">
              {footer.address && (
                <li className="flex items-start gap-3">
                  <FiMapPin className="text-[#991b1b] mt-1 shrink-0" size={18} />
                  <span>{footer.address}</span>
                </li>
              )}
              {footer.phone && (
                <li className="flex items-center gap-3">
                  <FiPhone className="text-[#991b1b] shrink-0" size={18} />
                  <a href={`tel:${footer.phone.replace(/\D/g, '')}`} className="hover:text-white transition-colors">
                    {footer.phone}
                  </a>
                </li>
              )}
              {footer.email && (
                <li className="flex items-center gap-3">
                  <FiMail className="text-[#991b1b] shrink-0" size={18} />
                  <a href={`mailto:${footer.email}`} className="hover:text-white transition-colors">
                    {footer.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-xs">
          <p>{footer.copyright || `Copyright ${new Date().getFullYear()} AFKAR LAND. All rights reserved.`}</p>
        </div>
      </div>
    </footer>
  );
}
