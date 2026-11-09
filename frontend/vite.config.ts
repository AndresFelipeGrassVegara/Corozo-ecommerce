import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

// En desarrollo, Vite reenvía /api y /uploads al backend NestJS.
// Así el navegador ve un único origen (cookies seguras sin CORS).
// En producción haz lo mismo con tu servidor web (Nginx, Caddy...).
const API_URL = process.env.VITE_API_PROXY ?? 'http://localhost:3000';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': API_URL,
      '/uploads': API_URL,
    },
  },
});
