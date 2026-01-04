'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistItem {
  productId: number;
  name: string;
  price: number;
  image?: string;
  addedAt: string;
    collectionIds?: number[];
      propertyIds?: number[];

      categoryIds?: number[];
      hidePrice?: boolean;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeItem: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const { items } = get();
        if (!items.find((i) => i.productId === item.productId)) {
          set({ items: [...items, { ...item, addedAt: new Date().toISOString() }] });
        }
      },
      
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },
      
      isInWishlist: (productId) => {
        return get().items.some((i) => i.productId === productId);
      },
      
      clearWishlist: () => set({ items: [] }),
    }),
    { name: 'wishlist-storage' }
  )
);
