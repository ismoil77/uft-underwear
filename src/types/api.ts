export interface LocalizedContent {
  name?: string;
  description?: string;
  label?: string;
}

export interface Category {
  id?: number;
  slug: string;
  image?: string;
  ru?: LocalizedContent;
  en?: LocalizedContent;
  uz?: LocalizedContent;
  tj?: LocalizedContent;
}

export interface Product {
  id?: number;
  slug: string;
  categoryId: number;
  price: number;
  oldPrice?: number;
  images?: string[];
  inStock?: boolean;
  propertyIds?: number[];
  collectionIds?: number[];
  sku?: string;
  ru?: LocalizedContent;
  en?: LocalizedContent;
  uz?: LocalizedContent;
  tj?: LocalizedContent;
  properties?: Record<string, any>;
  createdAt?: string;
  
}

export interface Order {
  id?: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  comment?: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt?: string;
  statusHistory?: StatusHistoryItem[];
}

export type OrderStatus = 'new' | 'viewed' | 'called' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled';

export interface StatusHistoryItem {
  status: OrderStatus;
  date: string;
  note?: string;
}

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Property {
  id?: number;
  key: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean';
  options?: string[];
  ru?: LocalizedContent;
  en?: LocalizedContent;
  uz?: LocalizedContent;
  tj?: LocalizedContent;
}

export interface TeamMember {
  id?: number;
  name: string;
  role: string;
  image?: string;
  description?: string;
  order?: number;
}

export interface Collection {
  id?: number;
  slug: string;
  image?: string;
  ru?: LocalizedContent;
  en?: LocalizedContent;
  uz?: LocalizedContent;
  tj?: LocalizedContent;
}

export interface AboutCompany {
  id?: number;
  ru?: { title?: string; description?: string; mission?: string; values?: string };
  en?: { title?: string; description?: string; mission?: string; values?: string };
  uz?: { title?: string; description?: string; mission?: string; values?: string };
  tj?: { title?: string; description?: string; mission?: string; values?: string };
}

export interface SocialMedia {
  id?: number;
  telegram?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
}

export interface Season {
  id?: number;
  winter?: boolean;
  spring?: boolean;
  summer?: boolean;
  autumn?: boolean;
}

export interface PolicyPrivacy {
  id?: number;
  ru?: { content?: string };
  en?: { content?: string };
  uz?: { content?: string };
  tj?: { content?: string };
}

export function getLocalized<T extends { ru?: LocalizedContent; en?: LocalizedContent; uz?: LocalizedContent; tj?: LocalizedContent }>(
  item: T,
  locale: string
): LocalizedContent | undefined {
  const loc = locale as 'ru' | 'en' | 'uz' | 'tj';
  return item[loc] || item.ru;
}
