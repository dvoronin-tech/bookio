import { createFileRoute } from '@tanstack/react-router';
import { BookingForms } from '#pages/BookingForms/BookingFormsList/BookingFormsList';

export const Route = createFileRoute('/_authenticated/$organizationId/booking-forms/')({
    component: BookingForms,
});
