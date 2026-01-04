'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { productsAPI, categoriesAPI, propertiesAPI, collectionsAPI } from '@/lib/api';
import { Product, Category, Property, Collection, getLocalized } from '@/types/api';
import { ChevronLeft, Save, Loader2, Plus, Trash2, EyeOff } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

type LocalizedContent = {
  label?: string;
  name?: string;
  description?: string;
};

type Props = {
  params: Promise<{ id: string }>;
};

export default function AdminProductEditPage({ params }: Props) {
  const { id } = use(params);
  const locale = useLocale();
  const router = useRouter();
  const isNew = id === 'new';

  const tAdmin = useTranslations('admin');
  const tCommon = useTranslations('common');
  const tProduct = useTranslations('product');
  const tLang = useTranslations('language');

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  
  const [form, setForm] = useState({
    slug: '',
    categoryId: 0,
    price: 0,
    oldPrice: 0,
    images: [''],
    inStock: true,
    hidePrice: false, // Новое поле для скрытия цены
    sku: '',
    propertyIds: [] as number[],
    collectionIds: [] as number[],
    ru: { name: '', description: '' },
    en: { name: '', description: '' },
    uz: { name: '', description: '' },
    tj: { name: '', description: '' },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [cats, props, cols] = await Promise.all([
          categoriesAPI.getAll(),
          propertiesAPI.getAll(),
          collectionsAPI.getAll(),
        ]);

        setCategories(cats);
        setProperties(props);
        setCollections(cols);

        if (!isNew) {
          const product = await productsAPI.getById(parseInt(id));
          if (product) {
            setForm({
              slug: product.slug || '',
              categoryId: product.categoryId || 0,
              price: product.price || 0,
              oldPrice: product.oldPrice || 0,
              images: product.images?.length ? product.images : [''],
              inStock: product.inStock ?? true,
              hidePrice: product.hidePrice ?? false, // Загружаем значение
              sku: product.sku || '',
              propertyIds: product.propertyIds || product.properties || [],
              collectionIds: product.collectionIds || [],
             ru: { 
  name: product.ru?.name || '', 
  description: product.ru?.description || '' 
},
en: { 
  name: product.en?.name || '', 
  description: product.en?.description || '' 
},
uz: { 
  name: product.uz?.name || '', 
  description: product.uz?.description || '' 
},
tj: { 
  name: product.tj?.name || '', 
  description: product.tj?.description || '' 
},
            });
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, isNew]);

  const updateLocale = (loc: string, field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [loc]: { ...(prev[loc as keyof typeof prev] as any), [field]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = {
        ...form,
        images: form.images.filter((img) => img.trim() !== ''),
        properties: form.propertyIds,
      };

      if (isNew) {
        await productsAPI.create(data as Omit<Product, 'id'>);
      } else {
        await productsAPI.update(parseInt(id), data);
      }
      router.push('/admin/products');
    } catch (error) {
      alert(tAdmin('saveError'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin/products" className="text-gray-500 hover:text-gray-700 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            {isNew ? tAdmin('add') : tCommon('edit')}
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
              <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
              {tAdmin('basicInfo')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {tAdmin('slug')} (URL) *
                </label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {tAdmin('categories')}
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value={0}>{tAdmin('noCategories')}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {getLocalized(cat, locale as any)?.name || cat.slug}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {tProduct('sku')}
                </label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {tAdmin('price')} (UZS) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {tCommon('discount')} ({tAdmin('price')})
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.oldPrice}
                  onChange={(e) => setForm({ ...form, oldPrice: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-500"
                />
              </div>

              {/* Чекбоксы в одной строке */}
              <div className="md:col-span-2 flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={form.inStock}
                    onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="inStock" className="text-sm font-bold text-gray-700 cursor-pointer select-none">
                    {tProduct('inStock')}
                  </label>
                </div>

                {/* Новое поле: Скрыть цену */}
                {/* <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="hidePrice"
                    checked={form.hidePrice}
                    onChange={(e) => setForm({ ...form, hidePrice: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                  />
                  <label htmlFor="hidePrice" className="text-sm font-bold text-gray-700 cursor-pointer select-none flex items-center gap-1.5">
                    <EyeOff className="w-4 h-4 text-orange-500" />
                    Скрыть цену
                  </label>
                </div> */}
              </div>
            </div>
          </div>

          {/* Properties selection */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
              <span className="w-1.5 h-5 bg-green-600 rounded-full"></span>
              {tAdmin('properties')}
            </h2>

            <div className="flex flex-wrap gap-2">
              {properties.map((prop) => {
                const propertyIds = Array.isArray(form.propertyIds) ? form.propertyIds : [];
                const selected = prop.id ? propertyIds.includes(prop.id) : false;

                const label =
                  (prop[locale as keyof typeof prop] as LocalizedContent)?.label ||
                  prop.ru?.label ||
                  prop.key;

                return (
                  <button
                    key={prop.id}
                    type="button"
                    onClick={() => {
                      setForm((prev) => {
                        const currentIds = Array.isArray(prev.propertyIds) ? prev.propertyIds : [];
                        if (typeof prop.id !== 'number') return prev;

                        return {
                          ...prev,
                          propertyIds: selected
                            ? currentIds.filter((id) => id !== prop.id)
                            : [...currentIds, prop.id],
                        };
                      });
                    }}
                    className={`px-3 py-1.5 rounded-lg border transition-all ${
                      selected 
                        ? 'bg-green-500 text-white border-green-500' 
                        : 'bg-gray-100 border-gray-200 hover:border-green-300'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Collections */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
              <span className="w-1.5 h-5 bg-purple-600 rounded-full"></span>
              {tAdmin('collections')}
            </h2>

            <div className="flex flex-wrap gap-2">
              {collections.map((col) => {
                const selected = col.id ? form.collectionIds.includes(col.id) : false;
                const colLocalized = getLocalized(col, locale as any);

                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        collectionIds: selected
                          ? prev.collectionIds.filter((id) => id !== col.id)
                          : [...prev.collectionIds, col.id!],
                      }))
                    }
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                      selected 
                        ? 'bg-purple-500 text-white border-purple-500' 
                        : 'bg-gray-100 border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    {col.image && (
                      <img
                        src={col.image}
                        alt=""
                        className="w-6 h-6 object-cover rounded"
                      />
                    )}
                    <span>{colLocalized?.name || col.slug}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
              <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
              {tAdmin('photo')}
            </h2>
            <div className="space-y-3">
              {form.images.map((img, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={img}
                    onChange={(e) => {
                      const newImages = [...form.images];
                      newImages[index] = e.target.value;
                      setForm({ ...form, images: newImages });
                    }}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder={tAdmin('imageUrl')}
                  />
                  {form.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setForm({
                          ...form,
                          images: form.images.filter((_, i) => i !== index),
                        });
                      }}
                      className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setForm({ ...form, images: [...form.images, ''] })}
                className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" /> {tAdmin('add')}
              </button>
            </div>
          </div>

          {/* Localized Content */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
              <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
              {tAdmin('translations')}
            </h2>

            <div className="space-y-8">
              {(['ru', 'en', 'uz', 'tj'] as const).map((loc) => (
                <div key={loc} className="relative border border-gray-100 rounded-xl p-5 bg-gray-50/30">
                  <div className="absolute -top-3 left-4 px-2 bg-white text-xs font-black uppercase tracking-widest text-gray-400 border border-gray-100 rounded shadow-sm">
                    {tLang(loc)}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        {tAdmin('name')} {loc === 'ru' && '*'}
                      </label>
                      <input
                        type="text"
                        required={loc === 'ru'}
                        value={form[loc].name}
                        onChange={(e) => updateLocale(loc, 'name', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        {tAdmin('description')}
                      </label>
                      <textarea
                        value={form[loc].description}
                        onChange={(e) => updateLocale(loc, 'description', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white resize-none"
                      />
                    </div>
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
              className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {saving ? tAdmin('loading') : tCommon('save')}
            </button>
            <Link
              href="/admin/products"
              className="px-8 py-4 border border-gray-300 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
            >
              {tCommon('cancel')}
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}