'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { categoriesAPI } from '@/lib/api';
import { Category, getLocalized } from '@/types/api';
import { Locale } from '@/config/api.config';
import { ArrowRight } from 'lucide-react';

export function CategoriesSection() {
  const t = useTranslations('home.categories');
  const locale = useLocale() as Locale;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoriesAPI.getAll()
      .then(data => setCategories(data.slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <h2 className="section-title text-center">{t('title')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title mb-0">{t('title')}</h2>
          <Link
            href="/catalog"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
          >
            {t('viewAll')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const loc = getLocalized(category, locale);
            return (
              <Link
                key={category.id}
                href={`/catalog?category=${category.slug}`}
                className="group relative aspect-square rounded-xl overflow-hidden bg-surface"
              >
                {category.image ? (
                  <img
                    src={category.image}
                    alt={loc?.name || category.slug}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-sm md:text-base">
                    {loc?.name || category.slug}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile View All */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/catalog"
            className="btn-outline inline-flex items-center gap-2"
          >
            {t('viewAll')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}