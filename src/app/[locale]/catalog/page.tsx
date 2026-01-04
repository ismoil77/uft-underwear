'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { productsAPI, categoriesAPI, collectionsAPI } from '@/lib/api';
import { Product, Category, Collection, getLocalized } from '@/types/api';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { ShoppingCart, Filter, X, Heart } from 'lucide-react';
import { siteConfig } from '@/config';
import { useSearchParams } from 'next/navigation';
import { Locale } from '@/config/api.config';

export default function CatalogPage() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { addItem } = useCartStore();
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    const collectionFromUrl = searchParams.get('collection');

    if (categoryFromUrl) {
      setSelectedCategory(Number(categoryFromUrl));
    } else {
      setSelectedCategory(null);
    }
    
    if (collectionFromUrl) {
      setSelectedCollection(collectionFromUrl);
    } else {
      setSelectedCollection(null);
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prods, cats, cols] = await Promise.all([
          productsAPI.getAll(),
          categoriesAPI.getAll(),
          collectionsAPI.getAll(),
        ]);
        setProducts(prods);
        setCategories(cats);
        setCollections(cols);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = products.filter((p) => {
    const loc = getLocalized(p, locale);
    const matchesCategory = selectedCategory
      ? p.categoryId === selectedCategory
      : true;

    const matchesSearch = searchQuery
      ? loc?.name?.toLowerCase().includes(searchQuery)
      : true;
      
    // Фильтр по коллекции
    const matchesCollection = selectedCollection
      ? p.collectionIds?.some(colId => {
          const col = collections.find(c => c.id === colId);
          return col?.slug === selectedCollection;
        })
      : true;

    return matchesCategory && matchesSearch && matchesCollection;
  });

  const formatPrice = (price: number) => {
    const formatted = new Intl.NumberFormat('ru-RU').format(price);
    return siteConfig.currency.position === 'after'
      ? `${formatted} ${siteConfig.currency.symbol}`
      : `${siteConfig.currency.symbol}${formatted}`;
  };

  const handleAddToCart = (product: Product) => {
    const loc = getLocalized(product, locale);
    addItem({
      productId: product.id!,
      name: loc?.name || 'Товар',
      price: product.price,
      image: product.images?.[0] || '',
    });
  };

  const isInWishlist = (productId: number) => {
    return wishlistItems.some(item => item.productId === productId);
  };

  const handleWishlistToggle = (product: Product) => {
    const loc = getLocalized(product, locale);
    if (isInWishlist(product.id!)) {
      removeFromWishlist(product.id!);
    } else {
      addToWishlist({
        productId: product.id!,
        name: loc?.name || 'Товар',
        price: product.price,
        image: product.images?.[0] || '',
      });
    }
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
        {/* Убрана надпись "Каталог" - заменена на фильтры */}
        <div className="flex items-center gap-4">
          {selectedCollection && (
            <span className="text-lg font-medium text-primary">
              {getLocalized(collections.find(c => c.slug === selectedCollection), locale)?.name || selectedCollection}
            </span>
          )}
        </div>
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

          <div className="space-y-6">
            {/* Категории */}
            <div className="space-y-2">
              <h3 className="font-semibold">{t('home.categories.title')}</h3>
              <button
                onClick={() => setSelectedCategory(null)}
                className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${!selectedCategory ? 'bg-primary text-white' : 'hover:bg-surface'}`}
              >
                {t('common.all')}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id!)}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === cat.id ? 'bg-primary text-white' : 'hover:bg-surface'}`}
                >
                  {getLocalized(cat, locale)?.name || cat.slug}
                </button>
              ))}
            </div>
            
            {/* Коллекции */}
            {collections.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">{t('collections.title')}</h3>
                <button
                  onClick={() => setSelectedCollection(null)}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${!selectedCollection ? 'bg-primary text-white' : 'hover:bg-surface'}`}
                >
                  {t('common.all')}
                </button>
                {collections.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => setSelectedCollection(col.slug)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCollection === col.slug ? 'bg-primary text-white' : 'hover:bg-surface'}`}
                  >
                    {getLocalized(col, locale)?.name || col.slug}
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map((product) => {
                const loc = getLocalized(product, locale);
                const discount = product.oldPrice
                  ? Math.round((1 - product.price / product.oldPrice) * 100)
                  : 0;

                return (
                  <div key={product.id} className="group relative">
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleWishlistToggle(product);
                      }}
                      className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isInWishlist(product.id!) 
                          ? 'bg-red-500 text-white' 
                          : 'bg-white/80 text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(product.id!) ? 'fill-current' : ''}`} />
                    </button>
                    
                    <Link href={`/catalog/${product.slug}`}>
                      <div className="aspect-[3/4] bg-surface rounded-xl overflow-hidden mb-3 relative">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={loc?.name || ''}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            Нет фото
                          </div>
                        )}
                        {discount > 0 && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            -{discount}%
                          </span>
                        )}
                      </div>
                      <h3 className="font-medium mb-1 line-clamp-2">{loc?.name || product.slug}</h3>
                    </Link>
                    
                    {/* Цена скрыта по требованию п.9 - закомментирована */}
                    {/* 
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold text-primary">{formatPrice(product.price)}</span>
                      {product.oldPrice && (
                        <span className="text-sm text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
                      )}
                    </div>
                    */}
                    
                    {/* Кнопка "В корзину" перемещена вниз */}
                    <div className="mt-auto pt-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {t('product.addToCart')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('catalog.noResults')}</p>
              <p className="text-sm text-gray-400 mt-1">{t('catalog.noResultsDesc')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}