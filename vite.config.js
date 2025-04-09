import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        base: `${env.VITE_URL}/build/`, // 👈 Esto es la clave
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
                            return 'vendor';
                        }

                        if (id.includes('resources/js/components/')) {
                            const name = path.basename(id).replace('.jsx', '');
                            return `components/${name}`;
                        }
                    }
                }
            },
            manifest: true,
            outDir: 'public/build',
        },
        server: {
            https: true,
            host: 'villa.ndnestor.com',
        },
        resolve: {
            alias: {
                '@': '/resources/js',
            },
        },
    };
});
