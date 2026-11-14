import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@lib/query-client';
import { NotFoundPage } from '#/pages/Errors/NotFoundPage/NotFoundPage';
import { LanguageSwitch } from '#/components/LanguageSwitch/LanguageSwitch';
import { m } from '../paraglide/messages.js';
import { getLocale, getTextDirection } from '../paraglide/runtime.js';

import appCss from '../styles.css?url';

export const Route = createRootRoute({
    head: () => ({
        meta: [
            {
                charSet: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                title: m.app_name(),
            },
        ],
        links: [
            {
                rel: 'icon',
                href: 'data:,',
            },
            {
                rel: 'stylesheet',
                href: appCss,
            },
        ],
    }),
    shellComponent: RootDocument,
    notFoundComponent: NotFoundPage,
});

function RootDocument({ children }: { children: React.ReactNode }) {
    return (
        <html lang={getLocale()} dir={getTextDirection()} suppressHydrationWarning>
            <head>
                <HeadContent />
            </head>
            <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
                <QueryClientProvider client={queryClient}>
                    <LanguageSwitch />
                    {children}
                </QueryClientProvider>
                <Scripts />
            </body>
        </html>
    );
}
