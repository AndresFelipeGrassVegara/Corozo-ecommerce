import { Link } from 'react-router-dom';
import { CollectionPills } from '@/components/home/CollectionPills';
import { CraftStrip } from '@/components/home/CraftStrip';
import { EditorialStory } from '@/components/home/EditorialStory';
import { Hero } from '@/components/home/Hero';
import { Lookbook } from '@/components/home/Lookbook';
import { Newsletter } from '@/components/home/Newsletter';
import { ProductRail } from '@/components/product/ProductRail';
import { Icon } from '@/components/ui/Icon';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ErrorState } from '@/components/ui/States';
import { useApi } from '@/hooks/useApi';
import { api } from '@/lib/api';

/** Página "Descubrir": portada editorial de la tienda. */
export function HomePage() {
  const featured = useApi(() => api.getProducts({ collection: 'featured', limit: 8 }), []);
  const newest = useApi(() => api.getProducts({ collection: 'new', limit: 8 }), []);

  return (
    <div className="pb-space-xl">
      <Hero />
      <CollectionPills />

      <section className="mt-space-xl">
        <div className="shop-container">
          <SectionHeader
            eyebrow="Tendencias de temporada"
            title="Piezas esenciales"
            aside={
              <Link to="/catalogo?collection=featured" className="eyebrow flex items-center gap-1 text-on-surface-variant hover:text-primary">
                <span className="md:hidden">Deslizar</span>
                <span className="hidden md:inline">Ver todo</span>
                <Icon name="chevron_right" className="text-[16px]" />
              </Link>
            }
          />
        </div>
        {featured.error ? (
          <ErrorState message={featured.error} onRetry={featured.reload} />
        ) : (
          <ProductRail products={featured.data?.data ?? []} loading={featured.loading} />
        )}
      </section>

      <EditorialStory />
      <Lookbook />

      <section className="mt-space-xl">
        <div className="shop-container">
          <SectionHeader
            eyebrow="Recién llegado"
            title="Novedades"
            aside={
              <Link to="/catalogo?collection=new" className="eyebrow text-secondary hover:underline">
                Ver todas
              </Link>
            }
          />
        </div>
        {newest.error ? (
          <ErrorState message={newest.error} onRetry={newest.reload} />
        ) : (
          <ProductRail products={newest.data?.data ?? []} loading={newest.loading} />
        )}
      </section>

      <CraftStrip />
      <Newsletter />
    </div>
  );
}
