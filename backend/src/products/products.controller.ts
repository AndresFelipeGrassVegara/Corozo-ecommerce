import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminOnly } from '../common/decorators/admin-only.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('Productos')
@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  // ─── Público ───────────────────────────────────────────────

  /** Catálogo con filtros: ?category=jeans&collection=new&search=lino&sort=price_asc&page=1 */
  @Get()
  findAll(@Query() query: QueryProductsDto) {
    return this.products.findAll(query);
  }

  // ─── Administración (requiere rol ADMIN) ───────────────────
  // Van antes de ':slug' para que Nest no confunda "admin" con un slug.

  @Get('admin/list')
  @AdminOnly()
  findAllForAdmin(@Query() query: QueryProductsDto) {
    return this.products.findAllForAdmin(query);
  }

  @Get('admin/:id')
  @AdminOnly()
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.products.findById(id);
  }

  @Post()
  @AdminOnly()
  create(@Body() dto: CreateProductDto) {
    return this.products.create(dto);
  }

  @Patch(':id')
  @AdminOnly()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.products.update(id, dto);
  }

  @Delete(':id')
  @AdminOnly()
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.products.remove(id);
  }

  // ─── Público (ficha) ───────────────────────────────────────

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.products.findBySlug(slug);
  }
}
