import {
    createApiErrorHandling,
    createParaglideApiErrorTranslators,
    throwIfApiError,
} from '@bookio/shared/utils';
import { m } from '../paraglide/messages.js';

export const { ApiError } = createApiErrorHandling(
    createParaglideApiErrorTranslators(m),
);

type ApiSuccessBody = {
    success: true;
    data: unknown;
};

export function validateError<TBody>(
    response: Response,
    body: TBody,
    fallbackMessage: string,
): asserts body is Extract<TBody, ApiSuccessBody> {
    throwIfApiError(response, body, fallbackMessage, ApiError);
}