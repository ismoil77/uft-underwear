import { Locale } from '@/config/api.config'

export interface TelegramChat {
  id: string;
  chatId: string;
  threadId?: string | null; // Разрешаем null, так как API часто его возвращает
  chatTitle?: string;       // Добавляем это поле, так как вы его используете
  name: string;
  type: 'personal' | 'group' | 'channel' | 'thread';
  userId?: string;
  username?: string;
  notifications: {
    newOrder: boolean;
    statusChange: boolean;
    lowStock: boolean;
  };
  isActive: boolean;
}
// Определение структуры данных, которые приходят от Telegram GetUpdates
export interface TelegramUpdate {
	update_id: number
	chatId: number | any
	message_thread_id?: number
	userName?: string
	threadId?: number | any
	type?: string
	text?: string
	chatTitle?: string | any
	updateId?: number
	name?: string | undefined
	message?: {
		chat: {
			id: number
			first_name?: string
			last_name?: string
			username?: string
			title?: string // для групп
			type: string
		}

		from: {
			id: number
			first_name: string
		}
	}
}

export interface TelegramSettings {
	id?: number
	botToken: string
	botUsername?: string
	isActive: boolean
	chats: TelegramChat[]
}

// Локализованный контент
export interface LocalizedContent {
	name?: string
	description?: string
	label?: string
	title?: string
	mission?: string
	values?: string
}
// Тип для политики конфиденциальности (если используется отдельно от Policy)
export interface PolicyPrivacy {
	id?: number
	ru?: { content: string }
	en?: { content: string }
	uz?: { content: string }
	tj?: { content: string }
}

// Тип для Сезонов/Коллекций (часто используется в фильтрах одежды)

export interface Season {
	id?: number
	winter?: boolean
	spring?: boolean
	summer?: boolean
	autumn?: boolean
	slug?: string
	ru?: { name: string }
	en?: { name: string }
	uz?: { name: string }
	tj?: { name: string }
}
// Категория
export interface Category {
	id?: number
	slug: string
	image?: string
	parentId?: number
	ru?: LocalizedContent
	en?: LocalizedContent
	uz?: LocalizedContent
	tj?: LocalizedContent
}

// Коллекция
export interface Collection {
	id?: number
	slug: string
	image?: string
	ru?: LocalizedContent
	en?: LocalizedContent
	uz?: LocalizedContent
	tj?: LocalizedContent
}
export interface TeamMember {
	id?: number
	name: string
	role: string
	image?: string
	order?: number
	description?: string
	ru?: { name: string; role: string }
	en?: { name: string; role: string }
	uz?: { name: string; role: string }
	tj?: { name: string; role: string }
}
// Свойство товара
export interface Property {
	id?: number
	key: string
	type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean'
	ru?: LocalizedContent
	en?: LocalizedContent
	uz?: LocalizedContent
	tj?: LocalizedContent
}

// Продукт
export interface Product {
	id?: number
	slug: string
	categoryId?: number
	price: number
	oldPrice?: number
	images?: string[]
	inStock?: boolean
	hidePrice?: boolean // Новое поле для скрытия цены
	sku?: string
	propertyIds?: number[]
	properties?: number[]
	collectionIds?: number[]
	categoryIds?: number[]
	ru?: LocalizedContent
	en?: LocalizedContent
	uz?: LocalizedContent
	tj?: LocalizedContent
}

// Статусы заказа
export type OrderStatus =
	| 'new'
	| 'viewed'
	| 'called'
	| 'processing'
	| 'shipped'
	| 'delivered'
	| 'completed'
	| 'cancelled'

// Элемент заказа
export interface OrderItem {
	productId: number
	name: string
	price: number
	quantity: number
	image?: string
	size?: string
	color?: string
	propertyIds?: number[]
	collectionIds?: number[]
}

// Заказ
export interface Order {
	id?: number
	name: string
	phone: string
	email?: string
	address?: string
	comment?: string
	items: OrderItem[]
	total: number
	status: OrderStatus
	createdAt?: string
	updatedAt?: string
}

// О компании
export interface AboutCompany {
	id?: number
	ru?: LocalizedContent
	en?: LocalizedContent
	uz?: LocalizedContent
	tj?: LocalizedContent
}

// Социальные сети и контакты
export interface SocialMedia {
	id?: number
	// Контактная информация
	phone?: string
	email?: string
	address?: string
	schedule?: string
	// Социальные сети
	telegram?: string
	whatsapp?: string
	instagram?: string
}
export interface Policy {
	id?: number
	ru?: { content: string }
	en?: { content: string }
	uz?: { content: string }
	tj?: { content: string }
}

// Элемент избранного
export interface WishlistItem {
	productId: number
	name: string
	price: number
	image?: string
	collectionIds?: number[]
	propertyIds?: number[]
	categoryIds?: number[]
	hidePrice?: boolean
}

// Хелпер для получения локализованного контента
export function getLocalized<
	T extends {
		ru?: LocalizedContent
		en?: LocalizedContent
		uz?: LocalizedContent
		tj?: LocalizedContent
	}
>(
	item: T | null | undefined,
	locale: Locale | string
): LocalizedContent | undefined {
	if (!item) return undefined

	const loc = locale as keyof Pick<T, 'ru' | 'en' | 'uz' | 'tj'>
	return (item[loc] as LocalizedContent) || item.ru
}
