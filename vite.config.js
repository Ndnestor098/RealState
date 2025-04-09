import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        base: '/build/',
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
                refresh: true,
                ssr: 'resources/js/ssr.jsx', // opcional, si usás SSR
            }),
            react(),
        ],
        build: {
            manifest: true,
            outDir: 'public/build',
            rollupOptions: {
                input: 'resources/js/app.jsx',
                output: {
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            return 'vendor';
                        }

                        if (id.includes('resources/js/components/')) {
                            const name = path.basename(id).replace('.jsx', '');
                            return `components/${name}`;
                        }
                    }
                }
            }
        },
        resolve: {
            alias: {
                '@': '/resources/js',
            },
        },
        server: {
            https: true,
            host: true,
        },
    };
});
