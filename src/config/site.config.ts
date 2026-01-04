// Вероятно, это файл src/config/index.ts или src/config/site.ts

import { SiteConfig } from '@/types'

export const siteConfig: SiteConfig = {
  name: "UFT Underwear",
  description: "Лучшее нижнее белье",
  // 1. Добавьте эти поля
  logo: "/logo.png",
  favicon: "/favicon.ico",
  
  contacts: {
    phone: "+998...",
    email: "info@example.com",
    address: "Ташкент...",
    workHours: "9:00 - 18:00",
    socials: {
       telegram: "@..."
    }
  },

  currency: {
    code: "UZS",
    symbol: "сум",
    position: "after"
  },

 	navigation: [
		{ href: '/', label: 'nav.home' },
		{ href: '/catalog', label: 'nav.catalog' },
		{ href: '/collections', label: 'nav.collections' },
		{ href: '/about', label: 'nav.about' },
		{ href: '/contacts', label: 'nav.contacts' },
	],

  // 2. Убедитесь, что SEO содержит именно эти три поля (как в вашем интерфейсе)
  seo: {
    titleTemplate: "%s | UFT Underwear",
    defaultTitle: "UFT Underwear - Магазин нижнего белья",
    keywords: ["белье", "купить", "ташкент"]
  }
};