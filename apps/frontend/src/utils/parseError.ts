import type { ZodIssue } from 'zod';

type SerializedZodError = {
    name: string;
    message: string;
};

type ApiErrorBody = {
    success: false;
    error: string | SerializedZodError | { issues: ZodIssue[] };
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null;
};

const formatIssueMessages = (issues: ZodIssue[]): string | null => {
    const messages = issues.map((issue) => issue.message).filter(Boolean);

    return messages.length > 0 ? messages.join('\n') : null;
};

const parseIssuesJson = (value: string): ZodIssue[] | null => {
    const trimmed = value.trim();
    if (!trimmed.startsWith('[')) {
        return null;
    }

    try {
        const parsed: unknown = JSON.parse(trimmed);
        if (!Array.isArray(parsed) || parsed.length === 0) {
            return null;
        }

        return parsed as ZodIssue[];
    } catch {
        return null;
    }
};

const extractIssues = (error: unknown): ZodIssue[] | null => {
    if (typeof error === 'string') {
        return parseIssuesJson(error);
    }

    if (!isRecord(error)) {
        return null;
    }

    if (Array.isArray(error.issues)) {
        return error.issues as ZodIssue[];
    }

    if (typeof error.message === 'string') {
        return parseIssuesJson(error.message);
    }

    return null;
};

/**
 * 
 * @param error - Zod error
 * @returns Formatted error message
 */
export const formatZodError = (error: unknown): string | null => {
    const issues = extractIssues(error);
    if (!issues) {
        return null;
    }

    return formatIssueMessages(issues);
};

export const parseError = (body: ApiErrorBody): string => {
    const zodMessage = formatZodError(body.error);
    if (zodMessage) {
        return zodMessage;
    }

    if (typeof body.error === 'string') {
        return body.error;
    }

    const errorRecord: unknown = body.error;
    if (isRecord(errorRecord) && typeof errorRecord.message === 'string') {
        return errorRecord.message;
    }

    return 'Unknown error';
};

export const parseZodErrorBody = (body: unknown): string | null => {
    if (!isRecord(body)) {
        return null;
    }

    if ('error' in body) {
        return formatZodError(body.error);
    }

    return formatZodError(body);
};
