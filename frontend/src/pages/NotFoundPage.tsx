import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/States';

export function NotFoundPage() {
  return (
    <EmptyState
      icon="explore_off"
      title="Página no encontrada"
      text="El enlace que buscas no existe o se ha movido."
      action={<Button to="/">Volver al inicio</Button>}
    />
  );
}
