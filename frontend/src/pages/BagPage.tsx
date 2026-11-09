import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { EmptyState } from '@/components/ui/States';
import { useCart } from '@/context/CartContext';
import { api } from '@/lib/api';
import { formatPrice, imageUrl } from '@/lib/format';
import { buildOrderMessage, whatsappUrl } from '@/lib/whatsapp';

const EMPTY_FORM = { customerName: '', city: '', notes: '' };

/**
 * Bolsa de compra.
 * Al confirmar: 1) se registra el pedido en el backend (que valida precios y stock)
 *               2) se abre WhatsApp con el resumen del pedido para terminar la compra.
 */
export function BagPage() {
  const cart = useCart();
  const [form, setForm] = useState(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [chatUrl, setChatUrl] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSending(true);
    setError('');
    try {
      const customer = { ...form, notes: form.notes.trim() || undefined };
      const order = await api.createOrder({
        ...customer,
        items: cart.items.map(({ variantId, quantity }) => ({ variantId, quantity })),
      });
      const url = whatsappUrl(buildOrderMessage(order, customer));
      cart.clear();
      setChatUrl(url);
      window.scrollTo({ top: 0 });
      window.location.href = url; // abre WhatsApp (app en móvil, WhatsApp Web en escritorio)
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  // Pantalla de respaldo por si el navegador no abrió WhatsApp automáticamente
  if (chatUrl) {
    return (
      <EmptyState
        icon="chat"
        title="¡Pedido enviado!"
        text="Te estamos llevando a WhatsApp para confirmar tu pedido. Si no se abrió, pulsa el botón."
        action={
          <a
            href={chatUrl}
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-space-xs rounded-lg bg-[#25D366] px-space-lg text-label-caps uppercase tracking-wider text-white shadow-sm"
          >
            <Icon name="chat" className="text-[18px]" /> Abrir WhatsApp
          </a>
        }
      />
    );
  }

  if (cart.items.length === 0) {
    return (
      <EmptyState
        icon="shopping_bag"
        title="Tu bolsa está vacía"
        text="Guarda aquí las prendas que quieras llevarte."
        action={<Button to="/catalogo" icon="arrow_forward">Explorar catálogo</Button>}
      />
    );
  }

  return (
    <div className="shop-container pb-space-xl pt-space-lg">
      <span className="eyebrow mb-1 block text-secondary">Tu selección</span>
      <h1 className="mb-space-lg text-headline-lg-mobile md:text-headline-lg">Bolsa ({cart.count})</h1>

      <div className="grid gap-space-xl lg:grid-cols-[1fr_400px]">
        {/* Artículos */}
        <ul className="divide-y divide-outline-variant/50">
          {cart.items.map((item) => (
            <li key={item.variantId} className="flex gap-space-md py-space-md first:pt-0">
              <Link to={`/producto/${item.slug}`} className="h-32 w-24 flex-none overflow-hidden rounded-lg bg-surface-container-high">
                {item.image && <img src={imageUrl(item.image)} alt={item.name} className="h-full w-full object-cover object-top" />}
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-space-sm">
                  <div>
                    <Link to={`/producto/${item.slug}`} className="font-serif text-title-editorial hover:text-primary">{item.name}</Link>
                    <p className="text-body-sm text-on-surface-variant">Talla {item.size} · {item.color}</p>
                  </div>
                  <button aria-label={`Eliminar ${item.name}`} onClick={() => cart.remove(item.variantId)} className="text-outline hover:text-error">
                    <Icon name="delete" className="text-[20px]" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-lg bg-surface-container">
                    <button aria-label="Restar uno" onClick={() => cart.setQuantity(item.variantId, item.quantity - 1)} className="flex h-9 w-9 items-center justify-center">
                      <Icon name="remove" className="text-[18px]" />
                    </button>
                    <span className="w-6 text-center text-label-ui">{item.quantity}</span>
                    <button aria-label="Sumar uno" onClick={() => cart.setQuantity(item.variantId, item.quantity + 1)} className="flex h-9 w-9 items-center justify-center">
                      <Icon name="add" className="text-[18px]" />
                    </button>
                  </div>
                  <span className="text-price">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Resumen y datos para WhatsApp */}
        <form onSubmit={onSubmit} className="flex flex-col gap-space-md self-start rounded-xl bg-surface-container-low p-space-lg lg:sticky lg:top-24">
          <div>
            <h2 className="text-headline-sm">Finalizar por WhatsApp</h2>
            <p className="text-body-sm text-on-surface-variant">
              Te enviaremos al chat de la tienda con tu pedido listo para confirmar pago y envío.
            </p>
          </div>

          <label className="flex flex-col gap-1">
            <span className="eyebrow text-on-surface-variant">Nombre</span>
            <input required minLength={3} maxLength={120} autoComplete="name" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="field" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="eyebrow text-on-surface-variant">Ciudad</span>
            <input required minLength={2} maxLength={80} autoComplete="address-level2" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="field" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="eyebrow text-on-surface-variant">Notas (opcional)</span>
            <textarea rows={2} maxLength={500} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="field h-auto py-space-sm" placeholder="Horario de entrega, dudas de talla..." />
          </label>

          <dl className="space-y-space-xs border-t border-outline-variant/50 pt-space-md text-body-md">
            <div className="flex justify-between"><dt>Prendas</dt><dd>{cart.count}</dd></div>
            <div className="flex justify-between text-on-surface-variant"><dt>Envío</dt><dd>Se acuerda por WhatsApp</dd></div>
            <div className="flex justify-between pt-space-xs font-serif text-headline-sm">
              <dt>Total</dt>
              <dd>{formatPrice(cart.subtotal)}</dd>
            </div>
          </dl>

          {error && <p role="alert" className="rounded-lg bg-error-container p-space-sm text-body-sm text-on-error-container">{error}</p>}

          <Button type="submit" size="lg" variant="whatsapp" icon="chat" loading={sending}>
            Pedir por WhatsApp
          </Button>
          <p className="text-center text-[11px] text-on-surface-variant">
            Los precios y la disponibilidad se verifican en nuestros servidores al enviar el pedido.
          </p>
        </form>
      </div>
    </div>
  );
}
