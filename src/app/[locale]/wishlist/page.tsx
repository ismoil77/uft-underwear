'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { siteConfig } from '@/config';

export default function WishlistPage() {
  const t = useTranslations();
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const formatPrice = (price: number) => {
    const formatted = new Intl.NumberFormat('ru-RU').format(price);
    return `${formatted} ${siteConfig.currency.symbol}`;
  };

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({
      
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
       collectionIds: item.collectionIds,
      propertyIds: item.propertyIds,

      categoryIds:item.categoryIds,
      hidePrice: item.hidePrice,

    });
  };

  if (!mounted) return null;

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Heart className="w-8 h-8 text-primary" />
          {t('wishlist.title')}
        </h1>
        {items.length > 0 && (
          <button onClick={clearWishlist} className="text-red-500 hover:text-red-600 text-sm">
            {t('cart.clear')}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t('wishlist.empty')}</h2>
          <p className="text-text-muted mb-6">{t('wishlist.emptyDesc')}</p>
          <Link href="/catalog" className="inline-flex items-center gap-2 btn-primary px-6 py-3">
            <ArrowLeft className="w-5 h-5" />
            {t('cart.continueShopping')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {items.map((item) => (
            <div key={item.productId} className="bg-white rounded-xl shadow-sm overflow-hidden group">
              <div className="aspect-[3/4] bg-surface relative">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">Нет фото</div>
                )}
                <button
                  onClick={() => removeItem(item.productId)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-red-50 text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2 line-clamp-2">{item.name}</h3>
                <p className="font-bold text-primary mb-3">{formatPrice(item.price)}</p>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {t('product.addToCart')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
