import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      'framer-motion': fileURLToPath(new URL('./src/lib/gsapMotion.jsx', import.meta.url)),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) return 'react-vendor'
          if (id.includes('firebase')) return 'firebase-vendor'
          if (id.includes('gsap')) return 'gsap-vendor'
          if (id.includes('recharts')) return 'charts-vendor'
          if (id.includes('react-icons') || id.includes('lucide-react')) return 'icons-vendor'
          return 'vendor'
        },
      },
    },
  },
})
