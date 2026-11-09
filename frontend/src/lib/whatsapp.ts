import { SITE } from '@/config/site';
import type { OrderConfirmation } from '@/types/api';
import { formatPrice } from './format';

/**
 * Construye el mensaje de WhatsApp a partir del pedido ya registrado en el backend.
 * Usa los precios devueltos por el servidor, no los guardados en el navegador.
 * Edita aquí el texto si quieres cambiar cómo llega el pedido al chat.
 */
export function buildOrderMessage(
  order: OrderConfirmation,
  customer: { customerName: string; city: string; notes?: string },
): string {
  const lines = order.items.map(
    (item) =>
      `• ${item.productName} — Talla ${item.size} · ${item.color} — x${item.quantity} — ${formatPrice(item.unitPrice * item.quantity)}`,
  );

  return [
    `¡Hola ${SITE.name}! Quiero hacer este pedido:`,
    '',
    `*Pedido #${order.id}*`,
    ...lines,
    '',
    `*Total: ${formatPrice(order.total)}*`,
    '',
    `Nombre: ${customer.customerName}`,
    `Ciudad: ${customer.city}`,
    ...(customer.notes ? [`Notas: ${customer.notes}`] : []),
  ].join('\n');
}

/** Enlace que abre el chat de la tienda con el mensaje ya escrito. */
export function whatsappUrl(message: string): string {
  const phone = SITE.whatsappNumber.replace(/\D/g, '');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
