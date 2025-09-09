import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
    plugins: [
        react(),
        visualizer({
            filename: 'dist/bundle-analysis.html',
            open: false,
            gzipSize: true,
            brotliSize: true,
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Core React libraries
                    'react-vendor': ['react', 'react-dom'],

                    // UI libraries
                    'ui-core': [
                        '@radix-ui/react-dialog',
                        '@radix-ui/react-dropdown-menu',
                        '@radix-ui/react-select',
                        '@radix-ui/react-tabs',
                        '@radix-ui/react-toast',
                    ],

                    // Charts and visualization
                    'charts': ['recharts'],

                    // Document processing
                    'document-processing': ['docx', 'dompurify'],

                    // Supabase
                    'supabase': ['@supabase/supabase-js', '@supabase/auth-helpers-react'],

                    // Utilities
                    'utils': ['date-fns', 'clsx', 'tailwind-merge'],

                    // Forms
                    'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],

                    // Icons
                    'icons': ['lucide-react'],

                    // Router
                    'router': ['react-router-dom'],

                    // Query
                    'query': ['@tanstack/react-query'],

                    // Capacitor
                    'capacitor': [
                        '@capacitor/core',
                        '@capacitor/app',
                        '@capacitor/camera',
                        '@capacitor/filesystem',
                        '@capacitor/preferences',
                    ],
                },
            },
        },
        // Optimize chunk size
        chunkSizeWarningLimit: 1000,
    },
    // Performance optimizations
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            '@supabase/supabase-js',
            'lucide-react',
        ],
    },
});