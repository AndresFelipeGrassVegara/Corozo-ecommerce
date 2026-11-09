import type {
  Category,
  Order,
  OrderConfirmation,
  OrderStatus,
  Paginated,
  ProductDetail,
  ProductInput,
  ProductSummary,
  User,
} from '@/types/api';

/**
 * Cliente HTTP de la tienda.
 * Todas las llamadas al backend pasan por aquí: si cambias una ruta en NestJS,
 * solo tienes que tocar este archivo.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    credentials: 'include', // envía la cookie httpOnly de sesión
    headers: { 'Content-Type': 'application/json', ...init.headers },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message = Array.isArray(body.message) ? body.message.join('. ') : body.message;
    throw new ApiError(response.status, message ?? 'Algo salió mal. Inténtalo de nuevo.');
  }

  return response.status === 204 ? (undefined as T) : response.json();
}

const json = (data: unknown) => JSON.stringify(data);

export interface ProductFilters {
  category?: string;
  collection?: 'new' | 'featured' | 'sale';
  search?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'name';
  page?: number;
  limit?: number;
}

/** Convierte un objeto de filtros en "?a=1&b=2", omitiendo los vacíos. */
function toQuery(filters: object): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== '' && value !== null) params.set(key, String(value));
  }
  const query = params.toString();
  return query ? `?${query}` : '';
}

export const api = {
  // ─── Catálogo ──────────────────────────────────────────────
  getCategories: () => request<Category[]>('/categories'),
  getProducts: (filters: ProductFilters = {}) =>
    request<Paginated<ProductSummary>>(`/products${toQuery(filters)}`),
  getProduct: (slug: string) => request<ProductDetail>(`/products/${encodeURIComponent(slug)}`),

  // ─── Compra y marketing ────────────────────────────────────
  createOrder: (order: {
    customerName: string;
    city: string;
    notes?: string;
    items: { variantId: number; quantity: number }[];
  }) => request<OrderConfirmation>('/orders', { method: 'POST', body: json(order) }),
  subscribe: (email: string) =>
    request<{ message: string }>('/newsletter', { method: 'POST', body: json({ email }) }),

  // ─── Sesión ────────────────────────────────────────────────
  login: (email: string, password: string) =>
    request<{ user: User }>('/auth/login', { method: 'POST', body: json({ email, password }) }),
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
  me: () => request<User>('/auth/me'),

  // ─── Administración ────────────────────────────────────────
  admin: {
    listProducts: (filters: ProductFilters = {}) =>
      request<Paginated<ProductDetail>>(`/products/admin/list${toQuery(filters)}`),
    getProduct: (id: number) => request<ProductDetail>(`/products/admin/${id}`),
    createProduct: (data: ProductInput) =>
      request<ProductDetail>('/products', { method: 'POST', body: json(data) }),
    updateProduct: (id: number, data: Partial<ProductInput>) =>
      request<ProductDetail>(`/products/${id}`, { method: 'PATCH', body: json(data) }),
    deleteProduct: (id: number) => request<void>(`/products/${id}`, { method: 'DELETE' }),
    listOrders: (status?: OrderStatus) => request<Order[]>(`/orders${toQuery({ status })}`),
    updateOrderStatus: (id: number, status: OrderStatus) =>
      request<Order>(`/orders/${id}/status`, { method: 'PATCH', body: json({ status }) }),
  },
};
