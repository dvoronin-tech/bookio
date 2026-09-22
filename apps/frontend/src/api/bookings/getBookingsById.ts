import hono from '#lib/hono-client';
import { validateError } from '#utils/validateError';
import type { InferResponseType } from 'hono/client';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useSession } from '#api/auth';

const getBookingsByIdClient = hono.booking['get-by-id'];

export type GetBookingsByIdResponse = InferResponseType<
    typeof getBookingsByIdClient.$get,
    200
>;
export type BookingsByIdType = GetBookingsByIdResponse['data'];
export type BookingByIdItem = BookingsByIdType[number];

const fetchBookingsById = async (
    bookingFormId: string,
): Promise<BookingsByIdType> => {
    const response = await getBookingsByIdClient.$get({
        query: { bookingFormId },
    });

    const body = await response.json();

    validateError(response, body, 'Failed to get bookings');

    return body.data;
};

export const useGetBookingsById = (
    bookingFormId: string | undefined,
): UseQueryResult<BookingsByIdType> => {
    const { data: session } = useSession();
    return useQuery<BookingsByIdType>({
        queryKey: ['bookings', bookingFormId],
        queryFn: () => fetchBookingsById(bookingFormId!),
        enabled: !!session?.user.id && !!bookingFormId,
    });
};
