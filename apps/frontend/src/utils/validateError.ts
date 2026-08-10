import { parseError, parseZodErrorBody } from './parseError';

type ApiErrorBody = {
    success: false;
    error: string | import('zod').ZodError;
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
        throw new Error(parseError(body));
    }

    if (!response.ok) {
        const zodMessage = parseZodErrorBody(body);
        if (zodMessage) {
            throw new Error(zodMessage);
        }

        throw new Error(fallbackMessage);
    }
}
