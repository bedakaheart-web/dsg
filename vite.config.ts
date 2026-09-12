import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'DumaSafeGuide',
        short_name: 'DumaSafeGuide',
        description: 'DumaSafeGuide – Official emergency response portal for Dumaguete City.',
        theme_color: '#0d1b2e',
        background_color: '#0d1b2e',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/favicon.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/favicon.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})