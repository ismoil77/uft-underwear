'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { propertiesAPI } from '@/lib/api';
import { ChevronLeft, Save, Loader2, Plus, X } from 'lucide-react';
import { useTranslations } from 'next-intl'

type Props = {
  params: Promise<{ id: string }>;
};

type PropertyType = 'text' | 'number' | 'select' | 'multiselect' | 'boolean';

export default function AdminPropertyEditPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const t = useTranslations('admin.propertyForm');

  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    key: '',
    type: 'text' as PropertyType,
    options: [''],
    ru: { label: '' },
    en: { label: '' },
    uz: { label: '' },
    tj: { label: '' },
  });

  useEffect(() => {
    if (!isNew) {
      propertiesAPI.getAll().then((props) => {
        const prop = props.find((p) => p.id === parseInt(id));
        if (prop) {
          setForm({
            key: prop.key || '',
            type: prop.type || 'text',
            options: prop.options?.length ? prop.options : [''],
            ru: prop.ru || { label: '' },
            en: prop.en || { label: '' },
            uz: prop.uz || { label: '' },
            tj: prop.tj || { label: '' },
          });
        }
        setLoading(false);
      });
    }
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = {
        ...form,
        options:
          form.type === 'select' || form.type === 'multiselect'
            ? form.options.filter((o) => o.trim() !== '')
            : undefined,
      };

      if (isNew) {
        await propertiesAPI.create(data as any);
      } else {
        await propertiesAPI.update(parseInt(id), data);
      }

      router.push('/admin/properties');
    } catch {
      alert(t('saveError'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin/properties" className="text-gray-500 hover:text-gray-700">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">
            {isNew ? t('new') : t('edit')}
          </h1>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* BASIC */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">{t('basic')}</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t('key')} *
                </label>
                <input
                  required
                  value={form.key}
                  onChange={(e) => setForm({ ...form, key: e.target.value })}
                  placeholder={t('keyPlaceholder')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {t('type')}
                </label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value as PropertyType })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {(['text', 'number', 'select', 'multiselect', 'boolean'] as PropertyType[]).map(
                    (type) => (
                      <option key={type} value={type}>
                        {t(`types.${type}`)}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {(form.type === 'select' || form.type === 'multiselect') && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  {t('options')}
                </label>

                <div className="space-y-2">
                  {form.options.map((opt, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={opt}
                        onChange={(e) => {
                          const next = [...form.options];
                          next[i] = e.target.value;
                          setForm({ ...form, options: next });
                        }}
                        placeholder={t('optionPlaceholder')}
                        className="flex-1 px-3 py-2 border rounded-lg"
                      />
                      {form.options.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              options: form.options.filter((_, j) => j !== i),
                            })
                          }
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      setForm({ ...form, options: [...form.options, ''] })
                    }
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                  >
                    <Plus className="w-4 h-4" />
                    {t('addOption')}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* TRANSLATIONS */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">
              {t('translations')}
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {(['ru', 'en', 'uz', 'tj'] as const).map((locale) => (
                <div key={locale}>
                  <label className="block text-sm font-medium mb-1">
                    {locale.toUpperCase()}
                  </label>
                  <input
                    required={locale === 'ru'}
                    value={form[locale].label}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [locale]: { label: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {saving ? t('saving') : t('save')}
            </button>

            <Link
              href="/admin/properties"
              className="px-6 py-3 border rounded-lg hover:bg-gray-50"
            >
              {t('cancel')}
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
