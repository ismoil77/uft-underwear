// 'use client';

// import { useEffect, useState } from 'react';
// import { useTranslations, useLocale } from 'next-intl';
// import { Link } from '@/i18n/navigation';
// import { productsAPI } from '@/lib/api';
// import { Product, getLocalized } from '@/types/api';
// import { Locale } from '@/config/api.config';
// import { ArrowRight, ShoppingCart, Heart } from 'lucide-react';
// import { useCartStore } from '@/store/cartStore';
// import { useWishlistStore } from '@/store/wishlistStore';

// export function FeaturedProducts() {
//   const t = useTranslations('home.featured');
//   const tProduct = useTranslations('product');
//   const locale = useLocale() as Locale;
  
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
  
//   const { addItem: addToCart } = useCartStore();
//   const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();

//   useEffect(() => {
//     productsAPI.getAll()
//       .then(data => setProducts(data.slice(0, 8)))
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, []);

//   const isInWishlist = (productId: number) => {
//     return wishlistItems.some(item => item.productId === productId);
//   };

//   const handleWishlistToggle = (product: Product) => {
//     const loc = getLocalized(product, locale);
//     if (isInWishlist(product.id!)) {
//       removeFromWishlist(product.id!);
//     } else {
//       addToWishlist({
//         productId: product.id!,
//         name: loc?.name || 'Товар',
//         price: product.price,
//         image: product.images?.[0] || '',
//       });
//     }
//   };

//   const handleAddToCart = (product: Product) => {
//     const loc = getLocalized(product, locale);
//     addToCart({
//       productId: product.id!,
//       name: loc?.name || 'Товар',
//       price: product.price,
//       image: product.images?.[0] || '',
//       propertyIds: product.propertyIds,
//       collectionIds: product.collectionIds,
//     });
//   };

//   if (loading) {
//     return (
//       <section className="section">
//         <div className="container">
//           <h2 className="section-title">{t('title')}</h2>
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
//             {[1, 2, 3, 4].map(i => (
//               <div key={i} className="aspect-[3/4] bg-gray-100 rounded-xl animate-pulse" />
//             ))}
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="section">
//       <div className="container">
//         <div className="flex items-center justify-between mb-8">
//           <h2 className="section-title mb-0">{t('title')}</h2>
//           <Link
//             href="/catalog"
//             className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
//           >
//             {t('viewAll')}
//             <ArrowRight className="w-4 h-4" />
//           </Link>
//         </div>

//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
//           {products.map((product) => {
//             const loc = getLocalized(product, locale);
//             const inWishlist = isInWishlist(product.id!);

//             return (
//               <div key={product.id} className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
//                 {/* Wishlist Button */}
//                 <button
//                   onClick={() => handleWishlistToggle(product)}
//                   className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
//                     inWishlist
//                       ? 'bg-red-500 text-white'
//                       : 'bg-white/80 text-gray-500 hover:text-red-500'
//                   }`}
//                 >
//                   <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
//                 </button>

//                 {/* Image */}
//                 <Link href={`/catalog/${product.slug}`}>
//                   <div className="aspect-[3/4] bg-surface relative overflow-hidden">
//                     {product.images?.[0] ? (
//                       <img
//                         src={product.images[0]}
//                         alt={loc?.name || ''}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center text-gray-300">
//                         Нет фото
//                       </div>
//                     )}
//                   </div>
//                 </Link>

//                 {/* Info */}
//                 <div className="p-4">
//                   <Link href={`/catalog/${product.slug}`}>
//                     <h3 className="font-medium text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
//                       {loc?.name || product.slug}
//                     </h3>
//                   </Link>

//                   {/* Цена скрыта по требованию п.9 */}
//                   {
//             !product.hidePrice? <div className="flex items-center gap-2 mb-3">
//                     <span className="font-bold text-primary">{product.price.toLocaleString()} UZS</span>
//                   </div>:''
//                   }
                  
                 

//                   {/* Add to Cart Button - внизу карточки (п.19) */}
//                   <button
//                     onClick={() => handleAddToCart(product)}
//                     className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors :active:bg-green-500"
//                   >
//                     <ShoppingCart className="w-4 h-4" />
//                     {tProduct('addToCart')}
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Mobile View All */}
//         <div className="mt-8 text-center sm:hidden">
//           <Link
//             href="/catalog"
//             className="btn-outline inline-flex items-center gap-2"
//           >
//             {t('viewAll')}
//             <ArrowRight className="w-4 h-4" />
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }