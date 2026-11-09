import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';
import { Header } from './Header';

/** Estructura común a todas las páginas de la tienda. */
export function Layout() {
  const { pathname } = useLocation();

  // Al cambiar de página, volver arriba
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[100] focus:rounded focus:bg-surface focus:p-2">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
