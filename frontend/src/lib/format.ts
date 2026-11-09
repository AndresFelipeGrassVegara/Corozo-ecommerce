import { SITE } from '@/config/site';

const priceFormatter = new Intl.NumberFormat(SITE.locale, {
  style: 'currency',
  currency: SITE.currency,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** 189900 → "$ 189.900" (pesos colombianos, sin decimales) */
export const formatPrice = (value: number) => priceFormatter.format(value);

/**
 * Las fotos se guardan como rutas relativas (/uploads/...).
 * Si algún día se sirven desde un CDN, define VITE_ASSETS_URL.
 */
export const imageUrl = (path: string) =>
  path.startsWith('http') ? path : `${import.meta.env.VITE_ASSETS_URL ?? ''}${path}`;

/** Une clases de Tailwind ignorando valores falsos: cn('a', cond && 'b') */
export const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');
