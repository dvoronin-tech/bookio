import hono from '#lib/hono-client';
import { queryClient } from '#lib/query-client';
import { validateError } from '#utils/validateError';
import type { InferResponseType } from 'hono/client';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useSession } from '#api/auth';

export const entireBookingFormQueryKey = (bookingFormId?: string) =>
    bookingFormId !== undefined
        ? (['entire-booking-form', bookingFormId] as const)
        : (['entire-booking-form'] as const);

export const invalidateEntireBookingForm = (bookingFormId?: string) => {
    queryClient.invalidateQueries({ queryKey: entireBookingFormQueryKey(bookingFormId) });
};

const getEntireBookingFormByIdClient = hono['booking-forms']['get-entire-by-id'];

export type GetEntireBookingFormByIdResponse = InferResponseType<
    typeof getEntireBookingFormByIdClient.$get,
    200
>;
export type EntireBookingFormType = GetEntireBookingFormByIdResponse['data'];
export type EntireBookingFormField = NonNullable<EntireBookingFormType>['fields'][number];

const fetchEntireBookingFormById = async (
    bookingFormId: string,
): Promise<EntireBookingFormType> => {
    const response = await getEntireBookingFormByIdClient.$get({
        query: {
            bookingFormId,
        },
    });

    const body = await response.json();

    validateError(response, body, 'Failed to get entire booking form by id');

    return body.data;
};

export const useGetEntireBookingFormById = (
    bookingFormId: string | undefined,
): UseQueryResult<EntireBookingFormType> => {
    const { data: session } = useSession();
    return useQuery<EntireBookingFormType>({
        queryKey: entireBookingFormQueryKey(bookingFormId),
        queryFn: () => fetchEntireBookingFormById(bookingFormId!),
        enabled: !!session?.user.id,
    });
};
