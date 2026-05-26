import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.VITE_API_URL ?? 'http://localhost:3000';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3001,
      strictPort: true,
      proxy: {
        // Proxy GraphQL so the browser sees same-origin and cookies "just work" in dev.
        '/graphql': {
          target: apiUrl,
          changeOrigin: true,
          ws: true,
        },
      },
    },
    preview: {
      port: 3001,
      strictPort: true,
    },
  };
});
