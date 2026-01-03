// ===== ТИПЫ КОНФИГУРАЦИИ САЙТА =====

export interface SiteConfig {
  // Основное
  name: string;
  description: string;
  logo: string;
  favicon: string;

  // Контакты
  contacts: {
    phone?: string;
    email?: string;
    address?: string;
    workHours?: string;
    socials?: {
      telegram?: string;
      whatsapp?: string;
      instagram?: string;
      vk?: string;
      facebook?: string;
    };
  };

  // Валюта
  currency: {
    code: string;
    symbol: string;
    position: 'before' | 'after';
  };

  // Навигация
  navigation: {
    label: string;
    href: string;
    icon?: string;
  }[];

  // SEO
  seo: {
    titleTemplate: string;
    defaultTitle: string;
    keywords: string[];
  };
}

export interface ThemeConfig {
  colors: {
    primary: string;
    primaryHover: string;
    primaryLight: string;
    secondary: string;
    secondaryHover: string;
    accent: string;
    accentHover: string;
    background: string;
    surface: string;
    surfaceHover: string;
    border: string;
    text: string;
    textMuted: string;
    textInverse: string;
    success: string;
    error: string;
    warning: string;
  };

  fonts: {
    heading: string;
    body: string;
  };

  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };

  shadows: {
    card: string;
    cardHover: string;
    dropdown: string;
    button: string;
  };

  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };

  darkMode: boolean;
}

export interface ProductFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean' | 'range' | 'color' | 'textarea';
  options?: string[];
  min?: number;
  max?: number;
  suffix?: string;
  prefix?: string;
  filterable?: boolean;
  searchable?: boolean;
  sortable?: boolean;
  showInCard?: boolean;
  showInDetail?: boolean;
  required?: boolean;
}

export interface ProductConfig {
  // Название сущности
  entityName: {
    singular: string;
    plural: string;
    genitive: string;
  };

  // Поля товара
  fields: ProductFieldConfig[];

  // Сортировка
  sorting: {
    key: string;
    label: string;
  }[];

  // Отображение
  display: {
    showPrice: boolean;
    showOldPrice: boolean;
    showDiscount: boolean;
    showRating: boolean;
    showReviews: boolean;
    showStock: boolean;
    showSku: boolean;
    imagesPerProduct: number;
  };

  // Карточка товара
  card: {
    layout: 'vertical' | 'horizontal';
    imageAspect: string;
    showQuickView: boolean;
    showAddToCart: boolean;
    showWishlist: boolean;
    showCompare: boolean;
  };
}

export interface FeaturesConfig {
  // Корзина
  cart: {
    enabled: boolean;
    minOrder?: number;
    maxItems?: number;
    showQuantity: boolean;
  };

  // Оформление заказа
  checkout: {
    guestCheckout: boolean;
    requirePhone: boolean;
    requireEmail: boolean;
    requireAddress: boolean;
    showComments: boolean;
    paymentMethods: string[];
    deliveryMethods: string[];
  };

  // Пользователи
  auth: {
    enabled: boolean;
    providers: string[];
  };

  // Дополнительно
  wishlist: boolean;
  compare: boolean;
  reviews: boolean;
  search: boolean;
  filters: boolean;
  categories: boolean;
  brands: boolean;

  // Интеграции
  integrations: {
    analytics?: {
      google?: string;
      yandex?: string;
    };
    chat?: {
      enabled: boolean;
      provider?: 'telegram' | 'whatsapp' | 'jivo';
    };
  };

  // Секции главной
  homepage: {
    heroBanner: boolean;
    featuredProducts: boolean;
    categories: boolean;
    benefits: boolean;
    testimonials: boolean;
    brands: boolean;
    newsletter: boolean;
  };
}

// Полный конфиг
export interface AppConfig {
  site: SiteConfig;
  theme: ThemeConfig;
  product: ProductConfig;
  features: FeaturesConfig;
}

// Тип товара (базовый)
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  images: string[];
  categoryId: string;
  inStock: boolean;
  sku?: string;
  rating?: number;
  reviewsCount?: number;
  createdAt: string;
  // Динамические поля из конфига
  [key: string]: unknown;
}

// Категория
export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
}
