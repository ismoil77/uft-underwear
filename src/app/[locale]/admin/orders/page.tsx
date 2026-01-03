'use client'

import { Link } from '@/i18n/navigation'
import { ordersAPI } from '@/lib/api'
import { Order, OrderStatus } from '@/types/api'
import { ChevronLeft, Eye, MessageCircle, Phone, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

export default function AdminOrdersPage() {
   const tAdmin = useTranslations('admin')
   const tStatus = useTranslations('orderStatus')
   const tCommon = useTranslations('common')
   
   const [orders, setOrders] = useState<Order[]>([])
   const [loading, setLoading] = useState(true)
   const [selected, setSelected] = useState<Order | null>(null)
   const [filter, setFilter] = useState<OrderStatus | 'all'>('all')

   // Конфигурация цветов и иконок (текст теперь берется из tStatus)
   const STATUS_CONFIG: Record<OrderStatus, { color: string; icon: string }> = {
      new: { color: 'bg-blue-100 text-blue-700', icon: '🆕' },
      viewed: { color: 'bg-gray-100 text-gray-700', icon: '👁️' },
      called: { color: 'bg-yellow-100 text-yellow-700', icon: '📞' },
      processing: { color: 'bg-orange-100 text-orange-700', icon: '⚙️' },
      shipped: { color: 'bg-purple-100 text-purple-700', icon: '📦' },
      delivered: { color: 'bg-teal-100 text-teal-700', icon: '🚚' },
      completed: { color: 'bg-green-100 text-green-700', icon: '✅' },
      cancelled: { color: 'bg-red-100 text-red-700', icon: '❌' },
   }

   const STATUS_ORDER: OrderStatus[] = [
      'new', 'viewed', 'called', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'
   ]

   useEffect(() => {
      ordersAPI
         .getAll()
         .then(data => setOrders(data.reverse()))
         .catch(() => {})
         .finally(() => setLoading(false))
   }, [])

   const handleStatusChange = async (order: Order, newStatus: OrderStatus) => {
      try {
         const history = order.statusHistory || []
         history.push({ status: newStatus, date: new Date().toISOString() })
         const updated = await ordersAPI.update(order.id!, {
            status: newStatus,
            statusHistory: history,
         })
         setOrders(orders.map(o => (o.id === order.id ? updated : o)))
         if (selected?.id === order.id) setSelected(updated)
      } catch (e) {
         alert(tAdmin('error'))
      }
   }

   const handleDelete = async (id: number) => {
      if (!confirm(tAdmin('deleteOrderConfirm'))) return
      await ordersAPI.delete(id)
      setOrders(orders.filter(o => o.id !== id))
      if (selected?.id === id) setSelected(null)
   }

   const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

   return (
      <div className='min-h-screen bg-gray-100'>
         <header className='bg-white shadow-sm border-b'>
            <div className='max-w-7xl mx-auto px-4 py-4 flex items-center gap-4'>
               <Link href='/admin' className='text-gray-500 hover:text-primary transition-colors'>
                  <ChevronLeft className='w-5 h-5' />
               </Link>
               <h1 className='text-2xl font-bold text-gray-900'>{tAdmin('orders')}</h1>
            </div>
         </header>

         <main className='max-w-7xl mx-auto px-4 py-8'>
            {/* Фильтры */}
            <div className='flex flex-wrap gap-2 mb-6'>
               <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                     filter === 'all' ? 'bg-gray-800 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
               >
                  {tCommon('all')} ({orders.length})
               </button>
               {STATUS_ORDER.map(s => (
                  <button
                     key={s}
                     onClick={() => setFilter(s)}
                     className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                        filter === s ? STATUS_CONFIG[s].color + ' shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-50'
                     }`}
                  >
                     {STATUS_CONFIG[s].icon} {tStatus(s)} ({orders.filter(o => o.status === s).length})
                  </button>
               ))}
            </div>

            {/* Модальное окно деталей заказа */}
            {selected && (
               <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
                  <div className='bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl'>
                     <div className='p-6 border-b flex justify-between items-center bg-gray-50/50'>
                        <h2 className='font-bold text-xl text-gray-800'>{tAdmin('orders')} #{selected.id}</h2>
                        <button onClick={() => setSelected(null)} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                           <X className='w-6 h-6 text-gray-500' />
                        </button>
                     </div>
                     <div className='p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]'>
                        {/* Смена статуса в модалке */}
                        <div className='flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100'>
                           {STATUS_ORDER.map(s => (
                              <button
                                 key={s}
                                 onClick={() => handleStatusChange(selected, s)}
                                 className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                                    selected.status === s
                                       ? STATUS_CONFIG[s].color + ' ring-2 ring-offset-1 ring-current'
                                       : 'bg-white text-gray-400 border border-gray-200 hover:border-gray-300'
                                 }`}
                              >
                                 {STATUS_CONFIG[s].icon} {tStatus(s)}
                              </button>
                           ))}
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                           <div>
                              <p className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-1'>{tAdmin('client')}</p>
                              <p className='font-semibold text-gray-800 text-lg'>{selected.name}</p>
                           </div>
                           <div>
                              <p className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-1'>{tAdmin('phone')}</p>
                              <div className='flex items-center gap-3'>
                                 <span className="font-medium">{selected.phone}</span>
                                 <a href={`tel:${selected.phone}`} className='p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors'>
                                    <Phone className='w-4 h-4' />
                                 </a>
                                 <a 
                                    href={`https://wa.me/${selected.phone.replace(/\D/g, '')}`} 
                                    className='p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors'
                                 >
                                    <MessageCircle className='w-4 h-4' />
                                 </a>
                              </div>
                           </div>
                           {selected.address && (
                              <div className='col-span-full'>
                                 <p className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-1'>{tAdmin('address')}</p>
                                 <p className="text-gray-700 p-3 bg-gray-50 rounded-lg border border-gray-100">{selected.address}</p>
                              </div>
                           )}
                        </div>

                        {selected.comment && (
                           <div className='bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-800 text-sm italic'>
                              "{selected.comment}"
                           </div>
                        )}

                        <div className='border-t pt-6'>
                           <p className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-4'>{tAdmin('products')}</p>
                           <div className="space-y-3">
                              {selected.items?.map((item, i) => (
                                 <div key={i} className='flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors'>
                                    <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border">
                                       {item.image ? (
                                          <img src={item.image} className='w-full h-full object-cover' alt="" />
                                       ) : (
                                          <div className="w-full h-full flex items-center justify-center text-gray-300">📦</div>
                                       )}
                                    </div>
                                    <div className="flex-1">
                                       <p className="font-semibold text-gray-800">{item.name}</p>
                                       <p className='text-sm text-gray-500'>
                                          {item.quantity} x {item.price?.toLocaleString()} UZS
                                       </p>
                                    </div>
                                    <p className="font-bold text-gray-700">{(item.quantity * item.price).toLocaleString()} UZS</p>
                                 </div>
                              ))}
                           </div>
                           <div className="mt-6 pt-4 border-t flex justify-between items-center">
                              <span className="text-gray-500 font-medium">{tAdmin('total')}:</span>
                              <span className='font-black text-2xl text-primary'>
                                 {selected.total?.toLocaleString()} UZS
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* Таблица */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
               {loading ? (
                  <div className='p-20 text-center text-gray-400'>{tCommon('loading')}</div>
               ) : filtered.length > 0 ? (
                  <div className="overflow-x-auto">
                     <table className='w-full text-sm text-left'>
                        <thead className='bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-widest border-b'>
                           <tr>
                              <th className='px-6 py-4'>№</th>
                              <th className='px-6 py-4'>{tAdmin('client')}</th>
                              <th className='px-6 py-4'>{tAdmin('sum')}</th>
                              <th className='px-6 py-4'>{tAdmin('status')}</th>
                              <th className='px-6 py-4'>{tAdmin('date')}</th>
                              <th className='px-6 py-4 text-right'></th>
                           </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100'>
                           {filtered.map(order => (
                              <tr key={order.id} className='hover:bg-gray-50/50 transition-colors group'>
                                 <td className='px-6 py-4 font-mono text-gray-400'>#{order.id}</td>
                                 <td className='px-6 py-4'>
                                    <p className="font-bold text-gray-800">{order.name}</p>
                                    <p className='text-xs text-gray-400'>{order.phone}</p>
                                 </td>
                                 <td className='px-6 py-4 font-bold text-gray-700'>
                                    {order.total?.toLocaleString()} UZS
                                 </td>
                                 <td className='px-6 py-4'>
                                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${STATUS_CONFIG[order.status]?.color || 'bg-gray-100'}`}>
                                       {STATUS_CONFIG[order.status]?.icon} {tStatus(order.status)}
                                    </span>
                                 </td>
                                 <td className='px-6 py-4 text-gray-500'>
                                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                                 </td>
                                 <td className='px-6 py-4 text-right'>
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                       <button
                                          onClick={() => setSelected(order)}
                                          className='p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors'
                                       >
                                          <Eye className='w-4 h-4' />
                                       </button>
                                       <button
                                          onClick={() => handleDelete(order.id!)}
                                          className='p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors'
                                       >
                                          <Trash2 className='w-4 h-4' />
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               ) : (
                  <div className='p-20 text-center text-gray-400 font-medium'>{tAdmin('noOrders')}</div>
               )}
            </div>
         </main>
      </div>
   )
}