'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { propertiesAPI } from '@/lib/api';
import { Property } from '@/types/api';
import { ChevronLeft, Plus, Edit, Trash2, X, Save, Loader2 } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

export default function AdminPropertiesPage() {
  const tAdmin = useTranslations('admin');
  const tCommon = useTranslations('common');
  const tLang = useTranslations('language');
  const locale = useLocale();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    key: '',
    type: 'text' as Property['type'],
    options: '',
    ru: { label: '' },
    en: { label: '' },
    uz: { label: '' },
    tj: { label: '' },
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    try {
      const data = await propertiesAPI.getAll();
      setProperties(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  const getLabel = (prop: Property) => {
    const currentTranslation = prop[locale as keyof typeof prop] as { label?: string };
    return currentTranslation?.label || prop.ru?.label || prop.key;
  };

  // function openModal(property?: Property) {
  //   if (property) {
  //     setEditingId(property.id);
  //     setForm({
  //       key: property.key,
  //       type: property.type,
  //       options: property.options?.join(', ') || '',
  //       ru: property.ru || { label: '' },
  //       en: property.en || { label: '' },
  //       uz: property.uz || { label: '' },
  //       tj: property.tj || { label: '' },
  //     });
  //   } else {
  //     setEditingId(null);
  //     setForm({
  //       key: '',
  //       type: 'text',
  //       options: '',
  //       ru: { label: '' },
  //       en: { label: '' },
  //       uz: { label: '' },
  //       tj: { label: '' },
  //     });
  //   }
  //   setShowModal(true);
  // }
function openModal(property?: Property) {
  if (property) {
    // 1. Исправляем ошибку SetStateAction<number | null>
    setEditingId(property.id ?? null); 
    
    setForm({
      key: property.key,
      // 2. Используем as any, чтобы TS не ругался на отсутствие полей в интерфейсе
      type: (property as any).type || 'text',
      options: (property as any).options?.join(', ') || '',
      // 3. Исправляем потенциальную ошибку локализации через ?? ''
      ru: { label: property.ru?.label ?? '' },
      en: { label: property.en?.label ?? '' },
      uz: { label: property.uz?.label ?? '' },
      tj: { label: property.tj?.label ?? '' },
    });
  } else {
    // Очистка формы для нового свойства
    setEditingId(null);
    setForm({
      key: '',
      type: 'text',
      options: '',
      ru: { label: '' },
      en: { label: '' },
      uz: { label: '' },
      tj: { label: '' },
    });
  }
  setShowModal(true);
}
  async function handleSave() {
    setSaving(true);
    try {
      const data: any = {
        key: form.key,
        type: form.type,
        ru: form.ru,
        en: form.en,
        uz: form.uz,
        tj: form.tj,
      };
      if (form.options) {
        data.options = form.options.split(',').map((o) => o.trim());
      }

      if (editingId) {
        await propertiesAPI.update(editingId, data);
      } else {
        await propertiesAPI.create(data);
      }
      fetchProperties();
      setShowModal(false);
    } catch {
      alert(tAdmin('propertyForm.saveError'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm(tAdmin('deleteConfirm'))) return;
    try {
      await propertiesAPI.delete(id);
      setProperties(properties.filter((p) => p.id !== id));
    } catch {
      alert(tAdmin('deleteError'));
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin" className="text-gray-500 hover:text-gray-700">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{tAdmin('properties')}</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-end mb-6">
          <button 
            onClick={() => openModal()} 
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" /> {tAdmin('add')}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          {loading ? (
            <div className="p-12 text-center flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
              <span className="text-gray-500">{tCommon('loading')}</span>
            </div>
          ) : properties.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">{tAdmin('propertyForm.key')}</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      {tAdmin('propertyForm.translations')} ({locale.toUpperCase()})
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">{tAdmin('propertyForm.type')}</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">{tAdmin('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {properties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm text-blue-600 font-medium">{prop.key}</td>
                      <td className="px-6 py-4 font-medium text-gray-800">{getLabel(prop)}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-bold uppercase">
                          {tAdmin(`propertyForm.types.${prop.type}`)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => openModal(prop)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors border border-transparent hover:border-blue-100">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(prop.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors border border-transparent hover:border-red-100">
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
            <div className="p-12 text-center text-gray-400 font-medium">
              {tAdmin('noProperties')}
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-0 shadow-2xl overflow-hidden border border-gray-200">
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingId ? tAdmin('propertyForm.edit') : tAdmin('propertyForm.new')}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">{tAdmin('propertyForm.key')} *</label>
                  <input
                    type="text"
                    value={form.key}
                    onChange={(e) => setForm({ ...form, key: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder={tAdmin('propertyForm.keyPlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">{tAdmin('propertyForm.type')}</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as Property['type'] })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                  >
                    {(['text','number','select','multiselect','boolean'] as Property['type'][]).map((type) => (
                      <option key={type} value={type}>{tAdmin(`propertyForm.types.${type}`)}</option>
                    ))}
                  </select>
                </div>

                {(form.type === 'select' || form.type === 'multiselect') && (
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <label className="block text-sm font-bold text-orange-800 mb-1.5 uppercase tracking-wider">{tAdmin('propertyForm.options')}</label>
                    <input
                      type="text"
                      value={form.options}
                      onChange={(e) => setForm({ ...form, options: e.target.value })}
                      className="w-full px-4 py-2.5 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder={tAdmin('propertyForm.optionPlaceholder')}
                    />
                  </div>
                )}

                <div className="pt-2">
                  <p className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-widest border-b pb-2">
                    {tAdmin('propertyForm.translations')}
                  </p>
                  <div className="space-y-4">
                    {(['ru','en','uz','tj'] as const).map((loc) => (
                      <div key={loc} className="flex flex-col gap-1">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[10px] font-black text-gray-400 uppercase">{tLang(loc)}</span>
                        </div>
                        <input
                          type="text"
                          value={form[loc].label}
                          onChange={(e) => setForm({ ...form, [loc]: { label: e.target.value } })}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-gray-50/50"
                          placeholder={tAdmin('propertyForm.optionPlaceholder')}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving || !form.key}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 disabled:opacity-50 shadow-lg shadow-orange-200 transition-all"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {saving ? tAdmin('propertyForm.saving') : tAdmin('propertyForm.save')}
                </button>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="px-6 py-3 border border-gray-300 bg-white text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {tAdmin('propertyForm.cancel')}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
