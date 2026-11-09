import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { readStorage, writeStorage } from '@/lib/storage';
import type { ProductSummary } from '@/types/api';

/** Lista de deseos (favoritos) guardada en el navegador. */
interface WishlistContextValue {
  items: ProductSummary[];
  has: (productId: number) => boolean;
  toggle: (product: ProductSummary) => void;
}

const STORAGE_KEY = 'coroso.wishlist.v2';
const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ProductSummary[]>(() => readStorage(STORAGE_KEY, []));

  useEffect(() => {
    writeStorage(STORAGE_KEY, items);
  }, [items]);

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      has: (id) => items.some((p) => p.id === id),
      toggle: (product) =>
        setItems((current) =>
          current.some((p) => p.id === product.id)
            ? current.filter((p) => p.id !== product.id)
            : [product, ...current],
        ),
    }),
    [items],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist debe usarse dentro de <WishlistProvider>');
  return context;
}
