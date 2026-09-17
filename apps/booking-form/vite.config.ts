import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { devtools } from '@tanstack/devtools-vite';

import { tanstackStart } from '@tanstack/react-start/plugin/vite';

import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { nitro } from 'nitro/vite';
import { imagetools } from 'vite-imagetools';
import svgr from 'vite-plugin-svgr';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = defineConfig({
    resolve: {
        tsconfigPaths: true,
        alias: {
            '@bookio/booking-form-ui': path.resolve(
                __dirname,
                '../../packages/booking-form-ui/src/index.ts',
            ),
        },
    },
    plugins: [
        devtools(),
        nitro({ rollupConfig: { external: [/^@sentry\//] } }),
        tailwindcss(),
        tanstackStart(),
        viteReact(),
        imagetools(),
        svgr(),
    ],
});

export default config;
