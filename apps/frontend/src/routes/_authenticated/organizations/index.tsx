import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/organizations/')({
    beforeLoad: () => {
        throw redirect({ to: '/organizations/list', replace: true });
    },
});
