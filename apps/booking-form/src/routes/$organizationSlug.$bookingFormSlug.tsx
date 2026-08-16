import { fetchBookingFormBySlugs } from '#/api/bookingForms/getBookingFormBySlugs';
import { GreetingLayout } from '#/layouts/GreetingLayout/GreetingLayout';
import { ErrorPage } from '#/pages/Errors/ErrorPage/ErrorPage';
import { InactiveBookingFormPage } from '#/pages/Errors/InactiveBookingFormPage/InactiveBookingFormPage';
import { NotFoundPage } from '#/pages/Errors/NotFoundPage/NotFoundPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$organizationSlug/$bookingFormSlug')({
    loader: async ({ params }) => {
        const { bookingFormSlug, organizationSlug } = params;

        try {
            const bookingForm = await fetchBookingFormBySlugs(organizationSlug, bookingFormSlug);
            return { bookingForm };
        } catch (error) {
            console.error(error);
            if (error instanceof Error && typeof error.cause === 'string') {
                return { bookingForm: null, error: error.message, code: error.cause };
            }

            return {
                bookingForm: null,
                error: 'Failed to get booking form by slugs',
                code: 'UNKNOWN_ERROR',
            };
        }
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { code } = Route.useLoaderData();

    switch (code) {
        case 'ORGANIZATION_NOT_FOUND':
        case 'BOOKING_FORM_NOT_FOUND':
            return <NotFoundPage />;
        case 'BOOKING_FORM_NOT_ACTIVE':
            return <InactiveBookingFormPage />;
        case 'UNKNOWN_ERROR':
            return <ErrorPage />;
    }

    return <GreetingLayout />;
}
