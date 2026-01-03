'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation'; // Добавили useRouter
import { siteConfig } from '@/config';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ShoppingBag, Heart, Menu, X, Search } from 'lucide-react';

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter(); // Инициализация роутера
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Состояние для поиска
  
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);

  useEffect(() => setMounted(true), []);

  const cartCount = mounted ? cartItems.reduce((sum, item) => sum + item.quantity, 0) : 0;
  const wishlistCount = mounted ? wishlistItems.length : 0;

  // Функция обработки нажатия Enter
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(searchQuery.length==0){
      router.push(`/catalog?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(''); // Очищаем поле после поиска (по желанию)
      setMobileMenuOpen(false); // Закрываем мобильное меню, если оно открыто
    }
   else if (e.key === 'Enter' && searchQuery.trim()) {
      // Переход в каталог с параметром search
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Очищаем поле после поиска (по желанию)
      setMobileMenuOpen(false); // Закрываем мобильное меню, если оно открыто
    }
 
  };
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if(searchQuery.length==0){
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
  }
   else if (e.key === 'Enter' && searchQuery.trim()) {
      // Переходим в каталог с параметром search
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
   
  };
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="text-2xl font-heading font-bold text-primary">
            {siteConfig.name}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? 'text-primary' : 'text-text'
                }`}
              >
                {t(item.label.replace('nav.', ''))}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            
            {/* SEARCH BAR */}
            <div className="flex items-center gap-2 group p-2 hover:bg-surface rounded-full transition-all border border-transparent hover:border-border">
              <Search className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
              <input 
                type="text"  
                value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
                placeholder="Поиск..." 
                className="w-24 focus:w-48 outline-none bg-transparent text-sm transition-all duration-300 placeholder:text-gray-400"
              />
            </div>

            <Link href="/wishlist" className="p-2 hover:bg-surface rounded-full relative">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href="/cart" className="p-2 hover:bg-surface rounded-full relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <LanguageSwitcher />

            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t animate-fadeIn">
            {/* Добавил поиск в мобильное меню для удобства */}
            <div className="mb-4 px-2">
               <div className="flex items-center gap-2 bg-surface p-2 rounded-lg">
                  <Search className="w-5 h-5 text-gray-500" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    placeholder="Поиск..."
                    className="w-full bg-transparent outline-none"
                  />
               </div>
            </div>

            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-3 text-text hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t(item.label.replace('nav.', ''))}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}