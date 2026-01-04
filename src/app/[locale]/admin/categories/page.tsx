'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { categoriesAPI } from '@/lib/api';
import { Category, getLocalized } from '@/types/api';
import { Locale } from '@/config/api.config';
import { ChevronLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

export default function AdminCategoriesPage() {
  const t = useTranslations('admin');
  const commonT = useTranslations('common');
  const locale = useLocale() as Locale;
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number | undefined) {
    if (!id) return;
    if (!confirm(t('deleteConfirm'))) return;
    try {
      await categoriesAPI.delete(id);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (error) {
      alert(t('deleteError'));
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin" className="text-gray-500 hover:text-gray-700">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{t('categories')}</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-end mb-6">
          <Link 
            href="/admin/categories/new" 
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" /> {t('add')}
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          {loading ? (
            <div className="p-8 text-center text-gray-500">{t('loading')}</div>
          ) : categories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">{t('id')}</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">{t('name')}</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">{t('slug')}</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-500">{cat.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {/* Используем текущую локаль админки для отображения имен */}
                        {getLocalized(cat, locale)?.name || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{cat.slug}</td>
                      <td className="px-6 py-4 text-right space-x-2 ">
                        <div className="flex items-center justify-end">
 <Link 
                          href={`/admin/categories/${cat.id}`} 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg inline-block transition-colors"
                          title={commonT('edit')}
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(cat.id)} 
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title={commonT('delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        </div>
                       
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <div className="text-4xl mb-2">📁</div>
              {t('noCategories')}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}