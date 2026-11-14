import { toApiError } from '#i18n/apiError';

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
        throw toApiError(body, fallbackMessage);
    }

    if (!response.ok) {
        throw toApiError(
            { code: 'internal', error: fallbackMessage },
            fallbackMessage,
        );
    }
}
