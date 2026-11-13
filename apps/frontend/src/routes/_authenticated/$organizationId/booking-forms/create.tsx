import { createFileRoute } from '@tanstack/react-router';
import { CreateBookingForm } from '#pages/BookingForms/CreateBookingForm/CreateBookingForm';
import {
    redirectCreateRouteToGuidedFirstForm,
    validateCreateBookingFormSearch,
} from '#lib/bookingFormEntry';

export const Route = createFileRoute(
    '/_authenticated/$organizationId/booking-forms/create',
)({
    validateSearch: validateCreateBookingFormSearch,
    beforeLoad: ({ search, params }) =>
        redirectCreateRouteToGuidedFirstForm({
            organizationId: params.organizationId,
            guided: search.guided === true,
        }),
    component: CreateBookingForm,
});
