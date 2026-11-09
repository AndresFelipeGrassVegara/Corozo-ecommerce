import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, OrderItemDto } from './dto/create-order.dto';
import { ALLOWED_TRANSITIONS, OrderStatus } from './order-status';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registra un pedido "PENDING" antes de que el cliente abra WhatsApp.
   *  - Los precios se leen de la base de datos (nunca del cliente).
   *  - Se comprueba que haya stock, pero NO se descuenta todavía:
   *    eso ocurre cuando la tienda confirma el pedido en el panel.
   */
  async create(dto: CreateOrderDto) {
    const items = this.mergeDuplicates(dto.items);

    const variants = await this.prisma.productVariant.findMany({
      where: { id: { in: items.map((i) => i.variantId) }, product: { isActive: true } },
      include: { product: { select: { name: true, price: true } } },
    });

    if (variants.length !== items.length) {
      throw new BadRequestException('Alguna prenda de tu bolsa ya no está disponible');
    }

    const lines = items.map((item) => {
      const variant = variants.find((v) => v.id === item.variantId)!;
      if (variant.stock < item.quantity) {
        throw new ConflictException(
          `Solo quedan ${variant.stock} uds. de "${variant.product.name}" talla ${variant.size}`,
        );
      }
      return {
        variantId: variant.id,
        productName: variant.product.name,
        size: variant.size,
        color: variant.color,
        unitPrice: variant.product.price,
        quantity: item.quantity,
      };
    });

    const total = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
    const { items: _items, ...customer } = dto;

    const order = await this.prisma.order.create({
      data: { ...customer, total, items: { create: lines } },
      include: { items: true },
    });

    return {
      id: order.id,
      status: order.status,
      total: order.total,
      items: order.items.map(({ productName, size, color, unitPrice, quantity }) => ({
        productName,
        size,
        color,
        unitPrice,
        quantity,
      })),
    };
  }

  /** Últimos pedidos (panel de administración), opcionalmente filtrados por estado. */
  findAll(status?: OrderStatus) {
    return this.prisma.order.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
      take: 100,
    });
  }

  /**
   * Cambia el estado de un pedido y ajusta el stock:
   *  - al CONFIRMAR se descuenta (si no hay suficiente, se rechaza el cambio)
   *  - al CANCELAR un pedido confirmado se devuelve
   */
  async updateStatus(id: number, next: OrderStatus) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id }, include: { items: true } });
      if (!order) throw new NotFoundException('Pedido no encontrado');

      const current = order.status as OrderStatus;
      if (!ALLOWED_TRANSITIONS[current].includes(next)) {
        throw new BadRequestException(`No se puede pasar de ${current} a ${next}`);
      }

      if (next === 'CONFIRMED') await this.takeStock(tx, order.items);
      if (next === 'CANCELLED' && current === 'CONFIRMED') await this.returnStock(tx, order.items);

      return tx.order.update({ where: { id }, data: { status: next }, include: { items: true } });
    });
  }

  // ─── Utilidades internas ───────────────────────────────────

  private async takeStock(tx: Prisma.TransactionClient, items: OrderLine[]) {
    for (const item of items) {
      if (!item.variantId) continue; // la prenda se borró después del pedido
      // updateMany con condición de stock: operación atómica, evita vender de más
      const { count } = await tx.productVariant.updateMany({
        where: { id: item.variantId, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      });
      if (count === 0) {
        throw new ConflictException(`Sin stock suficiente de "${item.productName}" talla ${item.size}`);
      }
    }
  }

  private async returnStock(tx: Prisma.TransactionClient, items: OrderLine[]) {
    for (const item of items) {
      if (!item.variantId) continue;
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { increment: item.quantity } },
      });
    }
  }

  /** Si la misma variante aparece dos veces, suma las cantidades. */
  private mergeDuplicates(items: OrderItemDto[]): OrderItemDto[] {
    const merged = new Map<number, number>();
    for (const { variantId, quantity } of items) {
      merged.set(variantId, (merged.get(variantId) ?? 0) + quantity);
    }
    return [...merged].map(([variantId, quantity]) => ({ variantId, quantity }));
  }
}

type OrderLine = { variantId: number | null; quantity: number; productName: string; size: string };
