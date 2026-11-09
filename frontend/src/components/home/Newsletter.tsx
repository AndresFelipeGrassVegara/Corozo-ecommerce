import { FormEvent, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

/** Suscripción al club: guarda el correo en la base de datos vía API. */
export function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus('loading');
    setError('');
    try {
      const result = await api.subscribe(email);
      setMessage(result.message);
      setStatus('done');
    } catch (err) {
      setError((err as Error).message);
      setStatus('idle');
    }
  };

  return (
    <section className="shop-container mt-space-xl">
      <div className="relative overflow-hidden rounded-xl bg-surface-container-highest p-space-lg shadow-sm md:p-space-xl">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-secondary-container/30 blur-2xl" />
        <div className="relative z-10 grid gap-space-md md:grid-cols-2 md:items-center md:gap-space-xl">
          <div>
            <div className="mb-space-xs flex items-center gap-2">
              <Icon name="mail" className="text-[20px] text-secondary" />
              <span className="eyebrow font-semibold text-secondary">Club exclusivo</span>
            </div>
            <h2 className="mb-1 text-headline-sm md:text-headline-md">Acceso anticipado</h2>
            <p className="text-on-surface-variant">
              Suscríbete para recibir lanzamientos privados y obtén un{' '}
              <strong className="font-semibold text-on-surface">10% de cortesía</strong> en tu primer pedido.
            </p>
          </div>

          <div>
            {status === 'done' ? (
              <div role="status" className="flex items-center gap-2 rounded-lg bg-tertiary-fixed p-space-sm text-on-tertiary-fixed">
                <Icon name="check_circle" className="text-[20px]" />
                <span className="text-body-sm">{message}</span>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-space-xs">
                <label htmlFor="newsletter-email" className="sr-only">Correo electrónico</label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  maxLength={254}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Introduce tu correo electrónico"
                  className="field"
                />
                <Button type="submit" size="lg" icon="east" loading={status === 'loading'}>
                  Unirse a Coroso
                </Button>
                {error && <p role="alert" className="text-body-sm text-error">{error}</p>}
              </form>
            )}
            <p className="mt-space-sm text-center text-[11px] text-on-surface-variant/80">
              Sin promociones masivas. Solo lanzamientos y colecciones limitadas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
