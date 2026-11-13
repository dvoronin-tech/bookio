import { createFileRoute } from '@tanstack/react-router';
import { redirectToOrganizationWorkspace } from '#lib/bookingFormEntry';

export const Route = createFileRoute('/_authenticated/$organizationId/')({
    beforeLoad: ({ params }) =>
        redirectToOrganizationWorkspace(params.organizationId),
});
