export type ApiErrorParams = Record<string, unknown>;

export type ApiErrorBody = {
    success: false;
    code: string;
    error: string;
    params?: ApiErrorParams;
};

export const prepareError = (
    error: string,
    code: string,
    params?: ApiErrorParams,
): ApiErrorBody => {
    if (params && Object.keys(params).length > 0) {
        return { success: false, code, error, params };
    }

    return { success: false, code, error };
};

export const prepareSuccess = <T>(data: T): { success: true; data: T } => {
    return {
        success: true,
        data,
    };
};
