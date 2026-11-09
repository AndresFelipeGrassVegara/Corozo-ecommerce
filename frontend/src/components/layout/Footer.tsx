import { Link } from 'react-router-dom';
import { COLLECTION_PILLS, SITE } from '@/config/site';
import { Icon } from '../ui/Icon';

export function Footer() {
  return (
    <footer className="mt-space-xl bg-inverse-surface pb-28 pt-space-xl text-inverse-on-surface md:pb-space-xl">
      <div className="shop-container grid gap-space-xl md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="mb-space-sm font-serif text-headline-md">{SITE.name}</p>
          <p className="max-w-sm text-body-md text-inverse-on-surface/70">
            Prendas de autor confeccionadas en series cortas, con tejidos naturales y bordados hechos a mano.
          </p>
        </div>
        <div>
          <p className="eyebrow mb-space-sm text-secondary-fixed-dim">Comprar</p>
          <ul className="space-y-space-xs text-body-md text-inverse-on-surface/80">
            {COLLECTION_PILLS.slice(1, 6).map((pill) => (
              <li key={pill.label}>
                <Link to={`/catalogo?${pill.query}`} className="hover:text-secondary-fixed-dim">
                  {pill.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-space-sm text-secondary-fixed-dim">Ayuda</p>
          <ul className="space-y-space-xs text-body-md text-inverse-on-surface/80">
            <li className="flex items-center gap-space-xs"><Icon name="local_shipping" className="text-[18px]" /> Envíos a toda Colombia</li>
            <li className="flex items-center gap-space-xs"><Icon name="chat" className="text-[18px]" /> Pedidos por WhatsApp</li>
            <li className="flex items-center gap-space-xs"><Icon name="mail" className="text-[18px]" /> {SITE.supportEmail}</li>
          </ul>
        </div>
      </div>
      <div className="shop-container mt-space-xl flex flex-col justify-between gap-space-xs border-t border-inverse-on-surface/10 pt-space-md text-body-sm text-inverse-on-surface/50 md:flex-row">
        <span>© {new Date().getFullYear()} {SITE.name}. Todos los derechos reservados.</span>
        <Link to="/admin" className="hover:text-inverse-on-surface">Acceso administración</Link>
      </div>
    </footer>
  );
}
