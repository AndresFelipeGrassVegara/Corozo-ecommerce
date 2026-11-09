import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductSort, QueryProductsDto } from './dto/query-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';

/** Relaciones que se cargan siempre junto a un producto. */
const PRODUCT_INCLUDE = {
  category: { select: { id: true, name: true, slug: true } },
  images: { orderBy: { position: 'asc' } },
  variants: { orderBy: { id: 'asc' } },
} satisfies Prisma.ProductInclude;

type ProductWithRelations = Prisma.ProductGetPayload<{ include: typeof PRODUCT_INCLUDE }>;

const SORT_ORDER: Record<ProductSort, Prisma.ProductOrderByWithRelationInput> = {
  newest: { createdAt: 'desc' },
  price_asc: { price: 'asc' },
  price_desc: { price: 'desc' },
  name: { name: 'asc' },
};

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Tienda (público) ──────────────────────────────────────

  /** Listado paginado de prendas visibles, con filtros. */
  async findAll(query: QueryProductsDto) {
    const where: Prisma.ProductWhereInput = { isActive: true, ...this.buildFilters(query) };
    return this.paginate(where, query, (p) => this.toListItem(p));
  }

  /** Ficha de producto + prendas relacionadas de la misma categoría. */
  async findBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { slug, isActive: true },
      include: PRODUCT_INCLUDE,
    });
    if (!product) throw new NotFoundException('Prenda no encontrada');

    const related = await this.prisma.product.findMany({
      where: { isActive: true, categoryId: product.categoryId, id: { not: product.id } },
      include: PRODUCT_INCLUDE,
      take: 4,
    });

    return { ...this.toDetail(product), related: related.map((p) => this.toListItem(p)) };
  }

  // ─── Administración ────────────────────────────────────────

  /** Igual que findAll pero incluye prendas ocultas y el detalle completo. */
  async findAllForAdmin(query: QueryProductsDto) {
    return this.paginate(this.buildFilters(query), query, (p) => this.toDetail(p));
  }

  async findById(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id }, include: PRODUCT_INCLUDE });
    if (!product) throw new NotFoundException('Prenda no encontrada');
    return this.toDetail(product);
  }

  async create(dto: CreateProductDto) {
    const { images, variants, ...data } = dto;
    const product = await this.prisma.product.create({
      data: {
        ...data,
        images: { create: images.map((img, position) => ({ ...img, position })) },
        variants: { create: variants },
      },
      include: PRODUCT_INCLUDE,
    });
    return this.toDetail(product);
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.ensureExists(id);
    const { images, variants, ...data } = dto;

    await this.prisma.$transaction(async (tx) => {
      await tx.product.update({ where: { id }, data });

      if (images) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        await tx.productImage.createMany({
          data: images.map((img, position) => ({ ...img, position, productId: id })),
        });
      }

      if (variants) {
        // Se conservan las variantes existentes (por SKU) para no romper pedidos antiguos
        const skus = variants.map((v) => v.sku);
        await tx.productVariant.deleteMany({ where: { productId: id, sku: { notIn: skus } } });
        for (const variant of variants) {
          await tx.productVariant.upsert({
            where: { sku: variant.sku },
            update: { size: variant.size, color: variant.color, stock: variant.stock },
            create: { ...variant, productId: id },
          });
        }
      }
    });

    return this.findById(id);
  }

  async remove(id: number) {
    await this.ensureExists(id);
    await this.prisma.product.delete({ where: { id } });
  }

  // ─── Utilidades internas ───────────────────────────────────

  private buildFilters({ category, collection, search }: QueryProductsDto): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {};
    if (category) where.category = { slug: category };
    if (collection === 'new') where.isNew = true;
    if (collection === 'featured') where.isFeatured = true;
    if (collection === 'sale') where.compareAtPrice = { not: null };
    if (search) {
      // En PostgreSQL añade `mode: 'insensitive'` a cada `contains`
      where.OR = [
        { name: { contains: search } },
        { subtitle: { contains: search } },
        { material: { contains: search } },
      ];
    }
    return where;
  }

  private async paginate<T>(
    where: Prisma.ProductWhereInput,
    { page, limit, sort }: QueryProductsDto,
    map: (product: ProductWithRelations) => T,
  ) {
    const [total, products] = await this.prisma.$transaction([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        include: PRODUCT_INCLUDE,
        orderBy: SORT_ORDER[sort],
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      data: products.map(map),
      meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    };
  }

  private async ensureExists(id: number) {
    const exists = await this.prisma.product.count({ where: { id } });
    if (!exists) throw new NotFoundException('Prenda no encontrada');
  }

  /** Versión resumida para tarjetas y listados. */
  private toListItem(p: ProductWithRelations) {
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      subtitle: p.subtitle,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      badge: p.badge,
      isNew: p.isNew,
      category: p.category,
      image: p.images[0] ? { url: p.images[0].url, alt: p.images[0].alt } : null,
      sizes: [...new Set(p.variants.map((v) => v.size))],
      inStock: p.variants.some((v) => v.stock > 0),
    };
  }

  /** Versión completa para la ficha de producto y el panel de administración. */
  private toDetail(p: ProductWithRelations) {
    return {
      ...this.toListItem(p),
      description: p.description,
      material: p.material,
      care: p.care,
      isFeatured: p.isFeatured,
      isActive: p.isActive,
      categoryId: p.categoryId,
      images: p.images.map(({ id, url, alt }) => ({ id, url, alt })),
      variants: p.variants.map(({ id, sku, size, color, stock }) => ({ id, sku, size, color, stock })),
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  }
}
