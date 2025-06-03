import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), command === 'build' && viteSingleFile()].filter(Boolean),
  base: '',
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    rollupOptions: {
      input: 'ui.html',
      output: {
        entryFileNames: '[name].js',
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 5173,
    open: 'ui.html',
  },
}));
