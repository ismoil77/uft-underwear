'use client'

import { Link } from '@/i18n/navigation'
import {
	categoriesAPI,
	collectionsAPI,
	ordersAPI,
	productsAPI,
	propertiesAPI,
	teamAPI,
	usersAPI,
} from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { Order } from '@/types/api'
import {
	FolderOpen,
	Layers,
	LogOut,
	Package,
	Palette,
	Settings,
	ShoppingCart,
	User,
	Users,
	UserPlus,
	Shield,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminPage() {
	const t = useTranslations('adminHome')
	const router = useRouter()
	const { user, logout } = useAuthStore()
	const [mounted, setMounted] = useState(false)
	const [stats, setStats] = useState({
		products: 0,
		categories: 0,
		orders: 0,
		properties: 0,
		team: 0,
		collections: 0,
		users: 0,
	})
	const [recentOrders, setRecentOrders] = useState<Order[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		setMounted(true)
	}, [])
	
	useEffect(() => {
		if (mounted && !user) router.push('/login')
	}, [mounted, user, router])
	
	useEffect(() => {
		if (user) fetchStats()
	}, [user])

	async function fetchStats() {
		try {
			const [products, categories, orders, properties, team, collections, users] =
				await Promise.all([
					productsAPI.getAll(),
					categoriesAPI.getAll(),
					ordersAPI.getAll(),
					propertiesAPI.getAll(),
					teamAPI.getAll().catch(() => []),
					collectionsAPI.getAll().catch(() => []),
					usersAPI.getAll().catch(() => []),
				])
			setStats({
				products: products.length,
				categories: categories.length,
				orders: orders.length,
				properties: properties.length,
				team: team.length,
				collections: collections.length,
				users: users.length,
			})
			setRecentOrders(orders.slice(-5).reverse())
		} catch (e) {
			console.error('Error fetching stats:', e)
		} finally {
			setLoading(false)
		}
	}

	const handleLogout = () => {
		logout()
		router.push('/login')
	}

	if (!mounted || !user)
		return (
			<div className='min-h-screen bg-gray-100 flex items-center justify-center'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
			</div>
		)

	const menuItems = [
		{
			title: t('menu.products'),
			href: '/admin/products',
			icon: Package,
			count: stats.products,
			color: 'bg-blue-500',
		},
		{
			title: t('menu.categories'),
			href: '/admin/categories',
			icon: FolderOpen,
			count: stats.categories,
			color: 'bg-green-500',
		},
		{
			title: t('menu.orders'),
			href: '/admin/orders',
			icon: ShoppingCart,
			count: stats.orders,
			color: 'bg-purple-500',
		},
		{
			title: t('menu.properties'),
			href: '/admin/properties',
			icon: Settings,
			count: stats.properties,
			color: 'bg-orange-500',
		},
		{
			title: t('menu.team'),
			href: '/admin/team',
			icon: Users,
			count: stats.team,
			color: 'bg-pink-500',
		},
		{
			title: t('menu.collections'),
			href: '/admin/collections',
			icon: Layers,
			count: stats.collections,
			color: 'bg-cyan-500',
		},
		{
			title: t('menu.settings'),
			href: '/admin/settings',
			icon: Palette,
			count: null,
			color: 'bg-gray-500',
		},
		
	]

	// Добавляем пункт "Пользователи" только для админа
	if (user.role === 'admin') {
		menuItems.push({
			title: t('menu.users'),
			href: '/admin/users',
			icon: UserPlus,
			count: stats.users,
			color: 'bg-indigo-500',
		})
	}

	return (
		<div className='min-h-screen bg-gray-100'>
			<header className='bg-white shadow-sm'>
				<div className='max-w-7xl mx-auto px-4 py-4 flex items-center justify-between'>
					<h1 className='text-2xl font-bold text-gray-900'>{t('title')}</h1>
					<div className='flex items-center gap-4'>
						{/* Профиль */}
						<Link 
							href='/admin/profile'
							className='flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors'
						>
							<div className='w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center'>
								<User className='w-4 h-4 text-primary' />
							</div>
							<div className='hidden sm:block'>
								<p className='text-sm font-medium text-gray-900'>{user.name}</p>
								<p className='text-xs text-gray-500 flex items-center gap-1'>
									{user.role === 'admin' ? (
										<>
											<Shield className='w-3 h-3' />
											{t('roles.admin')}
										</>
									) : (
										t('roles.manager')
									)}
								</p>
							</div>
						</Link>
						
						<Link href='/' className='text-sm text-blue-600 hover:underline hidden sm:block'>
							{t('createUser.onSite')}
						</Link>
						<button
							onClick={handleLogout}
							className='flex items-center gap-1 text-sm text-red-600 hover:underline'
						>
							<LogOut className='w-4 h-4' /> {t('createUser.logout')}
						</button>
					</div>
				</div>
			</header>

			<main className='max-w-7xl mx-auto px-4 py-8'>
				{/* Приветствие */}
				<div className='bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6 mb-8'>
					<h2 className='text-xl font-semibold text-gray-900 mb-1'>
						{t('welcome')}, {user.name}! 👋
					</h2>
					<p className='text-gray-600'>
						{user.role === 'admin' ? t('welcomeAdmin') : t('welcomeManager')}
					</p>
				</div>

				{/* Меню с карточками */}
				<div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
					{menuItems.map(item => (
						<Link
							key={item.href}
							href={item.href}
							className='bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow'
						>
							<div className='flex items-start justify-between mb-3'>
								<div className={`${item.color} p-2.5 rounded-lg`}>
									<item.icon className='w-5 h-5 text-white' />
								</div>
								{item.count !== null && (
									<span className='text-2xl font-bold text-gray-900'>
										{loading ? '...' : item.count}
									</span>
								)}
							</div>
							<h3 className='font-medium text-gray-900'>{item.title}</h3>
						</Link>
					))}
				</div>

				{/* Последние заказы */}
				<div className='bg-white rounded-xl shadow-sm p-6'>
					<div className='flex items-center justify-between mb-4'>
						<h2 className='text-lg font-semibold'>{t('recentOrders.title')}</h2>
						<Link
							href='/admin/orders'
							className='text-sm text-blue-600 hover:underline'
						>
							{t('recentOrders.viewAll')} →
						</Link>
					</div>
					{loading ? (
						<div className='animate-pulse space-y-3'>
							{[1, 2, 3].map(i => (
								<div key={i} className='h-16 bg-gray-100 rounded-lg' />
							))}
						</div>
					) : recentOrders.length > 0 ? (
						<div className='space-y-3'>
							{recentOrders.map(order => (
								<div
									key={order.id}
									className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'
								>
									<div>
										<p className='font-medium'>
											#{order.id} — {order.name}
										</p>
										<p className='text-sm text-gray-500'>{order.phone}</p>
									</div>
									<div className='text-right'>
										<p className='font-semibold'>
											{order.total?.toLocaleString()} UZS
										</p>
										<span
											className={`text-xs px-2 py-1 rounded-full ${
												order.status === 'new'
													? 'bg-blue-100 text-blue-700'
													: order.status === 'completed'
													? 'bg-green-100 text-green-700'
													: 'bg-gray-100'
											}`}
										>
											{order.status}
										</span>
									</div>
								</div>
							))}
						</div>
					) : (
						<p className='text-gray-500 text-center py-8'>{t('recentOrders.empty')}</p>
					)}
				</div>
			</main>
		</div>
	)
}