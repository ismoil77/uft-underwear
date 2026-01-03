'use client';

import { useEffect, useState } from 'react';
import { policyAPI } from '@/lib/api';

export default function PrivacyPage() {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    policyAPI.get().then((data) => {
      if (data?.ru?.content) setContent(data.ru.content);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Политика конфиденциальности</h1>
      {loading ? (
        <div className="space-y-4">
          {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>)}
        </div>
      ) : content ? (
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />
      ) : (
        <div className="prose max-w-none text-text-muted">
          <p>Информация о политике конфиденциальности скоро будет добавлена.</p>
          <p className="mt-4">Мы заботимся о защите ваших персональных данных и гарантируем их конфиденциальность в соответствии с действующим законодательством.</p>
        </div>
      )}
    </div>
  );
}
