// 'use client';

// import { useTranslations } from 'next-intl';
// import { Link } from '@/i18n/navigation';
// import { ArrowRight } from 'lucide-react';
// import  ProductCard  from '@/components/product/ProductCard';

// // Популярные изделия нижнего белья
// const products = [

// ];

// export function FeaturedProducts() {
//   const t = useTranslations('home.featured');

//   return (
//     <section className="section">
//       <div className="container">
//         {/* Header */}
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

//         {/* Grid */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
//           {products.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
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
