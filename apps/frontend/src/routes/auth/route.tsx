import { createFileRoute } from '@tanstack/react-router';
import { AuthLayout } from '#layouts/AuthLayout/AuthLayout';
import { redirectToCurrentUserEntry } from '#lib/organizationEntry';

export const Route = createFileRoute('/auth')({
    beforeLoad: () => redirectToCurrentUserEntry(),
    component: AuthLayout,
});
