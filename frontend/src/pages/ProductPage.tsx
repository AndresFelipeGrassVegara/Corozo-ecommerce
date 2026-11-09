import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProductRail } from '@/components/product/ProductRail';
import { WishlistButton } from '@/components/product/WishlistButton';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EmptyState, Skeleton } from '@/components/ui/States';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useApi } from '@/hooks/useApi';
import { api } from '@/lib/api';
import { cn, formatPrice, imageUrl } from '@/lib/format';
import type { ProductDetail } from '@/types/api';

/** Ficha de producto: galería, selector de talla y añadir a la bolsa. */
export function ProductPage() {
  const { slug = '' } = useParams();
  const { data: product, loading, error } = useApi(() => api.getProduct(slug), [slug]);

  if (loading) return <ProductSkeleton />;
  if (error || !product) {
    return (
      <EmptyState
        icon="checkroom"
        title="Prenda no disponible"
        text="Puede que se haya agotado o que el enlace no sea correcto."
        action={<Button to="/catalogo">Ver catálogo</Button>}
      />
    );
  }
  return <ProductView key={product.id} product={product} />;
}

function ProductView({ product }: { product: ProductDetail }) {
  const cart = useCart();
  const toast = useToast();
  const [imageIndex, setImageIndex] = useState(0);

  const colors = useMemo(() => [...new Set(product.variants.map((v) => v.color))], [product]);
  const [color, setColor] = useState(colors[0]);
  const sizes = product.variants.filter((v) => v.color === color);
  const [variantId, setVariantId] = useState<number | null>(null);
  const selected = product.variants.find((v) => v.id === variantId);

  useEffect(() => {
    setVariantId(null);
  }, [color]);

  const onSale = product.compareAtPrice !== null && product.compareAtPrice > product.price;

  const addToBag = () => {
    if (!selected) return;
    cart.add({
      variantId: selected.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0]?.url ?? null,
      size: selected.size,
      color: selected.color,
      price: product.price,
      maxStock: selected.stock,
    });
    toast(`${product.name} (talla ${selected.size}) añadido a tu bolsa`, 'shopping_bag');
  };

  return (
    <div className="pb-space-xl">
      <div className="shop-container pt-space-md md:pt-space-lg">
        {/* Migas de pan */}
        <nav aria-label="Ruta" className="mb-space-md flex items-center gap-1 text-body-sm text-on-surface-variant">
          <Link to="/catalogo" className="hover:text-primary">Catálogo</Link>
          <Icon name="chevron_right" className="text-[14px]" />
          <Link to={`/catalogo?category=${product.category.slug}`} className="hover:text-primary">{product.category.name}</Link>
        </nav>

        <div className="grid gap-space-lg md:grid-cols-2 md:gap-space-xl lg:gap-16">
          {/* Galería */}
          <div className="md:sticky md:top-24 md:self-start">
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-surface-container-high">
              {product.images[imageIndex] && (
                <img
                  src={imageUrl(product.images[imageIndex].url)}
                  alt={product.images[imageIndex].alt}
                  className="h-full w-full animate-fade-up object-cover object-top"
                />
              )}
              {product.badge && (
                <span className="eyebrow absolute left-space-md top-space-md rounded-full bg-surface-container-lowest/90 px-space-sm py-1 text-primary backdrop-blur-sm">
                  {product.badge}
                </span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="mt-space-sm flex gap-space-sm">
                {product.images.map((img, i) => (
                  <button
                    key={img.url}
                    onClick={() => setImageIndex(i)}
                    aria-label={`Ver imagen ${i + 1}`}
                    className={cn('h-20 w-16 overflow-hidden rounded-lg ring-2', i === imageIndex ? 'ring-primary' : 'ring-transparent')}
                  >
                    <img src={imageUrl(img.url)} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información */}
          <div className="flex flex-col">
            <span className="eyebrow mb-1 text-secondary">{product.category.name}</span>
            <div className="flex items-start justify-between gap-space-md">
              <h1 className="text-headline-lg-mobile md:text-headline-lg">{product.name}</h1>
              <WishlistButton product={product} className="mt-1 h-10 w-10 flex-none bg-surface-container" />
            </div>
            <p className="mb-space-md text-body-lg text-on-surface-variant">{product.subtitle}</p>

            <div className="mb-space-lg flex items-baseline gap-space-sm">
              <span className={cn('font-serif text-headline-md', onSale && 'text-primary')}>{formatPrice(product.price)}</span>
              {onSale && <span className="text-body-lg text-outline line-through">{formatPrice(product.compareAtPrice!)}</span>}
            </div>

            {/* Color */}
            <div className="mb-space-md">
              <p className="eyebrow mb-space-xs text-on-surface-variant">
                Color: <span className="text-on-surface">{color}</span>
              </p>
              {colors.length > 1 && (
                <div className="flex gap-space-xs">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={cn('rounded-lg px-space-md py-2 text-label-ui ring-1', c === color ? 'ring-primary text-primary' : 'ring-outline-variant')}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Talla */}
            <div className="mb-space-lg">
              <div className="mb-space-xs flex items-center justify-between">
                <p className="eyebrow text-on-surface-variant">Talla</p>
                {selected && selected.stock <= 3 && selected.stock > 0 && (
                  <span className="eyebrow rounded bg-secondary-fixed/50 px-1.5 py-0.5 text-secondary">Últimas {selected.stock} uds.</span>
                )}
              </div>
              <div className="grid grid-cols-5 gap-space-xs" role="radiogroup" aria-label="Talla">
                {sizes.map((v) => (
                  <button
                    key={v.id}
                    role="radio"
                    aria-checked={v.id === variantId}
                    disabled={v.stock === 0}
                    onClick={() => setVariantId(v.id)}
                    className={cn(
                      'h-11 rounded-lg text-label-ui transition-all',
                      v.id === variantId
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container hover:bg-surface-container-high',
                      v.stock === 0 && 'cursor-not-allowed text-outline line-through opacity-60',
                    )}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>

            <Button size="lg" icon="shopping_bag" disabled={!selected} onClick={addToBag}>
              {selected ? 'Añadir a la bolsa' : 'Selecciona una talla'}
            </Button>

            <ul className="mt-space-md grid grid-cols-2 gap-space-sm text-body-sm text-on-surface-variant">
              <li className="flex items-center gap-space-xs"><Icon name="local_shipping" className="text-[18px]" /> Envíos a toda Colombia</li>
              <li className="flex items-center gap-space-xs"><Icon name="chat" className="text-[18px]" /> Pedido por WhatsApp</li>
            </ul>

            {/* Detalles */}
            <div className="mt-space-lg divide-y divide-outline-variant/50 border-y border-outline-variant/50">
              <Details title="Descripción" open>
                {product.description}
              </Details>
              {product.material && <Details title="Composición">{product.material}</Details>}
              {product.care && <Details title="Cuidados">{product.care}</Details>}
            </div>
          </div>
        </div>
      </div>

      {product.related && product.related.length > 0 && (
        <section className="mt-space-xl">
          <div className="shop-container">
            <SectionHeader eyebrow="Completa el look" title="También te puede gustar" />
          </div>
          <ProductRail products={product.related} />
        </section>
      )}
    </div>
  );
}

function Details({ title, open, children }: { title: string; open?: boolean; children: React.ReactNode }) {
  return (
    <details open={open} className="group py-space-md">
      <summary className="flex cursor-pointer list-none items-center justify-between font-serif text-title-editorial">
        {title}
        <Icon name="expand_more" className="text-[20px] transition-transform group-open:rotate-180" />
      </summary>
      <p className="mt-space-sm leading-relaxed text-on-surface-variant">{children}</p>
    </details>
  );
}

function ProductSkeleton() {
  return (
    <div className="shop-container grid gap-space-lg pt-space-lg md:grid-cols-2">
      <Skeleton className="aspect-[3/4] w-full rounded-xl" />
      <div className="space-y-space-md">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
