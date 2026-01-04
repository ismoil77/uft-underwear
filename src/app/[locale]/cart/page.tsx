'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCartStore } from '@/store/cartStore';
import { ordersAPI, propertiesAPI, collectionsAPI, sendTelegramNotification } from '@/lib/api';
import { Property, Collection, getLocalized } from '@/types/api';
import { Locale } from '@/config/api.config';
import { siteConfig } from '@/config';
import { ShoppingBag, Trash2, Plus, Minus, CheckCircle, Tag, Layers } from 'lucide-react';

export default function CartPage() {
  const t = useTranslations('cart');
  const tCheckout = useTranslations('checkout');
  const locale = useLocale() as Locale;
  
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [mounted, setMounted] = useState(false);
  
  // Для отображения свойств и коллекций (п.22)
  const [properties, setProperties] = useState<Property[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    comment: '',
  });

  useEffect(() => {
    setMounted(true);
    
    // Загружаем свойства и коллекции для отображения
    Promise.all([
      propertiesAPI.getAll(),
      collectionsAPI.getAll(),
    ]).then(([props, cols]) => {
      setProperties(props);
      setCollections(cols);
    }).catch(() => {});
  }, []);

  const formatPrice = (price: number) => {
    const formatted = new Intl.NumberFormat('ru-RU').format(price);
    
    return siteConfig.currency.position === 'before'
      ? `${siteConfig.currency.symbol}${formatted}`
      : `${formatted} ${siteConfig.currency.symbol}`;
  };

  // Получить названия свойств по ID (п.22)
  const getPropertyNames = (propertyIds?: number[]) => {
    if (!propertyIds || !properties.length) return [];
    return properties
      .filter(p => propertyIds.includes(p.id!))
      .map(p => getLocalized(p, locale)?.label || p.key);
  };

  // Получить названия коллекций по ID (п.22)
  const getCollectionNames = (collectionIds?: number[]) => {
    if (!collectionIds || !collections.length) return [];
    return collections
      .filter(c => collectionIds.includes(c.id!))
      .map(c => getLocalized(c, locale)?.name || c.slug);
  };

  const sendToTelegram = async (order: any) => {
    const itemsList = order.items
      .map((item: any) => `• ${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`)
      .join('\n');

    const message = `
🛒 <b>Новый заказ!</b>

👤 <b>Клиент:</b> ${order.name}
📱 <b>Телефон:</b> ${order.phone}
${order.email ? `📧 <b>Email:</b> ${order.email}` : ''}
${order.address ? `📍 <b>Адрес:</b> ${order.address}` : ''}
📝 <b>Статус:</b> ${order.status}
📦 <b>Товары:</b>
${itemsList}

💰 <b>Итого:</b> ${formatPrice(order.total)}

${order.comment ? `💬 <b>Комментарий:</b> ${order.comment}` : ''}
    `.trim();

    await sendTelegramNotification(message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const order = {
        ...form,
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          size: item.size,
          color: item.color,
          // Сохраняем propertyIds и collectionIds (п.22)
          propertyIds: item.propertyIds,
          collectionIds: item.collectionIds,
                    hidePrice:item.hidePrice,

        })),
        total: getTotal(),
        status: 'new' as const,
        createdAt: new Date().toISOString(),
      };

      const savedOrder = await ordersAPI.create(order);
      await sendToTelegram(order);

      setOrderNumber(savedOrder.id?.toString() || Date.now().toString());
      clearCart();
      setStep('success');
    } catch (error) {
      console.error('Order error:', error);
      alert('Ошибка при оформлении заказа');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  // Пустая корзина
  if (items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag className="w-24 h-24 text-gray-300 mb-6" />
        <h1 className="text-2xl font-heading font-semibold mb-2">{t('empty')}</h1>
        <p className="text-text-muted mb-8">{t('emptyDesc')}</p>
        <Link href="/catalog" className="btn-primary">
          {t('continueShopping')}
        </Link>
      </div>
    );
  }

  // Успешный заказ
  if (step === 'success') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <CheckCircle className="w-24 h-24 text-success mb-6" />
        <h1 className="text-2xl font-heading font-semibold mb-2">{tCheckout('success')}</h1>
        <p className="text-text-muted mb-2">
          {tCheckout('orderNumber', { number: orderNumber })}
        </p>
        <p className="text-text-muted mb-8">{tCheckout('successDesc')}</p>
        <Link href="/catalog" className="btn-primary">
          {t('continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <h1 className="text-3xl md:text-4xl font-heading font-semibold text-secondary mb-8">
          {step === 'cart' ? t('title') : tCheckout('title')}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {step === 'cart' ? (
              <div className="space-y-4">
                {items.map((item) => {
                  const propNames = getPropertyNames(item.propertyIds);
                  const colNames = getCollectionNames(item.collectionIds);
                  
                  return (
                    <div key={`${item.productId}-${item.size}`} className="bg-white rounded-xl p-4 shadow-sm flex gap-4">
                      <div className="w-24 h-24 bg-surface rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">📦</div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{item.name}</h3>
                        
                        {/* Размер и цвет */}
                        {(item.size || item.color) && (
                          <p className="text-sm text-gray-500 mb-1">
                            {item.size && <span>Размер: {item.size}</span>}
                            {item.size && item.color && ' • '}
                            {item.color && <span>Цвет: {item.color}</span>}
                          </p>
                        )}
                        
                        {/* Свойства товара (п.22) */}
                        {propNames.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                            <Tag className="w-3 h-3" />
                            <span>{propNames.join(', ')}</span>
                          </div>
                        )}
                        
                        {/* Коллекции товара (п.22) */}
                        {colNames.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-primary mb-1">
                            <Layers className="w-3 h-3" />
                            <span>{colNames.join(', ')}</span>
                          </div>
                        )}
                        
                        {/* Цена скрыта по требованию п.9 */}
                       {!item.hidePrice? <p className="text-primary font-semibold">{formatPrice(item.price)}</p>:""}
                        
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="flex justify-between items-center pt-4">
                  <button onClick={clearCart} className="text-red-500 hover:text-red-600 text-sm">
                    {t('clear')}
                  </button>
                  <Link href="/catalog" className="text-primary hover:underline text-sm">
                    {t('continueShopping')}
                  </Link>
                </div>
              </div>
            ) : (
              // Checkout Form
              <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{tCheckout('name')} *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">{tCheckout('phone')} *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">{tCheckout('email')}</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">{tCheckout('address')}</label>
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">{tCheckout('comment')}</label>
                  <textarea
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    placeholder={tCheckout('commentPlaceholder')}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover disabled:opacity-50"
                >
                  {loading ? 'Оформление...' : tCheckout('placeOrder')}
                </button>
              </form>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="font-semibold mb-4">{t('subtotal')}</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>{t('item')} ({items.length})</span>
                  {/* Цена скрыта */}
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t('delivery')}</span>
                  <span className="text-green-600">{t('deliveryFree')}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">{t('total')}</span>
                  {/* Цена скрыта по требованию п.9 */}
                 {!items[0].hidePrice? <span className="text-xl font-bold text-primary">{formatPrice(getTotal())}</span>
                  :<span className="text-sm text-gray-500">Цена по запросу</span>}
                </div>

                {step === 'cart' && (
                  <button
                    onClick={() => setStep('checkout')}
                    className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover"
                  >
                    {t('checkout')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}