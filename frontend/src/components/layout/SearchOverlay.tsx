import { FormEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/format';
import { Icon } from '../ui/Icon';

const SUGGESTIONS = ['Jean bordado', 'Vestido', 'Conjunto', 'Encaje', 'Bermuda'];

/** Buscador a pantalla completa. Envía al catálogo con ?search= */
export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [term, setTerm] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const search = (value: string) => {
    const query = value.trim().slice(0, 60);
    if (!query) return;
    navigate(`/catalogo?search=${encodeURIComponent(query)}`);
    setTerm('');
    onClose();
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    search(term);
  };

  if (!open) return null;

  return (
    <div role="dialog" aria-label="Buscar" className={cn('fixed inset-0 z-[70] animate-fade-up bg-surface/95 backdrop-blur-xl')}>
      <div className="shop-container pt-safe">
        <form onSubmit={onSubmit} className="flex h-20 items-center gap-space-sm border-b border-outline-variant">
          <Icon name="search" className="text-outline" />
          <input
            ref={input}
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            maxLength={60}
            placeholder="Buscar prendas, tejidos..."
            className="h-full flex-1 bg-transparent font-serif text-headline-sm placeholder:text-outline focus:outline-none"
            aria-label="Término de búsqueda"
          />
          <button type="button" aria-label="Cerrar búsqueda" onClick={onClose} className="flex h-11 w-11 items-center justify-center">
            <Icon name="close" />
          </button>
        </form>
        <p className="eyebrow mb-space-sm mt-space-lg text-on-surface-variant">Búsquedas frecuentes</p>
        <div className="flex flex-wrap gap-space-xs">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => search(s)} className="rounded-lg bg-surface-container px-space-md py-2 text-label-ui hover:bg-surface-container-high">
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
