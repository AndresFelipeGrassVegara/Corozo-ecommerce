import { cn } from '@/lib/format';

interface PillProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

/** Botón de filtro con forma de píldora (barra de colecciones, tallas...). */
export function Pill({ label, active, onClick }: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'whitespace-nowrap rounded-lg px-space-md py-2 text-label-caps uppercase transition-all',
        active
          ? 'bg-primary text-on-primary shadow-sm'
          : 'bg-surface-container text-on-surface hover:bg-surface-container-high',
      )}
    >
      {label}
    </button>
  );
}
