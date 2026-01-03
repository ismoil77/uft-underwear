'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { aboutCompanyAPI } from '@/lib/api';
import { Shield, Heart, Star, Users } from 'lucide-react';

export default function AboutPage() {
  const t = useTranslations('about');
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    aboutCompanyAPI.get().then(setCompany).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">{company?.ru?.title || t('title')}</h1>
      
      {loading ? (
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
      ) : (
        <>
          <p className="text-lg text-text-muted mb-8 max-w-3xl">
            {company?.ru?.description || t('description')}
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {company?.ru?.mission && (
              <div className="bg-surface p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Наша миссия</h2>
                </div>
                <p className="text-text-muted">{company.ru.mission}</p>
              </div>
            )}
            {company?.ru?.values && (
              <div className="bg-surface p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Наши ценности</h2>
                </div>
                <p className="text-text-muted">{company.ru.values}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '5+', label: 'Лет на рынке' },
              { value: '10 000+', label: 'Довольных клиентов' },
              { value: '500+', label: 'Моделей в ассортименте' },
              { value: '98%', label: 'Положительных отзывов' },
            ].map((stat, i) => (
              <div key={i} className="p-4">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
