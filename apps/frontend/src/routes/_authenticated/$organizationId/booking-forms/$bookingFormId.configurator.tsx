import { createFileRoute } from '@tanstack/react-router';
import { BookingFormConfigurator } from '#pages/BookingForms/BookingFormConfigurator/BookingFormConfigurator';

export const Route = createFileRoute(
    '/_authenticated/$organizationId/booking-forms/$bookingFormId/configurator',
)({
    component: BookingFormConfigurator,
});
