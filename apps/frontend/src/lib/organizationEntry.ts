import { useCallback } from 'react';
import { redirect, useNavigate } from '@tanstack/react-router';
import {
    fetchOrganizationsByUserId,
    organizationsQueryKey,
    type OrganizationsType,
} from '#api/organizations/getOrganizationsByUserId';
import { queryClient } from '#lib/query-client';
import { getSession } from '#lib/session';

type OrganizationsLoadResult =
    | { status: 'anonymous' }
    | { status: 'error' }
    | { status: 'ready'; organizations: OrganizationsType };

export async function loadCurrentUserOrganizations(options?: {
    fresh?: boolean;
}): Promise<OrganizationsLoadResult> {
    const session = await getSession();
    const userId = session?.user?.id;

    if (!userId) {
        return { status: 'anonymous' };
    }

    try {
        if (options?.fresh) {
            await queryClient.invalidateQueries({
                queryKey: organizationsQueryKey,
            });
        }

        const organizations = await queryClient.fetchQuery({
            queryKey: organizationsQueryKey,
            queryFn: () => fetchOrganizationsByUserId(userId),
        });

        return { status: 'ready', organizations };
    } catch {
        return { status: 'error' };
    }
}

export function redirectToOrganizationEntry(
    organizations: OrganizationsType,
): never {
    if (organizations.length === 0) {
        throw redirect({ to: '/organizations/create', replace: true });
    }

    const organization =
        organizations.length === 1 ? organizations[0] : undefined;

    if (organization) {
        throw redirect({
            to: '/$organizationId/booking-forms',
            params: { organizationId: organization.id },
            replace: true,
        });
    }

    throw redirect({ to: '/organizations/list', replace: true });
}

/** Signed-in home and auth: 0 → create, 1 → forms, 2+ → chooser. */
export async function redirectToCurrentUserEntry(): Promise<void> {
    const result = await loadCurrentUserOrganizations();

    if (result.status === 'anonymous') {
        return;
    }

    if (result.status === 'error') {
        throw redirect({ to: '/organizations/list', replace: true });
    }

    redirectToOrganizationEntry(result.organizations);
}

/** List and organization routes stay closed when the user has no organization. */
export async function redirectIfUserHasNoOrganizations(): Promise<void> {
    const cachedQuery = queryClient.getQueryCache().find({
        queryKey: organizationsQueryKey,
        exact: true,
    });
    const cached = cachedQuery?.state.data as OrganizationsType | undefined;

    if (cachedQuery && cached && cached.length > 0 && !cachedQuery.isStale()) {
        return;
    }

    const result = await loadCurrentUserOrganizations();

    if (result.status === 'ready' && result.organizations.length === 0) {
        throw redirect({ to: '/organizations/create', replace: true });
    }
}

export function useNavigateToOrganizationEntry() {
    const navigate = useNavigate();

    return useCallback(async () => {
        const result = await loadCurrentUserOrganizations({ fresh: true });

        if (result.status === 'anonymous') {
            await navigate({ to: '/auth/sign-in', replace: true });
            return;
        }

        if (result.status === 'error') {
            await navigate({ to: '/organizations/list', replace: true });
            return;
        }

        if (result.organizations.length === 0) {
            await navigate({ to: '/organizations/create', replace: true });
            return;
        }

        const organization =
            result.organizations.length === 1
                ? result.organizations[0]
                : undefined;

        if (organization) {
            await navigate({
                to: '/$organizationId/booking-forms',
                params: { organizationId: organization.id },
                replace: true,
            });
            return;
        }

        await navigate({ to: '/organizations/list', replace: true });
    }, [navigate]);
}
