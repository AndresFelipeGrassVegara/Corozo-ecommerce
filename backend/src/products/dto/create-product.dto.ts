import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class ProductImageDto {
  /** Ruta local (/uploads/products/foto.jpg) o URL https:// */
  @IsString()
  @Matches(/^(\/uploads\/[\w\-./]+|https:\/\/\S+)$/, {
    message: 'La imagen debe ser una ruta /uploads/... o una URL https://',
  })
  @MaxLength(500)
  url: string;

  /** Texto alternativo (accesibilidad y SEO) */
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  alt: string;
}

export class ProductVariantDto {
  /** Código único de inventario. @example JEAN-CALADO-38 */
  @IsString()
  @Matches(/^[A-Z0-9-]+$/, { message: 'El SKU solo admite mayúsculas, números y guiones' })
  @MaxLength(60)
  sku: string;

  /** @example 38 */
  @IsString()
  @MaxLength(10)
  size: string;

  /** @example Azul claro */
  @IsString()
  @MaxLength(40)
  color: string;

  @IsInt()
  @Min(0)
  @Max(100000)
  stock: number;
}

export class CreateProductDto {
  /** Identificador para la URL. @example jean-wide-leg-calado-floral */
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'El slug solo admite minúsculas, números y guiones' })
  @MaxLength(80)
  slug: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(120)
  subtitle: string;

  @IsString()
  @MaxLength(2000)
  description: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  material?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  care?: string;

  /** Precio en pesos colombianos (COP), sin decimales. @example 189900 */
  @IsInt()
  @Min(0)
  @Max(100_000_000)
  price: number;

  /** Precio anterior en COP (opcional, para mostrar descuento) */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100_000_000)
  compareAtPrice?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  badge?: string | null;

  @IsOptional()
  @IsBoolean()
  isNew?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsInt()
  categoryId: number;

  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  images: ProductImageDto[];

  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  variants: ProductVariantDto[];
}
