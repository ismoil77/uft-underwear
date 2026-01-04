'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { ordersAPI, sendTelegramNotification, updateOrderStatusWithNotification } from '@/lib/api';
import { Order, OrderStatus } from '@/types/api';
import { ChevronLeft, Eye, Trash2, X, Phone, Mail, MapPin, Calendar, Package } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { siteConfig } from '@/config';

const STATUS_ORDER: OrderStatus[] = ['new', 'viewed', 'called', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'];

const STATUS_CONFIG: Record<OrderStatus, { color: string; icon: string }> = {
  new: { color: 'bg-blue-100 text-blue-700', icon: '🆕' },
  viewed: { color: 'bg-gray-100 text-gray-700', icon: '👁️' },
  called: { color: 'bg-purple-100 text-purple-700', icon: '📞' },
  processing: { color: 'bg-yellow-100 text-yellow-700', icon: '⚙️' },
  shipped: { color: 'bg-indigo-100 text-indigo-700', icon: '📦' },
  delivered: { color: 'bg-teal-100 text-teal-700', icon: '🚚' },
  completed: { color: 'bg-green-100 text-green-700', icon: '✅' },
  cancelled: { color: 'bg-red-100 text-red-700', icon: '❌' },
};

export default function AdminOrdersPage() {
  const tAdmin = useTranslations('admin');
  const tCommon = useTranslations('common');
  const tStatus = useTranslations('orderStatus');

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | null>(null);
  const [selected, setSelected] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
    
    // Запуск очистки старых заказов раз в день (п.10)
    const lastCleanup = localStorage.getItem('lastOrdersCleanup');
    const now = new Date().toDateString();
    
    if (lastCleanup !== now) {
      ordersAPI.cleanOldOrders?.(30).then(() => {
        localStorage.setItem('lastOrdersCleanup', now);
      }).catch(() => {});
    }
  }, []);

  async function fetchOrders() {
    try {
      const data = await ordersAPI.getAll();
      setOrders(data.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      }));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

 
  // Изменение статуса с отправкой в Telegram (п.18)
  async function handleStatusChange(order: Order, newStatus: OrderStatus) {
    if (!order.id) return;
    
    try {
      const updated = await updateOrderStatusWithNotification(order.id, newStatus, order);
      
      if (updated) {
        setOrders(orders.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
        if (selected?.id === order.id) {
          setSelected({ ...selected, status: newStatus });
               

        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert(tAdmin('error'));
    }
  }

  async function handleDelete(id: number) {
    if (!confirm(tAdmin('deleteOrderConfirm'))) return;
    try {
      await ordersAPI.delete(id);
      setOrders(orders.filter(o => o.id !== id));
      setSelected(null);
    } catch (error) {
      alert(tAdmin('deleteError'));
    }
  }

  const filtered = filter ? orders.filter(o => o.status === filter) : orders;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin" className="text-gray-500 hover:text-gray-700">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">{tAdmin('orders')}</h1>
          <span className="ml-auto text-sm text-gray-500">
            {tCommon('all')}: {orders.length}
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Status Filter */}
        <div className="flex flex-wrap gap-2 mb-6 p-4 bg-white rounded-xl shadow-sm">
          <button
            onClick={() => setFilter(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === null ? 'bg-gray-800 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tCommon('all')} ({orders.length})
          </button>
          {STATUS_ORDER.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === s ? STATUS_CONFIG[s].color + ' shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {STATUS_CONFIG[s].icon} {tStatus(s)} ({orders.filter(o => o.status === s).length})
            </button>
          ))}
        </div>

        {/* Order Details Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                <h2 className="font-bold text-xl text-gray-800">
                  {tAdmin('orders')} #{selected.id}
                </h2>
                <button onClick={() => setSelected(null)} className="p-1 hover:bg-gray-200 rounded-full">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Status Buttons */}
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl">
                  {STATUS_ORDER.map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selected, s)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        selected.status === s
                          ? STATUS_CONFIG[s].color + ' ring-2 ring-offset-1'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {STATUS_CONFIG[s].icon} {tStatus(s)}
                    </button>
                  ))}
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package className="w-4 h-4" />
                    <span className="font-medium">{selected.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${selected.phone}`} className="hover:text-primary">{selected.phone}</a>
                  </div>
                  {selected.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${selected.email}`} className="hover:text-primary">{selected.email}</a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(selected.createdAt)}</span>
                  </div>
                  {selected.address && (
                    <div className="col-span-2 flex items-start gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 mt-1" />
                      <span>{selected.address}</span>
                    </div>
                  )}
                </div>

                {selected.comment && (
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-800 text-sm italic">
                    "{selected.comment}"
                  </div>
                )}

                {/* Items */}
                <div className="border-t pt-6">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                    {tAdmin('products')}
                  </p>
                  <div className="space-y-3">
                    {selected.items?.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg">
                        <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border">
                          {item.image ? (
                            <img src={item.image} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">📦</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} x {item.price?.toLocaleString()} UZS
                          </p>
                        </div>
                        <p className="font-bold text-gray-700">
                          {(item.quantity * item.price).toLocaleString()} UZS
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t flex justify-between items-center">
                    <span className="text-gray-500 font-medium">{tAdmin('total')}:</span>
                    <span className="font-black text-2xl text-primary">
                      {selected.total?.toLocaleString()} UZS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-20 text-center text-gray-400">{tCommon('loading')}</div>
          ) : filtered.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{tAdmin('id')}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{tAdmin('client')}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{tAdmin('sum')}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{tAdmin('status')}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{tAdmin('date')}</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">{tAdmin('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">#{order.id}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{order.name}</p>
                        <p className="text-sm text-gray-500">{order.phone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold">{order.total?.toLocaleString()} UZS</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_CONFIG[order.status].color}`}>
                        {STATUS_CONFIG[order.status].icon} {tStatus(order.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelected(order)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => order.id && handleDelete(order.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-20 text-center text-gray-400">{tAdmin('noOrders')}</div>
          )}
        </div>
      </main>
    </div>
  );
}