import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Caminho relativo: permite rodar no GitHub Pages sem erro de tela branca
  server: {
    port: 5173,
    open: false
  }
});
