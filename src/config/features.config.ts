import { FeaturesConfig } from '@/types/config'

// ╔════════════════════════════════════════════════════════════════╗
// ║                   ФУНКЦИОНАЛ САЙТА                             ║
// ║              UFT — Магазин нижнего белья                    ║
// ╚════════════════════════════════════════════════════════════════╝

export const featuresConfig: FeaturesConfig = {
	// ===== КОРЗИНА =====
	cart: {
		enabled: true,
		minOrder: 2000,
		maxItems: 30,
		showQuantity: true,
	},

	// ===== ОФОРМЛЕНИЕ ЗАКАЗА =====
	checkout: {
		guestCheckout: true,
		requirePhone: true,
		requireEmail: true,
		requireAddress: true,
		showComments: true,
		paymentMethods: ['card', 'online'],
		deliveryMethods: ['courier', 'pickup', 'post'],
	},

	// ===== ПОЛЬЗОВАТЕЛИ =====
	auth: {
		enabled: true,
		providers: ['phone', 'email'],
	},

	// ===== ДОПОЛНИТЕЛЬНО =====
	wishlist: true,
	compare: false,
	reviews: true,
	search: true,
	filters: true,
	categories: true,
	brands: false,

	// ===== ИНТЕГРАЦИИ =====
	integrations: {
		analytics: {
			google: '',
			yandex: '',
		},
		chat: {
			enabled: true,
			provider: 'whatsapp',
		},
	},

	// ===== СЕКЦИИ ГЛАВНОЙ =====
	homepage: {
		heroBanner: true,
		featuredProducts: true,
		categories: true,
		benefits: true,
		testimonials: true,
		brands: false,
		newsletter: true,
	},
}
