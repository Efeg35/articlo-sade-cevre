import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8081,
    host: true,
    strictPort: false
  },
  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        maximumFileSizeToCacheInBytes: 5000000
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Artiklo',
        short_name: 'Artiklo',
        description: 'Hukuki Belgeleri Anında Anlayın',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
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
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          // React ekosistemi - AYRILMAMALI
          'react-vendor': ['react', 'react-dom', 'react/jsx-runtime'],

          // Router
          'router': ['react-router-dom'],

          // UI kütüphaneleri - Ana
          'ui-core': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast'
          ],

          // UI kütüphaneleri - Ek
          'ui-extended': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-aspect-ratio',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-collapsible'
          ],

          // Capacitor
          'capacitor': [
            '@capacitor/core',
            '@capacitor/app',
            '@capacitor/keyboard',
            '@capacitor/camera',
            '@capacitor/status-bar'
          ],

          // Supabase
          'supabase': ['@supabase/supabase-js', '@supabase/auth-helpers-react'],

          // Büyük kütüphaneler
          'charts': ['recharts'],
          'document-processing': ['docx'],
          'query': ['@tanstack/react-query'],

          // Form utilities
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],

          // Icons
          'icons': ['lucide-react'],

          // Date utilities
          'date-utils': ['date-fns', 'react-day-picker'],

          // Utility kütüphaneleri
          'utils': [
            'clsx',
            'tailwind-merge',
            'class-variance-authority',
            'dompurify',
            'sonner'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
