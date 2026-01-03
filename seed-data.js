// seed-data.js
// Запусти: node seed-data.js

const API_URL = 'https://dfe9a3e83bdc7f15.mokky.dev'

// ===== КАТЕГОРИИ =====
const categories = [
	{
		slug: 'bras',
		image: 'https://images.unsplash.com/photo-1617331140180-e8262094733a?w=400',
		ru: {
			name: 'Бюстгальтеры',
			description: 'Комфортные бюстгальтеры на каждый день',
		},
		en: { name: 'Bras', description: 'Comfortable bras for every day' },
		uz: { name: 'Sutyenlar', description: 'Har kunlik qulay sutyenlar' },
		tj: { name: 'Синабандҳо', description: 'Синабандҳои қулай барои ҳар рӯз' },
	},
	{
		slug: 'panties',
		image: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=400',
		ru: { name: 'Трусы', description: 'Удобные трусы из натуральных тканей' },
		en: {
			name: 'Panties',
			description: 'Comfortable panties from natural fabrics',
		},
		uz: {
			name: 'Ichki kiyimlar',
			description: 'Tabiiy matolardan qulay ichki kiyimlar',
		},
		tj: { name: 'Эзорҳо', description: 'Эзорҳои қулай аз матоҳои табиӣ' },
	},
	{
		slug: 'sets',
		image: 'https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?w=400',
		ru: { name: 'Комплекты', description: 'Элегантные комплекты белья' },
		en: { name: 'Sets', description: 'Elegant lingerie sets' },
		uz: { name: 'Toʻplamlar', description: 'Nafis ichki kiyim toʻplamlari' },
		tj: { name: 'Комплектҳо', description: 'Комплектҳои зебои либоси зер' },
	},
	{
		slug: 'sleepwear',
		image: 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=400',
		ru: { name: 'Пижамы', description: 'Мягкие пижамы для сладких снов' },
		en: { name: 'Sleepwear', description: 'Soft pajamas for sweet dreams' },
		uz: {
			name: 'Pijamalar',
			description: 'Shirin tushlar uchun yumshoq pijamalar',
		},
		tj: {
			name: 'Пижамаҳо',
			description: 'Пижамаҳои мулоим барои хобҳои ширин',
		},
	},
	{
		slug: 'robes',
		image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
		ru: { name: 'Халаты', description: 'Шелковые и махровые халаты' },
		en: { name: 'Robes', description: 'Silk and terry robes' },
		uz: { name: 'Xalatlar', description: 'Ipak va mahsi xalatlar' },
		tj: { name: 'Халатҳо', description: 'Халатҳои абрешимӣ ва маҳсӣ' },
	},
]

// ===== СВОЙСТВА =====
const properties = [
	{
		key: 'size',
		type: 'multiselect',
		options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
		ru: { label: 'Размер' },
		en: { label: 'Size' },
		uz: { label: "O'lcham" },
		tj: { label: 'Андоза' },
	},
	{
		key: 'cup_size',
		type: 'multiselect',
		options: ['A', 'B', 'C', 'D', 'E', 'F'],
		ru: { label: 'Размер чашки' },
		en: { label: 'Cup size' },
		uz: { label: 'Kosa oʻlchami' },
		tj: { label: 'Андозаи коса' },
	},
	{
		key: 'color',
		type: 'select',
		options: ['Чёрный', 'Белый', 'Бежевый', 'Розовый', 'Красный', 'Синий'],
		ru: { label: 'Цвет' },
		en: { label: 'Color' },
		uz: { label: 'Rang' },
		tj: { label: 'Ранг' },
	},
	{
		key: 'material',
		type: 'text',
		ru: { label: 'Состав' },
		en: { label: 'Material' },
		uz: { label: 'Tarkibi' },
		tj: { label: 'Таркиб' },
	},
	{
		key: 'push_up',
		type: 'boolean',
		ru: { label: 'Push-up эффект' },
		en: { label: 'Push-up effect' },
		uz: { label: 'Push-up effekt' },
		tj: { label: 'Эффекти Push-up' },
	},
]

// ===== ТОВАРЫ =====
const products = [
	{
		slug: 'bra-elegance-black',
		categoryId: 1,
		price: 3490,
		oldPrice: 4290,
		images: [
			'https://images.unsplash.com/photo-1617331140180-e8262094733a?w=600',
			'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=600',
		],
		inStock: true,
		sku: 'BRA-ELG-001',
		ru: {
			name: 'Бюстгальтер Elegance с кружевом',
			description:
				'Изящный бюстгальтер с французским кружевом. Мягкие чашки обеспечивают идеальную поддержку.',
		},
		en: {
			name: 'Elegance Lace Bra',
			description:
				'Elegant bra with French lace. Soft cups provide perfect support.',
		},
		uz: {
			name: 'Elegance dantel sutyeni',
			description: 'Fransuz danteli bilan nafis sutyen.',
		},
		tj: {
			name: 'Синабанди Elegance бо тӯр',
			description: 'Синабанди зебо бо тӯри фаронсавӣ.',
		},
		properties: {
			color: 'Чёрный',
			material: '85% полиамид, 15% эластан',
			push_up: false,
		},
	},
	{
		slug: 'bra-comfort-beige',
		categoryId: 1,
		price: 2790,
		images: [
			'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=600',
		],
		inStock: true,
		sku: 'BRA-CMF-002',
		ru: {
			name: 'Бесшовный бюстгальтер Comfort',
			description:
				'Невидимый под одеждой бесшовный бюстгальтер для максимального комфорта.',
		},
		en: {
			name: 'Seamless Comfort Bra',
			description: 'Invisible seamless bra for maximum comfort.',
		},
		uz: {
			name: 'Tikirsizsutyen Comfort',
			description: 'Maksimal qulaylik uchun koʻrinmas tikuvizsiz sutyen.',
		},
		tj: {
			name: 'Синабанди бедӯзиш Comfort',
			description: 'Синабанди бедӯзиш барои қулайии максималӣ.',
		},
		properties: {
			color: 'Бежевый',
			material: '90% нейлон, 10% спандекс',
			push_up: false,
		},
	},
	{
		slug: 'bra-pushup-red',
		categoryId: 1,
		price: 4190,
		oldPrice: 4990,
		images: [
			'https://images.unsplash.com/photo-1617331140180-e8262094733a?w=600',
		],
		inStock: true,
		sku: 'BRA-PSH-003',
		ru: {
			name: 'Бюстгальтер Push-up Passion',
			description:
				'Соблазнительный бюстгальтер с эффектом push-up для создания идеального декольте.',
		},
		en: {
			name: 'Push-up Passion Bra',
			description: 'Seductive push-up bra for creating the perfect cleavage.',
		},
		uz: {
			name: 'Push-up Passion sutyeni',
			description: 'Ideal dekolte yaratish uchun jozibador push-up sutyen.',
		},
		tj: {
			name: 'Синабанди Push-up Passion',
			description: 'Синабанди ҷаззоб бо эффекти push-up.',
		},
		properties: {
			color: 'Красный',
			material: '80% полиамид, 20% эластан',
			push_up: true,
		},
	},
	{
		slug: 'panties-classic-black',
		categoryId: 2,
		price: 990,
		images: [
			'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=600',
		],
		inStock: true,
		sku: 'PNT-CLS-001',
		ru: {
			name: 'Классические трусы-слипы',
			description: 'Базовые трусы-слипы из мягкого хлопка с эластаном.',
		},
		en: {
			name: 'Classic Brief Panties',
			description: 'Basic brief panties made of soft cotton with elastane.',
		},
		uz: {
			name: 'Klassik slip trusiklar',
			description: 'Yumshoq paxtadan tayyorlangan asosiy slip trusiklar.',
		},
		tj: {
			name: 'Эзори классикӣ',
			description: 'Эзори асосӣ аз пахтаи мулоим.',
		},
		properties: { color: 'Чёрный', material: '95% хлопок, 5% эластан' },
	},
	{
		slug: 'panties-lace-white',
		categoryId: 2,
		price: 1490,
		images: [
			'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=600',
		],
		inStock: true,
		sku: 'PNT-LCE-002',
		ru: {
			name: 'Кружевные трусики-бразилиана',
			description: 'Соблазнительные трусики-бразилиана из нежного кружева.',
		},
		en: {
			name: 'Lace Brazilian Panties',
			description: 'Seductive Brazilian panties made of delicate lace.',
		},
		uz: {
			name: 'Dantel braziliya trusiklarи',
			description:
				'Nafis danteldan tayyorlangan jozibador braziliya trusiklarи.',
		},
		tj: {
			name: 'Эзори тӯрии бразилиягӣ',
			description: 'Эзори ҷаззоби бразилиягӣ аз тӯри нозук.',
		},
		properties: { color: 'Белый', material: '85% полиамид, 15% эластан' },
	},
	{
		slug: 'set-romantic-pink',
		categoryId: 3,
		price: 5990,
		oldPrice: 7490,
		images: [
			'https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?w=600',
			'https://images.unsplash.com/photo-1617331140180-e8262094733a?w=600',
		],
		inStock: true,
		sku: 'SET-ROM-001',
		ru: {
			name: 'Комплект Romantic',
			description:
				'Романтичный комплект из бюстгальтера и трусиков с цветочным кружевом.',
		},
		en: {
			name: 'Romantic Set',
			description: 'Romantic set of bra and panties with floral lace.',
		},
		uz: {
			name: "Romantic to'plami",
			description: "Gullikdantelli sutyen va trusiklar to'plami.",
		},
		tj: {
			name: 'Комплекти Romantic',
			description: 'Комплекти романтикӣ аз синабанд ва эзор бо тӯри гулдор.',
		},
		properties: {
			color: 'Розовый',
			material: '80% полиамид, 20% эластан',
			push_up: false,
		},
	},
	{
		slug: 'set-passion-black',
		categoryId: 3,
		price: 7490,
		images: [
			'https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?w=600',
		],
		inStock: true,
		sku: 'SET-PAS-002',
		ru: {
			name: 'Комплект Passion',
			description:
				'Страстный комплект с бюстгальтером push-up и трусиками-стринг.',
		},
		en: {
			name: 'Passion Set',
			description: 'Passionate set with push-up bra and thong panties.',
		},
		uz: {
			name: "Passion to'plami",
			description: "Push-up sutyen va string trusiklar bilan ehtiros to'plami.",
		},
		tj: {
			name: 'Комплекти Passion',
			description: 'Комплекти пуршавқ бо синабанди push-up ва эзори стринг.',
		},
		properties: {
			color: 'Чёрный',
			material: '85% полиамид, 15% эластан',
			push_up: true,
		},
	},
	{
		slug: 'pajama-silk-blue',
		categoryId: 4,
		price: 6990,
		oldPrice: 8490,
		images: [
			'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=600',
		],
		inStock: true,
		sku: 'PJM-SLK-001',
		ru: {
			name: 'Шёлковая пижама Dream',
			description: 'Роскошная пижама из натурального шёлка. Рубашка и шорты.',
		},
		en: {
			name: 'Silk Pajama Dream',
			description: 'Luxurious pajamas made of natural silk. Shirt and shorts.',
		},
		uz: {
			name: 'Dream ipak pijama',
			description: 'Tabiiy ipakdan tayyorlangan hashamatli pijama.',
		},
		tj: {
			name: 'Пижамаи абрешимии Dream',
			description: 'Пижамаи ҳашаматӣ аз абрешими табиӣ.',
		},
		properties: { color: 'Синий', material: '100% натуральный шёлк' },
	},
	{
		slug: 'robe-velvet-black',
		categoryId: 5,
		price: 8990,
		images: [
			'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600',
		],
		inStock: true,
		sku: 'RBE-VLV-001',
		ru: {
			name: 'Бархатный халат Luxury',
			description: 'Элегантный халат из мягкого бархата с кружевной отделкой.',
		},
		en: {
			name: 'Velvet Robe Luxury',
			description: 'Elegant robe made of soft velvet with lace trim.',
		},
		uz: {
			name: 'Luxury baxmal xalati',
			description: 'Dantel bezakli yumshoq baxmaldan tayyorlangan nafis xalat.',
		},
		tj: {
			name: 'Халати бахмалии Luxury',
			description: 'Халати зебо аз бахмали мулоим бо ороиши тӯрӣ.',
		},
		properties: { color: 'Чёрный', material: '92% полиэстер, 8% эластан' },
	},
	{
		slug: 'panties-set-basic',
		categoryId: 2,
		price: 2490,
		oldPrice: 2970,
		images: [
			'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=600',
		],
		inStock: true,
		sku: 'PNT-SET-003',
		ru: {
			name: 'Набор трусов Basic (3 шт)',
			description: 'Базовый набор из трёх трусов-слипов разных цветов.',
		},
		en: {
			name: 'Basic Panties Set (3 pcs)',
			description: 'Basic set of three brief panties in different colors.',
		},
		uz: {
			name: 'Basic trusiklar toʻplami (3 dona)',
			description: 'Turli ranglardagi uchta slip trusiklar toʻplami.',
		},
		tj: {
			name: 'Маҷмӯаи эзорҳои Basic (3 дона)',
			description: 'Маҷмӯаи асосӣ аз се эзор бо рангҳои гуногун.',
		},
		properties: { color: 'Чёрный', material: '95% хлопок, 5% эластан' },
	},
]

// ===== АДМИН ПОЛЬЗОВАТЕЛЬ =====
const adminUser = {
	email: 'admin@uft.ru',
	password: 'admin123',
	name: 'Администратор',
	role: 'admin',
}

// ===== ФУНКЦИЯ ДОБАВЛЕНИЯ =====
async function seedData() {
	console.log('🌱 Начинаем заполнение базы данных...\n')

	// Категории
	console.log('📁 Добавляем категории...')
	for (const cat of categories) {
		try {
			const res = await fetch(`${API_URL}/category`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(cat),
			})
			const data = await res.json()
			console.log(`  ✓ ${cat.ru.name} (id: ${data.id})`)
		} catch (e) {
			console.log(`  ✗ Ошибка: ${cat.ru.name}`)
		}
	}

	// Свойства
	console.log('\n⚙️ Добавляем свойства...')
	for (const prop of properties) {
		try {
			const res = await fetch(`${API_URL}/property`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(prop),
			})
			const data = await res.json()
			console.log(`  ✓ ${prop.ru.label} (id: ${data.id})`)
		} catch (e) {
			console.log(`  ✗ Ошибка: ${prop.ru.label}`)
		}
	}

	// Товары
	console.log('\n🛍️ Добавляем товары...')
	for (const product of products) {
		try {
			const res = await fetch(`${API_URL}/products`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...product,
					createdAt: new Date().toISOString(),
				}),
			})
			const data = await res.json()
			console.log(`  ✓ ${product.ru.name} (id: ${data.id})`)
		} catch (e) {
			console.log(`  ✗ Ошибка: ${product.ru.name}`)
		}
	}

	// Регистрация админа
	console.log('\n👤 Регистрируем админа...')
	try {
		const res = await fetch(`${API_URL}/register`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(adminUser),
		})
		if (res.ok) {
			const data = await res.json()
			console.log(`  ✓ Админ создан: ${adminUser.email}`)
			console.log(`    Логин: ${adminUser.email}`)
			console.log(`    Пароль: ${adminUser.password}`)
		} else {
			console.log('  ⚠️ Админ уже существует или ошибка')
		}
	} catch (e) {
		console.log('  ✗ Ошибка регистрации админа')
	}

	console.log('\n✅ Готово!\n')
	console.log('📌 Данные для входа в админку:')
	console.log(`   Email: ${adminUser.email}`)
	console.log(`   Пароль: ${adminUser.password}`)
}

seedData()
