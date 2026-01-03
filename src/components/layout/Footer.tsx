'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { siteConfig } from '@/config';
import { socialMediaAPI, aboutCompanyAPI } from '@/lib/api';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

export function Footer() {
  const t = useTranslations();
  const [social, setSocial] = useState<any>(null);

  useEffect(() => {
    socialMediaAPI.get().then(setSocial).catch(() => {});
  }, []);

  return (
    <footer className="bg-secondary text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-heading font-bold text-primary-light">
              {siteConfig.name}
            </Link>
            <p className="mt-4 text-gray-400 text-sm">
              Премиальное нижнее бельё для тех, кто ценит комфорт и элегантность.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">{t('nav.catalog')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {t(item.label.replace('nav.', 'nav.'))}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.contacts')}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href={`tel:${siteConfig.contacts.phone}`} className="hover:text-white">
                  {siteConfig.contacts.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${siteConfig.contacts.email}`} className="hover:text-white">
                  {siteConfig.contacts.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>{siteConfig.contacts.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{siteConfig.contacts.workHours}</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.social')}</h4>
            <div className="flex gap-3">
              {social?.telegram && (
                <a href={social.telegram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#0088cc] rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
                </a>
              )}
              {social?.whatsapp && (
                <a href={`https://wa.me/${social.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
              {social?.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} {siteConfig.name}. {t('footer.rights')}</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">{t('footer.privacy')}</Link>
            <Link href="/terms" className="hover:text-white">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
