import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/organizations/_shell/')({
    beforeLoad: () => {
        throw redirect({ to: '/organizations/list', replace: true });
    },
});
