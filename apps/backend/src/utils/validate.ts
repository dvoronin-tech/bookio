import type { ValidationTargets } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { ZodType } from 'zod';
import type { ErrorCode } from '@bookio/shared/constants';

type ValidationIssue = {
    path: Array<string | number>;
    code: string;
    params?: Record<string, unknown>;
};

type RawIssue = {
    path: PropertyKey[];
    message: string;
    code?: string;
};

const SKIPPED_ISSUE_KEYS = new Set([
    'code',
    'path',
    'message',
    'input',
    'errors',
    'issues',
    'inst',
]);

const isJsonValue = (value: unknown): boolean => {
    if (
        value === null ||
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
    ) {
        return true;
    }

    if (Array.isArray(value)) {
        return value.every(isJsonValue);
    }

    if (typeof value === 'object') {
        return Object.values(value).every(isJsonValue);
    }

    return false;
};

export const toValidationIssue = (issue: RawIssue): ValidationIssue => {
    const params: Record<string, unknown> = {};
    const record = issue as unknown as Record<string, unknown>;

    for (const [key, value] of Object.entries(record)) {
        if (SKIPPED_ISSUE_KEYS.has(key) || value === undefined) {
            continue;
        }

        if (typeof value === 'bigint') {
            params[key] = value.toString();
            continue;
        }

        if (isJsonValue(value)) {
            params[key] = value;
        }
    }

    return {
        path: issue.path.map((part) =>
            typeof part === 'symbol' ? part.toString() : part,
        ),
        code: issue.code ?? 'custom',
        ...(Object.keys(params).length > 0 ? { params } : {}),
    };
};

export const validationErrorBody = (issues: readonly RawIssue[]) => {
    return {
        success: false as const,
        code: 'validation' satisfies ErrorCode,
        error: 'Validation failed',
        issues: issues.map(toValidationIssue),
    };
};

export const validate = <
    T extends ZodType,
    Target extends keyof ValidationTargets,
>(
    target: Target,
    schema: T,
) =>
    zValidator(target, schema, (result, c) => {
        if (!result.success) {
            return c.json(
                validationErrorBody(result.error.issues as readonly RawIssue[]),
                400,
            );
        }
    });
