import { createFileRoute } from '@tanstack/react-router';
import { AuthLayout } from '#layouts/AuthLayout/AuthLayout';
import { goToCurrentUserEntry } from '#lib/organizationEntry';

export const Route = createFileRoute('/auth')({
    beforeLoad: () => goToCurrentUserEntry(),
    component: AuthLayout,
});
