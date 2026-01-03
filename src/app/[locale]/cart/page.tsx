'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCartStore } from '@/store/cartStore';
import { ordersAPI, sendToTelegram } from '@/lib/api';
import { siteConfig } from '@/config';
import { Trash2, Minus, Plus, ShoppingBag, CheckCircle } from 'lucide-react';

export default function CartPage() {
  const t = useTranslations('cart');
  const tCheckout = useTranslations('checkout');
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    comment: '',
  });

  const formatPrice = (price: number) => {
    const formatted = new Intl.NumberFormat('ru-RU').format(price);
    return siteConfig.currency.position === 'before'
      ? `${siteConfig.currency.symbol}${formatted}`
      : `${formatted} ${siteConfig.currency.symbol}`;
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
          size: item.size,
          color: item.color,
        })),
        total: getTotal(),
        status: 'new' as const,
      };

      // Сохраняем заказ в API
      const savedOrder = await ordersAPI.create(order);
      
      // Отправляем в Telegram
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
              /* Cart items */
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="card p-4 flex gap-4"
                  >
                    {/* Image */}
                    <div className="w-24 h-32 bg-surface rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingBag className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-secondary line-clamp-2 mb-1">
                        {item.name}
                      </h3>
                      {item.size && (
                        <p className="text-sm text-text-muted mb-2">
                          Размер: {item.size}
                        </p>
                      )}
                      <p className="font-semibold text-lg">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-text-muted hover:text-error transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-primary transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-primary transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Checkout form */
              <form onSubmit={handleSubmit} className="card p-6 space-y-6">
                <h2 className="text-xl font-semibold">{tCheckout('contactInfo')}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {tCheckout('name')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input"
                      placeholder="Ваше имя"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {tCheckout('phone')} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="input"
                      placeholder="+7 (999) 999-99-99"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {tCheckout('email')}
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {tCheckout('address')}
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="input"
                    placeholder="Город, улица, дом, квартира"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {tCheckout('comment')}
                  </label>
                  <textarea
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    className="input min-h-[100px]"
                    placeholder={tCheckout('commentPlaceholder')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-4 text-lg"
                >
                  {loading ? 'Оформление...' : tCheckout('placeOrder')}
                </button>
              </form>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">{t('total')}</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-text-muted">{t('subtotal')}</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">{t('delivery')}</span>
                  <span className="text-success">{t('deliveryFree')}</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold">
                  <span>{tCheckout('orderTotal')}</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
              </div>

              {step === 'cart' && (
                <button
                  onClick={() => setStep('checkout')}
                  className="w-full btn-primary py-4"
                >
                  {t('checkout')}
                </button>
              )}

              {step === 'checkout' && (
                <button
                  onClick={() => setStep('cart')}
                  className="w-full btn-outline py-3"
                >
                  Назад к корзине
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
