import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Expose on all network interfaces so tunnels/phones can reach it
    proxy: {
      // Proxy all /api and /ws requests to the Node.js backend
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'ws://127.0.0.1:3001',
        ws: true,
        changeOrigin: true,
      }
    }
  },
})
