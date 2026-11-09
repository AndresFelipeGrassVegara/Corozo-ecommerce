import { Link, useNavigate } from 'react-router-dom';
import { COLLECTION_PILLS } from '@/config/site';
import { Pill } from '../ui/Pill';

/** Barra horizontal de colecciones: cada píldora abre el catálogo filtrado. */
export function CollectionPills() {
  const navigate = useNavigate();

  return (
    <section className="mt-space-lg">
      <div className="shop-container mb-space-xs flex items-center justify-between">
        <span className="eyebrow text-on-surface-variant">Colecciones</span>
        <Link to="/catalogo" className="eyebrow text-secondary hover:underline">
          Ver todas
        </Link>
      </div>
      <div className="no-scrollbar shop-container flex items-center gap-space-xs overflow-x-auto py-space-xs">
        {COLLECTION_PILLS.map((pill, index) => (
          <Pill
            key={pill.label}
            label={pill.label}
            active={index === 0}
            onClick={() => navigate(`/catalogo${pill.query ? `?${pill.query}` : ''}`)}
          />
        ))}
      </div>
    </section>
  );
}
