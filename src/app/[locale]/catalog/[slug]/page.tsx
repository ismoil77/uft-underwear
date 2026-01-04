'use client';

import { useState, useEffect, use } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { productsAPI, propertiesAPI, collectionsAPI } from '@/lib/api';
import { Product, Property, Collection, getLocalized } from '@/types/api';
import { Locale } from '@/config/api.config';
import { siteConfig } from '@/config';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { ShoppingCart, Heart, ChevronLeft, Check, Share2 } from 'lucide-react';
import { Link } from '@/i18n/navigation';

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export default function ProductPage({ params }: Props) {
  const { slug } = use(params);
  const t = useTranslations('product');
  const tCommon = useTranslations('common');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { addItem } = useCartStore();
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const [data, props, cols] = await Promise.all([
          productsAPI.getBySlug(slug),
          propertiesAPI.getAll(),
          collectionsAPI.getAll(),
        ]);
        setProduct(data);
        setProperties(props);
        setCollections(cols);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  // Проверка, находится ли продукт в избранном (п.20 - исправлен лайк в getById)
  const isInWishlist = product?.id ? wishlistItems.some(item => item.productId === product.id) : false;

  const handleWishlistToggle = () => {
    if (!product) return;
    
    const localized = getLocalized(product, locale);
    
    if (isInWishlist) {
      removeFromWishlist(product.id!);
    } else {
      addToWishlist({
        productId: product.id!,
        name: localized?.name || product.slug,
        price: product.price,
        image: product.images?.[0] || '',
      });
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const localized = getLocalized(product, locale);
    
    addItem({
      productId: product.id!,
      name: localized?.name || product.slug,
      price: product.price,
      image: product.images?.[0] || '',
      size: selectedSize,
      // Добавляем propertyIds и collectionIds в корзину (п.22)
      propertyIds: product.propertyIds,
      collectionIds: product.collectionIds,
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

  // Получение свойств продукта
  const getProductProperties = () => {
    if (!product?.propertyIds || !properties.length) return [];
    return properties.filter(p => product.propertyIds?.includes(p.id!));
  };

  // Получение коллекций продукта
  const getProductCollections = () => {
    if (!product?.collectionIds || !collections.length) return [];
    return collections.filter(c => product.collectionIds?.includes(c.id!));
  };

  if (loading) {
    return (
      <div className="container py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-12 text-center">
        <p className="text-gray-500">Товар не найден</p>
        <Link href="/catalog" className="text-primary hover:underline mt-4 inline-block">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  const localized = getLocalized(product, locale);
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;
  const productProperties = getProductProperties();
  const productCollections = getProductCollections();

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        {tCommon('back')}
      </button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-surface rounded-2xl overflow-hidden relative">
            {product.images?.[selectedImage] ? (
              <img
                src={product.images[selectedImage]}
                alt={localized?.name || ''}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                Нет фото
              </div>
            )}
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                -{discount}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? 'border-primary' : 'border-transparent'
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
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold mb-2">
              {localized?.name || product.slug}
            </h1>
            {product.sku && (
              <p className="text-sm text-gray-400">
                {t('sku')}: {product.sku}
              </p>
            )}
          </div>

          {/* Цена скрыта по требованию п.9 */}
          {/* 
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xl text-gray-400 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          */}

          {/* Stock Status */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {product.inStock ? t('inStock') : t('outOfStock')}
          </div>

          {/* Description */}
          {localized?.description && (
            <div>
              <h3 className="font-semibold mb-2">{t('description')}</h3>
              <p className="text-gray-600 leading-relaxed">{localized.description}</p>
            </div>
          )}

          {/* Properties - показываем propertyIds (п.22) */}
          {productProperties.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Свойства</h3>
              <div className="flex flex-wrap gap-2">
                {productProperties.map((prop) => {
                  const propLocalized = getLocalized(prop, locale);
                  return (
                    <span 
                      key={prop.id} 
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {propLocalized?.label || prop.key}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Collections - показываем collectionIds (п.22) */}
          {productCollections.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Коллекции</h3>
              <div className="flex flex-wrap gap-2">
                {productCollections.map((col) => {
                  const colLocalized = getLocalized(col, locale);
                  return (
                    <Link 
                      key={col.id} 
                      href={`/catalog?collection=${col.slug}`}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                    >
                      {colLocalized?.name || col.slug}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions - кнопки перемещены вниз (п.19) */}
          <div className="flex flex-col gap-3 pt-4 border-t mt-6">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium transition-all ${
                addedToCart
                  ? 'bg-green-500 text-white'
                  : product.inStock
                    ? 'bg-primary text-white hover:bg-primary-hover'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
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

            <div className="flex gap-3">
              {/* Wishlist Button - исправлен лайк (п.20) */}
              <button
                onClick={handleWishlistToggle}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                  isInWishlist
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'border-gray-200 hover:border-primary hover:text-primary'
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                {isInWishlist ? t('removeFromWishlist') : t('addToWishlist')}
              </button>

              {/* Share Button */}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: localized?.name || product.slug,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="px-4 py-3 rounded-xl border border-gray-200 hover:border-primary hover:text-primary transition-all"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}