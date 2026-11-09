import { ReactNode } from 'react';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  /** Contenido a la derecha (enlace "Ver todo", contador...) */
  aside?: ReactNode;
}

export function SectionHeader({ eyebrow, title, aside }: SectionHeaderProps) {
  return (
    <div className="mb-space-md flex items-end justify-between gap-space-md">
      <div>
        <span className="eyebrow mb-1 block text-secondary">{eyebrow}</span>
        <h2 className="text-headline-sm md:text-headline-md">{title}</h2>
      </div>
      {aside}
    </div>
  );
}
