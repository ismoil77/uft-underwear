'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { collectionsAPI } from '@/lib/api';
import { Collection, getLocalized } from '@/types/api';
import { Locale } from '@/config/api.config';
import { ChevronLeft, Plus, Edit, Trash2, X, Save, Loader2, Image as ImageIcon } from 'lucide-react';

export default function AdminCollectionsPage() {
  const t = useTranslations('admin');
  const commonT = useTranslations('common');
  const locale = useLocale() as Locale;
  
  const [items, setItems] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Collection | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, []);

  async function fetchCollections() {
    try {
      const data = await collectionsAPI.getAll();
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        const updated = await collectionsAPI.update(editing.id, editing);
        setItems(items.map((i) => (i.id === editing.id ? updated : i)));
      } else {
        const created = await collectionsAPI.create(editing);
        setItems([...items, created]);
      }
      setEditing(null);
    } catch (e) {
      alert(t('error'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('deleteConfirm'))) return;
    try {
      await collectionsAPI.delete(id);
      setItems(items.filter((i) => i.id !== id));
    } catch (e) {
      alert(t('error'));
    }
  };

  // Список языков для генерации инпутов
  const languages = [
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
    { code: 'tj', label: 'Тоҷикӣ', flag: '🇹🇯' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin" className="text-gray-500 hover:text-primary transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{t('collections')}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-end mb-6">
          <button 
            onClick={() => setEditing({ 
              slug: '', 
              ru: { name: '', description: '' },
              uz: { name: '', description: '' },
              tj: { name: '', description: '' },
              en: { name: '', description: '' }
            })} 
            className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 shadow-lg shadow-cyan-100 transition-all"
          >
            <Plus className="w-5 h-5" /> {t('add')}
          </button>
        </div>

        {editing && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto pt-10">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl mb-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {editing.id ? t('editCollection') : t('newCollection')}
                </h2>
                <button onClick={() => setEditing(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Основные поля */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">{t('slug')} *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. summer-2024" 
                      value={editing.slug} 
                      onChange={(e) => setEditing({ ...editing, slug: e.target.value })} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500/20 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">{t('imageUrl')}</label>
                    <input 
                      type="url" 
                      placeholder="https://..." 
                      value={editing.image || ''} 
                      onChange={(e) => setEditing({ ...editing, image: e.target.value })} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500/20 outline-none" 
                    />
                  </div>
                </div>

                {/* Поля переводов */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-700 flex items-center gap-2">
                    <span className="w-1 h-4 bg-cyan-500 rounded-full"></span>
                    {t('translations') || 'Переводы'}
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {languages.map((lang) => (
                      <div key={lang.code} className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">{lang.flag}</span>
                          <span className="text-sm font-bold text-gray-600">{lang.label}</span>
                        </div>
                        <div className="space-y-3">
                          <input 
                            type="text" 
                            placeholder={`${t('name')} (${lang.code.toUpperCase()}) *`}
                            value={editing[lang.code]?.name || ''} 
                            onChange={(e) => setEditing({ 
                              ...editing, 
                              [lang.code]: { ...editing[lang.code], name: e.target.value } 
                            })} 
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500/20 outline-none text-sm" 
                          />
                          <textarea 
                            placeholder={`${t('description')} (${lang.code.toUpperCase()})`}
                            value={editing[lang.code]?.description || ''} 
                            onChange={(e) => setEditing({ 
                              ...editing, 
                              [lang.code]: { ...editing[lang.code], description: e.target.value } 
                            })} 
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500/20 outline-none text-sm" 
                            rows={1} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleSave} 
                  disabled={saving || !editing.slug || !editing.ru?.name} 
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-700 disabled:opacity-50 transition-all shadow-lg shadow-cyan-100"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} 
                  {commonT('save')}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          {loading ? (
            <div className="p-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-cyan-500" /></div>
          ) : items.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-5 hover:bg-gray-50/80 transition-colors">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-inner">
                    {item.image ? (
                      <img src={item.image} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">
                      {getLocalized(item, locale)?.name || item.slug}
                    </p>
                    <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">{item.slug}</p>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setEditing(item)} 
                      className="p-2.5 hover:bg-blue-50 text-blue-600 rounded-xl transition-colors"
                      title={commonT('edit')}
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id!)} 
                      className="p-2.5 hover:bg-red-50 text-red-500 rounded-xl transition-colors"
                      title={commonT('delete')}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-10 h-10 text-gray-200" />
              </div>
              <p className="text-gray-400 font-medium">{t('noCollections')}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}