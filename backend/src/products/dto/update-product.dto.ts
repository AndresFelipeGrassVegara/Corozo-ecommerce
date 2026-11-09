import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

/**
 * Todos los campos son opcionales.
 * Si se envían `images` o `variants`, sustituyen a las existentes.
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {}
