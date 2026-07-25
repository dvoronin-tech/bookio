import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), svgr()],
    resolve: {
        alias: {
            '@assets': path.resolve(__dirname, 'src/assets'),
            '@hooks': path.resolve(__dirname, 'src/hooks'),
            '@layouts': path.resolve(__dirname, 'src/layouts'),
            '@lib': path.resolve(__dirname, 'src/lib'),
            '@pages': path.resolve(__dirname, 'src/pages'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@api': path.resolve(__dirname, 'src/api'),
            '@store': path.resolve(__dirname, 'src/store'),
            '@bookio/backend': path.resolve(__dirname, '../backend/src/routes/index.ts'),
            '@schemas': path.resolve(__dirname, 'src/schemas'),
        },
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
                        id.includes('react-router')
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
