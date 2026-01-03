'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { categoriesAPI } from '@/lib/api';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = { params: Promise<{ id: string }> };

export default function AdminCategoryEditPage({ params }: Props) {
  const t = useTranslations('admin');
  const commonT = useTranslations('common');
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === 'new';
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    slug: '',
    image: '',
    ru: { name: '', description: '' },
    en: { name: '', description: '' },
    uz: { name: '', description: '' },
    tj: { name: '', description: '' },
  });

  useEffect(() => {
    if (!isNew && id) {
      const numId = parseInt(id);
      if (!isNaN(numId)) {
        categoriesAPI.getById(numId).then((cat) => {
          if (cat) {
            setForm({
              slug: cat.slug || '',
              image: cat.image || '',
              ru: { name: cat.ru?.name || '', description: cat.ru?.description || '' },
              en: { name: cat.en?.name || '', description: cat.en?.description || '' },
              uz: { name: cat.uz?.name || '', description: cat.uz?.description || '' },
              tj: { name: cat.tj?.name || '', description: cat.tj?.description || '' },
            });
          }
          setLoading(false);
        }).catch(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) {
        await categoriesAPI.create(form as any);
      } else {
        await categoriesAPI.update(parseInt(id), form);
      }
      router.push('/admin/categories');
    } catch (error) {
      alert(t('saveError') || 'Error saving');
    } finally {
      setSaving(false);
    }
  };

  const updateLocale = (locale: 'ru' | 'en' | 'uz' | 'tj', field: 'name' | 'description', value: string) => {
    setForm((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value },
    }));
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin/categories" className="text-gray-500 hover:text-primary transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {isNew ? t('newCategory') : t('editCategory')}
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              {t('basicInfo')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('slug')} *</label>
                <input 
                  type="text" 
                  required 
                  value={form.slug} 
                  onChange={(e) => setForm({ ...form, slug: e.target.value })} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL {t('image') || 'Image'}</label>
                <input 
                  type="url" 
                  value={form.image} 
                  onChange={(e) => setForm({ ...form, image: e.target.value })} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                />
              </div>
            </div>
          </div>

          {/* Translations Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
               <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
               {t('translations')}
            </h2>
            <div className="space-y-6">
              {(['ru', 'uz', 'tj', 'en'] as const).map((locale) => (
                <div key={locale} className="border border-gray-100 rounded-xl p-5 bg-gray-50/50">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">
                      {locale === 'ru' ? '🇷🇺' : locale === 'en' ? '🇬🇧' : locale === 'uz' ? '🇺🇿' : '🇹🇯'}
                    </span>
                    <h3 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
                      {locale === 'ru' ? 'Русский' : locale === 'en' ? 'English' : locale === 'uz' ? "O'zbek" : 'Тоҷикӣ'}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      required={locale === 'ru'} 
                      placeholder={t('name')} 
                      value={form[locale].name} 
                      onChange={(e) => updateLocale(locale, 'name', e.target.value)} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white transition-all" 
                    />
                    <textarea 
                      placeholder={t('description') || 'Description'} 
                      value={form[locale].description} 
                      onChange={(e) => updateLocale(locale, 'description', e.target.value)} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white transition-all" 
                      rows={2} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button 
              type="submit" 
              disabled={saving} 
              className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-200"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} 
              {commonT('save')}
            </button>
            <Link 
              href="/admin/categories" 
              className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              {commonT('cancel')}
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}