'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_URL } from '@/config/api.config';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; password: string; name: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await fetch(`${API_URL}/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!res.ok) {
            const error = await res.json();
            set({ isLoading: false });
            return { success: false, error: error.message || 'Неверный email или пароль' };
          }

          const data = await res.json();
          set({ 
            user: data.data, 
            token: data.token,
            isLoading: false 
          });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: 'Ошибка сервера' };
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...userData, role: 'user' }),
          });

          if (!res.ok) {
            const error = await res.json();
            set({ isLoading: false });
            return { success: false, error: error.message || 'Ошибка регистрации' };
          }

          const data = await res.json();
          set({ 
            user: data.data, 
            token: data.token,
            isLoading: false 
          });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: 'Ошибка сервера' };
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const res = await fetch(`${API_URL}/auth_me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!res.ok) {
            set({ user: null, token: null });
            return;
          }

          const user = await res.json();
          set({ user });
        } catch (error) {
          set({ user: null, token: null });
        }
      },

      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
