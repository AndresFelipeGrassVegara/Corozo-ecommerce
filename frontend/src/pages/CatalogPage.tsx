import { useSearchParams } from 'react-router-dom';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Pill } from '@/components/ui/Pill';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { useApi } from '@/hooks/useApi';
import { api, ProductFilters } from '@/lib/api';

const COLLECTIONS = [
  { value: 'new', label: 'Novedades' },
  { value: 'featured', label: 'Destacados' },
  { value: 'sale', label: 'Rebajas' },
] as const;

const SORTS = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'name', label: 'Nombre (A-Z)' },
] as const;

/**
 * Catálogo con filtros. Todo el estado vive en la URL
 * (/catalogo?category=jeans&sort=price_asc), así se puede compartir el enlace.
 */
export function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const filters: ProductFilters = {
    category: params.get('category') ?? undefined,
    collection: (params.get('collection') as ProductFilters['collection']) ?? undefined,
    search: params.get('search') ?? undefined,
    sort: (params.get('sort') as ProductFilters['sort']) ?? 'newest',
    page: Number(params.get('page')) || 1,
    limit: 12,
  };

  const categories = useApi(() => api.getCategories(), []);
  const products = useApi(() => api.getProducts(filters), [params.toString()]);

  /** Cambia un filtro y vuelve a la página 1. */
  const update = (changes: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    if (!('page' in changes)) next.delete('page');
    setParams(next);
  };

  const currentCategory = categories.data?.find((c) => c.slug === filters.category);
  const currentCollection = COLLECTIONS.find((c) => c.value === filters.collection);
  const title = filters.search
    ? `«${filters.search}»`
    : (currentCategory?.name ?? currentCollection?.label ?? 'Toda la colección');
  const meta = products.data?.meta;

  return (
    <div className="shop-container pb-space-xl pt-space-lg">
      {/* Cabecera */}
      <div className="mb-space-lg">
        <span className="eyebrow mb-1 block text-secondary">{filters.search ? 'Resultados de búsqueda' : 'Catálogo'}</span>
        <div className="flex flex-wrap items-end justify-between gap-space-sm">
          <h1 className="text-headline-lg-mobile md:text-headline-lg">{title}</h1>
          {meta && <span className="text-body-sm text-on-surface-variant">{meta.total} prendas</span>}
        </div>
        {currentCategory?.description && <p className="mt-1 text-on-surface-variant">{currentCategory.description}</p>}
      </div>

      {/* Filtros */}
      <div className="sticky top-16 z-30 -mx-margin-mobile mb-space-lg bg-surface/90 px-margin-mobile py-space-sm backdrop-blur-xl md:-mx-margin-tablet md:px-margin-tablet lg:mx-0 lg:px-0">
        <div className="no-scrollbar flex items-center gap-space-xs overflow-x-auto">
          <Pill label="Todo" active={!filters.category && !filters.collection} onClick={() => update({ category: undefined, collection: undefined })} />
          {COLLECTIONS.map((c) => (
            <Pill key={c.value} label={c.label} active={filters.collection === c.value} onClick={() => update({ collection: c.value, category: undefined })} />
          ))}
          <span className="mx-1 h-5 w-px flex-none bg-outline-variant" />
          {categories.data?.map((c) => (
            <Pill key={c.slug} label={c.name} active={filters.category === c.slug} onClick={() => update({ category: c.slug, collection: undefined })} />
          ))}
        </div>
        <div className="mt-space-sm flex items-center justify-between gap-space-sm">
          {filters.search ? (
            <button onClick={() => update({ search: undefined })} className="flex items-center gap-1 rounded-full bg-surface-container px-space-sm py-1 text-body-sm">
              Búsqueda: {filters.search}
              <Icon name="close" className="text-[16px]" />
            </button>
          ) : (
            <span />
          )}
          <label className="flex items-center gap-space-xs text-body-sm text-on-surface-variant">
            <Icon name="swap_vert" className="text-[18px]" />
            <span className="sr-only">Ordenar por</span>
            <select
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value })}
              className="cursor-pointer bg-transparent text-label-ui text-on-surface focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Resultados */}
      {products.error ? (
        <ErrorState message={products.error} onRetry={products.reload} />
      ) : !products.loading && products.data?.data.length === 0 ? (
        <EmptyState
          icon="search_off"
          title="No encontramos prendas"
          text="Prueba con otra búsqueda o explora toda la colección."
          action={<Button variant="outline" onClick={() => setParams({})}>Ver todo</Button>}
        />
      ) : (
        <ProductGrid products={products.data?.data ?? []} loading={products.loading} />
      )}

      {/* Paginación */}
      {meta && meta.totalPages > 1 && (
        <nav aria-label="Paginación" className="mt-space-xl flex items-center justify-center gap-space-md">
          <Button variant="outline" size="sm" disabled={meta.page <= 1} onClick={() => update({ page: String(meta.page - 1) })}>
            Anterior
          </Button>
          <span className="text-body-sm text-on-surface-variant">
            Página {meta.page} de {meta.totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={meta.page >= meta.totalPages} onClick={() => update({ page: String(meta.page + 1) })}>
            Siguiente
          </Button>
        </nav>
      )}
    </div>
  );
}
