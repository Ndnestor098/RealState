import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    server: {
        https: true,
        host: 'villa.ndnestor.com',
    },
    build: {
        manifest: true,
        outDir: 'public/build',
    },
    base: '/build/',
});
