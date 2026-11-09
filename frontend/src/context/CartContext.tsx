import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { readStorage, writeStorage } from '@/lib/storage';

/**
 * Bolsa de compra guardada en el navegador.
 * El precio se guarda solo para mostrarlo: el backend recalcula el total al registrar el pedido.
 */
export interface CartItem {
  variantId: number;
  slug: string;
  name: string;
  image: string | null;
  size: string;
  color: string;
  price: number; // COP
  quantity: number;
  maxStock: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  setQuantity: (variantId: number, quantity: number) => void;
  remove: (variantId: number) => void;
  clear: () => void;
}

const STORAGE_KEY = 'coroso.cart.v2';
const MAX_PER_ITEM = 10;
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStorage(STORAGE_KEY, []));

  useEffect(() => {
    writeStorage(STORAGE_KEY, items);
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const limit = (item: CartItem, qty: number) => Math.max(1, Math.min(qty, item.maxStock, MAX_PER_ITEM));

    return {
      items,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      add: (newItem, quantity = 1) =>
        setItems((current) => {
          const existing = current.find((i) => i.variantId === newItem.variantId);
          if (existing) {
            return current.map((i) =>
              i.variantId === newItem.variantId ? { ...i, quantity: limit(i, i.quantity + quantity) } : i,
            );
          }
          const item = { ...newItem, quantity };
          return [...current, { ...item, quantity: limit(item, quantity) }];
        }),

      setQuantity: (variantId, quantity) =>
        setItems((current) =>
          current.map((i) => (i.variantId === variantId ? { ...i, quantity: limit(i, quantity) } : i)),
        ),

      remove: (variantId) => setItems((current) => current.filter((i) => i.variantId !== variantId)),
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return context;
}
