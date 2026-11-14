import type { ErrorCode } from '../constants.js';
import type { ApiErrorBodyInput } from './apiError.js';

export type ApiErrorConstructor = new (
    body: ApiErrorBodyInput,
    fallbackEnglish?: string,
) => Error;

type ApiErrorResponseBody = {
    success: false;
    code?: string;
    error?: string;
    issues?: unknown;
};

const hasFailedSuccess = (body: unknown): body is ApiErrorResponseBody => {
    return (
        typeof body === 'object' &&
        body !== null &&
        'success' in body &&
        !(body as { success: boolean }).success
    );
};

export function throwIfApiError(
    response: Response,
    body: unknown,
    fallbackMessage: string,
    ApiError: ApiErrorConstructor,
): void {
    if (hasFailedSuccess(body)) {
        throw new ApiError(body, fallbackMessage);
    }

    if (!response.ok) {
        throw new ApiError(
            { code: 'internal' satisfies ErrorCode, error: fallbackMessage },
            fallbackMessage,
        );
    }
}