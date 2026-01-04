'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { productsAPI, categoriesAPI } from '@/lib/api';
import { Product, Category, getLocalized } from '@/types/api';
import { Locale } from '@/config/api.config';

// Хук для получения всех товаров
export function useProducts(categoryId?: number) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const locale = useLocale() as Locale;

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
const data = await (productsAPI as any).getAll({ categoryId });        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading products');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [categoryId]);

  // Возвращаем товары с локализованными данными
const localizedProducts = products.map((product) => {
    const localized = getLocalized(product, locale);
    return {
      ...product,
      localizedName: localized?.name  || '',
      localizedDescription: localized?.description || '',
    };
  });

  return { products: localizedProducts, loading, error, refetch: () => {} };
}

// Хук для получения одного товара
export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const locale = useLocale() as Locale;

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const data = await productsAPI.getBySlug(slug);
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading product');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  
 const localizedProduct = product
    ? {
        ...product,
        localizedName: getLocalized(product, locale)?.name || '',
        localizedDescription: getLocalized(product, locale)?.description || '',
      }
    : null;
  return { product: localizedProduct, loading, error };
}

// Хук для категорий
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const locale = useLocale() as Locale;

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const data = await categoriesAPI.getAll();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading categories');
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

 const localizedCategories = categories.map((cat) => {
    const localized = getLocalized(cat, locale);
    return {
      ...cat,
      localizedName: localized?.name || '',
      localizedDescription: localized?.description || '',
    };
  });

  return { categories: localizedCategories, loading, error };
}
