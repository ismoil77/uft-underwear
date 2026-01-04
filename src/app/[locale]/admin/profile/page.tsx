'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useAuthStore } from '@/store/authStore';
import { usersAPI } from '@/lib/api';
import { ChevronLeft, Save, Loader2, User, Mail, Lock, Eye, EyeOff, Shield, UserCog } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function AdminProfilePage() {
  const t = useTranslations('adminProfile');
  const router = useRouter();
//   const { user, setUser } = useAuthStore();
  const { user, login: setUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push('/login');
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [mounted, user, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('errors.nameRequired');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('errors.emailInvalid');
    }
    
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = t('errors.currentPasswordRequired');
      }
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = t('errors.passwordMinLength');
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = t('errors.passwordMismatch');
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !user?.id) return;
    
    setSaving(true);
    setSuccess('');
    setErrors({});
    
    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
      };
      
      if (formData.newPassword) {
        const currentUser = await usersAPI.getById(user.id);
        if (currentUser.password !== formData.currentPassword) {
          setErrors({ currentPassword: t('errors.wrongPassword') });
          setSaving(false);
          return;
        }
        updateData.password = formData.newPassword;
      }
      
      const updated = await usersAPI.update(user.id, updateData);
      
      setUser({
        ...user,
        name: updated.name,
        email: updated.email,
      });
      
      setSuccess(t('success.saved'));
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ general: t('errors.saveFailed') });
    } finally {
      setSaving(false);
    }
  };

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin" className="text-gray-500 hover:text-gray-700">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Карточка пользователя */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              {user.role === 'admin' ? (
                <Shield className="w-8 h-8 text-primary" />
              ) : (
                <UserCog className="w-8 h-8 text-gray-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
              <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                user.role === 'admin' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {user.role === 'admin' ? t('role.admin') : t('role.manager')}
              </span>
            </div>
          </div>
        </div>

        {/* Форма */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <h3 className="text-lg font-semibold border-b pb-3">{t('sections.personal')}</h3>
          
          {success && (
            <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}
          
          {errors.general && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          {/* Имя */}
          <div>
            <label className="block text-sm font-medium mb-1">{t('fields.name')}</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('placeholders.name')}
              />
            </div>
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">{t('fields.email')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('placeholders.email')}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Смена пароля */}
          <h3 className="text-lg font-semibold border-b pb-3 pt-4">{t('sections.password')}</h3>
          <p className="text-sm text-gray-500">{t('sections.passwordDesc')}</p>

          {/* Текущий пароль */}
          <div>
            <label className="block text-sm font-medium mb-1">{t('fields.currentPassword')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className={`w-full pl-10 pr-10 py-2 border rounded-lg ${
                  errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('placeholders.currentPassword')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.currentPassword && <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>}
          </div>

          {/* Новый пароль */}
          <div>
            <label className="block text-sm font-medium mb-1">{t('fields.newPassword')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className={`w-full pl-10 pr-10 py-2 border rounded-lg ${
                  errors.newPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('placeholders.newPassword')}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
          </div>

          {/* Подтверждение пароля */}
          <div>
            <label className="block text-sm font-medium mb-1">{t('fields.confirmPassword')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('placeholders.confirmPassword')}
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Кнопка */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? t('buttons.saving') : t('buttons.save')}
          </button>
        </div>
      </main>
    </div>
  );
}