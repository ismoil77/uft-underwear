'use client'

import { Link } from '@/i18n/navigation'
import { useAuthStore } from '@/store/authStore'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
	const router = useRouter()
	const { login, isLoading } = useAuthStore()

	const [form, setForm] = useState({ email: '', password: '' })
	const [error, setError] = useState('')
	const [showPassword, setShowPassword] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')

		const result = await login(form.email, form.password)

		if (result.success) {
			router.push('/admin')
		} else {
			setError(result.error || 'Ошибка входа')
		}
	}

	return (
		<div className='min-h-screen bg-surface flex items-center justify-center p-4'>
			<div className='w-full max-w-md'>
				<div className='bg-white rounded-2xl shadow-lg p-8'>
					{/* Header */}
					<div className='text-center mb-8'>
						<h1 className='text-2xl font-heading font-bold text-secondary mb-2'>
							Вход в аккаунт
						</h1>
						<p className='text-text-muted'>
							Войдите для доступа к админ-панели
						</p>
					</div>

					{/* Error */}
					{error && (
						<div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm'>
							{error}
						</div>
					)}

					{/* Form */}
					<form onSubmit={handleSubmit} className='space-y-5'>
						<div>
							<label className='block text-sm font-medium text-secondary mb-2'>
								Email
							</label>
							<input
								type='email'
								required
								value={form.email}
								onChange={e => setForm({ ...form, email: e.target.value })}
								className='w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
								placeholder='admin@uft.ru'
							/>
						</div>

						<div>
							<label className='block text-sm font-medium text-secondary mb-2'>
								Пароль
							</label>
							<div className='relative'>
								<input
									type={showPassword ? 'text' : 'password'}
									required
									value={form.password}
									onChange={e => setForm({ ...form, password: e.target.value })}
									className='w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all pr-12'
									placeholder='••••••••'
								/>
								<button
									type='button'
									onClick={() => setShowPassword(!showPassword)}
									className='absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text'
								>
									{showPassword ? (
										<EyeOff className='w-5 h-5' />
									) : (
										<Eye className='w-5 h-5' />
									)}
								</button>
							</div>
						</div>

						<button
							type='submit'
							disabled={isLoading}
							className='w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
						>
							{isLoading && <Loader2 className='w-5 h-5 animate-spin' />}
							{isLoading ? 'Вход...' : 'Войти'}
						</button>
					</form>

					{/* Links */}
					<div className='mt-6 text-center space-y-3'>
						<p className='text-text-muted text-sm'>
							Нет аккаунта?{' '}
							<Link href='/register' className='text-primary hover:underline'>
								Зарегистрироваться
							</Link>
						</p>
						<Link href='/' className='text-sm text-text-muted hover:text-text'>
							← Вернуться в магазин
						</Link>
					</div>
				</div>

				{/* Demo credentials */}
				<div className='mt-6 p-4 bg-blue-50 rounded-xl text-center'>
					<p className='text-sm text-blue-800 font-medium mb-1'>Демо доступ:</p>
					<p className='text-sm text-blue-600'>admin@uft.ru / admin123</p>
				</div>
			</div>
		</div>
	)
}
