import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  const basePath = env.VITE_BASE_PATH || '/';

  return {
    base: basePath,
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'strip-crossorigin-from-build',
        apply: 'build',
        transformIndexHtml(html) {
          return html.replace(/\s+crossorigin/g, '');
        },
      },
    ],
    build: {
      // Same-origin assets do not need CORS; crossorigin can break CSS on some mobile browsers.
      crossOriginAttribute: false,
    },
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify - file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      allowedHosts: ['.trycloudflare.com'],
    },
  };
});
