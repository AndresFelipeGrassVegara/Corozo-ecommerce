# Coroso · E-commerce de moda

Tienda online de ropa con estética editorial ("quiet luxury"): burdeos profundo, dorado envejecido,
tipografías **EB Garamond** + **Hanken Grotesk**, diseño *mobile-first* con barra inferior en móvil
y cabecera completa en escritorio.

**Cómo se compra:** la clienta añade prendas a la bolsa, escribe su nombre y ciudad, y al pulsar
*Pedir por WhatsApp* el pedido se registra en la base de datos y se abre el chat de la tienda con el
resumen ya escrito (número de pedido, prendas, tallas y total en COP). El pago y el envío se acuerdan por chat.

| Capa       | Tecnología                                                   |
|------------|--------------------------------------------------------------|
| Frontend   | React 18 · TypeScript · Vite · Tailwind CSS · React Router   |
| Backend    | NestJS 11 · TypeScript · Prisma ORM                          |
| Base datos | SQLite en desarrollo → PostgreSQL en producción (1 línea)    |

---

## 1. Puesta en marcha

Requisitos: **Node.js 20 o superior**.

```bash
# Backend
cd backend
npm install
cp .env.example .env          # y cambia JWT_SECRET y ADMIN_PASSWORD
npm run db:migrate            # crea la BD y carga las 10 prendas de ejemplo
npm run start:dev             # http://localhost:3000/api

# Frontend (en otra terminal)
cd frontend
npm install
cp .env.example .env.local    # pon tu número en VITE_WHATSAPP_NUMBER
npm run dev                   # http://localhost:5173
```

- Tienda: <http://localhost:5173>
- Panel de administración: <http://localhost:5173/admin> (usuario y clave de `ADMIN_EMAIL` / `ADMIN_PASSWORD` del `.env`)
- Documentación interactiva de la API (Swagger): <http://localhost:3000/api/docs>
- Editor visual de la base de datos: `npm run db:studio` (dentro de `backend/`)

> Si `npm install` avisa de *install scripts* bloqueados, ejecuta `npm install-scripts approve <paquete>`
> para `@prisma/engines`, `prisma`, `@prisma/client` y `esbuild` (ya vienen aprobados en `package.json`).

---

## 2. Estructura del proyecto

```
coroso-ecommerce/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        ← Modelo de datos (tablas)
│   │   ├── seed.ts              ← Prendas y admin iniciales
│   │   └── migrations/
│   ├── uploads/products/        ← Fotos de las prendas
│   └── src/
│       ├── main.ts              ← Arranque + políticas de seguridad HTTP
│       ├── app.module.ts        ← Registro de módulos y rate limiting
│       ├── config/              ← Validación de variables de entorno
│       ├── common/              ← Decoradores (@AdminOnly) y filtros de error
│       ├── auth/                ← Login, JWT en cookie, guards de rol
│       ├── products/            ← Catálogo (público) + CRUD (admin)
│       ├── categories/
│       ├── orders/              ← Checkout con cálculo de precios en servidor
│       └── newsletter/
└── frontend/
    ├── tailwind.config.ts       ← Sistema de diseño (colores, tipografías, espaciados)
    └── src/
        ├── config/site.ts       ← Nombre de la tienda, moneda, menús
        ├── lib/api.ts           ← TODAS las llamadas al backend
        ├── types/api.ts         ← Tipos de las respuestas de la API
        ├── context/             ← Bolsa, favoritos, sesión, avisos
        ├── components/
        │   ├── layout/          ← Cabecera, menú, buscador, barra inferior, pie
        │   ├── home/            ← Secciones de la portada
        │   ├── product/         ← Tarjeta, carrusel y rejilla de prendas
        │   └── ui/              ← Botón, píldora, icono, estados vacíos
        └── pages/               ← Una página por ruta (+ admin/)
```

### Rutas del frontend

| Ruta                     | Página                                        |
|--------------------------|-----------------------------------------------|
| `/`                      | Descubrir (portada editorial)                 |
| `/catalogo`              | Catálogo con filtros en la URL                |
| `/producto/:slug`        | Ficha de producto                             |
| `/bolsa`                 | Bolsa y formulario de envío                   |
| `/perfil`                | Favoritos y cuenta                            |
| `/admin`                 | Panel: listado de prendas                     |
| `/admin/prendas/nueva`   | Crear prenda                                  |
| `/admin/prendas/:id`     | Editar prenda                                 |
| `/admin/pedidos`         | Pedidos recibidos por WhatsApp                |

---

## 3. API REST

Prefijo: `/api`. 🔒 = requiere sesión de administrador.

| Método | Ruta                          | Descripción                                                    |
|--------|-------------------------------|----------------------------------------------------------------|
| GET    | `/categories`                 | Categorías con número de prendas                               |
| GET    | `/products`                   | Catálogo. Filtros: `category`, `collection` (`new`/`featured`/`sale`), `search`, `sort` (`newest`/`price_asc`/`price_desc`/`name`), `page`, `limit` (máx. 48) |
| GET    | `/products/:slug`             | Ficha + prendas relacionadas                                   |
| POST   | `/orders`                     | Registrar pedido antes de abrir WhatsApp (`customerName`, `city`, `notes?`, `items: [{ variantId, quantity }]`) |
| POST   | `/newsletter`                 | Suscribir correo                                               |
| POST   | `/auth/login`                 | Inicia sesión (cookie httpOnly)                                |
| POST   | `/auth/logout`                | Cierra sesión                                                  |
| GET    | `/auth/me`                    | Usuario actual                                                 |
| GET    | `/products/admin/list` 🔒      | Todas las prendas (incluidas ocultas)                          |
| GET    | `/products/admin/:id` 🔒       | Detalle para editar                                            |
| POST   | `/products` 🔒                 | Crear prenda                                                   |
| PATCH  | `/products/:id` 🔒             | Editar prenda                                                  |
| DELETE | `/products/:id` 🔒             | Eliminar prenda                                                |
| GET    | `/orders?status=PENDING` 🔒    | Últimos 100 pedidos (filtro opcional por estado)               |
| PATCH  | `/orders/:id/status` 🔒        | Cambiar estado: `CONFIRMED`, `DELIVERED` o `CANCELLED`         |

Ejemplo:

```bash
curl "http://localhost:3000/api/products?category=jeans&sort=price_asc"
```

### Modelo de datos

`Category` 1─N `Product` 1─N `ProductImage`
`Product` 1─N `ProductVariant` (talla + color + stock + SKU)
`Order` 1─N `OrderItem` (copia del nombre/precio en el momento de compra)
`User` (rol `ADMIN` / `CUSTOMER`) · `NewsletterSubscriber`

Los precios se guardan en **pesos colombianos (COP)** como números enteros, sin decimales: `189900` = $ 189.900.

### Ciclo de un pedido

| Estado       | Qué significa                                             | Stock                     |
|--------------|-----------------------------------------------------------|---------------------------|
| `PENDING`    | La clienta lo envió desde la bolsa a WhatsApp             | Se comprueba, no se toca  |
| `CONFIRMED`  | Acordaste pago y envío por chat y lo confirmas en el panel | Se descuenta              |
| `DELIVERED`  | Entregado                                                 | —                         |
| `CANCELLED`  | Anulado                                                   | Se devuelve si estaba confirmado |

Los cambios permitidos están en `backend/src/orders/order-status.ts`.

---

## 4. Políticas de seguridad implementadas

| Riesgo                         | Medida                                                                                     | Dónde |
|--------------------------------|--------------------------------------------------------------------------------------------|-------|
| Cabeceras inseguras            | `helmet` (CSP, HSTS, X-Frame-Options, noSniff, Referrer-Policy) y sin `X-Powered-By`        | `main.ts` |
| Peticiones desde otros sitios  | CORS restringido a `CORS_ORIGINS`                                                           | `main.ts` |
| Datos maliciosos / inesperados | `ValidationPipe` global: lista blanca de campos, tipos, longitudes y formatos (regex)        | DTOs `*.dto.ts` |
| Payloads enormes               | Límite de 100 KB por petición; paginación máxima de 48                                       | `main.ts`, `query-products.dto.ts` |
| Fuerza bruta / abuso           | Rate limiting global (120/min) y estricto en login (5/min), pedidos (10/min) y newsletter (5/min) | `app.module.ts`, controladores |
| Robo de sesión (XSS)           | JWT en cookie **httpOnly** (JavaScript no puede leerla), `secure` en producción             | `auth.controller.ts` |
| CSRF                           | Cookie `SameSite=Strict` + API que solo acepta JSON                                         | `auth.controller.ts` |
| Contraseñas                    | `bcrypt` con coste 12; nunca se devuelve el hash                                            | `auth.service.ts`, `seed.ts` |
| Enumeración de usuarios        | Mismo mensaje y mismo tiempo de respuesta exista o no el correo                             | `auth.service.ts`, `newsletter.service.ts` |
| Control de acceso              | `@AdminOnly()` = JWT válido + rol `ADMIN` verificados en el servidor                         | `common/decorators/admin-only.decorator.ts` |
| Manipulación de precios        | El cliente solo envía `variantId` + cantidad; los precios se leen de la BD y el mensaje de WhatsApp se arma con el total que devuelve el servidor | `orders.service.ts`, `lib/whatsapp.ts` |
| Sobreventa (race conditions)   | Al confirmar: transacción + descuento de stock atómico (`stock >= cantidad`)                | `orders.service.ts` |
| Fugas de información           | Errores de Prisma traducidos a mensajes genéricos; Swagger y detalles de validación desactivados en producción | `prisma-exception.filter.ts`, `main.ts` |
| Configuración incorrecta       | La API no arranca si falta una variable o `JWT_SECRET` tiene menos de 32 caracteres         | `config/env.validation.ts` |
| Inyección SQL                  | Prisma usa consultas parametrizadas                                                         | — |
| Archivos estáticos             | `/uploads` sin listado de directorios ni archivos ocultos                                   | `main.ts` |

---

## 5. Cómo hacer cambios habituales

**Añadir una prenda**
- Desde el panel `/admin` → *Nueva*. Copia antes la foto en `backend/uploads/products/` y usa la ruta `/uploads/products/mi-foto.jpg`.
- O añade un objeto a `PRODUCTS` en `backend/prisma/seed.ts` y ejecuta `npm run db:seed`.

**Cambiar colores o tipografías** → `frontend/tailwind.config.ts` (los nombres siguen Material 3: `primary`, `surface`, `on-surface`...).

**Cambiar el número de WhatsApp** → `VITE_WHATSAPP_NUMBER` en `frontend/.env.local`
(código de país + número, solo dígitos: `573001234567`). Reinicia `npm run dev` tras cambiarlo.

**Cambiar el texto del mensaje de WhatsApp** → `frontend/src/lib/whatsapp.ts`.

**Cambiar nombre de la tienda, moneda o menús** → `frontend/src/config/site.ts`.

**Editar textos de la portada** → cada sección es un archivo en `frontend/src/components/home/`.
Los puntos interactivos del lookbook están en el array `LOOKS` de `Lookbook.tsx`.

**Añadir un campo a las prendas** (p. ej. `fit`):
1. `backend/prisma/schema.prisma` → añade el campo y ejecuta `npm run db:migrate`.
2. `backend/src/products/dto/create-product.dto.ts` → añade la validación.
3. `backend/src/products/products.service.ts` → inclúyelo en `toListItem` / `toDetail`.
4. `frontend/src/types/api.ts` → añade el tipo y úsalo en el componente.

**Añadir una página** → crea `frontend/src/pages/MiPagina.tsx` y regístrala en `frontend/src/App.tsx`.

**Proteger un endpoint nuevo** → añade `@AdminOnly()` encima del método del controlador.

---

## 6. Producción

1. **Base de datos**: en `schema.prisma` cambia `provider = "sqlite"` por `"postgresql"`, ajusta `DATABASE_URL`,
   borra `prisma/migrations` y ejecuta `npx prisma migrate dev --name init` una vez; después usa `npm run db:deploy`.
   Añade `mode: 'insensitive'` a las búsquedas en `products.service.ts`.
2. **Variables**: `NODE_ENV=production`, un `JWT_SECRET` aleatorio largo, `CORS_ORIGINS=https://tu-dominio.com`.
   Cambia la contraseña del administrador inicial. En el frontend define `VITE_WHATSAPP_NUMBER` **antes** de `npm run build`
   (Vite lo incrusta en el código al compilar).
3. **Build**: `npm run build` en cada carpeta. El frontend genera `frontend/dist/` (estático).
4. **Servidor web** (Nginx/Caddy) con HTTPS: sirve `frontend/dist`, reenvía `/api` y `/uploads` a NestJS
   (`node dist/main`), y devuelve `index.html` para el resto de rutas (SPA). Añade ahí una cabecera CSP para el frontend.
5. Si la API va detrás de un proxy, activa `app.set('trust proxy', 1)` en `main.ts` para que el rate limiting vea la IP real.

## 7. Pendiente / siguientes pasos sugeridos

- Pasarela de pago (Wompi, Mercado Pago, PayU) si en el futuro no se quiere cerrar la venta por WhatsApp.
- Subida de imágenes desde el panel (con validación de tipo y tamaño).
- Cuentas de cliente (registro, historial de pedidos) — el modelo `User` ya admite el rol `CUSTOMER`.
- Correo de bienvenida de la newsletter.
- Tests automáticos (Jest en backend, Vitest + Testing Library en frontend).
