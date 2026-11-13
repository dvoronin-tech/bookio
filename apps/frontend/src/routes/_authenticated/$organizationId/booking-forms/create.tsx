import { createFileRoute } from '@tanstack/react-router';
import { CreateBookingForm } from '#pages/BookingForms/CreateBookingForm/CreateBookingForm';
import {
    resolveCreateBookingFormRoute,
    validateCreateBookingFormSearch,
} from '#lib/bookingFormEntry';
import { throwNavigation } from '#lib/navigation';

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
            throwNavigation({ ...target, replace: true });
        }
    },
    component: CreateBookingForm,
});
