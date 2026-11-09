import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminProductFormPage } from './pages/admin/AdminProductFormPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { BagPage } from './pages/BagPage';
import { CatalogPage } from './pages/CatalogPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProductPage } from './pages/ProductPage';
import { ProfilePage } from './pages/ProfilePage';

/** Mapa de rutas de la aplicación. */
export function App() {
  return (
    <Routes>
      {/* Tienda */}
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="catalogo" element={<CatalogPage />} />
        <Route path="producto/:slug" element={<ProductPage />} />
        <Route path="bolsa" element={<BagPage />} />
        <Route path="perfil" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Panel de administración */}
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminProductsPage />} />
        <Route path="prendas/nueva" element={<AdminProductFormPage />} />
        <Route path="prendas/:id" element={<AdminProductFormPage />} />
        <Route path="pedidos" element={<AdminOrdersPage />} />
      </Route>
    </Routes>
  );
}
