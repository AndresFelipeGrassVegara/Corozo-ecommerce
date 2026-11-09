import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { EmptyState } from '@/components/ui/States';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';

/** Perfil: favoritos guardados y acceso a la cuenta. */
export function ProfilePage() {
  const wishlist = useWishlist();
  const { user, logout } = useAuth();

  return (
    <div className="shop-container pb-space-xl pt-space-lg">
      <div className="mb-space-lg flex items-center gap-space-md rounded-xl bg-surface-container-low p-space-md">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary font-serif text-headline-sm text-secondary-fixed-dim">
          {user ? user.name[0] : <Icon name="person" className="text-on-primary" />}
        </div>
        <div className="flex-1">
          <p className="eyebrow text-on-surface-variant">{user ? 'Sesión iniciada' : 'Invitada'}</p>
          <p className="font-serif text-title-editorial">{user ? user.email : 'Bienvenida a Coroso'}</p>
        </div>
        {user?.role === 'ADMIN' && (
          <div className="flex gap-space-xs">
            <Button to="/admin" size="sm" variant="soft" icon="tune">Panel</Button>
            <Button size="sm" variant="ghost" onClick={logout}>Salir</Button>
          </div>
        )}
      </div>

      <span className="eyebrow mb-1 block text-secondary">Guardado para después</span>
      <h1 className="mb-space-lg text-headline-lg-mobile md:text-headline-lg">Favoritos</h1>

      {wishlist.items.length === 0 ? (
        <EmptyState
          icon="favorite"
          title="Aún no tienes favoritos"
          text="Pulsa el corazón de cualquier prenda para guardarla aquí."
          action={<Button to="/catalogo">Explorar catálogo</Button>}
        />
      ) : (
        <ProductGrid products={wishlist.items} />
      )}
    </div>
  );
}
