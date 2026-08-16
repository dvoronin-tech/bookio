export const prepareError = <TCode extends string>(
    error: string,
    code?: TCode,
    additionalData?: Record<string, any>,
): { success: false; error: string; code?: TCode } & Record<string, any> => {
    return {
        success: false,
        error,
        code,
        ...additionalData,
    };
};

export const prepareSuccess = <T>(data: T): { success: true; data: T } => {
    return {
        success: true,
        data,
    };
};
