import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      // Prevent Vite from trying to bundle test files
      external: [
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/*.test.tsx',
        '**/*.spec.tsx',
        '**/__tests__',
        '**/test-utils',
      ],
    },
  },
  plugins: [
    react(),
    svgr(),
    VitePWA({
      registerType: 'prompt', // custom UI needed for suggesting to install the update
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,txt}'],
        runtimeCaching: [
          {
            // Cache the Google Fonts stylesheets (the CSS)
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
            },
          },
          {
            // Cache the underlying font files (the .woff2 files)
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              cacheableResponse: {
                statuses: [0, 200], // 0 is for opaque responses on iOS
              },
              expiration: {
                maxAgeSeconds: 60 * 60 * 24 * 365, // Cache for 1 year
                maxEntries: 30,
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module', // Required for Vite's HMR to work with SW
      },
    }),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
