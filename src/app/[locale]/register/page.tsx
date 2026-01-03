'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { useAuthStore } from '@/store/authStore';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Валидация
    if (form.password !== form.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (form.password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
    });
    
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Ошибка регистрации');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-heading font-bold text-secondary mb-2">
              Регистрация
            </h1>
            <p className="text-text-muted">
              Создайте аккаунт для покупок
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Имя
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Ваше имя"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Пароль
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all pr-12"
                  placeholder="Минимум 6 символов"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Подтвердите пароль
              </label>
              <input
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Повторите пароль"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-text-muted text-sm">
              Уже есть аккаунт?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Войти
              </Link>
            </p>
            <Link href="/" className="text-sm text-text-muted hover:text-text">
              ← Вернуться в магазин
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
