import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: '',
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    rollupOptions: {
      input: 'ui.html',
      output: {
        entryFileNames: '[name].js',
        inlineDynamicImports: false,
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.name.split('/').pop()
          return `assets/${fileName}`
        },
        chunkFileNames: 'chunks/[name].[hash].js'
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
})
