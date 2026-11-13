import { createFileRoute } from '@tanstack/react-router';
import { OrganizationList } from '#pages/Organization/OrganizationList/OrganizationList';
import { redirectIfUserHasNoOrganizations } from '#lib/organizationEntry';

export const Route = createFileRoute('/_authenticated/organizations/list')({
    beforeLoad: () => redirectIfUserHasNoOrganizations(),
    component: OrganizationList,
});
