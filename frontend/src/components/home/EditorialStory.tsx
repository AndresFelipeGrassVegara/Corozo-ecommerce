import { Button } from '../ui/Button';

/** Bloque editorial con dos imágenes y una cita. */
export function EditorialStory() {
  return (
    <section className="shop-container mt-space-xl">
      <div className="grid gap-space-md overflow-hidden rounded-xl bg-surface-container p-space-lg shadow-sm md:grid-cols-2 md:items-center md:gap-space-xl md:p-space-xl">
        <div className="grid grid-cols-2 gap-space-sm">
          <img
            src="/uploads/products/conjunto-bordado-ingles.jpg"
            alt="Detalle del conjunto de bordado inglés"
            loading="lazy"
            className="aspect-[3/4] w-full rounded-lg object-cover"
          />
          <img
            src="/uploads/products/conjunto-crochet-cacao.jpg"
            alt="Conjunto de crochet color cacao"
            loading="lazy"
            className="aspect-[3/4] w-full rounded-lg object-cover md:mt-space-xl"
          />
        </div>

        <div>
          <div className="mb-space-md flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-secondary" />
            <span className="eyebrow text-on-surface-variant">Editorial No. 04</span>
          </div>
          <h2 className="mb-space-xs text-headline-md md:text-headline-lg">El arte del detalle</h2>
          <blockquote className="mb-space-md font-serif text-title-editorial italic leading-relaxed text-on-surface-variant md:text-headline-sm md:font-normal">
            «El auténtico lujo no reside en la abundancia, sino en la calma de vestir prendas hechas a mano, puntada a puntada.»
          </blockquote>
          <div className="flex items-center justify-between gap-space-md">
            <div>
              <p className="text-label-ui font-semibold">Equipo de diseño Coroso</p>
              <p className="text-body-sm text-on-surface-variant">Taller de bordado</p>
            </div>
            <Button to="/catalogo?category=conjuntos" variant="soft" size="sm" icon="north_east">
              Ver conjuntos
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
