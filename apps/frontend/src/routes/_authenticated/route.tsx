import { createFileRoute, redirect } from '@tanstack/react-router';
import { toast } from 'react-hot-toast';
import { MainLayout } from '#layouts/MainLayout/MainLayout';
import { getSession } from '#lib/session';

export const Route = createFileRoute('/_authenticated')({
    // Avoid re-fetching the session on every navigation inside the app.
    staleTime: 30_000,
    beforeLoad: async () => {
        const session = await getSession();

        if (!session) {
            toast('You are not authorized to access this page', {
                icon: '❌',
                duration: 3000,
            });
            throw redirect({ to: '/auth/sign-in' });
        }
    },
    component: MainLayout,
});
