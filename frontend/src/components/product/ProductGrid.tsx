import type { ProductSummary } from '@/types/api';
import { Skeleton } from '../ui/States';
import { ProductCard } from './ProductCard';

/** Rejilla responsiva: 2 columnas en móvil, 3 en tablet, 4 en escritorio. */
export function ProductGrid({ products, loading }: { products: ProductSummary[]; loading?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-x-gutter-mobile gap-y-space-lg md:grid-cols-3 md:gap-x-gutter lg:grid-cols-4">
      {loading
        ? Array.from({ length: 8 }, (_, i) => (
            <div key={i}>
              <Skeleton className="mb-space-sm aspect-[3/4] w-full" />
              <Skeleton className="mb-1 h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))
        : products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}
