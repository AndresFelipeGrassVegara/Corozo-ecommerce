/**
 * Datos iniciales de la tienda.
 *
 * Ejecutar con:  npm run db:seed
 * Es idempotente: puedes lanzarlo varias veces sin duplicar registros
 * (usa `upsert` por slug / email).
 *
 * Para añadir una prenda nueva copia uno de los objetos de PRODUCTS,
 * coloca su foto en uploads/products/ y vuelve a ejecutar el seed.
 */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const CATEGORIES = [
  { slug: 'jeans', name: 'Jeans', description: 'Denim de tiro alto y pierna amplia.' },
  { slug: 'vestidos', name: 'Vestidos', description: 'Siluetas largas y fluidas.' },
  { slug: 'conjuntos', name: 'Conjuntos', description: 'Dos piezas coordinadas.' },
  { slug: 'blusas-tops', name: 'Blusas y Tops', description: 'Camisas, bodies y tops.' },
  { slug: 'bermudas', name: 'Bermudas', description: 'Largo a la rodilla, corte sastre.' },
];

const DENIM_SIZES = ['34', '36', '38', '40', '42'];
const LETTER_SIZES = ['XS', 'S', 'M', 'L', 'XL'];

interface SeedProduct {
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  material: string;
  care: string;
  price: number; // en pesos colombianos (COP)
  compareAt?: number;
  badge?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  category: string;
  image: string;
  alt: string;
  color: string;
  sizes: string[];
}

const PRODUCTS: SeedProduct[] = [
  {
    slug: 'jean-wide-leg-calado-floral',
    name: 'Jean Wide Leg Calado Floral',
    subtitle: 'Denim claro con rosas caladas',
    description:
      'Jean de tiro alto y pierna amplia con aplicaciones de rosas caladas a mano y bajo deshilachado. Una pieza romántica que eleva cualquier camisa blanca.',
    material: '100% Algodón',
    care: 'Lavar del revés a 30 °C. No usar secadora.',
    price: 189900,
    badge: 'Edición Limitada',
    isNew: true,
    isFeatured: true,
    category: 'jeans',
    image: 'jean-calado-floral.jpg',
    alt: 'Jean azul claro de pierna amplia con rosas caladas, combinado con camisa blanca bordada',
    color: 'Azul claro',
    sizes: DENIM_SIZES,
  },
  {
    slug: 'bermuda-sastre-acuarela',
    name: 'Bermuda Sastre Acuarela',
    subtitle: 'Estampado floral en tinta gris',
    description:
      'Bermuda de corte sastre con pinzas y bolsillos laterales, estampada con flores en efecto acuarela. Perfecta para la oficina con un top de cuello halter.',
    material: '97% Algodón, 3% Elastano',
    care: 'Lavar a 30 °C. Planchar a temperatura media.',
    price: 129900,
    isNew: true,
    category: 'bermudas',
    image: 'bermuda-acuarela.jpg',
    alt: 'Bermuda blanca con flores grises en acuarela y top marfil sin mangas en una oficina',
    color: 'Marfil',
    sizes: LETTER_SIZES,
  },
  {
    slug: 'conjunto-bordado-ingles-marfil',
    name: 'Conjunto Bordado Inglés',
    subtitle: 'Top y falda sirena en algodón',
    description:
      'Dos piezas en algodón con bordado inglés: top de tirantes finos y falda larga con volante sirena. Ligero, fresco y pensado para días de sol.',
    material: '100% Algodón bordado',
    care: 'Lavar a mano en agua fría. Secar a la sombra.',
    price: 239900,
    badge: 'Edición Limitada',
    isFeatured: true,
    category: 'conjuntos',
    image: 'conjunto-bordado-ingles.jpg',
    alt: 'Conjunto blanco de bordado inglés con top corto y falda larga sirena',
    color: 'Blanco',
    sizes: LETTER_SIZES,
  },
  {
    slug: 'jean-wide-leg-cristales',
    name: 'Jean Wide Leg Cristales',
    subtitle: 'Strass aplicados a mano',
    description:
      'Jean de lavado claro salpicado de cristales aplicados a mano. Brilla de noche con un corsé o un body, y de día con una camiseta básica.',
    material: '100% Algodón, cristales de vidrio',
    care: 'Lavar a mano del revés. No planchar sobre los cristales.',
    price: 219900,
    badge: 'Noche',
    isFeatured: true,
    category: 'jeans',
    image: 'jean-cristales.jpg',
    alt: 'Jean claro de pierna amplia con cristales y corsé blanco perlado de noche',
    color: 'Azul hielo',
    sizes: DENIM_SIZES,
  },
  {
    slug: 'conjunto-crochet-cacao',
    name: 'Conjunto Crochet Cacao',
    subtitle: 'Top de ganchillo y palazzo',
    description:
      'Top corto de ganchillo floral con pantalón palazzo de pinzas en tono cacao. Un conjunto monocromo, cálido y fácil de llevar.',
    material: 'Top: 100% Algodón · Pantalón: 70% Lino, 30% Viscosa',
    care: 'Lavar a mano. Secar en horizontal.',
    price: 199900,
    compareAt: 249900,
    badge: 'Rebaja',
    category: 'conjuntos',
    image: 'conjunto-crochet-cacao.jpg',
    alt: 'Top de crochet marrón y pantalón palazzo marrón en una cafetería',
    color: 'Cacao',
    sizes: LETTER_SIZES,
  },
  {
    slug: 'jean-strass-bolsillos',
    name: 'Jean Strass en Bolsillos',
    subtitle: 'Jacquard floral y cristales',
    description:
      'Jean recto de lavado gris azulado con textura jacquard floral y cristales concentrados en los bolsillos delanteros.',
    material: '100% Algodón',
    care: 'Lavar del revés a 30 °C.',
    price: 179900,
    isNew: true,
    category: 'jeans',
    image: 'body-negro-jean-strass.jpg',
    alt: 'Body negro de manga larga con jean gris de pierna amplia y cristales en los bolsillos',
    color: 'Gris azulado',
    sizes: DENIM_SIZES,
  },
  {
    slug: 'camisa-flores-3d-marfil',
    name: 'Camisa Flores 3D',
    subtitle: 'Gasa con flores en relieve',
    description:
      'Camisa semitransparente en gasa marfil con pequeñas flores tridimensionales y mangas abullonadas. Llévala por dentro de un jean de tiro alto.',
    material: '100% Poliéster reciclado',
    care: 'Lavar a mano. Planchar del revés a baja temperatura.',
    price: 119900,
    badge: 'Básico Atemporal',
    isFeatured: true,
    category: 'blusas-tops',
    image: 'camisa-flores-3d.jpg',
    alt: 'Camisa marfil con flores en relieve combinada con jean azul de pierna amplia',
    color: 'Marfil',
    sizes: LETTER_SIZES,
  },
  {
    slug: 'vestido-maxi-encaje-durazno',
    name: 'Vestido Maxi Encaje',
    subtitle: 'Popelín y guipur color durazno',
    description:
      'Vestido largo abotonado con mangas de volante, lazada en la cintura y falda de guipur calado. Femenino y sereno.',
    material: '100% Algodón · Guipur 100% Poliéster',
    care: 'Lavar a mano en agua fría.',
    price: 279900,
    badge: 'Edición Limitada',
    isNew: true,
    isFeatured: true,
    category: 'vestidos',
    image: 'vestido-maxi-durazno.jpg',
    alt: 'Vestido largo color durazno con mangas de volante y falda de encaje calado',
    color: 'Durazno',
    sizes: LETTER_SIZES,
  },
  {
    slug: 'jean-bordado-rose',
    name: 'Jean Bordado Rosé',
    subtitle: 'Encaje floral y lentejuelas',
    description:
      'Jean de pierna amplia con apliques de encaje floral en tonos rosé y cobre bordados con lentejuelas a lo largo de la pierna.',
    material: '100% Algodón',
    care: 'Lavar a mano del revés. No usar secadora.',
    price: 239900,
    category: 'jeans',
    image: 'jean-bordado-rose.jpg',
    alt: 'Jean azul con bordados florales rosa y cobre combinado con body blanco',
    color: 'Azul medio',
    sizes: DENIM_SIZES,
  },
  {
    slug: 'bermuda-denim-encaje',
    name: 'Bermuda Denim Encaje',
    subtitle: 'Apliques de guipur marfil',
    description:
      'Bermuda denim holgada con apliques de guipur marfil en el delantero. Combínala con slingbacks y un top de tirantes.',
    material: '100% Algodón · Guipur 100% Poliéster',
    care: 'Lavar a mano del revés.',
    price: 149900,
    category: 'bermudas',
    image: 'bermuda-denim-encaje.jpg',
    alt: 'Bermuda denim clara con encaje blanco y top de tirantes blanco',
    color: 'Azul claro',
    sizes: DENIM_SIZES,
  },
];

async function seedCategories() {
  for (const [index, c] of CATEGORIES.entries()) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, sortOrder: index },
      create: { ...c, sortOrder: index },
    });
  }
}

async function seedProducts() {
  for (const p of PRODUCTS) {
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: p.category } });
    const data = {
      name: p.name,
      subtitle: p.subtitle,
      description: p.description,
      material: p.material,
      care: p.care,
      price: p.price,
      compareAtPrice: p.compareAt ?? null,
      badge: p.badge ?? null,
      isNew: p.isNew ?? false,
      isFeatured: p.isFeatured ?? false,
      categoryId: category.id,
    };

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: data,
      create: { slug: p.slug, ...data },
    });

    // Imágenes y variantes se recrean para reflejar siempre el seed actual
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.create({
      data: { productId: product.id, url: `/uploads/products/${p.image}`, alt: p.alt, position: 0 },
    });

    for (const size of p.sizes) {
      const sku = `${p.slug}-${size}`.toUpperCase();
      await prisma.productVariant.upsert({
        where: { sku },
        update: {},
        create: { sku, size, color: p.color, stock: 8, productId: product.id },
      });
    }
  }
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn('⚠️  ADMIN_EMAIL / ADMIN_PASSWORD no definidos: no se crea el administrador.');
    return;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: { passwordHash, role: 'ADMIN' },
    create: { email: email.toLowerCase(), name: 'Administración', passwordHash, role: 'ADMIN' },
  });
  console.log(`👤 Administrador listo: ${email}`);
}

async function main() {
  await seedCategories();
  await seedProducts();
  await seedAdmin();
  console.log(`🌱 Seed completado: ${CATEGORIES.length} categorías, ${PRODUCTS.length} prendas.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
