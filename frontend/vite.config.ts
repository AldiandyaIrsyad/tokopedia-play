import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import generouted from '@generouted/react-router/plugin';
import { resolve } from 'path';

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  dotenv.config({ path: '../.env' });

  return {
    plugins: [react(), generouted()],
    server: {
      proxy: {
        '/api': {
          target: process.env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
          // rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },

    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '#root': resolve(__dirname),
      },
    },
  };
});
