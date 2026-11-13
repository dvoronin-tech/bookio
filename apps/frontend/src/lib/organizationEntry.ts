import { redirect, useNavigate } from '@tanstack/react-router';
import {
    fetchOrganizationsByUserId,
    organizationsQueryKey,
    type OrganizationsType,
} from '#api/organizations/getOrganizationsByUserId';
import {
    resolveOrganizationWorkspaceTarget,
    type OrganizationWorkspaceTarget,
} from '#lib/bookingFormEntry';
import { queryClient } from '#lib/query-client';
import { getSession } from '#lib/session';

type AppNavigate = ReturnType<typeof useNavigate>;

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
async function resolveOrganizationEntryTarget(
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

type CurrentUserEntryTarget =
    | OrganizationEntryTarget
    | { to: '/auth/sign-in' };

/**
 * Anonymous with no `anonymousTo` is a sentinel: the caller stays put.
 * Error opens the chooser. A ready session uses the org-count target.
 */
async function resolveCurrentUserEntryTarget(options: {
    fresh?: boolean;
    anonymousTo: '/auth/sign-in';
}): Promise<CurrentUserEntryTarget>;
async function resolveCurrentUserEntryTarget(options?: {
    fresh?: boolean;
}): Promise<CurrentUserEntryTarget | null>;
async function resolveCurrentUserEntryTarget(options?: {
    fresh?: boolean;
    anonymousTo?: '/auth/sign-in';
}): Promise<CurrentUserEntryTarget | null> {
    const result = await loadCurrentUserOrganizations({
        fresh: options?.fresh,
    });

    if (result.status === 'anonymous') {
        return options?.anonymousTo ? { to: options.anonymousTo } : null;
    }

    if (result.status === 'error') {
        return { to: '/organizations/list' };
    }

    return resolveOrganizationEntryTarget(result.organizations);
}

/** Signed-in home and auth: 0 orgs → create, 1 org → its workspace, 2+ → chooser. */
export async function goToCurrentUserEntry(
    navigate?: AppNavigate,
): Promise<void> {
    const target = navigate
        ? await resolveCurrentUserEntryTarget({
              fresh: true,
              anonymousTo: '/auth/sign-in',
          })
        : await resolveCurrentUserEntryTarget();

    if (!target) {
        return;
    }

    if (navigate) {
        await navigate({ ...target, replace: true });
        return;
    }

    throw redirect({ ...target, replace: true });
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
