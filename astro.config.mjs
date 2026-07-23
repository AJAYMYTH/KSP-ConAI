import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';

// https://astro.build/config
export default defineConfig({
  srcDir: './app',
  outDir: './client',
  base: '/app/',
  build: {
    format: 'file'
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./app', import.meta.url)),
      },
    },
  },
});
