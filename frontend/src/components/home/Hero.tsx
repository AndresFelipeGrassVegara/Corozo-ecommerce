import { Button } from '../ui/Button';

/** Portada editorial con la campaña de temporada. */
export function Hero() {
  return (
    <section className="shop-container pt-space-xs md:pt-space-lg">
      <div className="relative overflow-hidden rounded-xl bg-surface-container-high shadow-sm">
        <div className="relative aspect-[4/5] w-full sm:aspect-[16/10] lg:aspect-[21/9]">
          <img
            src="/uploads/products/vestido-maxi-durazno.jpg"
            alt="Modelo con vestido largo color durazno de encaje calado en una galería comercial"
            className="h-full w-full object-cover object-[center_20%] lg:object-[center_8%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent lg:bg-gradient-to-r lg:from-primary/80 lg:via-primary/30" />
          <div className="absolute inset-0 flex flex-col items-start justify-end p-space-lg md:p-space-xl lg:justify-center lg:p-16">
            <span className="eyebrow mb-space-sm inline-block rounded-full bg-surface-container-lowest/80 px-space-sm py-1 text-primary backdrop-blur-sm">
              Edición Limitada
            </span>
            <h1 className="mb-2 max-w-xl text-headline-lg-mobile text-on-primary md:text-headline-lg lg:text-display-hero">
              Colección Primavera / Verano
            </h1>
            <p className="mb-space-md max-w-xs font-light text-on-primary/90 md:max-w-md md:text-body-lg">
              Denim bordado a mano, encajes y algodones ligeros concebidos para perdurar.
            </p>
            <Button to="/catalogo?collection=new" variant="light" icon="arrow_forward">
              Explorar novedades
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
