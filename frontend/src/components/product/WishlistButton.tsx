import { useWishlist } from '@/context/WishlistContext';
import { cn } from '@/lib/format';
import type { ProductSummary } from '@/types/api';
import { Icon } from '../ui/Icon';

export function WishlistButton({ product, className }: { product: ProductSummary; className?: string }) {
  const wishlist = useWishlist();
  const saved = wishlist.has(product.id);

  return (
    <button
      type="button"
      aria-label={saved ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      aria-pressed={saved}
      onClick={(event) => {
        event.preventDefault(); // la tarjeta es un enlace: no navegar al pulsar el corazón
        wishlist.toggle(product);
      }}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-lowest/80 backdrop-blur-sm',
        'transition-all hover:text-secondary active:scale-110',
        saved ? 'text-secondary' : 'text-on-surface',
        className,
      )}
    >
      <Icon name="favorite" filled={saved} className="text-[18px]" />
    </button>
  );
}
