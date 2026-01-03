'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { siteConfig, productConfig, featuresConfig } from '@/config';
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    oldPrice?: number;
    images: string[];
    inStock: boolean;
    rating?: number;
    reviewsCount?: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations('product');
  const { currency } = siteConfig;
  const { display, card } = productConfig;
  const { addItem } = useCartStore();
  const [added, setAdded] = useState(false);

  // Форматирование цены
  const formatPrice = (price: number) => {
    const formatted = new Intl.NumberFormat('ru-RU').format(price);
    return currency.position === 'before'
      ? `${currency.symbol}${formatted}`
      : `${formatted} ${currency.symbol}`;
  };

  // Расчёт скидки
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      productId: parseInt(product.id),
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="card group relative overflow-hidden">
      {/* Image */}
      <Link href={`/catalog/${product.slug}`} className="block relative aspect-square overflow-hidden">
        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Discount Badge */}
        {display.showDiscount && discount > 0 && (
          <span className="absolute top-2 left-2 badge badge-error text-white">
            {t('discount', { percent: discount })}
          </span>
        )}

        {/* Stock Badge */}
        {display.showStock && !product.inStock && (
          <span className="absolute top-2 right-2 badge bg-gray-800 text-white">
            {t('outOfStock')}
          </span>
        )}

        {/* Quick Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-2">
            {card.showAddToCart && featuresConfig.cart.enabled && (
              <button
                onClick={handleAddToCart}
                className={`flex-1 btn-primary py-2 text-sm ${added ? 'bg-success' : ''}`}
                disabled={!product.inStock}
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                {added ? '✓' : t('addToCart')}
              </button>
            )}
          </div>
        </div>
      </Link>

      {/* Wishlist Button */}
      {card.showWishlist && featuresConfig.wishlist && (
        <button
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-text-muted hover:text-error transition-colors z-10"
          aria-label={t('addToWishlist')}
        >
          <Heart className="w-4 h-4" />
        </button>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Rating */}
        {display.showRating && product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 fill-warning text-warning" />
            <span className="text-sm font-medium">{product.rating}</span>
            {display.showReviews && product.reviewsCount && (
              <span className="text-sm text-text-muted">
                ({product.reviewsCount})
              </span>
            )}
          </div>
        )}

        {/* Name */}
        <Link href={`/catalog/${product.slug}`}>
          <h3 className="font-medium text-text line-clamp-2 mb-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        {display.showPrice && (
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-text">
              {formatPrice(product.price)}
            </span>
            {display.showOldPrice && product.oldPrice && (
              <span className="text-sm text-text-muted line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
        )}

        {/* Stock Status */}
        {display.showStock && (
          <p className={`text-sm mt-2 ${product.inStock ? 'text-success' : 'text-error'}`}>
            {product.inStock ? t('inStock') : t('outOfStock')}
          </p>
        )}
      </div>
    </div>
  );
}
