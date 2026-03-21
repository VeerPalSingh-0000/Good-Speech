import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'SpeechGood',
        short_name: 'SpeechGood',
        description: 'Guided stammering therapy and analytics',
        theme_color: '#8b5cf6',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4MB to handle larger index bundle
        // Cache API responses and assets for offline
        runtimeCaching: [
          {
             urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
             handler: 'NetworkFirst',
             options: {
               cacheName: 'firebase-records-cache',
               expiration: {
                 maxEntries: 100,
                 maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week 
               },
               cacheableResponse: {
                 statuses: [0, 200]
               }
             }
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          'vendor-charts': ['recharts'],
          'vendor-motion': ['framer-motion'],
          'vendor-pdf': ['pdfjs-dist', 'react-pdf']
        }
      }
    }
  }
})
