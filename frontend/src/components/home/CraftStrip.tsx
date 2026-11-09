import { Icon } from '../ui/Icon';

const PILLARS = [
  { icon: 'eco', eyebrow: 'Trazabilidad', title: 'Algodón y lino naturales', text: 'Cada prenda indica su origen y composición.' },
  { icon: 'back_hand', eyebrow: 'Hecho a mano', title: 'Bordados artesanales', text: 'Apliques y cristales colocados pieza a pieza.' },
  { icon: 'chat', eyebrow: 'Compra fácil', title: 'Pedido por WhatsApp', text: 'Arma tu bolsa y te atendemos por chat.' },
];

/** Franja con los valores de la marca. */
export function CraftStrip() {
  return (
    <section className="shop-container mt-space-lg grid gap-space-sm md:mt-space-xl md:grid-cols-3">
      {PILLARS.map((p) => (
        <div key={p.title} className="flex items-center gap-space-md rounded-xl bg-surface-container-low p-space-md">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-tertiary-fixed text-on-tertiary-fixed">
            <Icon name={p.icon} className="text-[24px]" />
          </div>
          <div>
            <span className="eyebrow text-on-surface-variant">{p.eyebrow}</span>
            <h3 className="font-serif text-[17px] leading-tight">{p.title}</h3>
            <p className="mt-0.5 text-body-sm text-on-surface-variant">{p.text}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
