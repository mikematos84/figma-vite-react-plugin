import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'esnext',
    lib: {
      entry: 'code.js',
      formats: ['es'],
      fileName: 'code'
    },
    outDir: 'dist',
    emptyOutDir: false
  }
}) 