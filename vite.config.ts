import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
    host: true
  },
  plugins: [
    react(),
    visualizer({
      filename: 'bundle-analysis.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    }),
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
          // React ekosistemi
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],

          // UI kütüphaneleri
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-select',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs'
          ],

          // Utility kütüphaneleri
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],

          // Form ve validation
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],

          // İkonlar ve medya
          icons: ['lucide-react'],

          // Supabase ve auth
          supabase: ['@supabase/supabase-js']
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
