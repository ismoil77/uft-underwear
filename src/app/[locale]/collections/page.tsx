'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { collectionsAPI } from '@/lib/api';
import { Collection, getLocalized } from '@/types/api';

export default function CollectionsPage() {
  const t = useTranslations('collections');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    collectionsAPI.getAll().then(setCollections).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="aspect-[3/4] bg-gray-100 rounded-xl animate-pulse"></div>)}
        </div>
      ) : collections.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6">
          {collections.map((col) => {
            const loc = getLocalized(col, 'ru');
            return (
              <Link key={col.id} href={`/catalog?collection=${col.slug}`} className="group">
                <div className="aspect-[3/4] rounded-xl overflow-hidden mb-4 relative">
                  {col.image ? (
                    <img src={col.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5"></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-xl font-semibold">{loc?.name || col.slug}</h3>
                    {loc?.description && <p className="text-white/80 text-sm mt-1">{loc.description}</p>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-12">Коллекции скоро появятся</p>
      )}
    </div>
  );
}
