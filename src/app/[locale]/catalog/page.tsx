'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { productsAPI, categoriesAPI } from '@/lib/api';
import { Product, Category, getLocalized } from '@/types/api';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart, Filter, X } from 'lucide-react';
import { siteConfig } from '@/config';
import { useSearchParams } from 'next/navigation';

export default function CatalogPage() {
  const t = useTranslations();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { addItem } = useCartStore();
  const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search')?.toLowerCase() || '';

useEffect(() => {
  const categoryFromUrl = searchParams.get('category');

  if (categoryFromUrl) {
    setSelectedCategory(Number(categoryFromUrl));
  } else {
    setSelectedCategory(null);
  }
}, [searchParams]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prods, cats] = await Promise.all([
          productsAPI.getAll(),
          categoriesAPI.getAll(),
        ]);
        setProducts(prods);
        setCategories(cats);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = products.filter((p) => {
  const loc = getLocalized(p, 'ru');
  const matchesCategory = selectedCategory
    ? p.categoryId === selectedCategory
    : true;

  const matchesSearch = searchQuery
    ? loc?.name?.toLowerCase().includes(searchQuery)
    : true;

  return matchesCategory && matchesSearch;
});


  const formatPrice = (price: number) => {
    const formatted = new Intl.NumberFormat('ru-RU').format(price);
    return siteConfig.currency.position === 'after'
      ? `${formatted} ${siteConfig.currency.symbol}`
      : `${siteConfig.currency.symbol}${formatted}`;
  };

  const handleAddToCart = (product: Product) => {
    const loc = getLocalized(product, 'ru');
    addItem({
      productId: product.id!,
      name: loc?.name || 'Товар',
      price: product.price,
      image: product.images?.[0] || '',
    });
  };

  if (loading) {
    return (
      <div className="container py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t('catalog.title')}</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 px-4 py-2 border rounded-lg"
        >
          <Filter className="w-5 h-5" />
          {t('catalog.filters')}
        </button>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-white p-6' : 'hidden'} md:block md:relative md:w-64 md:flex-shrink-0`}>
          <div className="flex items-center justify-between mb-4 md:hidden">
            <h2 className="text-lg font-semibold">{t('catalog.filters')}</h2>
            <button onClick={() => setShowFilters(false)}><X className="w-6 h-6" /></button>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">{t('home.categories.title')}</h3>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`block w-full text-left px-3 py-2 rounded-lg ${!selectedCategory ? 'bg-primary text-white' : 'hover:bg-surface'}`}
            >
              {t('common.all')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id!)}
                className={`block w-full text-left px-3 py-2 rounded-lg ${selectedCategory === cat.id ? 'bg-primary text-white' : 'hover:bg-surface'}`}
              >
                {getLocalized(cat, 'ru')?.name || cat.slug}
              </button>
            ))}
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map((product) => {
                const loc = getLocalized(product, 'ru');
                const discount = product.oldPrice
                  ? Math.round((1 - product.price / product.oldPrice) * 100)
                  : 0;

                return (
                  <div key={product.id} className="group">
                    <Link href={`/catalog/${product.slug}`}>
                      <div className="aspect-[3/4] bg-surface rounded-xl overflow-hidden mb-3 relative">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={loc?.name || ''}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-text-muted">
                            Нет фото
                          </div>
                        )}
                        {discount > 0 && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            -{discount}%
                          </span>
                        )}
                      </div>
                    </Link>
                    <h3 className="font-medium mb-1 group-hover:text-primary">
                      <Link href={`/catalog/${product.slug}`}>{loc?.name || product.slug}</Link>
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-primary">{formatPrice(product.price)}</span>
                      {product.oldPrice && (
                        <span className="text-sm text-text-muted line-through">
                          {formatPrice(product.oldPrice)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {t('product.addToCart')}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-text-muted">{t('catalog.noResults')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
