/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base de la API. Por defecto "/api" (proxy de Vite / servidor web). */
  readonly VITE_API_URL?: string;
  /** Prefijo para las imágenes si se sirven desde un CDN. */
  readonly VITE_ASSETS_URL?: string;
  /** Número de WhatsApp de la tienda (ej.: 573001234567). */
  readonly VITE_WHATSAPP_NUMBER?: string;
}
