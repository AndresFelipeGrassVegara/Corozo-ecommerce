import { ReactNode } from 'react';
import { Icon } from './Icon';

/** Mensaje cuando una lista está vacía. */
export function EmptyState({
  icon,
  title,
  text,
  action,
}: {
  icon: string;
  title: string;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-margin-mobile py-16 text-center">
      <div className="mb-space-md flex h-16 w-16 items-center justify-center rounded-full bg-surface-container">
        <Icon name={icon} className="text-[28px] text-on-surface-variant" />
      </div>
      <h2 className="mb-1 text-headline-sm">{title}</h2>
      {text && <p className="mb-space-lg max-w-xs text-on-surface-variant">{text}</p>}
      {action}
    </div>
  );
}

/** Mensaje de error con opción de reintentar. */
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-space-sm py-12 text-center">
      <Icon name="cloud_off" className="text-[32px] text-outline" />
      <p className="max-w-xs text-on-surface-variant">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="eyebrow text-secondary underline-offset-4 hover:underline">
          Reintentar
        </button>
      )}
    </div>
  );
}

/** Rectángulo gris animado mientras cargan los datos. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-surface-container-high ${className ?? ''}`} />;
}
