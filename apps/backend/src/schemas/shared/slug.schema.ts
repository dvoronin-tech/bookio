import { z } from 'zod';

export const slugSchema = z
    .string()
    .min(1)
    .max(60)
    .regex(/^[a-z0-9][a-z0-9-_]*$/, {
        message:
            'Slug must use only lowercase English letters, numbers, hyphens, and underscores (no spaces)',
    });
