import { prettifyError, type ZodError } from 'zod';

type ApiErrorBody = {
    success: false;
    error: string | ZodError;
};

export const parseError = (body: ApiErrorBody): string => {
    if (typeof body.error === 'string') {
        return body.error;
    }

    return prettifyError(body.error);
};
