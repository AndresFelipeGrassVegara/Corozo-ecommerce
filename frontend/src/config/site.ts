/**
 * Configuración general de la tienda.
 * Cambia aquí el nombre, la moneda o los enlaces de navegación.
 */
export const SITE = {
  name: 'Coroso',
  tagline: 'Moda de autor',
  currency: 'COP',
  locale: 'es-CO',
  supportEmail: 'hola@coroso.com',
  /**
   * Número de WhatsApp que recibe los pedidos: código de país + número, solo dígitos.
   * Puedes definirlo también con VITE_WHATSAPP_NUMBER en frontend/.env.local
   */
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER ?? '573000000000',
} as const;

/** Navegación principal (cabecera de escritorio, menú lateral y barra inferior móvil). */
export const NAV_LINKS = [
  { to: '/', label: 'Descubrir', icon: 'cottage' },
  { to: '/catalogo', label: 'Catálogo', icon: 'grid_view' },
  { to: '/bolsa', label: 'Bolsa', icon: 'shopping_bag' },
  { to: '/perfil', label: 'Perfil', icon: 'person' },
] as const;

/** Atajos del hero y de la barra de colecciones. */
export const COLLECTION_PILLS = [
  { label: 'Todo', query: '' },
  { label: 'Novedades', query: 'collection=new' },
  { label: 'Jeans', query: 'category=jeans' },
  { label: 'Vestidos', query: 'category=vestidos' },
  { label: 'Conjuntos', query: 'category=conjuntos' },
  { label: 'Blusas y Tops', query: 'category=blusas-tops' },
  { label: 'Bermudas', query: 'category=bermudas' },
  { label: 'Rebajas', query: 'collection=sale' },
] as const;
