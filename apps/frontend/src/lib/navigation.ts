import { redirect, useNavigate } from '@tanstack/react-router';

/**
 * Route target TanStack Router accepts: `to`, optional `params` / `search`, and `replace`.
 * Stored targets use this shape. `redirect` and `navigate` only infer search from an
 * object literal, so the two runners cast once at this boundary.
 */
export type RouteNavigationTarget = {
    to: string;
    params?: Record<string, string>;
    search?: Record<string, unknown>;
    replace?: boolean;
};

type AppNavigate = ReturnType<typeof useNavigate>;

export function throwNavigation(target: RouteNavigationTarget): never {
    throw redirect(target as Parameters<typeof redirect>[0]);
}

export async function runNavigation(
    navigate: AppNavigate,
    target: RouteNavigationTarget,
): Promise<void> {
    await navigate(target as Parameters<AppNavigate>[0]);
}
