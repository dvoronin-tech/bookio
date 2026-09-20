import { createFileRoute, redirect } from '@tanstack/react-router';
import { toast } from 'react-hot-toast';
import { MainLayout } from '#layouts/MainLayout/MainLayout';
import { getSession } from '#lib/session';

export const Route = createFileRoute('/_authenticated')({
    loader: async () => {
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
