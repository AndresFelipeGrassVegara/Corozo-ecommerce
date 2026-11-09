import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AdminOnly } from '../common/decorators/admin-only.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ORDER_STATUSES, OrderStatus } from './order-status';
import { OrdersService } from './orders.service';

@ApiTags('Pedidos')
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  /** Registra el pedido antes de redirigir al cliente a WhatsApp (no requiere cuenta). */
  @Post()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  create(@Body() dto: CreateOrderDto) {
    return this.orders.create(dto);
  }

  @Get()
  @AdminOnly()
  @ApiQuery({ name: 'status', required: false, enum: ORDER_STATUSES })
  findAll(@Query('status') status?: string) {
    const valid = ORDER_STATUSES.includes(status as OrderStatus) ? (status as OrderStatus) : undefined;
    return this.orders.findAll(valid);
  }

  @Patch(':id/status')
  @AdminOnly()
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderStatusDto) {
    return this.orders.updateStatus(id, dto.status);
  }
}
