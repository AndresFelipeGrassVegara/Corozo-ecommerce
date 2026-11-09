import { useRef } from 'react';
import type { ProductSummary } from '@/types/api';
import { Icon } from '../ui/Icon';
import { Skeleton } from '../ui/States';
import { ProductCard } from './ProductCard';

/** Carrusel horizontal de prendas (deslizable en móvil, con flechas en escritorio). */
export function ProductRail({ products, loading }: { products: ProductSummary[]; loading?: boolean }) {
  const scroller = useRef<HTMLDivElement>(null);
  const scroll = (direction: 1 | -1) =>
    scroller.current?.scrollBy({ left: direction * 560, behavior: 'smooth' });

  return (
    <div className="relative">
      <div
        ref={scroller}
        className="no-scrollbar flex snap-x snap-mandatory gap-space-md overflow-x-auto px-margin-mobile pb-space-xs md:px-margin-tablet lg:px-[max(3rem,calc((100vw-1280px)/2+3rem))]"
      >
        {loading
          ? Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="aspect-[3/4] w-[220px] flex-none md:w-[260px]" />)
          : products.map((product) => (
              <div key={product.id} className="snap-start">
                <ProductCard product={product} layout="rail" />
              </div>
            ))}
      </div>

      {/* Flechas solo en pantallas grandes */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between px-space-md lg:flex">
        {([-1, 1] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            aria-label={dir === -1 ? 'Anterior' : 'Siguiente'}
            onClick={() => scroll(dir)}
            className="pointer-events-auto -mt-16 flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-lowest/90 shadow-md backdrop-blur hover:text-primary"
          >
            <Icon name={dir === -1 ? 'chevron_left' : 'chevron_right'} />
          </button>
        ))}
      </div>
    </div>
  );
}
