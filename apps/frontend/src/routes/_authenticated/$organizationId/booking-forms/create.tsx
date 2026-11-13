import { createFileRoute, redirect } from '@tanstack/react-router';
import { CreateBookingForm } from '#pages/BookingForms/CreateBookingForm/CreateBookingForm';
import {
    resolveCreateBookingFormRoute,
    validateCreateBookingFormSearch,
} from '#lib/bookingFormEntry';

export const Route = createFileRoute(
    '/_authenticated/$organizationId/booking-forms/create',
)({
    validateSearch: validateCreateBookingFormSearch,
    beforeLoad: async ({ search, params }) => {
        const target = await resolveCreateBookingFormRoute({
            organizationId: params.organizationId,
            guided: search.guided === true,
        });

        if (target) {
            throw redirect({ ...target, replace: true });
        }
    },
    component: CreateBookingForm,
});
