'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';

// Категории нижнего белья
const categories = [
  { id: '1', name: 'Бюстгальтеры', slug: 'bras', icon: '👙', count: 86 },
  { id: '2', name: 'Трусы', slug: 'panties', icon: '🩲', count: 124 },
  { id: '3', name: 'Комплекты', slug: 'sets', icon: '💝', count: 45 },
  { id: '4', name: 'Корсеты', slug: 'corsets', icon: '🎀', count: 28 },
  { id: '5', name: 'Пижамы', slug: 'pajamas', icon: '🌙', count: 52 },
  { id: '6', name: 'Халаты', slug: 'robes', icon: '👘', count: 31 },
];

export function Categories() {
  const t = useTranslations('home.categories');

  return (
    <section className="section bg-surface">
      <div className="container">
        {/* Header */}
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

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/catalog?category=${category.slug}`}
              className="card p-6 text-center group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <h3 className="font-medium text-text mb-1">{category.name}</h3>
              <p className="text-sm text-text-muted">{category.count} изделий</p>
            </Link>
          ))}
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
