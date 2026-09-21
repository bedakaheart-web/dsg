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
      // Inject manifest + precache all hashed assets; auto-update on new deploy (no user prompt)
      includeAssets: ['favicon.png'],
      manifest: {
        name: 'DumaSafeGuide',
        short_name: 'DumaSafeGuide',
        description: 'DumaSafeGuide – Official emergency response portal for Dumaguete City.',
        theme_color: '#0d1b2e',
        background_color: '#0d1b2e',
        display: 'standalone',
        // Relative start_url/scope keeps PWA working on both Netlify (/) and GitHub Pages (/dumasafeguide/)
        start_url: './',
        scope: './',
        orientation: 'portrait-primary',
        icons: [
          {
            src: './favicon.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: './favicon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // Keep precache small + runtime cache for external APIs (Supabase, fonts, CDN) — never cache auth tokens
        globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,woff2}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/supabase\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-cache', expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'gfonts-cache', expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
          {
            urlPattern: /^https:\/\/mulpurkwsadxohfpbcsu\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'supabase-api', networkTimeoutSeconds: 4, expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 } },
          },
          {
            urlPattern: /^https:\/\/unpkg\.com\/leaflet.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'leaflet-cdn' },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  // Relative base keeps assets working on GitHub Pages subpath and Netlify root
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    // Split large vendor chunk so initial load stays under 500kb warning and no page is destroyed on mobile data
    chunkSizeWarningLimit: 850,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          leaflet: ['leaflet', 'react-leaflet'],
          icons: ['react-icons'],
        },
      },
    },
  },
})