import { createRouter } from '@tanstack/react-router';
import { PageLoader } from '@bookio/ui';
import { NotFound } from '#components/NotFound/NotFound';
import { queryClient } from '#lib/query-client';
import { routeTree } from './routeTree.gen';

export const router = createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
    defaultPendingComponent: PageLoader,
    defaultNotFoundComponent: NotFound,
});

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}
