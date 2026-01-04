'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  const t = useTranslations('home.hero');

  return (
    <section className="relative min-h-[70vh] flex items-center bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-secondary mb-6 leading-tight">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-text-muted mb-8 leading-relaxed">
            {t('subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/catalog"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              {t('cta')}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/collections"
              className="btn-outline inline-flex items-center justify-center"
            >
              {t('collections')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}