import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        tanstackRouter({
            target: 'react',
            autoCodeSplitting: true,
        }),
        react(),
        svgr(),
    ],
    resolve: {
        alias: [
            {
                find: '@bookio/booking-form-ui',
                replacement: path.resolve(__dirname, '../../packages/booking-form-ui/src/index.ts'),
            },
            {
                find: '@bookio/backend/schemas',
                replacement: path.resolve(__dirname, '../backend/src/schemas/index.ts'),
            },
            {
                find: '@bookio/backend',
                replacement: path.resolve(__dirname, '../backend/src/routes/index.ts'),
            },
            { find: '#assets', replacement: path.resolve(__dirname, 'src/assets') },
            { find: '#hooks', replacement: path.resolve(__dirname, 'src/hooks') },
            { find: '#layouts', replacement: path.resolve(__dirname, 'src/layouts') },
            { find: '#lib', replacement: path.resolve(__dirname, 'src/lib') },
            { find: '#pages', replacement: path.resolve(__dirname, 'src/pages') },
            { find: '#components', replacement: path.resolve(__dirname, 'src/components') },
            { find: '#utils', replacement: path.resolve(__dirname, 'src/utils') },
            { find: '#api', replacement: path.resolve(__dirname, 'src/api') },
            { find: '#store', replacement: path.resolve(__dirname, 'src/store') },
        ],
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) {
                        return;
                    }

                    if (
                        id.includes('react-dom') ||
                        id.includes('/react/') ||
                        id.includes('@tanstack/react-router')
                    ) {
                        return 'vendor-react';
                    }

                    if (id.includes('@tanstack/react-query')) {
                        return 'vendor-query';
                    }

                    if (id.includes('better-auth')) {
                        return 'vendor-auth';
                    }

                    if (id.includes('zod')) {
                        return 'vendor-zod';
                    }

                    if (id.includes('react-hot-toast')) {
                        return 'vendor-toast';
                    }

                    if (id.includes('zustand')) {
                        return 'vendor-zustand';
                    }
                },
            },
        },
    },
});
