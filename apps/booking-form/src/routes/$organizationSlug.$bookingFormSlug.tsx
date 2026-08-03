import { createFileRoute } from '@tanstack/react-router';
import { fetchBookingFormBySlugs } from '#/api/bookingForms/getBookingFormBySlugs';

export const Route = createFileRoute('/$organizationSlug/$bookingFormSlug')({
    loader: async ({ params }) => {
        const bookingForm = await fetchBookingFormBySlugs(
            params.organizationSlug,
            params.bookingFormSlug,
        );

        return { bookingForm };
    },
    component: RouteComponent,
});

function RouteComponent() {

    return (
        <div>
        </div>
    );
}
