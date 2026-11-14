import { fetchBookingFormBySlugs } from '#/api/bookingForms/getBookingFormBySlugs';
import { ErrorPage } from '#/pages/Errors/ErrorPage/ErrorPage';
import { InactiveBookingFormPage } from '#/pages/Errors/InactiveBookingFormPage/InactiveBookingFormPage';
import { NotFoundPage } from '#/pages/Errors/NotFoundPage/NotFoundPage';
import { MainPage } from '#/pages/MainPage/MainPage';
import { BookingFormDataContext } from '#/store/BookingFormData/BookingFormDataContext';
import { StepsProvider } from '#/store/Steps/StepsContext';
import { createFileRoute } from '@tanstack/react-router';
import type { ErrorCode } from '@bookio/shared/constants';
import { ApiError } from '#/i18n/apiError';

export const Route = createFileRoute('/$organizationSlug/$bookingFormSlug')({
    loader: async ({ params }) => {
        const { bookingFormSlug, organizationSlug } = params;

        try {
            const bookingForm = await fetchBookingFormBySlugs(
                organizationSlug,
                bookingFormSlug,
            );
            return { bookingForm };
        } catch (error) {
            console.error(error);
            if (ApiError.isApiError(error)) {
                return {
                    bookingForm: null,
                    error: error.english,
                    code: error.code,
                };
            }

            return {
                bookingForm: null,
                error: 'Failed to get booking form by slugs',
                code: 'internal' satisfies ErrorCode,
            };
        }
    },
    head: ({ loaderData }) => {
        if (!loaderData) return { meta: [] };
        const { bookingForm } = loaderData;
        if (!bookingForm) return { meta: [] };

        const { metaData } = bookingForm;

        return {
            meta: [
                {
                    title: metaData.title,
                },
                {
                    name: 'description',
                    content: metaData.description,
                },
                ...Object.entries(metaData.additionalMetaData).map(
                    ([name, content]) => ({
                        name,
                        content,
                    }),
                ),
            ],
        };
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { code, bookingForm } = Route.useLoaderData();

    switch (code) {
        case 'not_found':
            return <NotFoundPage />;
        case 'inactive':
            return <InactiveBookingFormPage />;
        case 'internal':
        case 'validation':
            return <ErrorPage />;
    }

    if (!bookingForm) {
        return <ErrorPage />;
    }

    return (
        <StepsProvider>
            <BookingFormDataContext.Provider value={bookingForm}>
                <MainPage />
            </BookingFormDataContext.Provider>
        </StepsProvider>
    );
}
