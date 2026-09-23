import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { queryClient } from '#lib/query-client';
import { router } from './router';
import { Toaster } from 'react-hot-toast';
import './index.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <Toaster
            position="bottom-center"
            toastOptions={{
                duration: 3000,
                style: {
                    background: 'var(--color-bg-ui)',
                    color: 'var(--color-text-main)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '1rem',
                    padding: '1rem 2rem',
                    fontSize: '1.6rem',
                    maxWidth: '40rem',
                },
            }}
        />
        <RouterProvider router={router} />
        <ReactQueryDevtools />
    </QueryClientProvider>,
);
