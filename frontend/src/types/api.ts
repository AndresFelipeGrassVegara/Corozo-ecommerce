/**
 * Tipos que devuelve la API del backend.
 * Si cambias una respuesta en NestJS, actualiza aquí su forma.
 */

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  productCount: number;
}

export interface ProductImage {
  id?: number;
  url: string;
  alt: string;
}

export interface ProductVariant {
  id: number;
  sku: string;
  size: string;
  color: string;
  stock: number;
}

/** Prenda resumida (tarjetas y listados). */
export interface ProductSummary {
  id: number;
  slug: string;
  name: string;
  subtitle: string;
  price: number; // COP
  compareAtPrice: number | null;
  badge: string | null;
  isNew: boolean;
  category: { id: number; name: string; slug: string };
  image: ProductImage | null;
  sizes: string[];
  inStock: boolean;
}

/** Ficha completa de una prenda. */
export interface ProductDetail extends ProductSummary {
  description: string;
  material: string | null;
  care: string | null;
  isFeatured: boolean;
  isActive: boolean;
  categoryId: number;
  images: ProductImage[];
  variants: ProductVariant[];
  related?: ProductSummary[];
}

export interface Paginated<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'CUSTOMER';
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';

export interface OrderLine {
  productName: string;
  size: string;
  color: string;
  unitPrice: number;
  quantity: number;
}

/** Respuesta al registrar un pedido desde la bolsa. */
export interface OrderConfirmation {
  id: number;
  status: OrderStatus;
  total: number;
  items: OrderLine[];
}

/** Pedido completo (panel de administración). */
export interface Order {
  id: number;
  customerName: string;
  city: string;
  notes: string | null;
  status: OrderStatus;
  total: number;
  createdAt: string;
  items: (OrderLine & { id: number; variantId: number | null })[];
}

/** Cuerpo para crear o editar una prenda desde el panel. */
export interface ProductInput {
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  material?: string;
  care?: string;
  price: number;
  compareAtPrice?: number | null;
  badge?: string | null;
  isNew?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  categoryId: number;
  images: { url: string; alt: string }[];
  variants: { sku: string; size: string; color: string; stock: number }[];
}
