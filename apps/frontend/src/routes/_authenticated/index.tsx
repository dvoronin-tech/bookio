import { createFileRoute } from '@tanstack/react-router';
import { redirectToCurrentUserEntry } from '#lib/organizationEntry';

export const Route = createFileRoute('/_authenticated/')({
    beforeLoad: () => redirectToCurrentUserEntry(),
});
