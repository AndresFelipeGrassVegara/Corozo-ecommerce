import { Link, NavLink, Outlet } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/format';
import { AdminLoginPage } from './AdminLoginPage';

/**
 * Envuelve todas las rutas /admin.
 * Si no hay sesión de administrador muestra el login.
 * (La seguridad real está en el backend: esto solo es la interfaz.)
 */
export function AdminLayout() {
  const { user, checking, logout } = useAuth();

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Icon name="progress_activity" className="animate-spin text-[32px] text-primary" />
      </div>
    );
  }
  if (user?.role !== 'ADMIN') return <AdminLoginPage />;

  return (
    <div className="min-h-screen bg-surface-container-low">
      <header className="sticky top-0 z-40 bg-inverse-surface text-inverse-on-surface">
        <div className="shop-container flex h-14 items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-lg">
            <Link to="/admin" className="font-serif text-headline-sm">Coroso · Admin</Link>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) => cn('eyebrow hidden sm:block', isActive ? 'text-secondary-fixed-dim' : 'text-inverse-on-surface/70')}
            >
              Prendas
            </NavLink>
            <NavLink
              to="/admin/pedidos"
              className={({ isActive }) => cn('eyebrow hidden sm:block', isActive ? 'text-secondary-fixed-dim' : 'text-inverse-on-surface/70')}
            >
              Pedidos
            </NavLink>
          </div>
          <div className="flex items-center gap-space-md text-body-sm">
            <Link to="/" className="flex items-center gap-1 text-inverse-on-surface/70 hover:text-inverse-on-surface">
              <Icon name="storefront" className="text-[18px]" /> <span className="hidden sm:inline">Ver tienda</span>
            </Link>
            <button onClick={logout} className="flex items-center gap-1 text-inverse-on-surface/70 hover:text-inverse-on-surface">
              <Icon name="logout" className="text-[18px]" /> <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>
      <main className="shop-container py-space-lg">
        <Outlet />
      </main>
    </div>
  );
}
