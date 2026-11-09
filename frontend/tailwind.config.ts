import type { Config } from 'tailwindcss';

/**
 * Sistema de diseño de Coroso.
 * Los nombres de color siguen Material 3 (primary, surface, on-surface...),
 * igual que en el diseño de referencia: cambia un valor aquí y se actualiza toda la tienda.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Marca: burdeos profundo + dorado envejecido
        primary: '#4a0007',
        'on-primary': '#ffffff',
        'primary-container': '#6d0f16',
        'on-primary-container': '#f87775',
        'primary-fixed': '#ffdad7',
        'primary-fixed-dim': '#ffb3af',
        'surface-tint': '#a5393a',
        secondary: '#775a19',
        'on-secondary': '#ffffff',
        'secondary-container': '#fdd487',
        'on-secondary-container': '#785a19',
        'secondary-fixed': '#ffdea4',
        'secondary-fixed-dim': '#e8c176',
        tertiary: '#212121',
        'tertiary-container': '#363636',
        'on-tertiary-container': '#a09e9e',
        'tertiary-fixed': '#e5e2e1',
        'tertiary-fixed-dim': '#c8c6c5',
        'on-tertiary-fixed': '#1c1b1b',

        // Superficies (fondos y tarjetas)
        background: '#f9f9f9',
        surface: '#f9f9f9',
        'surface-dim': '#dadada',
        'surface-bright': '#f9f9f9',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f3f3f4',
        'surface-container': '#eeeeee',
        'surface-container-high': '#e8e8e8',
        'surface-container-highest': '#e2e2e2',
        'surface-variant': '#e2e2e2',
        'inverse-surface': '#2f3131',
        'inverse-on-surface': '#f0f1f1',

        // Texto y bordes
        'on-surface': '#1a1c1c',
        'on-surface-variant': '#574240',
        'on-background': '#1a1c1c',
        outline: '#8a7170',
        'outline-variant': '#ddc0be',

        // Estados
        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
      },
      fontFamily: {
        serif: ['"EB Garamond"', 'Georgia', 'serif'],
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-hero': ['64px', { lineHeight: '72px', letterSpacing: '-0.02em' }],
        'display-hero-mobile': ['38px', { lineHeight: '44px', letterSpacing: '-0.01em' }],
        'headline-lg': ['42px', { lineHeight: '48px', letterSpacing: '-0.015em' }],
        'headline-lg-mobile': ['28px', { lineHeight: '34px', letterSpacing: '-0.01em' }],
        'headline-md': ['30px', { lineHeight: '36px', letterSpacing: '-0.01em' }],
        'headline-sm': ['22px', { lineHeight: '28px', fontWeight: '500' }],
        'title-editorial': ['18px', { lineHeight: '24px', letterSpacing: '0.02em' }],
        'body-lg': ['16px', { lineHeight: '26px', letterSpacing: '-0.01em' }],
        'body-md': ['14px', { lineHeight: '22px' }],
        'body-sm': ['12px', { lineHeight: '18px', letterSpacing: '0.01em' }],
        'label-ui': ['13px', { lineHeight: '18px', letterSpacing: '0.01em', fontWeight: '500' }],
        'label-caps': ['11px', { lineHeight: '16px', letterSpacing: '0.08em', fontWeight: '600' }],
        price: ['14px', { lineHeight: '18px', letterSpacing: '0.02em', fontWeight: '600' }],
      },
      spacing: {
        'margin-mobile': '1.25rem',
        'gutter-mobile': '0.75rem',
        'margin-tablet': '2rem',
        margin: '3rem',
        gutter: '1.5rem',
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2.5rem',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
      maxWidth: {
        shop: '1280px',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
      },
    },
  },
  plugins: [],
} satisfies Config;
