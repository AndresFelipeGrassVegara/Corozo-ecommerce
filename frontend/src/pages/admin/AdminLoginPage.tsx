import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export function AdminLoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError((err as Error).message);
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-container-low px-margin-mobile">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-xl bg-surface-container-lowest p-space-xl shadow-sm">
        <span className="eyebrow mb-1 block text-secondary">Área privada</span>
        <h1 className="mb-space-lg text-headline-md">Administración</h1>

        <label className="mb-space-md flex flex-col gap-1">
          <span className="eyebrow text-on-surface-variant">Correo</span>
          <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
        </label>
        <label className="mb-space-lg flex flex-col gap-1">
          <span className="eyebrow text-on-surface-variant">Contraseña</span>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field"
          />
        </label>

        {error && <p role="alert" className="mb-space-md rounded-lg bg-error-container p-space-sm text-body-sm text-on-error-container">{error}</p>}

        <Button type="submit" size="lg" loading={loading}>Entrar</Button>
        <Link to="/" className="mt-space-md block text-center text-body-sm text-on-surface-variant hover:text-primary">
          ← Volver a la tienda
        </Link>
      </form>
    </div>
  );
}
