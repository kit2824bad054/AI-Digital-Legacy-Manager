import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * ============================================================
 * Vite Configuration for AI Digital Legacy Manager
 * ============================================================
 * Features:
 * - React v18 JSX support via @vitejs/plugin-react
 * - Local proxy setup to forward /api requests to Express server (port 5000)
 * ============================================================
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
