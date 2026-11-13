import { createFileRoute } from '@tanstack/react-router';
import { goToOrganizationWorkspace } from '#lib/bookingFormEntry';

export const Route = createFileRoute('/_authenticated/$organizationId/')({
    beforeLoad: ({ params }) => goToOrganizationWorkspace(params.organizationId),
});
