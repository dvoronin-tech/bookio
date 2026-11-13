import { redirect, useNavigate } from '@tanstack/react-router';
import {
    bookingFormsQueryKey,
    fetchBookingForms,
} from '#api/bookingForms/getBookingForms';
import { queryClient } from '#lib/query-client';

type AppNavigate = ReturnType<typeof useNavigate>;

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

export async function goToOrganizationWorkspace(
    organizationId: string,
    navigate?: AppNavigate,
): Promise<void> {
    const target = await resolveOrganizationWorkspaceTarget(organizationId);

    if (navigate) {
        await navigate({ ...target });
        return;
    }

    throw redirect({ ...target, replace: true });
}

type CreateBookingFormRouteTarget = {
    to: '/$organizationId/booking-forms/create';
    params: { organizationId: string };
    search: CreateBookingFormSearch;
};

/**
 * Latch `guided` from the forms count when the create route loads.
 * Returns null when this visit should stay on the current search.
 * The param stays for this visit, so creating the form (count becomes 1)
 * does not put the list exit back on the success step.
 */
async function resolveCreateBookingFormRoute(options: {
    organizationId: string;
    guided: boolean;
}): Promise<CreateBookingFormRouteTarget | null> {
    const count = await loadBookingFormCount(options.organizationId);
    if (count === null) {
        return null;
    }

    if (count === 0 && !options.guided) {
        return {
            to: '/$organizationId/booking-forms/create',
            params: { organizationId: options.organizationId },
            search: { guided: true },
        };
    }

    if (count > 0 && options.guided) {
        return {
            to: '/$organizationId/booking-forms/create',
            params: { organizationId: options.organizationId },
            search: {},
        };
    }

    return null;
}

export async function goToCreateBookingForm(
    organizationId: string,
    guided: boolean,
    navigate?: AppNavigate,
): Promise<void> {
    const target = await resolveCreateBookingFormRoute({
        organizationId,
        guided,
    });

    if (!target) {
        return;
    }

    if (navigate) {
        await navigate({ ...target });
        return;
    }

    throw redirect({ ...target, replace: true });
}
