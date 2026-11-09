import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class OrderItemDto {
  @IsInt()
  variantId: number;

  @IsInt()
  @Min(1)
  @Max(10)
  quantity: number;
}

/**
 * Pedido que se envía desde la bolsa antes de abrir WhatsApp.
 * Fíjate en que NO incluye precios: el total se calcula siempre en el servidor.
 */
export class CreateOrderDto {
  /** @example María Pérez */
  @Transform(trim)
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  customerName: string;

  /** @example Medellín */
  @Transform(trim)
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  city: string;

  /** Comentarios opcionales (horario de entrega, dudas...) */
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  items: OrderItemDto[];
}
