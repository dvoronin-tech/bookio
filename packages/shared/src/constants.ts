export const ERROR_CODES = [
    'not_found',
    'name_taken',
    'slug_taken',
    'invalid_password',
    'already_member',
    'forbidden',
    'inactive',
    'field_wrong_form',
    'parent_not_group',
    'validation',
    'internal',
    'unknown',
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

const errorCodes: ReadonlySet<string> = new Set(ERROR_CODES);

export const isErrorCode = (value: unknown): value is ErrorCode =>
    typeof value === 'string' && errorCodes.has(value);

/** Known codes pass through. Any other string is `unknown`. A missing code is `internal`. */
export const readErrorCode = (value: unknown): ErrorCode => {
    if (isErrorCode(value)) {
        return value;
    }

    return typeof value === 'string' ? 'unknown' : 'internal';
};
