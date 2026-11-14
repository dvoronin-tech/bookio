import type { ErrorCode } from '@bookio/backend/constants';
import { ApiError } from '#i18n/apiError';

type ApiErrorBody = {
    success: false;
    code?: string;
    error?: string;
    issues?: unknown;
};

type ApiSuccessBody = {
    success: true;
    data: unknown;
};

const hasFailedSuccess = (body: unknown): body is ApiErrorBody => {
    return (
        typeof body === 'object' &&
        body !== null &&
        'success' in body &&
        !(body as { success: boolean }).success
    );
};

export function validateError<TBody>(
    response: Response,
    body: TBody,
    fallbackMessage: string,
): asserts body is Extract<TBody, ApiSuccessBody> {
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
