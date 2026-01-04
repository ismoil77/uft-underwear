'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { aboutCompanyAPI } from '@/lib/api';
import { getLocalized } from '@/types/api';
import { Locale } from '@/config/api.config';
import { Shield, Heart, Star, Users, Award, Sparkles } from 'lucide-react';

export default function AboutPage() {
  const t = useTranslations('about');
  const locale = useLocale() as Locale;
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    aboutCompanyAPI.get()
      .then(setCompany)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Получаем локализованные данные в зависимости от текущего языка
  const getLocalizedCompany = () => {
    if (!company) return null;
    return company[locale] || company.ru || {};
  };

  const localizedData = getLocalizedCompany();

  // Статистика компании с переводами
  const stats = {
    ru: [
      { value: '5+', label: 'Лет на рынке' },
      { value: '10 000+', label: 'Довольных клиентов' },
      { value: '500+', label: 'Моделей в ассортименте' },
      { value: '98%', label: 'Положительных отзывов' },
    ],
    en: [
      { value: '5+', label: 'Years on market' },
      { value: '10,000+', label: 'Happy customers' },
      { value: '500+', label: 'Models available' },
      { value: '98%', label: 'Positive reviews' },
    ],
    uz: [
      { value: '5+', label: 'Yillik tajriba' },
      { value: '10 000+', label: 'Mamnun mijozlar' },
      { value: '500+', label: 'Modellar' },
      { value: '98%', label: 'Ijobiy sharhlar' },
    ],
    tj: [
      { value: '5+', label: 'Сол дар бозор' },
      { value: '10 000+', label: 'Муштариёни қаноатманд' },
      { value: '500+', label: 'Моделҳо' },
      { value: '98%', label: 'Шарҳҳои мусбат' },
    ],
  };

  // Заголовки секций с переводами
  const sectionTitles = {
    mission: {
      ru: 'Наша миссия',
      en: 'Our Mission',
      uz: 'Bizning vazifamiz',
      tj: 'Миссияи мо',
    },
    values: {
      ru: 'Наши ценности',
      en: 'Our Values',
      uz: 'Bizning qadriyatlarimiz',
      tj: 'Арзишҳои мо',
    },
  };

  const currentStats = stats[locale] || stats.ru;

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {localizedData?.title || t('title')}
        </h1>
        
        {loading ? (
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
          </div>
        ) : (
          <p className="text-lg text-text-muted">
            {localizedData?.description || t('description')}
          </p>
        )}
      </div>

      {/* Mission & Values */}
      {!loading && (
        <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
          {localizedData?.mission && (
            <div className="bg-surface p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">
                  {sectionTitles.mission[locale] || sectionTitles.mission.ru}
                </h2>
              </div>
              <p className="text-text-muted">{localizedData.mission}</p>
            </div>
          )}
          
          {localizedData?.values && (
            <div className="bg-surface p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">
                  {sectionTitles.values[locale] || sectionTitles.values.ru}
                </h2>
              </div>
              <p className="text-text-muted">{localizedData.values}</p>
            </div>
          )}
        </div>
      )}

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          {
            icon: Shield,
            title: { ru: 'Гарантия качества', en: 'Quality Guarantee', uz: 'Sifat kafolati', tj: 'Кафолати сифат' },
            desc: { 
              ru: 'Все изделия проходят строгий контроль качества',
              en: 'All products undergo strict quality control',
              uz: 'Barcha mahsulotlar qat\'iy sifat nazoratidan o\'tadi',
              tj: 'Ҳамаи маҳсулотҳо аз назорати сифати қатъӣ мегузаранд'
            },
          },
          {
            icon: Award,
            title: { ru: 'Премиум материалы', en: 'Premium Materials', uz: 'Premium materiallar', tj: 'Маводҳои олӣ' },
            desc: { 
              ru: 'Используем только лучшие ткани и фурнитуру',
              en: 'We use only the best fabrics and accessories',
              uz: 'Faqat eng yaxshi matolar va aksessuarlardan foydalanamiz',
              tj: 'Мо танҳо беҳтарин матоъҳо ва аксессуарҳоро истифода мебарем'
            },
          },
          {
            icon: Sparkles,
            title: { ru: 'Современный дизайн', en: 'Modern Design', uz: 'Zamonaviy dizayn', tj: 'Тарроҳии муосир' },
            desc: { 
              ru: 'Следим за мировыми трендами моды',
              en: 'We follow global fashion trends',
              uz: 'Dunyo moda trendlariga amal qilamiz',
              tj: 'Мо тамоюлҳои ҷаҳонии модаро пайгирӣ мекунем'
            },
          },
        ].map((feature, i) => {
          const Icon = feature.icon;
          return (
            <div key={i} className="text-center p-6 bg-white rounded-xl shadow-card">
              <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">
                {feature.title[locale] || feature.title.ru}
              </h3>
              <p className="text-sm text-text-muted">
                {feature.desc[locale] || feature.desc.ru}
              </p>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {currentStats.map((stat, i) => (
            <div key={i} className="p-4">
              <p className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-sm text-text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}