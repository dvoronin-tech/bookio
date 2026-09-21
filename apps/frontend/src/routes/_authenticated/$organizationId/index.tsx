import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/$organizationId/')({
    beforeLoad: ({ params }) => {
        throw redirect({
            to: '/$organizationId/analytics',
            params: { organizationId: params.organizationId },
            replace: true,
        });
    },
});
