import { siteConfig } from '@/config';
import { API_URL } from '@/config/api.config';
import { Product, Category, Order, Property, TeamMember, Collection, AboutCompany, SocialMedia, Season, PolicyPrivacy } from '@/types/api';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

function createCRUD<T extends { id?: number }>(resource: string) {
  return {
    getAll: () => fetchAPI<T[]>(`/${resource}`),
    getById: (id: number) => fetchAPI<T>(`/${resource}/${id}`),
    create: (data: Omit<T, 'id'>) => fetchAPI<T>(`/${resource}`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<T>) => fetchAPI<T>(`/${resource}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: number) => fetchAPI<void>(`/${resource}/${id}`, { method: 'DELETE' }),
  };
}

export const productsAPI = {
  ...createCRUD<Product>('products'),
  
  getBySlug: async (slug: string): Promise<Product | null> => {
    try {
      const data = await fetchAPI<Product[]>(`/products?slug=${slug}`);
      return data[0] || null;
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      return null;
    }
  },
  
  getById: async (id: number): Promise<Product | null> => {
    try {
      const data = await fetchAPI<Product>(`/products/${id}`);
      return data || null;
    } catch (error) {
      console.error('Error fetching product by id:', error);
      return null;
    }
  },
  
  getByCollection: async (collectionId: number): Promise<Product[]> => {
    try {
      const allProducts = await fetchAPI<Product[]>('/products');
      return allProducts.filter(p => p.collectionIds?.includes(collectionId));
    } catch (error) {
      console.error('Error fetching products by collection:', error);
      return [];
    }
  },
  
  getByCategory: async (categoryId: number): Promise<Product[]> => {
    try {
      const data = await fetchAPI<Product[]>(`/products?categoryId=${categoryId}`);
      return data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  },
};

export const categoriesAPI = createCRUD<Category>('category');

export const ordersAPI = {
  ...createCRUD<Order>('orders'),
  
  cleanOldOrders: async (daysOld: number = 30): Promise<void> => {
    try {
      const orders = await fetchAPI<Order[]>('/orders');
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const oldOrders = orders.filter(order => {
        if (!order.createdAt) return false;
        return new Date(order.createdAt) < cutoffDate;
      });
      
      if (oldOrders.length > 0) {
        const existingBackup = localStorage.getItem('ordersBackup');
        const backup = existingBackup ? JSON.parse(existingBackup) : [];
        backup.push(...oldOrders);
        localStorage.setItem('ordersBackup', JSON.stringify(backup));
        
        for (const order of oldOrders) {
          if (order.id) {
            await fetchAPI<void>(`/orders/${order.id}`, { method: 'DELETE' });
          }
        }
      }
    } catch (error) {
      console.error('Error cleaning old orders:', error);
    }
  },
};

export const propertiesAPI = createCRUD<Property>('property');
export const teamAPI = createCRUD<TeamMember>('ourComand');

export const collectionsAPI = {
  ...createCRUD<Collection>('collection'),
  
  getProducts: async (collectionId: number): Promise<Product[]> => {
    return productsAPI.getByCollection(collectionId);
  },
};

export const aboutCompanyAPI = {
  get: () => fetchAPI<AboutCompany[]>('/aboutcompany').then(data => data[0] || null),
  update: (id: number, data: AboutCompany) => fetchAPI<AboutCompany>(`/aboutcompany/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  create: (data: AboutCompany) => fetchAPI<AboutCompany>('/aboutcompany', { method: 'POST', body: JSON.stringify(data) }),
};

export const socialMediaAPI = {
  get: () => fetchAPI<SocialMedia[]>('/socilalMediaOnlineResource').then(data => data[0] || null),
  update: (id: number, data: SocialMedia) => fetchAPI<SocialMedia>(`/socilalMediaOnlineResource/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  create: (data: SocialMedia) => fetchAPI<SocialMedia>('/socilalMediaOnlineResource', { method: 'POST', body: JSON.stringify(data) }),
};

export const seasonAPI = {
  get: () => fetchAPI<Season[]>('/seasons').then(data => data[0] || null),
  update: (id: number, data: Season) => fetchAPI<Season>(`/seasons/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  create: (data: Season) => fetchAPI<Season>('/seasons', { method: 'POST', body: JSON.stringify(data) }),
};

export const policyAPI = {
  get: () => fetchAPI<PolicyPrivacy[]>('/policyPrivacy').then(data => data[0] || null),
  update: (id: number, data: PolicyPrivacy) => fetchAPI<PolicyPrivacy>(`/policyPrivacy/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  create: (data: PolicyPrivacy) => fetchAPI<PolicyPrivacy>('/policyPrivacy', { method: 'POST', body: JSON.stringify(data) }),
};

// ============ TELEGRAM ============

// ============ TELEGRAM ============

// Хелпер для форматирования цены
const formatPrice = (price: number): string => {
  const formatted = new Intl.NumberFormat('ru-RU').format(price);
  return siteConfig.currency.position === 'before'
    ? `${siteConfig.currency.symbol}${formatted}`
    : `${formatted} ${siteConfig.currency.symbol}`;
};

// Базовая функция отправки в Telegram через API Route (чтобы обойти CORS)
export const sendTelegramNotification = async (message: string): Promise<boolean> => {
  try {
    console.log('sendTelegramNotification called, message length:', message.length);
    
    // Отправляем через наш API route, а не напрямую в Telegram (CORS!)
    const response = await fetch('/api/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    
    const result = await response.json();
    console.log('Telegram API response:', result);
    
    if (!response.ok) {
      console.error('Telegram send failed:', result);
      return false;
    }
    
    return result.success === true;
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    return false;
  }
};

// Отправка нового заказа в Telegram с накладной
export const sendOrderToTelegram = async (order: Order): Promise<boolean> => {
  console.log('sendOrderToTelegram called:', order);
  
  // Генерируем накладную для нового заказа
  const invoice = generateInvoiceText(
    order.id || 0, 
    '🆕 Новый заказ', 
    order
  );
  
  return sendTelegramNotification(invoice);
};

// Отправка фото в Telegram (для накладной)
export const sendTelegramPhoto = async (photoUrl: string, caption: string): Promise<boolean> => {
  try {
    console.log('sendTelegramPhoto called, photo:', photoUrl);
    
    const response = await fetch('/api/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photo: photoUrl, caption }),
    });
    
    const result = await response.json();
    console.log('Telegram photo response:', result);
    
    return result.success === true;
  } catch (error) {
    console.error('Error sending Telegram photo:', error);
    return false;
  }
};

// Генерация текстовой накладной для Telegram
const generateInvoiceText = (
  orderId: number,
  status: string,
  order: Order
): string => {
  const date = new Date().toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  
  // Шапка накладной
  let invoice = `
━━━━━━━━━━━━━━━━━━━━━━
📄 <b>НАКЛАДНАЯ № ${orderId}</b>
━━━━━━━━━━━━━━━━━━━━━━

📅 <b>Дата:</b> ${date}
🏷 <b>Статус:</b> ${status}

👤 <b>Покупатель:</b> ${order.name}
📱 <b>Телефон:</b> ${order.phone}`;

  if (order.address) {
    invoice += `\n📍 <b>Адрес:</b> ${order.address}`;
  }

  // Таблица товаров
  invoice += `\n
━━━━━━━━━━━━━━━━━━━━━━
📦 <b>ТОВАРЫ</b>
━━━━━━━━━━━━━━━━━━━━━━
`;

  let totalQty = 0;
  order.items?.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    totalQty += item.quantity;
    invoice += `
${index + 1}. ${item.name}
   ${item.quantity} шт × ${formatPrice(item.price)} = <b>${formatPrice(itemTotal)}</b>
`;
  });

  // Итоги
  invoice += `
━━━━━━━━━━━━━━━━━━━━━━
📊 <b>ИТОГО</b>
━━━━━━━━━━━━━━━━━━━━━━

📦 Товаров: <b>${totalQty} шт</b>
💰 К оплате: <b>${formatPrice(order.total)}</b>`;

  if (order.comment) {
    invoice += `\n\n💬 <i>${order.comment}</i>`;
  }

  invoice += `\n
━━━━━━━━━━━━━━━━━━━━━━`;

  return invoice.trim();
};

// Отправка уведомления о смене статуса в Telegram с накладной
export const sendStatusChangeToTelegram = async (
  orderId: number,
  newStatus: Order['status'],
  order: Order
): Promise<boolean> => {
  const statusLabels: Record<Order['status'], string> = {
    new: '🆕 Новый',
    viewed: '👁️ Просмотрен',
    called: '📞 Позвонили',
    processing: '⚙️ В обработке',
    shipped: '📦 Отправлен',
    delivered: '🚚 Доставлен',
    completed: '✅ Выполнен',
    cancelled: '❌ Отменён',
  };
  
  // Генерируем красивую накладную
  const invoice = generateInvoiceText(orderId, statusLabels[newStatus], order);
  
  return sendTelegramNotification(invoice);
};

// Обновление статуса заказа с уведомлением в Telegram
// export const updateOrderStatusWithNotification = async (
//   orderId: number,
//   newStatus: Order['status'],
//   order: Order
// ): Promise<Order | null> => {
//   try {
//     console.log('updateOrderStatusWithNotification:', { orderId, newStatus });
    
//     // Обновляем статус в базе
//     const updatedOrder = await ordersAPI.update(orderId, { 
//       status: newStatus,
//       updatedAt: new Date().toISOString(),
//     });
    
//     // Отправляем уведомление в Telegram
//     await sendStatusChangeToTelegram(orderId, newStatus, order);
    
//     return updatedOrder;
//   } catch (error) {
//     console.error('Error updating order status:', error);
//     return null;
//   }
// };

// ============ USERS API ============
export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager';
  createdAt?: string;
}

export const usersAPI = {
  getAll: () => fetchAPI<User[]>('/users'),
  getById: (id: number) => fetchAPI<User>(`/users/${id}`),
  create: (data: Omit<User, 'id'>) => fetchAPI<User>('/users', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  update: (id: number, data: Partial<User>) => fetchAPI<User>(`/users/${id}`, { 
    method: 'PATCH', 
    body: JSON.stringify(data) 
  }),
  delete: (id: number) => fetchAPI<void>(`/users/${id}`, { 
    method: 'DELETE' 
  }),
  getByEmail: async (email: string): Promise<User | null> => {
    try {
      const users = await fetchAPI<User[]>(`/users?email=${email}`);
      return users[0] || null;
    } catch {
      return null;
    }
  },
};

// Обновление статуса заказа с уведомлением в Telegram
export const updateOrderStatusWithNotification = async (
  orderId: number,
  newStatus: Order['status'],
  order: Order
): Promise<Order | null> => {
  try {
    console.log('updateOrderStatusWithNotification:', { orderId, newStatus });
    
    // Обновляем статус в базе
    const updatedOrder = await ordersAPI.update(orderId, { 
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
    
    // Отправляем уведомление в Telegram
    await sendStatusChangeToTelegram(orderId, newStatus, order);
    
    return updatedOrder;
  } catch (error) {
    console.error('Error updating order status:', error);
    return null;
  }
};


// Telegram Settings API
interface TelegramChat {
  id: string
  chatId: string
  threadId?: string | null   // 🔥 ДОБАВИЛИ
  name: string
  type: 'personal' | 'group' | 'channel' | 'thread'
  notifications: {
    newOrder: boolean
    statusChange: boolean
    lowStock: boolean
  }
  isActive: boolean
}


export interface TelegramSettings {
  id?: number;
  botToken: string;
  botUsername?: string;
  isActive: boolean;
  chats: TelegramChat[];
}

export const telegramSettingsAPI = {
  get: () => fetchAPI<TelegramSettings[]>('/telegramSettings').then(data => data[0] || null),
  update: (id: number, data: TelegramSettings) => fetchAPI<TelegramSettings>(`/telegramSettings/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  create: (data: TelegramSettings) => fetchAPI<TelegramSettings>('/telegramSettings', { method: 'POST', body: JSON.stringify(data) }),
};










