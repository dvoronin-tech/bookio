import { createFileRoute, redirect } from '@tanstack/react-router';
import { resolveOrganizationWorkspaceTarget } from '#lib/bookingFormEntry';

export const Route = createFileRoute('/_authenticated/$organizationId/')({
    beforeLoad: async ({ params }) => {
        throw redirect({
            ...(await resolveOrganizationWorkspaceTarget(params.organizationId)),
            replace: true,
        });
    },
});
