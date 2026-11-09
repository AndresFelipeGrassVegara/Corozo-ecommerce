import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { api } from '@/lib/api';
import { Link } from 'react-router-dom';
import { cn, formatPrice } from '@/lib/format';
import { Button } from '../ui/Button';

/**
 * Looks con puntos interactivos sobre la foto.
 * Para añadir un punto: copia un objeto de `hotspots` y ajusta top/left (en %).
 * El nombre y el precio se leen de la API a partir del `slug`.
 */
const LOOKS = [
  {
    image: '/uploads/products/jean-cristales.jpg',
    alt: 'Look de noche: corsé perlado blanco y jean de pierna amplia con cristales',
    eyebrow: 'Look 01 · Noche urbana',
    title: 'Cristal sobre denim',
    hotspots: [{ top: '62%', left: '44%', slug: 'jean-wide-leg-cristales' }],
  },
  {
    image: '/uploads/products/body-negro-jean-strass.jpg',
    alt: 'Look de noche: body negro de manga larga y jean con cristales en los bolsillos',
    eyebrow: 'Look 02 · After office',
    title: 'Negro y strass',
    hotspots: [{ top: '42%', left: '40%', slug: 'jean-strass-bolsillos' }],
  },
];

export function Lookbook() {
  return (
    <section className="shop-container mt-space-xl">
      <div className="mb-space-md flex items-end justify-between">
        <div>
          <span className="eyebrow mb-1 block text-on-surface-variant">Lookbook interactivo</span>
          <h2 className="text-headline-sm md:text-headline-md">Brillo nocturno</h2>
        </div>
        <span className="eyebrow text-secondary">{LOOKS.length} looks</span>
      </div>

      <div className="grid gap-space-md md:grid-cols-2">
        {LOOKS.map((look, index) => (
          <LookCard key={look.title} look={look} className={cn(index > 0 && 'hidden md:block')} />
        ))}
      </div>
    </section>
  );
}

function LookCard({ look, className }: { look: (typeof LOOKS)[number]; className?: string }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className={cn('relative overflow-hidden rounded-xl bg-surface-container-high shadow-md', className)}>
      <div className="relative aspect-[4/5] w-full">
        <img src={look.image} alt={look.alt} loading="lazy" className="h-full w-full object-cover" />

        {look.hotspots.map((spot, index) => (
          <Hotspot key={spot.slug} spot={spot} open={open === index} onToggle={() => setOpen(open === index ? null : index)} />
        ))}

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-space-sm bg-gradient-to-t from-primary/80 to-transparent p-space-md text-on-primary">
          <div>
            <p className="eyebrow text-surface-container-low">{look.eyebrow}</p>
            <p className="font-serif text-title-editorial">{look.title}</p>
          </div>
          <Button to={`/producto/${look.hotspots[0].slug}`} variant="light" size="sm">
            Comprar look
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Punto sobre la foto: al pulsarlo muestra nombre y precio reales de la prenda. */
function Hotspot({
  spot,
  open,
  onToggle,
}: {
  spot: { top: string; left: string; slug: string };
  open: boolean;
  onToggle: () => void;
}) {
  const { data: product } = useApi(() => api.getProduct(spot.slug), [spot.slug]);

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: spot.top, left: spot.left }}>
      <button
        type="button"
        aria-label={`Ver ${product?.name ?? 'prenda'}`}
        aria-expanded={open}
        onClick={onToggle}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-lowest/90 shadow-lg backdrop-blur-md transition-transform active:scale-125"
      >
        <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
      </button>
      {open && product && (
        <Link
          to={`/producto/${spot.slug}`}
          className="absolute left-1/2 top-9 z-20 flex -translate-x-1/2 animate-fade-up flex-col items-center whitespace-nowrap rounded-lg bg-surface-container-lowest/95 px-space-sm py-1.5 shadow-xl backdrop-blur-md"
        >
          <span className="text-label-ui">{product.name}</span>
          <span className="text-price text-secondary">{formatPrice(product.price)}</span>
        </Link>
      )}
    </div>
  );
}
