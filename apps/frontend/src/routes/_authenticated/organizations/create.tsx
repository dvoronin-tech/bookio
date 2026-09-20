import { createFileRoute } from '@tanstack/react-router';
import { CreateOrganization } from '#pages/Organization/CreateOrganization/CreateOrganization';

export const Route = createFileRoute('/_authenticated/organizations/create')({
    component: CreateOrganization,
});
