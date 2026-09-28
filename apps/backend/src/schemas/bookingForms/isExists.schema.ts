import { z } from 'zod';
import { slugSchema } from '@/schemas/shared/slug.schema.js';

export const isBookingFormExistsSchema = z
    .object({
        organizationId: z.uuid(),
        name: z.string().min(1).max(255).optional(),
        slug: slugSchema.optional(),
    })
    .refine((data) => data.name !== undefined || data.slug !== undefined, {
        message: 'Either name or slug must be provided',
    });
