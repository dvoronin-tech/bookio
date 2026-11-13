import { useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
    fetchOrganizationsByUserId,
    organizationsQueryKey,
    type OrganizationsType,
} from '#api/organizations/getOrganizationsByUserId';
import {
    resolveOrganizationWorkspaceTarget,
    type OrganizationWorkspaceTarget,
} from '#lib/bookingFormEntry';
import { throwNavigation, runNavigation } from '#lib/navigation';
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

export type OrganizationEntryTarget =
    | { to: '/organizations/create' }
    | { to: '/organizations/list' }
    | OrganizationWorkspaceTarget;

/** 0 orgs → create, 1 → its workspace, 2+ → chooser. */
export async function resolveOrganizationEntryTarget(
    organizations: OrganizationsType,
): Promise<OrganizationEntryTarget> {
    if (organizations.length === 0) {
        return { to: '/organizations/create' };
    }

    const organization =
        organizations.length === 1 ? organizations[0] : undefined;

    if (organization) {
        return resolveOrganizationWorkspaceTarget(organization.id);
    }

    return { to: '/organizations/list' };
}

type CurrentUserEntryTarget = OrganizationEntryTarget & { replace: true };

/**
 * Anonymous with no `anonymousTo` is a sentinel: the caller stays put.
 * Error opens the chooser. A ready session uses the org-count target.
 */
export async function resolveCurrentUserEntryTarget(options: {
    fresh?: boolean;
    anonymousTo: '/auth/sign-in';
}): Promise<CurrentUserEntryTarget | { to: '/auth/sign-in'; replace: true }>;
export async function resolveCurrentUserEntryTarget(options?: {
    fresh?: boolean;
}): Promise<CurrentUserEntryTarget | null>;
export async function resolveCurrentUserEntryTarget(options?: {
    fresh?: boolean;
    anonymousTo?: '/auth/sign-in';
}): Promise<
    | CurrentUserEntryTarget
    | { to: '/auth/sign-in'; replace: true }
    | null
> {
    const result = await loadCurrentUserOrganizations({
        fresh: options?.fresh,
    });

    if (result.status === 'anonymous') {
        return options?.anonymousTo
            ? { to: options.anonymousTo, replace: true }
            : null;
    }

    if (result.status === 'error') {
        return { to: '/organizations/list', replace: true };
    }

    return {
        ...(await resolveOrganizationEntryTarget(result.organizations)),
        replace: true,
    };
}

/** Signed-in home and auth: 0 orgs → create, 1 org → its workspace, 2+ → chooser. */
export async function redirectToCurrentUserEntry(): Promise<void> {
    const target = await resolveCurrentUserEntryTarget();
    if (!target) {
        return;
    }

    throwNavigation(target);
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
        throwNavigation({ to: '/organizations/create', replace: true });
    }
}

export function useNavigateToOrganizationEntry() {
    const navigate = useNavigate();

    return useCallback(async () => {
        await runNavigation(
            navigate,
            await resolveCurrentUserEntryTarget({
                fresh: true,
                anonymousTo: '/auth/sign-in',
            }),
        );
    }, [navigate]);
}
