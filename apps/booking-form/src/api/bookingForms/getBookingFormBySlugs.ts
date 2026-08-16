import hono from '@lib/hono-client';
import { validateError } from '@utils/validateError';
import type { InferResponseType } from 'hono/client';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

const getBookingFormBySlugsClient = hono['booking-forms']['get-by-slugs'];

export type GetBookingFormBySlugsResponse = InferResponseType<
    typeof getBookingFormBySlugsClient.$get,
    200
>;

export type GetBookingFormBySlugsError = InferResponseType<
    typeof getBookingFormBySlugsClient.$get,
    404 | 500
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

    if (response.status === 404 && 'code' in body) {
        throw new Error(body.error, { cause: body.code });
    }

    validateError(response, body, 'Failed to get booking form by slugs');

    return body.data;
};

export const useGetBookingFormBySlugs = (
    organizationSlug: string | undefined,
    bookingFormSlug: string | undefined,
): UseQueryResult<BookingFormBySlugsType> => {
    return useQuery<BookingFormBySlugsType>({
        queryKey: ['booking-form', organizationSlug, bookingFormSlug],
        queryFn: () => fetchBookingFormBySlugs(organizationSlug!, bookingFormSlug!),
        enabled: !!organizationSlug && !!bookingFormSlug,
    });
};
