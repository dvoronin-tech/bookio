import { z } from 'zod';

export const slugSchema = z
    .string()
    .min(1, 'Slug is required')
    .max(60, 'Slug must be at most 60 characters')
    .regex(/^[a-z0-9][a-z0-9-_]*$/, {
        message:
            'Slug must use only lowercase English letters, numbers, hyphens, and underscores (no spaces)',
    });
