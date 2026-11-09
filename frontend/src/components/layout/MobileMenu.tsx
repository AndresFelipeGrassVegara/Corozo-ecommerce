import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { COLLECTION_PILLS, SITE } from '@/config/site';
import { cn } from '@/lib/format';
import { Icon } from '../ui/Icon';

/** Menú lateral para móvil con accesos a las colecciones. */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Bloquea el scroll del fondo y permite cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <div className={cn('fixed inset-0 z-[70] md:hidden', !open && 'pointer-events-none')} aria-hidden={!open}>
      <div
        className={cn('absolute inset-0 bg-tertiary/40 transition-opacity', open ? 'opacity-100' : 'opacity-0')}
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-label="Menú"
        className={cn(
          'pt-safe absolute inset-y-0 left-0 flex w-[82%] max-w-sm flex-col bg-surface shadow-xl transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between px-margin-mobile">
          <span className="font-serif text-headline-sm">{SITE.name}</span>
          <button aria-label="Cerrar menú" onClick={onClose} className="flex h-11 w-11 items-center justify-center">
            <Icon name="close" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-margin-mobile">
          <p className="eyebrow mb-space-sm mt-space-md text-on-surface-variant">Colecciones</p>
          <ul className="divide-y divide-outline-variant/40">
            {COLLECTION_PILLS.map((pill) => (
              <li key={pill.label}>
                <Link
                  to={`/catalogo${pill.query ? `?${pill.query}` : ''}`}
                  onClick={onClose}
                  className="flex items-center justify-between py-space-md font-serif text-title-editorial"
                >
                  {pill.label}
                  <Icon name="chevron_right" className="text-[18px] text-outline" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="pb-safe border-t border-outline-variant/40 px-margin-mobile py-space-md text-body-sm text-on-surface-variant">
          ¿Ayuda? {SITE.supportEmail}
        </div>
      </aside>
    </div>
  );
}
