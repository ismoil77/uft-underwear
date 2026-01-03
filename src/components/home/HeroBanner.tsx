// 'use client';

// import { useTranslations } from 'next-intl';
// import { Link } from '@/i18n/navigation';
// import { ArrowRight } from 'lucide-react';

// export function HeroBanner() {
//   const t = useTranslations('home.hero');

//   return (
//     <section className="relative bg-gradient-to-br from-[#FBF9F9] via-[#FAF0F0] to-[#F5E6E6] overflow-hidden">
//       {/* Decorative elements */}
//       <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
//       <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
//       {/* Pattern overlay */}
//       <div className="absolute inset-0 opacity-5">
//         <div className="absolute inset-0" style={{
//           backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A5A5' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
//         }} />
//       </div>

//       <div className="container relative">
//         <div className="py-24 md:py-32 lg:py-40 text-center max-w-3xl mx-auto">
//           <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-secondary mb-6 leading-tight">
//             {t('title')}
//           </h1>
//           <p className="text-lg md:text-xl text-text-muted mb-10 leading-relaxed">
//             {t('subtitle')}
//           </p>
//           <Link
//             href="/catalog"
//             className="btn-primary inline-flex items-center gap-3 px-8 py-4 text-lg bg-secondary text-white hover:bg-secondary-hover"
//           >
//             {t('cta')}
//             <ArrowRight className="w-5 h-5" />
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }
