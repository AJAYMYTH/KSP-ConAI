import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';

function devSrcDirRewrite() {
  return {
    name: 'dev-src-dir-rewrite',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/app/') && !req.url.startsWith('/app/app/')) {
          const subPath = req.url.substring(5); // path after '/app/'
          const firstSegment = subPath.split('/')[0].split('?')[0];
          const srcFolders = ['styles', 'i18n', 'components', 'layouts', 'lib', 'types', 'pages', 'assets'];
          if (srcFolders.includes(firstSegment)) {
            req.url = '/app/app/' + subPath;
          }
        }
        next();
      });
    }
  };
}

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
    plugins: [devSrcDirRewrite(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./app', import.meta.url)),
        '/app': fileURLToPath(new URL('./app', import.meta.url)),
        'app': fileURLToPath(new URL('./app', import.meta.url)),
      },
    },
  },
});
