import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/States';
import { Pill } from '@/components/ui/Pill';
import { useToast } from '@/context/ToastContext';
import { useApi } from '@/hooks/useApi';
import { api } from '@/lib/api';
import { cn, formatPrice } from '@/lib/format';
import type { Order, OrderStatus } from '@/types/api';

/** Texto, color y acciones disponibles para cada estado (igual que en el backend). */
const STATUS: Record<OrderStatus, { label: string; className: string; next: { to: OrderStatus; label: string }[] }> = {
  PENDING: {
    label: 'Por confirmar',
    className: 'bg-secondary-fixed text-on-secondary-container',
    next: [
      { to: 'CONFIRMED', label: 'Confirmar' },
      { to: 'CANCELLED', label: 'Cancelar' },
    ],
  },
  CONFIRMED: {
    label: 'Confirmado',
    className: 'bg-tertiary-fixed text-on-tertiary-fixed',
    next: [
      { to: 'DELIVERED', label: 'Marcar entregado' },
      { to: 'CANCELLED', label: 'Cancelar' },
    ],
  },
  DELIVERED: { label: 'Entregado', className: 'bg-inverse-surface text-inverse-on-surface', next: [] },
  CANCELLED: { label: 'Cancelado', className: 'bg-error-container text-on-error-container', next: [] },
};

const dateFormatter = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' });

/**
 * Pedidos que los clientes enviaron por WhatsApp.
 * Al "Confirmar" se descuenta el stock; al cancelar un pedido confirmado se devuelve.
 */
export function AdminOrdersPage() {
  const toast = useToast();
  const [filter, setFilter] = useState<OrderStatus | undefined>('PENDING');
  const { data, loading, error, reload } = useApi(() => api.admin.listOrders(filter), [filter]);

  const changeStatus = async (order: Order, status: OrderStatus) => {
    if (status === 'CANCELLED' && !window.confirm(`¿Cancelar el pedido #${order.id}?`)) return;
    try {
      await api.admin.updateOrderStatus(order.id, status);
      toast(`Pedido #${order.id}: ${STATUS[status].label.toLowerCase()}`);
      reload();
    } catch (err) {
      toast((err as Error).message, 'error');
    }
  };

  return (
    <>
      <div className="mb-space-lg">
        <h1 className="text-headline-md">Pedidos</h1>
        <p className="text-body-sm text-on-surface-variant">
          Busca el número del pedido en el chat de WhatsApp y confírmalo cuando acuerdes pago y envío.
        </p>
      </div>

      <div className="no-scrollbar mb-space-lg flex gap-space-xs overflow-x-auto">
        <Pill label="Todos" active={!filter} onClick={() => setFilter(undefined)} />
        {(Object.keys(STATUS) as OrderStatus[]).map((s) => (
          <Pill key={s} label={STATUS[s].label} active={filter === s} onClick={() => setFilter(s)} />
        ))}
      </div>

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading ? (
        <div className="space-y-space-sm">
          {Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
      ) : data?.length === 0 ? (
        <EmptyState icon="receipt_long" title="No hay pedidos" text="Aquí aparecerán los pedidos enviados desde la bolsa." />
      ) : (
        <div className="space-y-space-sm">
          {data?.map((order) => (
            <article key={order.id} className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
              <div className="mb-space-sm flex flex-wrap items-start justify-between gap-space-sm">
                <div>
                  <p className="font-serif text-headline-sm">Pedido #{order.id}</p>
                  <p className="text-body-sm text-on-surface-variant">
                    {order.customerName} · {order.city} · {dateFormatter.format(new Date(order.createdAt))}
                  </p>
                </div>
                <span className={cn('rounded-full px-space-sm py-0.5 text-body-sm', STATUS[order.status].className)}>
                  {STATUS[order.status].label}
                </span>
              </div>

              <ul className="mb-space-sm divide-y divide-outline-variant/30 text-body-md">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between gap-space-md py-1.5">
                    <span>
                      {item.productName} <span className="text-on-surface-variant">· Talla {item.size} · {item.color} · x{item.quantity}</span>
                    </span>
                    <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              {order.notes && <p className="mb-space-sm rounded-lg bg-surface-container-low p-space-sm text-body-sm">“{order.notes}”</p>}

              <div className="flex flex-wrap items-center justify-between gap-space-sm">
                <p className="font-serif text-headline-sm">{formatPrice(order.total)}</p>
                <div className="flex gap-space-xs">
                  {STATUS[order.status].next.map((action) => (
                    <Button
                      key={action.to}
                      size="sm"
                      variant={action.to === 'CANCELLED' ? 'outline' : 'primary'}
                      onClick={() => changeStatus(order, action.to)}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
