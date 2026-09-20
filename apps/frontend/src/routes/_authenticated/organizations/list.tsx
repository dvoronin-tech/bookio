import { createFileRoute } from '@tanstack/react-router';
import { OrganizationList } from '#pages/Organization/OrganizationList/OrganizationList';

export const Route = createFileRoute('/_authenticated/organizations/list')({
    component: OrganizationList,
});
