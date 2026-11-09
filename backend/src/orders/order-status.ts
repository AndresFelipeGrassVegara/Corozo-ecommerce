/** Estados de un pedido. Se guardan como texto en la columna Order.status. */
export const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/**
 * Cambios de estado permitidos:
 *   PENDING   → el cliente envió el pedido por WhatsApp (aún no se descuenta stock)
 *   CONFIRMED → la tienda acordó pago/envío: se descuenta el stock
 *   DELIVERED → entregado
 *   CANCELLED → anulado (si estaba confirmado, se devuelve el stock)
 */
export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
};
