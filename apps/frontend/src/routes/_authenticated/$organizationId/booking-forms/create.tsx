import { createFileRoute } from '@tanstack/react-router';
import { CreateBookingForm } from '#pages/BookingForms/CreateBookingForm/CreateBookingForm';
import {
    goToCreateBookingForm,
    validateCreateBookingFormSearch,
} from '#lib/bookingFormEntry';

export const Route = createFileRoute(
    '/_authenticated/$organizationId/booking-forms/create',
)({
    validateSearch: validateCreateBookingFormSearch,
    beforeLoad: ({ search, params }) =>
        goToCreateBookingForm(
            params.organizationId,
            search.guided === true,
        ),
    component: CreateBookingForm,
});
