'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { aboutCompanyAPI, socialMediaAPI, seasonAPI } from '@/lib/api';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AdminSettingsPage() {
  const t = useTranslations('adminSettings');

  const [tab, setTab] = useState<'company' | 'social' | 'season'>('company');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [company, setCompany] = useState<any>({
    id: null,
    ru: { title: '', description: '', mission: '', values: '' },
    en: { title: '', description: '', mission: '', values: '' },
    tj: { title: '', description: '', mission: '', values: '' },
    uz: { title: '', description: '', mission: '', values: '' }
  });
  const [social, setSocial] = useState<any>({
    id: null,
    telegram: '',
    whatsapp: '',
    instagram: ''
  });
  const [season, setSeason] = useState<any>({
    id: null,
    winter: false,
    spring: false,
    summer: false,
    autumn: false
  });

  useEffect(() => {
    Promise.all([aboutCompanyAPI.get(), socialMediaAPI.get(), seasonAPI.get()])
      .then(([c, s, se]) => {
        if (c) setCompany(c);
        if (s) setSocial(s);
        if (se) setSeason(se);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (tab === 'company') {
        if (company.id) await aboutCompanyAPI.update(company.id, company);
        else {
          const res = await aboutCompanyAPI.create(company);
          setCompany(res);
        }
      } else if (tab === 'social') {
        if (social.id) await socialMediaAPI.update(social.id, social);
        else {
          const res = await socialMediaAPI.create(social);
          setSocial(res);
        }
      } else if (tab === 'season') {
        if (season.id) await seasonAPI.update(season.id, season);
        else {
          const res = await seasonAPI.create(season);
          setSeason(res);
        }
      }
      alert(t('buttons.save') + '!');
    } catch (e) {
      alert(t('buttons.saveError'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">{t('alerts.loading')}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin" className="text-gray-500 hover:text-gray-700">
            <ChevronLeft className="w-5 h-5" />
            <span className="ml-1">{t('buttons.back')}</span>
          </Link>
          <h1 className="text-2xl font-bold">{t('headers.settings')}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['company', 'social', 'season'] as const).map((id) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-4 py-2 rounded-lg font-medium ${
                tab === id ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-50'
              }`}
            >
              {t(`tabs.${id}`)}
            </button>
          ))}
        </div>

        {/* Company */}
        {tab === 'company' && (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold">{t('headers.companyInfo')}</h2>
            <input
              type="text"
              placeholder={t('companyFields.title')}
              value={company.uz?.title || ''}
              onChange={(e) =>
                setCompany({ ...company, uz: { ...company.uz, title: e.target.value } })
              }
              className="w-full px-3 py-2 border rounded-lg"
            />
            <textarea
              placeholder={t('companyFields.description')}
              value={company.uz?.description || ''}
              onChange={(e) =>
                setCompany({ ...company, uz: { ...company.uz, description: e.target.value } })
              }
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
            />
            <textarea
              placeholder={t('companyFields.mission')}
              value={company.uz?.mission || ''}
              onChange={(e) =>
                setCompany({ ...company, uz: { ...company.uz, mission: e.target.value } })
              }
              className="w-full px-3 py-2 border rounded-lg"
              rows={2}
            />
            <textarea
              placeholder={t('companyFields.values')}
              value={company.uz?.values || ''}
              onChange={(e) =>
                setCompany({ ...company, uz: { ...company.uz, values: e.target.value } })
              }
              className="w-full px-3 py-2 border rounded-lg"
              rows={2}
            />
          </div>
        )}

        {/* Social */}
        {tab === 'social' && (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold">{t('tabs.social')}</h2>
            <div>
              <label className="block text-sm font-medium mb-1">{t('socialFields.telegram')}</label>
              <input
                type="url"
                placeholder="https://t.me/..."
                value={social.telegram || ''}
                onChange={(e) => setSocial({ ...social, telegram: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('socialFields.whatsapp')}</label>
              <input
                type="text"
                placeholder="+79991234567"
                value={social.whatsapp || ''}
                onChange={(e) => setSocial({ ...social, whatsapp: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('socialFields.instagram')}</label>
              <input
                type="url"
                placeholder="https://instagram.com/..."
                value={social.instagram || ''}
                onChange={(e) => setSocial({ ...social, instagram: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Season */}
       {/* Season */}
{tab === 'season' && (
  <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
    <h2 className="text-lg font-semibold">{t('tabs.season')}</h2>
    <p className="text-sm text-gray-500">{t('headers.seasonDesc')}</p>
    {(['winter', 'spring', 'summer', 'autumn'] as const).map((id) => (
      <label
        key={id}
        className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
      >
        <input
          type="checkbox"
          checked={season[id] || false}
          onChange={(e) => setSeason({ ...season, [id]: e.target.checked })}
          className="w-5 h-5"
        />
        <span>{t(`seasonFields.${id}`)}</span>
      </label>
    ))}
  </div>
)}


        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {t('buttons.save')}
        </button>
      </main>
    </div>
  );
}