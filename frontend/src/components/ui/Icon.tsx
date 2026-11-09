import { cn } from '@/lib/format';

interface IconProps {
  /** Nombre del icono en https://fonts.google.com/icons (p. ej. "favorite") */
  name: string;
  filled?: boolean;
  className?: string;
}

export function Icon({ name, filled, className }: IconProps) {
  return (
    <span aria-hidden="true" className={cn('icon', filled && 'icon-filled', 'text-[22px]', className)}>
      {name}
    </span>
  );
}
