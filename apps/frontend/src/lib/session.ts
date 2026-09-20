import { authClient } from './auth-client';

/**
 * Fetches the current better-auth session for router guards.
 * Fails closed (returns null) on any error, mirroring the previous
 * layout guards that treated a failed session fetch as "not signed in".
 */
export async function getSession() {
    try {
        const { data } = await authClient.getSession();
        return data;
    } catch {
        return null;
    }
}
