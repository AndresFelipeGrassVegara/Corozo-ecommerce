import { Link } from 'react-router-dom';
import { cn, formatPrice, imageUrl } from '@/lib/format';
import type { ProductSummary } from '@/types/api';
import { WishlistButton } from './WishlistButton';

interface ProductCardProps {
  product: ProductSummary;
  /** "rail" = ancho fijo para carruseles horizontales; "grid" = se adapta a la columna */
  layout?: 'rail' | 'grid';
}

export function ProductCard({ product, layout = 'grid' }: ProductCardProps) {
  const sizeRange =
    product.sizes.length > 1 ? `Talla ${product.sizes[0]} - ${product.sizes.at(-1)}` : product.sizes[0];
  const onSale = product.compareAtPrice !== null && product.compareAtPrice > product.price;

  return (
    <article className={cn('group', layout === 'rail' && 'w-[220px] flex-none md:w-[260px]')}>
      <Link to={`/producto/${product.slug}`} className="block">
        <div className="relative mb-space-sm aspect-[3/4] w-full overflow-hidden rounded-lg bg-surface-container-high">
          {product.image && (
            <img
              src={imageUrl(product.image.url)}
              alt={product.image.alt}
              loading="lazy"
              className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
          )}
          {product.badge && (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-surface-container-lowest/90 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary backdrop-blur-sm">
              {product.badge}
            </span>
          )}
          <WishlistButton product={product} className="absolute right-2.5 top-2.5" />
          {!product.inStock && (
            <div className="absolute inset-x-0 bottom-0 bg-inverse-surface/70 py-1.5 text-center text-label-caps uppercase text-inverse-on-surface">
              Agotado
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h3 className="truncate font-serif text-title-editorial text-on-surface">{product.name}</h3>
          <p className="mb-1 truncate text-body-sm text-on-surface-variant">{product.subtitle}</p>
          <div className="flex items-center justify-between gap-space-xs">
            <span className="flex items-baseline gap-1.5">
              <span className={cn('text-price', onSale ? 'text-primary' : 'text-on-surface')}>
                {formatPrice(product.price)}
              </span>
              {onSale && (
                <span className="text-body-sm text-outline line-through">{formatPrice(product.compareAtPrice!)}</span>
              )}
            </span>
            {sizeRange && (
              <span className="rounded bg-tertiary-fixed/60 px-1.5 py-0.5 text-[10px] font-semibold text-on-surface-variant">
                {sizeRange}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
