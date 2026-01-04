'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { collectionsAPI, productsAPI } from '@/lib/api';
import { Collection, Product, getLocalized } from '@/types/api';
import { Locale } from '@/config/api.config';
import { siteConfig } from '@/config';
import { ArrowRight, ShoppingCart, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import ProductCard from '@/components/product/ProductCard'

export default function CollectionsPage() {
  const t = useTranslations('collections');
  const tProduct = useTranslations('product');
  const locale = useLocale() as Locale;
    const tAll = useTranslations('');

  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [collectionProducts, setCollectionProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  
  const { addItem: addToCart } = useCartStore();
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();

  useEffect(() => {
    collectionsAPI.getAll()
      .then(setCollections)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Загрузка продуктов по коллекции (п.21)
  const handleCollectionClick = async (collection: Collection) => {
    if (selectedCollection?.id === collection.id) {
      setSelectedCollection(null);
      setCollectionProducts([]);
      return;
    }
    
    setSelectedCollection(collection);
    setLoadingProducts(true);
    
    try {
      // Используем getByCollection из API
      const products = await productsAPI.getByCollection(collection.id!);
      setCollectionProducts(products);
    } catch (error) {
      console.error('Error loading products:', error);
      setCollectionProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const formatPrice = (price: number) => {
    const formatted = new Intl.NumberFormat('ru-RU').format(price);
    return `${formatted} ${siteConfig.currency.symbol}`;
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

  const handleAddToCart = (product: Product) => {
    const loc = getLocalized(product, locale);
    addToCart({
      ...product,
      productId: product.id!,
      name: loc?.name || 'Товар',
      price: product.price,
      image: product.images?.[0] || '',
      collectionIds: product.collectionIds,
      propertyIds: product.propertyIds,

      categoryIds:product.categoryIds,
      hidePrice: product.hidePrice,
    });
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
      
      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="aspect-[3/4] bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : collections.length > 0 ? (
        <div className="space-y-12">
          {/* Collections Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {collections.map((col) => {
              const loc = getLocalized(col, locale);
              const isSelected = selectedCollection?.id === col.id;
              
              return (
                <div 
                  key={col.id} 
                  onClick={() => handleCollectionClick(col)}
                  className={`group cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-primary ring-offset-2 rounded-xl' : ''
                  }`}
                >
                  <div className="aspect-[3/4] rounded-xl overflow-hidden  relative">
                    {col.image ? (
                      <img 
                        src={col.image} 
                        alt="" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white text-xl font-semibold">{loc?.name || col.slug}</h3>
                      {loc?.description && (
                        <p className="text-white/80 text-sm mt-1">{loc.description}</p>
                      )}
                    </div>
                    
                    {/* Indicator */}
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      isSelected 
                        ? 'bg-primary text-white' 
                        : 'bg-white/90 text-gray-700 group-hover:bg-primary group-hover:text-white'
                    }`}>
                      {isSelected ? 'Выбрано' : 'Показать товары'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Products from Selected Collection (п.21) */}
          {selectedCollection && (
            <div className="border-t pt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {getLocalized(selectedCollection, locale)?.name || selectedCollection.slug}
                </h2>
                <Link 
                  href={`/catalog?collection=${selectedCollection.slug}`}
                  className="text-primary hover:underline flex items-center gap-1"
                >
                    {t('viewAll')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {loadingProducts ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-[3/4] bg-gray-100 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : collectionProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {collectionProducts.map((product) => (
    <ProductCard
      key={product.id}
      product={product}
      locale={locale}
      isInWishlist={isInWishlist}
      onToggleWishlist={handleWishlistToggle}
      onAddToCart={handleAddToCart}
      formatPrice={formatPrice}
      t={tAll}
    />
  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  В этой коллекции пока нет товаров
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-12">Коллекции скоро появятся</p>
      )}
    </div>
  );
}