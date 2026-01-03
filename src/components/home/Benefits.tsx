'use client';

import { useTranslations } from 'next-intl';
import { Truck, Shield, Headphones, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/navigation'

export function Benefits() {
  const t = useTranslations('home.benefits');

  const benefits = [
     {
      icon: Headphones,
      title: t('support'),
      description: t('supportDesc'),
    },
    {
      icon: Truck,
      title: t('delivery'),
      description: t('deliveryDesc'),
    },
    {
      icon: Shield,
      title: t('quality'),
      description: t('qualityDesc'),
    },
   
    {
      icon: Sparkles,
      title:t('premium_quality'),
      description: t('premium_qualityDesc'),
    },
  ];

  return (
    <section className="section bg-surface">
      <div className="container">
        <h2 className="section-title text-center">{t('title')}</h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="text-center p-6"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-light rounded-full flex items-center justify-center">
                <benefit.icon className="w-8 h-8 text-primary" />
              </div>
             {benefit.title === t('support') ? (
  <Link href="/contacts">
    <h3 className="font-semibold text-text mb-2 hover:text-primary transition-colors">
      {benefit.title}
    </h3>
  </Link>
) : (
  <h3 className="font-semibold text-text mb-2">
    {benefit.title}
  </h3>
)}
              <p className="text-sm text-text-muted">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
