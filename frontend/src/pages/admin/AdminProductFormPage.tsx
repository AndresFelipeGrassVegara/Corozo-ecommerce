import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/context/ToastContext';
import { useApi } from '@/hooks/useApi';
import { api } from '@/lib/api';
import { formatPrice, imageUrl } from '@/lib/format';
import type { ProductDetail, ProductInput } from '@/types/api';

/** Estado del formulario (los precios se escriben en pesos COP, sin puntos ni decimales). */
interface FormState {
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  material: string;
  care: string;
  price: string;
  compareAt: string;
  badge: string;
  categoryId: string;
  isNew: boolean;
  isFeatured: boolean;
  isActive: boolean;
  images: { url: string; alt: string }[];
  variants: { sku: string; size: string; color: string; stock: number }[];
}

const EMPTY: FormState = {
  name: '',
  slug: '',
  subtitle: '',
  description: '',
  material: '',
  care: '',
  price: '',
  compareAt: '',
  badge: '',
  categoryId: '',
  isNew: true,
  isFeatured: false,
  isActive: true,
  images: [{ url: '/uploads/products/', alt: '' }],
  variants: [{ sku: '', size: 'M', color: '', stock: 5 }],
};

/** "Jean Rosé Ñandú" → "jean-rose-nandu" */
const slugify = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const fromProduct = (p: ProductDetail): FormState => ({
  name: p.name,
  slug: p.slug,
  subtitle: p.subtitle,
  description: p.description,
  material: p.material ?? '',
  care: p.care ?? '',
  price: String(p.price),
  compareAt: p.compareAtPrice ? String(p.compareAtPrice) : '',
  badge: p.badge ?? '',
  categoryId: String(p.categoryId),
  isNew: p.isNew,
  isFeatured: p.isFeatured,
  isActive: p.isActive,
  images: p.images.map(({ url, alt }) => ({ url, alt })),
  variants: p.variants.map(({ sku, size, color, stock }) => ({ sku, size, color, stock })),
});

const toInput = (f: FormState): ProductInput => ({
  name: f.name.trim(),
  slug: f.slug,
  subtitle: f.subtitle.trim(),
  description: f.description.trim(),
  material: f.material.trim() || undefined,
  care: f.care.trim() || undefined,
  price: Math.round(Number(f.price)),
  compareAtPrice: f.compareAt ? Math.round(Number(f.compareAt)) : null,
  badge: f.badge.trim() || null,
  categoryId: Number(f.categoryId),
  isNew: f.isNew,
  isFeatured: f.isFeatured,
  isActive: f.isActive,
  images: f.images.filter((i) => i.url.trim()),
  // Si no se indica SKU, se genera a partir del slug y la talla
  variants: f.variants.map((v) => ({ ...v, sku: v.sku || `${f.slug}-${v.size}`.toUpperCase().replace(/[^A-Z0-9-]/g, '') })),
});

export function AdminProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();
  const categories = useApi(() => api.getCategories(), []);

  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api.admin
      .getProduct(Number(id))
      .then((p) => setForm(fromProduct(p)))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const input = toInput(form);
      if (isEdit) await api.admin.updateProduct(Number(id), input);
      else await api.admin.createProduct(input);
      toast(isEdit ? 'Cambios guardados' : 'Prenda creada');
      navigate('/admin');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-on-surface-variant">Cargando…</p>;

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-4xl">
      <Link to="/admin" className="mb-space-sm flex items-center gap-1 text-body-sm text-on-surface-variant hover:text-primary">
        <Icon name="arrow_back" className="text-[16px]" /> Prendas
      </Link>
      <h1 className="mb-space-lg text-headline-md">{isEdit ? `Editar: ${form.name}` : 'Nueva prenda'}</h1>

      <div className="grid gap-space-lg lg:grid-cols-[1fr_300px]">
        <div className="space-y-space-lg">
          <Card title="Información">
            <Field label="Nombre">
              <input
                required
                maxLength={100}
                value={form.name}
                onChange={(e) => {
                  set('name', e.target.value);
                  if (!isEdit) set('slug', slugify(e.target.value));
                }}
                className="field"
              />
            </Field>
            <Field label="Slug (URL)" hint={`/producto/${form.slug || '…'}`}>
              <input required maxLength={80} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={form.slug} onChange={(e) => set('slug', e.target.value)} className="field" />
            </Field>
            <Field label="Subtítulo">
              <input required maxLength={120} value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} className="field" />
            </Field>
            <Field label="Descripción">
              <textarea required maxLength={2000} rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} className="field h-auto py-space-sm" />
            </Field>
            <div className="grid gap-space-md sm:grid-cols-2">
              <Field label="Composición">
                <input maxLength={200} value={form.material} onChange={(e) => set('material', e.target.value)} className="field" />
              </Field>
              <Field label="Cuidados">
                <input maxLength={300} value={form.care} onChange={(e) => set('care', e.target.value)} className="field" />
              </Field>
            </div>
          </Card>

          <Card title="Imágenes" hint="Sube la foto a backend/uploads/products/ y escribe aquí su ruta, o usa una URL https://">
            {form.images.map((img, i) => (
              <div key={i} className="flex items-start gap-space-sm">
                <div className="h-16 w-12 flex-none overflow-hidden rounded bg-surface-container">
                  {/\.(jpe?g|png|webp|avif)$/i.test(img.url) && <img src={imageUrl(img.url)} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="grid flex-1 gap-space-xs sm:grid-cols-2">
                  <input required placeholder="/uploads/products/foto.jpg" value={img.url} onChange={(e) => set('images', form.images.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))} className="field" />
                  <input required minLength={3} placeholder="Texto alternativo" value={img.alt} onChange={(e) => set('images', form.images.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))} className="field" />
                </div>
                <RemoveButton disabled={form.images.length === 1} onClick={() => set('images', form.images.filter((_, j) => j !== i))} />
              </div>
            ))}
            <AddButton onClick={() => set('images', [...form.images, { url: '/uploads/products/', alt: '' }])}>Añadir imagen</AddButton>
          </Card>

          <Card title="Tallas y stock">
            {form.variants.map((v, i) => (
              <div key={i} className="grid grid-cols-[70px_1fr_80px_auto] items-center gap-space-xs">
                <input required aria-label="Talla" placeholder="Talla" maxLength={10} value={v.size} onChange={(e) => set('variants', form.variants.map((x, j) => (j === i ? { ...x, size: e.target.value } : x)))} className="field px-space-sm" />
                <input required aria-label="Color" placeholder="Color" maxLength={40} value={v.color} onChange={(e) => set('variants', form.variants.map((x, j) => (j === i ? { ...x, color: e.target.value } : x)))} className="field" />
                <input required aria-label="Stock" type="number" min={0} value={v.stock} onChange={(e) => set('variants', form.variants.map((x, j) => (j === i ? { ...x, stock: Number(e.target.value) } : x)))} className="field px-space-sm" />
                <RemoveButton disabled={form.variants.length === 1} onClick={() => set('variants', form.variants.filter((_, j) => j !== i))} />
              </div>
            ))}
            <AddButton onClick={() => set('variants', [...form.variants, { sku: '', size: '', color: form.variants[0]?.color ?? '', stock: 5 }])}>Añadir talla</AddButton>
          </Card>
        </div>

        <div className="space-y-space-lg">
          <Card title="Precio">
            <Field label="Precio (COP)" hint={form.price ? formatPrice(Number(form.price)) : 'Ej.: 189900'}>
              <input required type="number" min={0} step={100} value={form.price} onChange={(e) => set('price', e.target.value)} className="field" />
            </Field>
            <Field label="Precio anterior (COP)" hint="Opcional: se muestra tachado">
              <input type="number" min={0} step={100} value={form.compareAt} onChange={(e) => set('compareAt', e.target.value)} className="field" />
            </Field>
          </Card>

          <Card title="Organización">
            <Field label="Categoría">
              <select required value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)} className="field">
                <option value="">Selecciona…</option>
                {categories.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Etiqueta" hint="Ej.: Edición Limitada">
              <input maxLength={30} value={form.badge} onChange={(e) => set('badge', e.target.value)} className="field" />
            </Field>
            <Check label="Visible en la tienda" checked={form.isActive} onChange={(v) => set('isActive', v)} />
            <Check label="Novedad" checked={form.isNew} onChange={(v) => set('isNew', v)} />
            <Check label="Destacada en portada" checked={form.isFeatured} onChange={(v) => set('isFeatured', v)} />
          </Card>

          {error && <p role="alert" className="rounded-lg bg-error-container p-space-sm text-body-sm text-on-error-container">{error}</p>}
          <Button type="submit" size="lg" icon="save" loading={saving}>
            {isEdit ? 'Guardar cambios' : 'Crear prenda'}
          </Button>
        </div>
      </div>
    </form>
  );
}

// ─── Piezas pequeñas del formulario ──────────────────────────

function Card({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="space-y-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
      <div>
        <h2 className="text-headline-sm">{title}</h2>
        {hint && <p className="text-body-sm text-on-surface-variant">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="eyebrow text-on-surface-variant">{label}</span>
      {children}
      {hint && <span className="text-body-sm text-outline">{hint}</span>}
    </label>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-space-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-primary" />
      {label}
    </label>
  );
}

function AddButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="eyebrow flex items-center gap-1 text-secondary hover:underline">
      <Icon name="add" className="text-[16px]" /> {children}
    </button>
  );
}

function RemoveButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button type="button" aria-label="Quitar" disabled={disabled} onClick={onClick} className="flex h-12 w-9 items-center justify-center text-outline hover:text-error disabled:opacity-30">
      <Icon name="close" className="text-[20px]" />
    </button>
  );
}
