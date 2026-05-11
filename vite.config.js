import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/portal/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500, // Ajuste este valor conforme necessário, em KB
  }
})
