import { createFileRoute } from '@tanstack/react-router';
import { resolveOrganizationWorkspaceTarget } from '#lib/bookingFormEntry';
import { throwNavigation } from '#lib/navigation';

export const Route = createFileRoute('/_authenticated/$organizationId/')({
    beforeLoad: async ({ params }) => {
        throwNavigation({
            ...(await resolveOrganizationWorkspaceTarget(params.organizationId)),
            replace: true,
        });
    },
});
