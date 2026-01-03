'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { teamAPI } from '@/lib/api';
import { TeamMember } from '@/types/api';

export default function TeamPage() {
  const t = useTranslations('team');
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teamAPI.getAll().then(setTeam).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
      {loading ? (
        <div className="grid md:grid-cols-3 gap-8">
          {[1,2,3].map(i => <div key={i} className="animate-pulse"><div className="w-40 h-40 mx-auto bg-gray-200 rounded-full mb-4"></div><div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-2"></div><div className="h-3 bg-gray-200 rounded w-24 mx-auto"></div></div>)}
        </div>
      ) : team.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div key={member.id} className="text-center group">
              <div className="w-40 h-40 mx-auto rounded-full overflow-hidden mb-4 ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-4xl">👤</div>
                )}
              </div>
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-primary">{member.role}</p>
              {member.description && <p className="text-text-muted text-sm mt-2">{member.description}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-12">Информация о команде скоро появится</p>
      )}
    </div>
  );
}
