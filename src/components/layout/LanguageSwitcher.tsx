'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing, Locale } from '@/i18n/routing';
import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

export function LanguageSwitcher() {
  const t = useTranslations('language');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие при клике вне
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-text-muted hover:text-text transition-colors rounded-md hover:bg-surface"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline uppercase">{locale}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-background border border-border rounded-lg shadow-dropdown overflow-hidden z-50">
          {routing.locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              className={`w-full px-4 py-2.5 text-left text-sm transition-colors
                ${locale === loc 
                  ? 'bg-primary-light text-primary font-medium' 
                  : 'text-text hover:bg-surface'
                }`}
            >
              {t(loc)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
