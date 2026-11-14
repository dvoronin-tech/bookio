import hono from '@lib/hono-client';
import { validateError } from '@utils/validateError';
import type { InferResponseType } from 'hono/client';

const getBookingFormBySlugsClient = hono['booking-forms']['get-by-slugs'];

export type GetBookingFormBySlugsResponse = InferResponseType<
    typeof getBookingFormBySlugsClient.$get,
    200
>;

export type BookingFormBySlugsType = GetBookingFormBySlugsResponse['data'];

export const fetchBookingFormBySlugs = async (
    organizationSlug: string,
    bookingFormSlug: string,
): Promise<BookingFormBySlugsType> => {
    const response = await getBookingFormBySlugsClient.$get({
        query: { organizationSlug, bookingFormSlug },
    });

    const body = await response.json();

    validateError(response, body, 'Failed to get booking form by slugs');

    return body.data;
};
