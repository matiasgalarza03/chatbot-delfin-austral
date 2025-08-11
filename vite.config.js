import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5174,
    open: true,
    cors: true,
    fs: {
      strict: false,
      allow: ['..']
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5003',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('🔄 Proxy error - servidor de inventario puede estar iniciándose...');
          });
        },
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: ['regenerator-runtime/runtime'],
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('@react-three')) {
              return 'vendor_react_three';
            }
            if (id.includes('three')) {
              return 'vendor_three';
            }
            if (id.includes('@chakra-ui')) {
              return 'vendor_chakra';
            }
            return 'vendor';
          }
        },
        assetFileNames: 'assets/[name].[hash][extname]',
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
      },
    },
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Solo copiar archivos esenciales, excluir archivos pesados
    copyPublicDir: false,
    // Minify output
    minify: 'esbuild',
    // Enable brotli compression
    brotliSize: true,
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'three', 
      '@react-three/fiber', 
      '@react-three/drei',
      'pdfjs-dist/legacy/build/pdf.js',
      'pdfjs-dist/legacy/build/pdf.worker.entry.js'
    ],
    // Forzar la inclusión de PDF.js en el bundle
    exclude: [],
  },
});
