import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { NAV_LINKS } from '@/config/site';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { cn } from '@/lib/format';
import { Icon } from '../ui/Icon';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { SearchOverlay } from './SearchOverlay';

/** Cabecera fija translúcida. En móvil: menú · logo · iconos. En escritorio: logo · navegación · iconos. */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count } = useCart();
  const wishlist = useWishlist();

  const iconButton =
    'relative flex h-11 w-11 items-center justify-center text-on-surface transition-colors hover:text-primary';

  return (
    <>
      <header className="pt-safe fixed top-0 z-50 w-full bg-surface/85 shadow-[0_1px_8px_rgba(0,0,0,0.03)] backdrop-blur-xl">
        <div className="shop-container grid h-16 grid-cols-[1fr_auto_1fr] items-center">
          {/* Izquierda */}
          <div className="flex items-center">
            <button aria-label="Abrir menú" className={cn(iconButton, '-ml-space-sm md:hidden')} onClick={() => setMenuOpen(true)}>
              <Icon name="menu" />
            </button>
            <div className="hidden md:block">
              <Logo />
            </div>
          </div>

          {/* Centro */}
          <div className="md:hidden">
            <Logo />
          </div>
          <nav aria-label="Principal" className="hidden items-center gap-space-xl md:flex">
            {NAV_LINKS.slice(0, 2).map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'eyebrow py-2 transition-colors hover:text-primary',
                    isActive ? 'text-primary' : 'text-on-surface-variant',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink to="/catalogo?collection=new" className="eyebrow py-2 text-on-surface-variant hover:text-primary">
              Novedades
            </NavLink>
            <NavLink to="/catalogo?collection=sale" className="eyebrow py-2 text-on-surface-variant hover:text-primary">
              Rebajas
            </NavLink>
          </nav>

          {/* Derecha */}
          <div className="-mr-space-sm flex items-center justify-end">
            <button aria-label="Buscar" className={iconButton} onClick={() => setSearchOpen(true)}>
              <Icon name="search" />
            </button>
            <Link to="/perfil" aria-label="Favoritos y perfil" className={cn(iconButton, 'hidden md:flex')}>
              <Icon name="favorite" />
              {wishlist.items.length > 0 && <Badge value={wishlist.items.length} />}
            </Link>
            <Link to="/bolsa" aria-label={`Bolsa, ${count} artículos`} className={cn(iconButton, 'hidden md:flex')}>
              <Icon name="shopping_bag" />
              {count > 0 && <Badge value={count} />}
            </Link>
            <Link to="/perfil" aria-label="Perfil" className={cn(iconButton, 'md:hidden')}>
              <Icon name="person" />
              {wishlist.items.length > 0 && <Badge value={wishlist.items.length} />}
            </Link>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function Badge({ value }: { value: number }) {
  return (
    <span className="absolute right-1 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-semibold leading-none text-on-primary">
      {value}
    </span>
  );
}
