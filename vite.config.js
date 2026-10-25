import { defineConfig } from 'vite';

// Hanya `public/` disalin ke `dist/`; `source-assets/` tidak pernah diterbitkan.
export default defineConfig({
  base: './',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1600,
  },
});
