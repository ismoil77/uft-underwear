'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useAuthStore } from '@/store/authStore';
import { usersAPI, User } from '@/lib/api';
import { 
  ChevronLeft, Plus, Save, Loader2, User as UserIcon, Mail, Lock, 
  Eye, EyeOff, Trash2, Edit2, X, Shield, UserCog
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function AdminUsersPage() {
  const t = useTranslations('adminUsers');
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState<User>({
    name: '',
    email: '',
    password: '',
    role: 'manager',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { setMounted(true); }, []);

useEffect(() => {
  if (!mounted) return;

  if (!currentUser) {
    router.push('/login');
    return;
  }

  // ❗ ТОЛЬКО admin может быть тут
  if (currentUser.role !== 'admin') {
    router.push('/admin');
    return;
  }

  fetchUsers();
}, [mounted, currentUser, router]);

  const fetchUsers = async () => {
    try {
      const data = await usersAPI.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = t('errors.nameRequired');
    
    if (!formData.email.trim()) {
      newErrors.email = t('errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('errors.emailInvalid');
    } else {
      const exists = users.find(u => u.email === formData.email && u.id !== editingUser?.id);
      if (exists) newErrors.email = t('errors.emailExists');
    }
    
    if (!editingUser && !formData.password) {
      newErrors.password = t('errors.passwordRequired');
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = t('errors.passwordMinLength');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'manager' });
    }
    setErrors({});
    setShowPassword(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'manager' });
    setErrors({});
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      if (editingUser?.id) {
        const updateData: Partial<User> = { name: formData.name, email: formData.email, role: formData.role };
        if (formData.password) updateData.password = formData.password;
        await usersAPI.update(editingUser.id, updateData);
      } else {
        await usersAPI.create({ ...formData, createdAt: new Date().toISOString() });
      }
      await fetchUsers();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving user:', error);
      setErrors({ general: t('errors.saveFailed') });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId: number) => {
    if (userId === currentUser?.id) {
      alert(t('errors.cantDeleteSelf'));
      return;
    }
    if (!confirm(t('confirm.delete'))) return;
    
    try {
      await usersAPI.delete(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(t('errors.deleteFailed'));
    }
  };

  if (!mounted || !currentUser ) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-500 hover:text-gray-700">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold">{t('title')}</h1>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            <Plus className="w-5 h-5" />
            {t('addUser')}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Инфо */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-blue-800 text-sm">{t('info')}</p>
        </div>

        {/* Список */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
            </div>
          ) : users.length > 0 ? (
            <div className="divide-y">
              {users.map((user) => (
                <div key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      user.role === 'admin' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {user.role === 'admin' ? (
                        <Shield className="w-5 h-5 text-blue-600" />
                      ) : (
                        <UserIcon className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{user.name}</p>
                        {user.id === currentUser?.id && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            {t('thisIsYou')}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      user.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role === 'admin' ? t('roles.admin') : t('roles.manager')}
                    </span>
                    
                    <button
                      onClick={() => handleOpenModal(user)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    
                    {user.id !== currentUser?.id && (
                      <button
                        onClick={() => user.id && handleDelete(user.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">{t('noUsers')}</div>
          )}
        </div>

        {/* Описание ролей */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold mb-4">{t('roles.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">{t('roles.admin')}</span>
              </div>
              <p className="text-sm text-blue-700">{t('roles.adminDesc')}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <UserCog className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-800">{t('roles.manager')}</span>
              </div>
              <p className="text-sm text-gray-700">{t('roles.managerDesc')}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Модалка */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingUser ? t('modal.titleEdit') : t('modal.titleNew')}
              </h2>
              <button onClick={handleCloseModal} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {errors.general && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{errors.general}</div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">{t('modal.name')} *</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('modal.email')} *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {t('modal.password')} {!editingUser && '*'}
                  {editingUser && <span className="text-gray-400 font-normal">({t('modal.passwordHint')})</span>}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full pl-10 pr-10 py-2 border rounded-lg ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('modal.role')} *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'manager' })}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.role === 'manager' ? 'border-primary bg-primary/5' : 'border-gray-200'
                    }`}
                  >
                    <UserCog className={`w-6 h-6 mx-auto mb-1 ${formData.role === 'manager' ? 'text-primary' : 'text-gray-400'}`} />
                    <p className="text-sm font-medium">{t('roles.manager')}</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'admin' })}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.role === 'admin' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <Shield className={`w-6 h-6 mx-auto mb-1 ${formData.role === 'admin' ? 'text-blue-500' : 'text-gray-400'}`} />
                    <p className="text-sm font-medium">{t('roles.admin')}</p>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex gap-3">
              <button onClick={handleCloseModal} className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                {t('modal.cancel')}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? t('modal.saving') : t('modal.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}