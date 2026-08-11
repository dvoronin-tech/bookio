import { z } from 'zod';
import { slugSchema } from '@/schemas/shared/slug.schema.js';

export const createBookingFormSchema = z.object({
    organizationId: z.uuid(),
    name: z.string().min(1).max(255),
    description: z.string().optional().nullable(),
    slug: slugSchema,
    primary: z.string().min(1),
    bgMain: z.string().min(1),
    bgSecondary: z.string().min(1),
    borderColor: z.string().min(1),
    textMain: z.string().min(1),
    textSecondary: z.string().min(1),
    metaTitle: z.string().min(1),
    metaDescription: z.string().min(1),
    additionalMeta: z.array(
        z.object({
            key: z.string().min(1),
            value: z.string().min(1),
        }),
    ),
});
