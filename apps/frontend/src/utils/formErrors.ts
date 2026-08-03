import type { FieldErrors } from 'react-hook-form';

export function getFirstFieldError(errors: FieldErrors): string | undefined {
    for (const error of Object.values(errors)) {
        if (!error) continue;
        if ('message' in error && typeof error.message === 'string') {
            return error.message;
        }
        const nested = getFirstFieldError(error as FieldErrors);
        if (nested) return nested;
    }
}

export function getFieldErrors(errors: FieldErrors): string[] {
    const result: string[] = [];

    for (const error of Object.values(errors)) {
        if (!error) continue;
        if ('message' in error && typeof error.message === 'string') {
            result.push(error.message);
            continue;
        }
        result.push(...getFieldErrors(error as FieldErrors));
    }

    return result;
}