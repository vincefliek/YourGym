import path from 'path';
import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { visualizer } from 'rollup-plugin-visualizer';

import { version } from './package.json';

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    cssCodeSplit: true,
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
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['@tanstack/react-router'],
          mantine: ['@mantine/core', '@mantine/hooks'],
          charts: ['recharts'],
          utils: ['jsonschema', 'date-fns-tz'], // 'lodash',
        },
      },
    },
  },
  plugins: [
    // make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
    tanstackRouter({
      enableRouteGeneration: false,
    }),
    react(),
    svgr(),
    VitePWA({
      registerType: 'prompt', // custom UI needed for suggesting to install the update
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,txt}'],
        cleanupOutdatedCaches: true,
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
    visualizer({
      gzipSize: true,
      brotliSize: true,
      filename: 'dev-dist/stats.html',
    }) as PluginOption,
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
