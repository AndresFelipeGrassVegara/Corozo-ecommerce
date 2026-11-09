import { Link } from 'react-router-dom';
import { SITE } from '@/config/site';

/** Logotipo: monograma + nombre. Sustitúyelo por un <img> si tienes logo propio. */
export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-space-sm" aria-label={`${SITE.name}, ir al inicio`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-serif text-[19px] leading-none text-secondary-fixed-dim">
        C
      </span>
      <span className="font-serif text-headline-sm tracking-tight text-on-surface">{SITE.name}</span>
    </Link>
  );
}
