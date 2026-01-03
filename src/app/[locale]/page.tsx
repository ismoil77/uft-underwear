'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { productsAPI, categoriesAPI } from '@/lib/api';
import { Product, Category, getLocalized } from '@/types/api';
import { siteConfig } from '@/config';
import { ShoppingCart, Truck, Shield, HeartHandshake, ArrowRight, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { Benefits } from '@/components/home/Benefits'

export default function HomePage() {
  const t = useTranslations();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  // 1. Следим за прокруткой для эффекта параллакса и исчезновения
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Загрузка данных
  useEffect(() => {
    Promise.all([productsAPI.getAll(), categoriesAPI.getAll()])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
      })
      .catch((err) => console.error("Data fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  // Расчеты для анимации
  const opacity = Math.max(1 - scrollY / 600, 0); // Исчезнет полностью к 600px скролла
  const heroTranslate = scrollY * 0.4; // Текст улетает чуть медленнее
  const bgTranslate = scrollY * 0.2;   // Фон движется медленно (параллакс)

  const formatPrice = (price: number) => 
    `${new Intl.NumberFormat('ru-RU').format(price)} ${siteConfig.currency.symbol}`;

  const handleAddToCart = (product: Product) => {
    const loc = getLocalized(product, 'ru');
    addToCart({ 
      productId: product.id!, 
      name: loc?.name || '', 
      price: product.price, 
      image: product.images?.[0] 
    });
  };

  const handleWishlist = (product: Product) => {
    const loc = getLocalized(product, 'ru');
    if (isInWishlist(product.id!)) {
      removeFromWishlist(product.id!);
    } else {
      addToWishlist({ 
        productId: product.id!, 
        name: loc?.name || '', 
        price: product.price, 
        image: product.images?.[0] 
      });
    }
  };

  return (
    <div className="bg-white">
      {/* --- HERO SECTION WITH PARALLAX & FADE --- */}
      <section className="relative h-[80vh] md:h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-[#FBF9F9] via-[#FAF0F0] to-[#F5E6E6]">
        
        {/* Декоративные круги (движутся с разной скоростью) */}
        <div 
          className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl z-0"
          style={{ transform: `translateY(${scrollY * 0.15}px)`, opacity }}
        />
        <div 
          className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl z-0"
          style={{ transform: `translateY(${scrollY * -0.1}px)`, opacity }}
        />
        
        {/* Фоновый паттерн (Parallax) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div 
            className="w-full h-full opacity-[0.08]" 
            style={{
              backgroundImage: `url("https://thumbs.dreamstime.com/b/%D0%B1%D0%B0%D0%BD%D0%BD%D0%B5%D1%80-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%B0-%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%D0%B0-%D0%BD%D0%B8%D0%B6%D0%BD%D0%B5%D0%B3%D0%BE-%D0%B1%D0%B5%D0%BB%D1%8C%D1%8F-%D0%B6%D0%B5%D0%BD%D1%89%D0%B8%D0%BD%D1%8B-%D0%B8%D0%BB%D0%B8-%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD-%D0%BF%D0%BB%D0%B0%D0%BA%D0%B0%D1%82%D0%B0-193199129.jpg"), url("https://www.transparenttextures.com/patterns/clean-gray-paper.png")`,
              backgroundSize: 'cover, auto',
              backgroundPosition: 'center',
              transform: `translateY(${bgTranslate}px)`,
              opacity
            }} 
          />
        </div>

        {/* Контент (Fade Out + Slide Up) */}
        <div 
          className="container relative z-10 mx-auto px-4"
          style={{ 
            transform: `translateY(${heroTranslate}px)`,
            opacity 
          }}
        >
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-secondary mb-6 leading-tight">
              {t('home.hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-text-muted mb-10 leading-relaxed">
              {t('home.hero.subtitle')}
            </p>
            <Link 
              href="/catalog" 
              className="inline-flex items-center gap-3 bg-secondary text-white px-10 py-4 text-lg rounded-full hover:bg-secondary-hover transition-all hover:scale-105 shadow-2xl"
            >
              {t('home.hero.cta')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- CATEGORIES SECTION --- */}
      <section className="relative z-20 py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-heading font-bold">{t('home.categories.title')}</h2>
            <Link href="/catalog" className="text-primary hover:underline flex items-center gap-1 font-medium">
              {t('home.categories.viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => <div key={i} className="aspect-[4/5] bg-gray-100 rounded-2xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.slice(0, 4).map((cat) => {
                const loc = getLocalized(cat, 'ru');
                return (
                  <Link key={cat.id} href={`/catalog?category=${cat.id}`} className="group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-sm">
                    {cat.image ? (
                      <img src={cat.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6">
                      <h3 className="text-white font-bold text-xl">{loc?.name || cat.slug}</h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* --- FEATURED PRODUCTS --- */}
      <section className="py-16 bg-[#F9FAFB]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-heading font-bold">{t('home.featured.title')}</h2>
            <Link href="/catalog" className="text-primary hover:underline flex items-center gap-1 font-medium">
              {t('home.featured.viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {loading ? (
              [1,2,3,4].map(i => <div key={i} className="aspect-[3/4] bg-white rounded-2xl animate-pulse" />)
            ) : (
              products.slice(0, 8).map((product) => {
                const loc = getLocalized(product, 'ru');
                const inWishlist = isInWishlist(product.id!);
                const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

                return (
                  <div key={product.id} className="bg-white rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Link href={`/catalog/${product.slug}`}>
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">Нет фото</div>
                        )}
                      </Link>
                      
                      {discount > 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          -{discount}%
                        </div>
                      )}
                      
                      <button 
                        onClick={() => handleWishlist(product)}
                        className={`absolute top-3 right-3 p-2.5 rounded-full transition-all ${
                          inWishlist ? 'bg-red-500 text-white shadow-lg' : 'bg-white/90 text-gray-600 hover:bg-white'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="p-5">
                      <Link href={`/catalog/${product.slug}`}>
                        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                          {loc?.name || product.slug}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xl font-bold text-secondary">{formatPrice(product.price)}</span>
                        {product.oldPrice && (
                          <span className="text-sm text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
                        )}
                      </div>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-secondary text-white rounded-xl hover:bg-secondary-hover transition-colors font-medium shadow-md"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {t('product.addToCart')}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* --- BENEFITS --- */}
      {/* <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Truck, title: t('home.benefits.delivery'), desc: t('home.benefits.deliveryDesc') },
              { icon: Shield, title: t('home.benefits.quality'), desc: t('home.benefits.qualityDesc') },
              { icon: HeartHandshake, title: t('home.benefits.support'), desc: t('home.benefits.supportDesc') },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-primary/10 group-hover:rotate-6 transition-all duration-300">
                  <item.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-text-muted max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}
      <Benefits/>
    </div>
  );
}