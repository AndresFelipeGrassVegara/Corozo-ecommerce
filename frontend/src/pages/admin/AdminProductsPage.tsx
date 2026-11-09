import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ErrorState, Skeleton } from '@/components/ui/States';
import { useToast } from '@/context/ToastContext';
import { useApi } from '@/hooks/useApi';
import { api } from '@/lib/api';
import { cn, formatPrice, imageUrl } from '@/lib/format';
import type { ProductDetail } from '@/types/api';

/** Listado de prendas en el panel (incluye las ocultas). */
export function AdminProductsPage() {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useApi(
    () => api.admin.listProducts({ search: search || undefined, page, limit: 20 }),
    [search, page],
  );

  const remove = async (product: ProductDetail) => {
    if (!window.confirm(`¿Eliminar "${product.name}" definitivamente? Esta acción no se puede deshacer.`)) return;
    try {
      await api.admin.deleteProduct(product.id);
      toast('Prenda eliminada', 'delete');
      reload();
    } catch (err) {
      toast((err as Error).message, 'error');
    }
  };

  return (
    <>
      <div className="mb-space-lg flex flex-wrap items-end justify-between gap-space-md">
        <div>
          <h1 className="text-headline-md">Prendas</h1>
          {data && <p className="text-body-sm text-on-surface-variant">{data.meta.total} en total</p>}
        </div>
        <div className="flex flex-1 items-center justify-end gap-space-sm">
          <input
            type="search"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            maxLength={60}
            className="field h-11 max-w-xs"
          />
          <Button to="/admin/prendas/nueva" icon="add">Nueva</Button>
        </div>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <div className="overflow-x-auto rounded-xl bg-surface-container-lowest shadow-sm">
          <table className="w-full min-w-[720px] text-left text-body-md">
            <thead className="eyebrow border-b border-outline-variant/50 text-on-surface-variant">
              <tr>
                <th className="p-space-md">Prenda</th>
                <th className="p-space-md">Categoría</th>
                <th className="p-space-md">Precio</th>
                <th className="p-space-md">Stock</th>
                <th className="p-space-md">Estado</th>
                <th className="p-space-md" />
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {loading
                ? Array.from({ length: 5 }, (_, i) => (
                    <tr key={i}><td colSpan={6} className="p-space-md"><Skeleton className="h-12 w-full" /></td></tr>
                  ))
                : data?.data.map((p) => {
                    const stock = p.variants.reduce((sum, v) => sum + v.stock, 0);
                    return (
                      <tr key={p.id} className="hover:bg-surface-container-low">
                        <td className="p-space-md">
                          <div className="flex items-center gap-space-sm">
                            {p.image && <img src={imageUrl(p.image.url)} alt="" className="h-12 w-10 rounded object-cover object-top" />}
                            <div>
                              <p className="font-medium">{p.name}</p>
                              <p className="text-body-sm text-on-surface-variant">/{p.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-space-md">{p.category.name}</td>
                        <td className="p-space-md">{formatPrice(p.price)}</td>
                        <td className={cn('p-space-md', stock < 5 && 'font-semibold text-error')}>{stock}</td>
                        <td className="p-space-md">
                          <span className={cn('rounded-full px-2 py-0.5 text-body-sm', p.isActive ? 'bg-tertiary-fixed' : 'bg-error-container text-on-error-container')}>
                            {p.isActive ? 'Visible' : 'Oculta'}
                          </span>
                        </td>
                        <td className="p-space-md">
                          <div className="flex justify-end gap-1">
                            <Link to={`/admin/prendas/${p.id}`} aria-label={`Editar ${p.name}`} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-surface-container">
                              <Icon name="edit" className="text-[20px]" />
                            </Link>
                            <button onClick={() => remove(p)} aria-label={`Eliminar ${p.name}`} className="flex h-9 w-9 items-center justify-center rounded-lg text-error hover:bg-error-container">
                              <Icon name="delete" className="text-[20px]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      )}

      {data && data.meta.totalPages > 1 && (
        <div className="mt-space-md flex items-center justify-end gap-space-sm">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Anterior</Button>
          <span className="text-body-sm">{page} / {data.meta.totalPages}</span>
          <Button size="sm" variant="outline" disabled={page >= data.meta.totalPages} onClick={() => setPage(page + 1)}>Siguiente</Button>
        </div>
      )}
    </>
  );
}
