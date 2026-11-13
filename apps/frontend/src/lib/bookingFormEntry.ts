import { redirect, useNavigate } from '@tanstack/react-router';
import {
    bookingFormsQueryKey,
    fetchBookingForms,
} from '#api/bookingForms/getBookingForms';
import { queryClient } from '#lib/query-client';

/** Search on `/$organizationId/booking-forms/create`. Set only for the first form. */
export type CreateBookingFormSearch = {
    guided?: true;
};

export function validateCreateBookingFormSearch(
    search: Record<string, unknown>,
): CreateBookingFormSearch {
    if (search.guided === true || search.guided === 'true') {
        return { guided: true };
    }

    return {};
}

type AppNavigate = ReturnType<typeof useNavigate>;

async function loadBookingFormCount(
    organizationId: string,
): Promise<number | null> {
    try {
        const forms = await queryClient.fetchQuery({
            queryKey: bookingFormsQueryKey(organizationId),
            queryFn: () => fetchBookingForms(organizationId),
        });

        return forms.length;
    } catch {
        return null;
    }
}

export type OrganizationWorkspaceTarget = {
    to:
        | '/$organizationId/booking-forms/create'
        | '/$organizationId/booking-forms';
    params: { organizationId: string };
    search?: { guided: true };
};

/** First entry into a workspace: wizard when it has no forms, otherwise the list. */
export async function resolveOrganizationWorkspaceTarget(
    organizationId: string,
): Promise<OrganizationWorkspaceTarget> {
    const count = await loadBookingFormCount(organizationId);

    if (count === 0) {
        return {
            to: '/$organizationId/booking-forms/create',
            params: { organizationId },
            search: { guided: true },
        };
    }

    return {
        to: '/$organizationId/booking-forms',
        params: { organizationId },
    };
}

export async function redirectToOrganizationWorkspace(
    organizationId: string,
): Promise<never> {
    throw redirect({
        ...(await resolveOrganizationWorkspaceTarget(organizationId)),
        replace: true,
    });
}

export async function navigateToOrganizationWorkspace(
    navigate: AppNavigate,
    organizationId: string,
    options?: { replace?: boolean },
): Promise<void> {
    await navigate({
        ...(await resolveOrganizationWorkspaceTarget(organizationId)),
        replace: options?.replace,
    });
}

/**
 * Latch `guided` from the forms count when the create route loads.
 * The param stays for this visit, so creating the form (count becomes 1)
 * does not put the list exit back on the success step.
 */
export async function redirectCreateRouteToGuidedFirstForm(options: {
    organizationId: string;
    guided: boolean;
}): Promise<void> {
    const count = await loadBookingFormCount(options.organizationId);
    if (count === null) {
        return;
    }

    if (count === 0 && !options.guided) {
        throw redirect({
            to: '/$organizationId/booking-forms/create',
            params: { organizationId: options.organizationId },
            search: { guided: true },
            replace: true,
        });
    }

    if (count > 0 && options.guided) {
        throw redirect({
            to: '/$organizationId/booking-forms/create',
            params: { organizationId: options.organizationId },
            search: {},
            replace: true,
        });
    }
}
