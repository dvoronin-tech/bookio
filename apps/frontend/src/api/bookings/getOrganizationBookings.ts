import hono from '#lib/hono-client';
import { validateError } from '#utils/validateError';
import type { InferResponseType } from 'hono/client';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useSession } from '#api/auth';

const getOrganizationBookingsClient = hono.booking['get-all'];

export type GetOrganizationBookingsResponse = InferResponseType<
    typeof getOrganizationBookingsClient.$get,
    200
>;
export type OrganizationBookingsType = GetOrganizationBookingsResponse['data'];
export type BookingItem = OrganizationBookingsType[number];

const fetchOrganizationBookings = async (
    organizationId: string,
): Promise<OrganizationBookingsType> => {
    const response = await getOrganizationBookingsClient.$get({
        query: { organizationId },
    });

    const body = await response.json();

    validateError(response, body, 'Failed to get organization bookings');

    return body.data;
};

export const useGetOrganizationBookings = (
    organizationId: string | undefined,
): UseQueryResult<OrganizationBookingsType> => {
    const { data: session } = useSession();
    return useQuery<OrganizationBookingsType>({
        queryKey: ['organization-bookings', organizationId],
        queryFn: () => fetchOrganizationBookings(organizationId!),
        enabled: !!session?.user.id && !!organizationId,
    });
};
