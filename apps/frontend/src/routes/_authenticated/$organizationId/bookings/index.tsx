import { createFileRoute } from '@tanstack/react-router';
import { BookingsIndex } from '#pages/Bookings/BookingsIndex/BookingsIndex.tsx';

export const Route = createFileRoute(
    '/_authenticated/$organizationId/bookings/',
)({
    component: BookingsIndex,
});
