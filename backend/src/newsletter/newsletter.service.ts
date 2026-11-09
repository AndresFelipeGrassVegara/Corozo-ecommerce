import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NewsletterService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Siempre responde lo mismo, exista o no el correo,
   * para no revelar quién está suscrito.
   */
  async subscribe(email: string) {
    await this.prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });
    return { message: '¡Gracias! Te hemos enviado tu código del 10% de bienvenida.' };
  }
}
