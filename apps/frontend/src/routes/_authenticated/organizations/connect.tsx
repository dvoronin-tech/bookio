import { createFileRoute } from '@tanstack/react-router';
import { ConnectOrganization } from '#pages/Organization/ConnectOrganization/ConnectOrganization';

export const Route = createFileRoute('/_authenticated/organizations/connect')({
    component: ConnectOrganization,
});
