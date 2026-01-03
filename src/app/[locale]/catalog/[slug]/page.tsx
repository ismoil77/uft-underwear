'use client';

import { useState, useEffect, use } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { productsAPI } from '@/lib/api';
import { Product, getLocalized } from '@/types/api';
import { Locale } from '@/config/api.config';
import { siteConfig } from '@/config';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart, Heart, ChevronLeft, Check } from 'lucide-react';

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export default function ProductPage({ params }: Props) {
  const { slug } = use(params);
  const t = useTranslations('product');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { addItem } = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const data = await productsAPI.getBySlug(slug);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;

    const localized = getLocalized(product, locale);
    
    addItem({
      productId: product.id,
      name: localized.name,
      price: product.price,
      image: product.images[0] || '',
      size: selectedSize,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // Форматирование цены
  const formatPrice = (price: number) => {
    const formatted = new Intl.NumberFormat('ru-RU').format(price);
    return siteConfig.currency.position === 'before'
      ? `${siteConfig.currency.symbol}${formatted}`
      : `${formatted} ${siteConfig.currency.symbol}`;
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-24 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-[3/4] bg-gray-200 rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              <div className="h-24 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-semibold mb-4">Товар не найден</h1>
        <button onClick={() => router.back()} className="btn-primary">
          Вернуться назад
        </button>
      </div>
    );
  }

  const localized = getLocalized(product, locale);
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-text-muted hover:text-text mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Назад
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-[3/4] bg-surface rounded-xl overflow-hidden relative">
              {product.images[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={localized.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              {/* Discount badge */}
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-error text-white px-3 py-1 rounded-full text-sm font-medium">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Name */}
            <h1 className="text-3xl md:text-4xl font-heading font-semibold text-secondary">
              {localized.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-secondary">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-xl text-text-muted line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>

            {/* Stock */}
            <p className={`font-medium ${product.inStock ? 'text-success' : 'text-error'}`}>
              {product.inStock ? t('inStock') : t('outOfStock')}
            </p>

            {/* SKU */}
            {product.sku && (
              <p className="text-sm text-text-muted">
                {t('sku')}: {product.sku}
              </p>
            )}

            {/* Size selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">{t('selectSize')}</span>
                <button className="text-sm text-primary hover:underline">
                  {t('sizeGuide')}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg border-2 font-medium transition-all ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-white'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 btn-primary flex items-center justify-center gap-2 py-4 ${
                  addedToCart ? 'bg-success hover:bg-success' : ''
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    Добавлено!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    {t('addToCart')}
                  </>
                )}
              </button>
              <button className="w-14 h-14 border-2 border-border rounded-lg flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            {/* Description */}
            {localized.description && (
              <div className="pt-6 border-t border-border">
                <h2 className="font-semibold mb-3">{t('description')}</h2>
                <p className="text-text-muted leading-relaxed">{localized.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
