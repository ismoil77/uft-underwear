'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { aboutCompanyAPI, socialMediaAPI, seasonAPI } from '@/lib/api';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Locale } from '@/config/api.config';

export default function AdminSettingsPage() {
  const t = useTranslations('adminSettings');
  const tLang = useTranslations('language');
  const locale = useLocale() as Locale;

  const [tab, setTab] = useState<'company' | 'contact' | 'social' | 'season'>('company');
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
    phone: '',
    email: '',
    address: '',
    schedule: '',
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

  const languages = [
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
    { code: 'tj', label: 'Тоҷикӣ', flag: '🇹🇯' },
  ] as const;

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
      } else if (tab === 'contact' || tab === 'social') {
        // Контакты и соц.сети сохраняются в одну таблицу
        if (social.id) {
          await socialMediaAPI.update(social.id, social);
        } else {
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
      alert(t('buttons.saved'));
    } catch (e) {
      console.error('Save error:', e);
      alert(t('buttons.saveError'));
    } finally {
      setSaving(false);
    }
  };

  const handleSeasonSelect = (selectedSeason: 'winter' | 'spring' | 'summer' | 'autumn') => {
    setSeason({
      ...season,
      winter: selectedSeason === 'winter',
      spring: selectedSeason === 'spring',
      summer: selectedSeason === 'summer',
      autumn: selectedSeason === 'autumn',
    });
  };

  const getCurrentSeason = (): string | null => {
    if (season.winter) return 'winter';
    if (season.spring) return 'spring';
    if (season.summer) return 'summer';
    if (season.autumn) return 'autumn';
    return null;
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
          </Link>
          <h1 className="text-2xl font-bold">{t('headers.settings')}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['company', 'contact', 'social', 'season'] as const).map((id) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                tab === id ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-50'
              }`}
            >
              {t(`tabs.${id}`)}
            </button>
          ))}
        </div>

        {/* Company */}
        {tab === 'company' && (
          <div className="space-y-6">
            {languages.map((lang) => (
              <div key={lang.code} className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>{lang.flag}</span>
                  {t('headers.companyInfo')} ({lang.label})
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder={t('companyFields.title')}
                    value={company[lang.code]?.title || ''}
                    onChange={(e) =>
                      setCompany({
                        ...company,
                        [lang.code]: { ...company[lang.code], title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <textarea
                    placeholder={t('companyFields.description')}
                    value={company[lang.code]?.description || ''}
                    onChange={(e) =>
                      setCompany({
                        ...company,
                        [lang.code]: { ...company[lang.code], description: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                  />
                  <textarea
                    placeholder={t('companyFields.mission')}
                    value={company[lang.code]?.mission || ''}
                    onChange={(e) =>
                      setCompany({
                        ...company,
                        [lang.code]: { ...company[lang.code], mission: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={2}
                  />
                  <textarea
                    placeholder={t('companyFields.values')}
                    value={company[lang.code]?.values || ''}
                    onChange={(e) =>
                      setCompany({
                        ...company,
                        [lang.code]: { ...company[lang.code], values: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact Info */}
        {tab === 'contact' && (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold">{t('tabs.contact')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">📱 Телефон</label>
                <input
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  value={social.phone || ''}
                  onChange={(e) => setSocial({ ...social, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">📧 Email</label>
                <input
                  type="email"
                  placeholder="info@uft.uz"
                  value={social.email || ''}
                  onChange={(e) => setSocial({ ...social, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">📍 Адрес</label>
                <input
                  type="text"
                  placeholder="г. Ургут, ул. Навои, д. 1"
                  value={social.address || ''}
                  onChange={(e) => setSocial({ ...social, address: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">🕐 Расписание работы</label>
                <input
                  type="text"
                  placeholder="Пн-Вс: 10:00-22:00"
                  value={social.schedule || ''}
                  onChange={(e) => setSocial({ ...social, schedule: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Social */}
        {tab === 'social' && (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold">{t('tabs.social')}</h2>
            <div>
              <label className="block text-sm font-medium mb-1">📱 {t('socialFields.telegram')}</label>
              <input
                type="url"
                placeholder="https://t.me/..."
                value={social.telegram || ''}
                onChange={(e) => setSocial({ ...social, telegram: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">💬 {t('socialFields.whatsapp')}</label>
              <input
                type="text"
                placeholder="+998901234567"
                value={social.whatsapp || ''}
                onChange={(e) => setSocial({ ...social, whatsapp: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">📸 {t('socialFields.instagram')}</label>
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
        {tab === 'season' && (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold">{t('tabs.season')}</h2>
            <p className="text-sm text-gray-500">{t('headers.seasonDesc')}</p>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="season"
                  checked={!getCurrentSeason()}
                  onChange={() => setSeason({ ...season, winter: false, spring: false, summer: false, autumn: false })}
                  className="w-5 h-5 text-blue-600"
                />
                <span>🚫 Отключить эффекты</span>
              </label>
              
              {(['winter', 'spring', 'summer', 'autumn'] as const).map((id) => (
                <label
                  key={id}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                    getCurrentSeason() === id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="season"
                    checked={getCurrentSeason() === id}
                    onChange={() => handleSeasonSelect(id)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span>{t(`seasonFields.${id}`)}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {saving ? t('buttons.saving') : t('buttons.save')}
        </button>
      </main>
    </div>
  );
}