import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // import from '@/components/...' instead of long ../../ paths
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    // Must match an origin allowed by the backend's cinebook.cors.allowed-origins
    port: 5173,
    strictPort: true,
  },
})
