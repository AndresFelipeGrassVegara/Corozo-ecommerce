import { createContext, ReactNode, useCallback, useContext, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';

/** Avisos breves en pantalla ("Añadido a tu bolsa"). */
interface Toast {
  id: number;
  message: string;
  icon: string;
}

const ToastContext = createContext<((message: string, icon?: string) => void) | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const show = useCallback((message: string, icon = 'check_circle') => {
    const id = ++nextId.current;
    setToasts((current) => [...current, { id, message, icon }]);
    setTimeout(() => setToasts((current) => current.filter((t) => t.id !== id)), 2800);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-space-xs px-margin-mobile md:bottom-8"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex animate-fade-up items-center gap-space-sm rounded-lg bg-inverse-surface px-space-md py-space-sm text-body-sm text-inverse-on-surface shadow-lg"
          >
            <Icon name={toast.icon} className="text-[18px] text-secondary-fixed-dim" />
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast debe usarse dentro de <ToastProvider>');
  return context;
}
