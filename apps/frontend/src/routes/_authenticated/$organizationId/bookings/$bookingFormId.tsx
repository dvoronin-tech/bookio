import { createFileRoute } from '@tanstack/react-router';
import { Bookings } from '#pages/Bookings/Bookings.tsx';

export const Route = createFileRoute(
    '/_authenticated/$organizationId/bookings/$bookingFormId',
)({
    component: Bookings,
});
