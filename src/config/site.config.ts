export const siteConfig = {
	name: 'UFT',
	description: 'Магазин нижнего белья',
	url: 'https://uft.ru',

	currency: {
		code: 'UZS',
		symbol: 'UZS',
		position: 'after' as const,
	},

	contacts: {
		phone: '+998 00000000',
		email: 'info@uft.ru',
		address: 'г. Urgut, ул. Urgut, д. 1',
		workHours: 'Пн-Вс: 10:00-22:00',
	},

	social: {
		instagram: 'https://instagram.com/uft',
		telegram: 'https://t.me/uft',
		whatsapp: 'https://wa.me/79991234567',
	},

	navigation: [
		{ href: '/', label: 'nav.home' },
		{ href: '/catalog', label: 'nav.catalog' },
		{ href: '/collections', label: 'nav.collections' },
		{ href: '/about', label: 'nav.about' },
		{ href: '/contacts', label: 'nav.contacts' },
	],
}
