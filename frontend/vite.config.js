import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    server: {
      port: 5173,
     proxy: {
  '/api': {
    target: 'http://localhost:8080', // ✅ point to Spring Boot backend
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
    secure: false,
  },
  '/users': {
    target: 'http://localhost:8080', // ✅ same here
    changeOrigin: true,
    secure: false,
  },
  '/analytics': {
    target: 'http://localhost:8080',
    changeOrigin: true,
    secure: false,
  },
}



    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
    },
    preview: {
      port: 4173,
    },
  };
});
