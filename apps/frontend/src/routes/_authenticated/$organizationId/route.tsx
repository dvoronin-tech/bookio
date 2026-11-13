import { createFileRoute } from '@tanstack/react-router';
import { AppLayout } from '#layouts/AppLayout/AppLayout';
import { redirectIfUserHasNoOrganizations } from '#lib/organizationEntry';

export const Route = createFileRoute('/_authenticated/$organizationId')({
    beforeLoad: () => redirectIfUserHasNoOrganizations(),
    component: AppLayout,
});
