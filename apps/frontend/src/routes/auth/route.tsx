import { createFileRoute, redirect } from '@tanstack/react-router';
import { AuthLayout } from '#layouts/AuthLayout/AuthLayout';
import { getSession } from '#lib/session';

export const Route = createFileRoute('/auth')({
    beforeLoad: async () => {
        const session = await getSession();

        if (session) {
            throw redirect({ to: '/organizations/list', replace: true });
        }
    },
    component: AuthLayout,
});
