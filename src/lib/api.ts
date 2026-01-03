import { API_URL } from '@/config/api.config';
import { Product, Category, Order, Property, TeamMember, Collection, AboutCompany, SocialMedia, Season, PolicyPrivacy } from '@/types/api';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

function createCRUD<T extends { id?: number }>(resource: string) {
  return {
    getAll: () => fetchAPI<T[]>(`/${resource}`),
    getById: (id: number) => fetchAPI<T>(`/${resource}/${id}`),
    create: (data: Omit<T, 'id'>) => fetchAPI<T>(`/${resource}`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<T>) => fetchAPI<T>(`/${resource}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: number) => fetchAPI<void>(`/${resource}/${id}`, { method: 'DELETE' }),
  };
}

export const productsAPI = {
  ...createCRUD<Product>('products'),
 getBySlug: async (slug: string) => {
  const data = await fetchAPI<Product[]>(`/products?slug=${slug}`);
  return data[0] || null;
},
};

export const categoriesAPI = createCRUD<Category>('category');
export const ordersAPI = createCRUD<Order>('orders');
export const propertiesAPI = createCRUD<Property>('property');
export const teamAPI = createCRUD<TeamMember>('ourComand');
export const collectionsAPI = createCRUD<Collection>('collection');

export const aboutCompanyAPI = {
  get: () => fetchAPI<AboutCompany[]>('/aboutcompany').then(data => data[0] || null),
  update: (id: number, data: AboutCompany) => fetchAPI<AboutCompany>(`/aboutcompany/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  create: (data: AboutCompany) => fetchAPI<AboutCompany>('/aboutcompany', { method: 'POST', body: JSON.stringify(data) }),
};

export const socialMediaAPI = {
  get: () => fetchAPI<SocialMedia[]>('/socilalMediaOnlineResource').then(data => data[0] || null),
  update: (id: number, data: SocialMedia) => fetchAPI<SocialMedia>(`/socilalMediaOnlineResource/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  create: (data: SocialMedia) => fetchAPI<SocialMedia>('/socilalMediaOnlineResource', { method: 'POST', body: JSON.stringify(data) }),
};

export const seasonAPI = {
  get: () => fetchAPI<Season[]>('/seasons').then(data => data[0] || null),
  update: (id: number, data: Season) => fetchAPI<Season>(`/seasons/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  create: (data: Season) => fetchAPI<Season>('/seasons', { method: 'POST', body: JSON.stringify(data) }),
};

export const policyAPI = {
  get: () => fetchAPI<PolicyPrivacy[]>('/policyPrivacy').then(data => data[0] || null),
  update: (id: number, data: PolicyPrivacy) => fetchAPI<PolicyPrivacy>(`/policyPrivacy/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  create: (data: PolicyPrivacy) => fetchAPI<PolicyPrivacy>('/policyPrivacy', { method: 'POST', body: JSON.stringify(data) }),
};
