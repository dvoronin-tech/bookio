import type { FieldErrors } from 'react-hook-form';

/**
 * Safely extracts a string error message for a given field key from react-hook-form errors.
 */
export function getErrorMessage(
    errors: FieldErrors,
    key: string,
): string | undefined {
    const error = errors[key];
    if (!error) return undefined;

    if (typeof error.message === 'string') {
        return error.message;
    }

    return undefined;
}
