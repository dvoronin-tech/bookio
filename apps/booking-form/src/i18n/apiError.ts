import { readErrorCode, type ErrorCode } from '@bookio/backend/constants';
import { m } from '../paraglide/messages.js';

export type ApiIssue = {
    path: Array<string | number>;
    code: string;
    message: string;
};

type ErrorBody = {
    code?: unknown;
    error?: unknown;
    issues?: unknown;
};

type FieldErrorSetter = (
    name: string,
    error: { type: string; message: string },
) => void;

export class ApiError extends Error {
    readonly code: ErrorCode;
    readonly english: string;
    readonly issues?: ApiIssue[];

    constructor(body: ErrorBody, fallbackEnglish = 'Request failed') {
        const english =
            typeof body.error === 'string' ? body.error : fallbackEnglish;
        console.error(english);

        const code = readErrorCode(body.code);
        const issues =
            code === 'validation'
                ? ApiError.readIssues(body.issues)
                : undefined;
        const message =
            code === 'validation'
                ? issues?.map((issue) => issue.message).join('\n') ||
                  ApiError.translateCode(code)
                : ApiError.translateCode(code);

        super(message);
        this.name = 'ApiError';
        this.code = code;
        this.english = english;
        this.issues = issues;
    }

    static isApiError(error: unknown): error is ApiError {
        return error instanceof ApiError;
    }

    applyValidationIssues(setError: FieldErrorSetter): boolean {
        if (this.code !== 'validation' || !this.issues?.length) {
            return false;
        }

        let applied = false;

        for (const issue of this.issues) {
            const name = [...issue.path]
                .reverse()
                .find((part) => typeof part === 'string');
            if (!name) {
                continue;
            }

            setError(name, { type: issue.code, message: issue.message });
            applied = true;
        }

        return applied;
    }

    private static translateCode(code: ErrorCode) {
        switch (code) {
            case 'not_found':
                return m.err_not_found();
            case 'name_taken':
                return m.err_name_taken();
            case 'slug_taken':
                return m.err_slug_taken();
            case 'invalid_password':
                return m.err_invalid_password();
            case 'already_member':
                return m.err_already_member();
            case 'forbidden':
                return m.err_forbidden();
            case 'inactive':
                return m.err_inactive();
            case 'field_wrong_form':
                return m.err_field_wrong_form();
            case 'parent_not_group':
                return m.err_parent_not_group();
            case 'internal':
                return m.err_internal();
            case 'validation':
                return m.err_validation();
            case 'unknown':
                return m.unknown_error();
            default: {
                const unexpected: never = code;
                return unexpected;
            }
        }
    }

    private static translateIssueCode(code: string) {
        switch (code) {
            case 'invalid_type':
                return m.issue_invalid_type();
            case 'too_big':
                return m.issue_too_big();
            case 'too_small':
                return m.issue_too_small();
            case 'invalid_format':
                return m.issue_invalid_format();
            case 'not_multiple_of':
                return m.issue_not_multiple_of();
            case 'unrecognized_keys':
                return m.issue_unrecognized_keys();
            case 'invalid_union':
                return m.issue_invalid_union();
            case 'invalid_key':
                return m.issue_invalid_key();
            case 'invalid_element':
                return m.issue_invalid_element();
            case 'invalid_value':
                return m.issue_invalid_value();
            case 'custom':
                return m.issue_custom();
            default:
                return m.unknown_error();
        }
    }

    private static readIssues(value: unknown): ApiIssue[] | undefined {
        if (!Array.isArray(value)) {
            return undefined;
        }

        const issues: ApiIssue[] = [];

        for (const item of value) {
            if (typeof item !== 'object' || item === null) {
                continue;
            }

            const record = item as Record<string, unknown>;
            const code =
                typeof record.code === 'string' ? record.code : 'custom';
            const path = Array.isArray(record.path)
                ? record.path.filter(
                      (part): part is string | number =>
                          typeof part === 'string' || typeof part === 'number',
                  )
                : [];

            issues.push({
                path,
                code,
                message: ApiError.translateIssueCode(code),
            });
        }

        return issues.length > 0 ? issues : undefined;
    }
}
