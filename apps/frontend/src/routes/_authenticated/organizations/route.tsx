import { createFileRoute } from '@tanstack/react-router';
import { OrganizationLayout } from '#layouts/OrganizationLayout/OrganizationLayout';

export const Route = createFileRoute('/_authenticated/organizations')({
    component: OrganizationLayout,
});
