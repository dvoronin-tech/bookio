import { getRouteApi } from '@tanstack/react-router';

/** Route api for `/{organizationId}` pages (AppLayout subtree). */
export const organizationRouteApi = getRouteApi(
    '/_authenticated/$organizationId',
);

/** Route api for the booking form configurator page. */
export const configuratorRouteApi = getRouteApi(
    '/_authenticated/$organizationId/booking-forms/$bookingFormId/configurator',
);

/** Route api for the create-booking-form wizard. */
export const createBookingFormRouteApi = getRouteApi(
    '/_authenticated/$organizationId/booking-forms/create',
);

export const bookingsRouteApi = getRouteApi(
    '/_authenticated/$organizationId/bookings/$bookingFormId',
);
