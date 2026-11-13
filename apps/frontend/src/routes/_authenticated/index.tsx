import { createFileRoute } from '@tanstack/react-router';
import { goToCurrentUserEntry } from '#lib/organizationEntry';

export const Route = createFileRoute('/_authenticated/')({
    beforeLoad: () => goToCurrentUserEntry(),
});
