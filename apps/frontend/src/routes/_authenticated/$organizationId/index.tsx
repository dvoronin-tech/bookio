import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/$organizationId/')({
    beforeLoad: ({ params }) => {
        throw redirect({
            to: '/$organizationId/booking-forms',
            params: { organizationId: params.organizationId },
            replace: true,
        });
    },
});
