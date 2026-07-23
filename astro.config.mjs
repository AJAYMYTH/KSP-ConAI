import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';

function devSrcDirRewrite() {
  return {
    name: 'dev-src-dir-rewrite',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url) {
          const urlPath = req.url.split('?')[0];
          const query = req.url.includes('?') ? '?' + req.url.split('?')[1] : '';
          
          const cleanPath = urlPath.startsWith('/app/') 
            ? urlPath.substring(4) 
            : (urlPath.startsWith('/app') ? urlPath.substring(4) : urlPath);
            
          const firstSegment = cleanPath.split('/')[1];
          const srcFolders = ['styles', 'i18n', 'components', 'layouts', 'lib', 'types', 'pages', 'assets'];
          
          if (srcFolders.includes(firstSegment)) {
            req.url = '/app' + (cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath) + query;
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
        '/styles': fileURLToPath(new URL('./app/styles', import.meta.url)),
        '/i18n': fileURLToPath(new URL('./app/i18n', import.meta.url)),
        '/components': fileURLToPath(new URL('./app/components', import.meta.url)),
        '/layouts': fileURLToPath(new URL('./app/layouts', import.meta.url)),
        '/lib': fileURLToPath(new URL('./app/lib', import.meta.url)),
        '/types': fileURLToPath(new URL('./app/types', import.meta.url)),
        '/pages': fileURLToPath(new URL('./app/pages', import.meta.url)),
      },
    },
  },
});
