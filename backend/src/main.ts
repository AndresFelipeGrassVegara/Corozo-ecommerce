import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { Env } from './config/env.validation';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService<Env, true>);
  const isProduction = config.get('NODE_ENV') === 'production';

  // ─── Seguridad HTTP ────────────────────────────────────────
  // Cabeceras seguras (CSP, X-Frame-Options, HSTS, noSniff...).
  // 'same-site' permite que el frontend (mismo dominio) cargue las imágenes.
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'same-site' } }));
  app.disable('x-powered-by');

  // Solo los orígenes listados en CORS_ORIGINS pueden llamar a la API desde el navegador
  app.enableCors({
    origin: config.get('CORS_ORIGINS').split(',').map((o: string) => o.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  });

  // Limita el tamaño del cuerpo de las peticiones (evita payloads abusivos)
  app.useBodyParser('json', { limit: '100kb' });
  app.use(cookieParser());

  // Valida y limpia TODOS los DTO: descarta campos desconocidos y convierte tipos
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: isProduction,
    }),
  );

  app.useGlobalFilters(new PrismaExceptionFilter());
  app.setGlobalPrefix('api');

  // Fotos de producto: /uploads/products/*.jpg
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
    index: false,
    dotfiles: 'deny',
    maxAge: '7d',
  });

  // Documentación interactiva de la API (solo fuera de producción)
  if (!isProduction) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Coroso API')
      .setDescription('Catálogo, pedidos y administración de la tienda Coroso')
      .setVersion('1.0')
      .addCookieAuth('access_token')
      .build();
    SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, swaggerConfig));
  }

  app.enableShutdownHooks();
  const port = config.get('PORT');
  await app.listen(port);
  Logger.log(`API lista en http://localhost:${port}/api`, 'Bootstrap');
}

bootstrap();
