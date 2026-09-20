import { createRouter } from '@tanstack/react-router';
import { Spinner } from '@bookio/ui';
import { NotFound } from '#components/NotFound/NotFound';
import { queryClient } from '#lib/query-client';
import { routeTree } from './routeTree.gen';

export const router = createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
    defaultPendingComponent: Spinner,
    defaultNotFoundComponent: NotFound,
});

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}
