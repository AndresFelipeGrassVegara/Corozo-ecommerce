import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Matches, Max, MaxLength, Min } from 'class-validator';

export const PRODUCT_SORTS = ['newest', 'price_asc', 'price_desc', 'name'] as const;
export type ProductSort = (typeof PRODUCT_SORTS)[number];

export const PRODUCT_COLLECTIONS = ['new', 'featured', 'sale'] as const;
export type ProductCollection = (typeof PRODUCT_COLLECTIONS)[number];

/** Filtros admitidos en GET /api/products */
export class QueryProductsDto {
  /** Slug de la categoría. @example jeans */
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9-]+$/)
  category?: string;

  /** Colección especial: novedades, destacados o rebajas */
  @IsOptional()
  @IsIn(PRODUCT_COLLECTIONS)
  collection?: ProductCollection;

  /** Texto libre que se busca en nombre, subtítulo y material */
  @IsOptional()
  @IsString()
  @MaxLength(60)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  search?: string;

  @IsOptional()
  @IsIn(PRODUCT_SORTS)
  sort: ProductSort = 'newest';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  /** Máximo 48 por página para no sobrecargar la base de datos */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(48)
  limit: number = 12;
}
