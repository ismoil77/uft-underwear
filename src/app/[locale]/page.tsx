'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { productsAPI, categoriesAPI } from '@/lib/api';
import { Product, Category, getLocalized } from '@/types/api';
import { siteConfig } from '@/config';

import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { ShoppingCart, Truck, Shield, HeartHandshake, ArrowRight, Heart, HeadphonesIcon, Star, Phone } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard'
import useContacts from '@/config/useContacts'

export default function HomePage() {
  const t = useTranslations('');
  const tHome = useTranslations('home');
  const tContacts = useTranslations('contacts');
    const { phone, email, address, schedule, telegram, whatsapp, instagram } = useContacts();

  const benefits = [
    {
      // Консультация теперь ведет на контакты (п.5)
      icon: HeadphonesIcon,
      title: tHome('benefits.support'),
      desc: tHome('benefits.supportDesc'),
      isLink: true,
      href: '/contacts',
    },
    {
      icon: Truck,
      title: tHome('benefits.delivery'),
      desc: tHome('benefits.deliveryDesc'),
    },
    {
      icon: Shield,
      title: tHome('benefits.quality'),
      desc: tHome('benefits.qualityDesc'),
    },
    {
      icon: Star,
      title: tHome('benefits.premium_quality'),
      desc: tHome('benefits.premium_qualityDesc'),
    },
  ];

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
 const locale = useLocale();
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
  const opacity = Math.max(1 - scrollY / 600, 0);
  const heroTranslate = scrollY * 0.4;
  const bgTranslate = scrollY * 0.2;

  const formatPrice = (price: number) => 
    `${new Intl.NumberFormat('ru-RU').format(price)} ${siteConfig.currency.symbol}`;

  const handleAddToCart = (product: Product) => {
    const loc = getLocalized(product, 'ru');
    addToCart({ 
      
      productId: product.id!, 
     name: loc?.name ||  'Товар без названия',
      price: product.price, 
      image: product.images?.[0] || '/placeholder.png', 
      collectionIds:product.collectionIds,
      categoryIds:product.categoryIds,
      hidePrice: product.hidePrice,
      propertyIds:product.propertyIds,


      

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
                      <h3 className="text-white font-bold text-xl">{locale?.name || cat.slug}</h3>
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

    {loading ? (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => (
          <div key={i} className="aspect-[3/4] bg-white rounded-2xl animate-pulse" />
        ))}
      </div>
    ) : (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.slice(0, 8).map(product => (
          <ProductCard
            key={product.id}
            product={product}
            locale={locale}
            isInWishlist={isInWishlist}
            onToggleWishlist={handleWishlist}
            onAddToCart={handleAddToCart}
            formatPrice={formatPrice}
            t={t}
          />
        ))}
      </div>
    )}
  </div>
</section>

      {/* --- BENEFITS SECTION --- */}
      <section className="section bg-surface">
        <div className="container">
          <h2 className="section-title text-center">{tHome('benefits.title')}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => {
              const Icon = benefit.icon;
              
              // Если это консультация - делаем кликабельным с переходом на контакты
              if (benefit.isLink && benefit.href) {
                return (
                  <Link
                    key={i}
                    href={benefit.href}
                    className="text-center p-6 bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all group cursor-pointer"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{benefit.title}</h3>
                    <p className="text-sm text-text-muted">{benefit.desc}</p>
                  </Link>
                );
              }
              
              return (
                <div
                  key={i}
                  className="text-center p-6 bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-text-muted">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - переход на контакты для консультации */}
      <section className="section">
        <div className="container">
          <div className="bg-gradient-to-r from-primary to-primary-hover rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
             {t('consultation.needAConsultation')}
            </h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              {t('consultation.weWillHelpYou')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contacts"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-primary rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                <Phone className="w-5 h-5" />
                {tContacts('title')}
              </Link>
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-white text-white rounded-full font-medium hover:bg-white/10 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  {phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}