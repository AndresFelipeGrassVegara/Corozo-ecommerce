import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/format';
import { Icon } from './Icon';

const VARIANTS = {
  primary: 'bg-primary text-on-primary hover:bg-primary-container shadow-sm',
  light: 'bg-surface text-primary hover:bg-surface-container-lowest shadow-md',
  soft: 'bg-surface-container-lowest text-primary hover:bg-surface shadow-sm',
  outline: 'bg-transparent text-on-surface ring-1 ring-outline-variant hover:ring-primary hover:text-primary',
  ghost: 'bg-transparent text-on-surface hover:text-primary',
  whatsapp: 'bg-[#25D366] text-white hover:bg-[#1ebe5b] shadow-sm',
} as const;

const SIZES = {
  sm: 'h-9 px-space-md',
  md: 'h-11 px-space-lg',
  lg: 'h-12 px-space-lg w-full',
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  /** Si se indica, el botón se convierte en un enlace interno */
  to?: string;
  icon?: string;
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  to,
  icon,
  loading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-space-xs whitespace-nowrap rounded-lg font-sans text-label-caps uppercase tracking-wider',
    'transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50',
    VARIANTS[variant],
    SIZES[size],
    className,
  );

  const content = (
    <>
      <span>{children}</span>
      {loading ? (
        <Icon name="progress_activity" className="animate-spin text-[18px]" />
      ) : (
        icon && <Icon name={icon} className="text-[18px]" />
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} disabled={disabled || loading} {...props}>
      {content}
    </button>
  );
}
