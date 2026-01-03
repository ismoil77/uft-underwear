'use client'

import { Link } from '@/i18n/navigation'
import { categoriesAPI, productsAPI } from '@/lib/api'
import { Category, getLocalized, Product } from '@/types/api'
import { ChevronLeft, Edit, Plus, Search, Trash2 } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { useEffect, useState } from 'react'

export default function AdminProductsPage() {
   const locale = useLocale() // Получаем текущий язык (ru, uz, tj, en)
   const t = useTranslations('admin')
   const tCommon = useTranslations('common')
   const tHome = useTranslations('home')

   const [products, setProducts] = useState<Product[]>([])
   const [categories, setCategories] = useState<Category[]>([])
   const [loading, setLoading] = useState(true)
   const [search, setSearch] = useState('')
   const [categoryFilter, setCategoryFilter] = useState<number | null>(null)

   useEffect(() => {
      fetchData()
   }, [])

   async function fetchData() {
      try {
         const [prods, cats] = await Promise.all([
            productsAPI.getAll(),
            categoriesAPI.getAll(),
         ])
         setProducts(prods)
         setCategories(cats)
      } catch (error) {
         console.error('Error:', error)
      } finally {
         setLoading(false)
      }
   }

   async function handleDelete(id: number | undefined) {
      if (!id) return
      if (!confirm(t('deleteProductConfirm'))) return
      try {
         await productsAPI.delete(id)
         setProducts(products.filter(p => p.id !== id))
      } catch (error) {
         alert(t('deleteError'))
      }
   }

   const filtered = products.filter(p => {
      // Используем текущую локаль для поиска
      const loc = getLocalized(p, locale as any)
      const matchSearch =
         !search || loc?.name?.toLowerCase().includes(search.toLowerCase())
      const matchCategory = !categoryFilter || p.categoryId === categoryFilter
      return matchSearch && matchCategory
   })

   return (
      <div className='min-h-screen bg-gray-100'>
         <header className='bg-white shadow-sm'>
            <div className='max-w-7xl mx-auto px-4 py-4 flex items-center gap-4'>
               <Link href='/admin' className='text-gray-500 hover:text-gray-700'>
                  <ChevronLeft className='w-5 h-5' />
               </Link>
               <h1 className='text-2xl font-bold'>{t('products')}</h1>
            </div>
         </header>

         <main className='max-w-7xl mx-auto px-4 py-8'>
            <div className='flex flex-col md:flex-row gap-4 mb-6'>
               <div className='flex-1 relative'>
                  <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                  <input
                     type='text'
                     placeholder={`${tCommon('search')}...`}
                     value={search}
                     onChange={e => setSearch(e.target.value)}
                     className='w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
                  />
               </div>
               <select
                  value={categoryFilter || ''}
                  onChange={e =>
                     setCategoryFilter(e.target.value ? Number(e.target.value) : null)
                  }
                  className='px-4 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500'
               >
                  <option value=''>{tHome('categories.title')}</option>
                  {categories.map(cat => (
                     <option key={cat.id} value={cat.id}>
                        {getLocalized(cat, locale as any)?.name || cat.slug}
                     </option>
                  ))}
               </select>
               <Link
                  href='/admin/products/new'
                  className='flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
               >
                  <Plus className='w-5 h-5' /> {t('add')}
               </Link>
            </div>

            <div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200'>
               {loading ? (
                  <div className='p-20 text-center text-gray-500'>{t('loading')}</div>
               ) : filtered.length > 0 ? (
                  <div className="overflow-x-auto">
                     <table className='w-full'>
                        <thead className='bg-gray-50 border-b border-gray-100'>
                           <tr>
                              <th className='text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider'>
                                 {t('photo')}
                              </th>
                              <th className='text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider'>
                                 {t('name')}
                              </th>
                              <th className='text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider'>
                                 {t('price')}
                              </th>
                              <th className='text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider'>
                                 {t('status')}
                              </th>
                              <th className='text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider'>
                                 {t('actions')}
                              </th>
                           </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100'>
                           {filtered.map(product => {
                              const loc = getLocalized(product, locale as any)
                              return (
                                 <tr key={product.id} className='hover:bg-gray-50/50 transition-colors'>
                                    <td className='px-6 py-4'>
                                       <div className='w-14 h-14 bg-gray-50 rounded-lg overflow-hidden border border-gray-100'>
                                          {product.images?.[0] ? (
                                             <img
                                                src={product.images[0]}
                                                alt=''
                                                className='w-full h-full object-cover'
                                             />
                                          ) : (
                                             <div className='w-full h-full flex items-center justify-center text-gray-300 text-[10px]'>
                                                NO IMG
                                             </div>
                                          )}
                                       </div>
                                    </td>
                                    <td className='px-6 py-4'>
                                       <p className="font-medium text-gray-900">{loc?.name || product.slug}</p>
                                       <p className="text-xs text-gray-400 font-mono">ID: {product.id}</p>
                                    </td>
                                    <td className='px-6 py-4 font-bold text-gray-700'>
                                       {product.price?.toLocaleString()} UZS
                                    </td>
                                    <td className='px-6 py-4'>
                                       <span
                                          className={`px-3 py-1 text-[11px] font-bold rounded-full ${
                                             product.inStock
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                          }`}
                                       >
                                          {product.inStock ? t('inStock') : t('outOfStock')}
                                       </span>
                                    </td>
                                    <td className='px-6 py-4 text-right'>
                                       <div className="flex justify-end gap-2">
                                          <Link
                                             href={`/admin/products/${product.id}`}
                                             className='p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors'
                                          >
                                             <Edit className='w-4 h-4' />
                                          </Link>
                                          <button
                                             onClick={() => handleDelete(product.id)}
                                             className='p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors'
                                          >
                                             <Trash2 className='w-4 h-4' />
                                          </button>
                                       </div>
                                    </td>
                                 </tr>
                              )
                           })}
                        </tbody>
                     </table>
                  </div>
               ) : (
                  <div className='p-20 text-center text-gray-400'>{t('noProducts')}</div>
               )}
            </div>
         </main>
      </div>
   )
}