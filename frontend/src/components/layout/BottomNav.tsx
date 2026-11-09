import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '@/config/site';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/format';
import { Icon } from '../ui/Icon';

/** Barra de pestañas inferior, solo en móvil. */
export function BottomNav() {
  const { count } = useCart();

  return (
    <nav
      aria-label="Navegación inferior"
      className="pb-safe fixed bottom-0 z-50 w-full bg-surface/90 shadow-[0_-1px_12px_rgba(0,0,0,0.04)] backdrop-blur-xl md:hidden"
    >
      <div className="flex h-16 items-center justify-around px-gutter-mobile">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex h-11 min-w-[56px] flex-col items-center justify-center transition-colors',
                isActive ? 'font-semibold text-primary' : 'text-on-surface-variant hover:text-on-surface',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className="relative flex items-center justify-center">
                  <Icon name={link.icon} filled={isActive} />
                  {link.to === '/bolsa' && count > 0 && (
                    <span className="absolute -right-2.5 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-secondary px-0.5 text-[9px] font-semibold text-on-secondary">
                      {count}
                    </span>
                  )}
                </span>
                <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider">{link.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
