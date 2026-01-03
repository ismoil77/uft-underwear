import { ProductConfig } from '@/types/config'

// ╔════════════════════════════════════════════════════════════════╗
// ║                 НАСТРОЙКИ ТОВАРОВ                              ║
// ║              UFT — Нижнее бельё                             ║
// ╚════════════════════════════════════════════════════════════════╝

export const productConfig: ProductConfig = {
	// ===== НАЗВАНИЕ СУЩНОСТИ =====
	entityName: {
		singular: 'Изделие',
		plural: 'Изделия',
		genitive: 'изделий',
	},

	// ===== ПОЛЯ ТОВАРА =====
	fields: [
		{
			key: 'category',
			label: 'Категория',
			type: 'select',
			options: [
				'Бюстгальтеры',
				'Трусы',
				'Комплекты',
				'Корсеты',
				'Пижамы',
				'Халаты',
				'Боди',
			],
			filterable: true,
			showInCard: false,
			showInDetail: true,
			required: true,
		},
		{
			key: 'size',
			label: 'Размер',
			type: 'multiselect',
			options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
			filterable: true,
			showInCard: true,
			showInDetail: true,
			required: true,
		},
		{
			key: 'braCupSize',
			label: 'Размер чашки',
			type: 'multiselect',
			options: ['A', 'B', 'C', 'D', 'E', 'F'],
			filterable: true,
			showInCard: false,
			showInDetail: true,
		},
		{
			key: 'braSize',
			label: 'Обхват под грудью',
			type: 'multiselect',
			options: ['70', '75', '80', '85', '90', '95'],
			filterable: true,
			showInCard: false,
			showInDetail: true,
		},
		{
			key: 'color',
			label: 'Цвет',
			type: 'select',
			options: [
				'Чёрный',
				'Белый',
				'Бежевый',
				'Розовый',
				'Красный',
				'Бордовый',
				'Синий',
				'Серый',
			],
			filterable: true,
			showInCard: true,
			showInDetail: true,
			required: true,
		},
		{
			key: 'material',
			label: 'Состав',
			type: 'text',
			showInCard: false,
			showInDetail: true,
		},
		{
			key: 'style',
			label: 'Стиль',
			type: 'select',
			options: [
				'Классический',
				'Спортивный',
				'Романтичный',
				'Эротический',
				'Повседневный',
			],
			filterable: true,
			showInCard: false,
			showInDetail: true,
		},
		{
			key: 'pushUp',
			label: 'Push-up эффект',
			type: 'boolean',
			filterable: true,
			showInCard: true,
			showInDetail: true,
		},
		{
			key: 'seamless',
			label: 'Бесшовное',
			type: 'boolean',
			filterable: true,
			showInCard: false,
			showInDetail: true,
		},
		{
			key: 'collection',
			label: 'Коллекция',
			type: 'select',
			options: ['Basic', 'Elegance', 'Passion', 'Sport', 'Bridal'],
			filterable: true,
			showInCard: false,
			showInDetail: true,
		},
	],

	// ===== СОРТИРОВКА =====
	sorting: [
		{ key: 'newest', label: 'Новинки' },
		{ key: 'popular', label: 'Популярные' },
		{ key: 'price_asc', label: 'Сначала дешевле' },
		{ key: 'price_desc', label: 'Сначала дороже' },
	],

	// ===== ОТОБРАЖЕНИЕ =====
	display: {
		showPrice: true,
		showOldPrice: true,
		showDiscount: true,
		showRating: true,
		showReviews: true,
		showStock: true,
		showSku: true,
		imagesPerProduct: 6,
	},

	// ===== КАРТОЧКА ТОВАРА =====
	card: {
		layout: 'vertical',
		imageAspect: '3:4',
		showQuickView: true,
		showAddToCart: false,
		showWishlist: true,
		showCompare: false,
	},
}
