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
