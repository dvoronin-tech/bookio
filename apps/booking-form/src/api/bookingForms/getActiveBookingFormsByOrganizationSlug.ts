import hono from '@lib/hono-client';
import { validateError } from '@utils/validateError';
import type { InferResponseType } from 'hono/client';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

const getActiveBookingFormsByOrganizationSlugClient =
    hono['booking-forms']['get-active-by-organization-slug'];

export type GetActiveBookingFormsByOrganizationSlugResponse = InferResponseType<
    typeof getActiveBookingFormsByOrganizationSlugClient.$get,
    200
>;
export type ActiveBookingFormsType = GetActiveBookingFormsByOrganizationSlugResponse['data'];
export type ActiveBookingFormType = ActiveBookingFormsType[number];

const fetchActiveBookingFormsByOrganizationSlug = async (
    organizationSlug: string,
): Promise<ActiveBookingFormsType> => {
    const response = await getActiveBookingFormsByOrganizationSlugClient.$get({
        query: { organizationSlug },
    });

    const body = await response.json();

    validateError(response, body, 'Failed to get active booking forms by organization slug');

    return body.data;
};

export const useGetActiveBookingFormsByOrganizationSlug = (
    organizationSlug: string | undefined,
): UseQueryResult<ActiveBookingFormsType> => {
    return useQuery<ActiveBookingFormsType>({
        queryKey: ['active-booking-forms', organizationSlug],
        queryFn: () => fetchActiveBookingFormsByOrganizationSlug(organizationSlug!),
        enabled: !!organizationSlug,
    });
};
