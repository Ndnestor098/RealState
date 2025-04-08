import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    base: 'https://villa.ndnestor.com/build/',
    plugins: [
        laravel({
            input: [
                'resources/js/app.jsx',
                'resources/css/fontawesome.css',
                'resources/css/templatemo-villa-agency.css',
                'resources/css/animate.css',
                'resources/css/flex-slider.css',
                'resources/css/owl.css',
                'resources/css/style.css',

            ],
            ssr: 'resources/js/ssr.jsx',
            refresh: false,
        }),
        react(),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return 'vendor'; // Mantener vendor separado
                    }
    
                    // Divide los componentes grandes
                    if (id.includes('resources/js/components/')) {
                        const name = id.split('/').pop().replace('.jsx', '');
                        return `components/${name}`; // Crea un chunk por cada componente
                    }
                }
            }
        }
    },
    server: {
        https: true,
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
    }
});
