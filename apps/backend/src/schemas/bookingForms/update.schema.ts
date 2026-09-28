import { z } from 'zod';
import type { BookingFormSettingsUpdate } from '@bookio/db';
import { slugSchema } from '@/schemas/shared/slug.schema.js';

export const updateBookingFormSchema = z
    .object({
        id: z.uuid(),
        name: z.string().min(1).max(255).optional(),
        description: z.string().optional().nullable(),
        markRequiredFields: z.boolean().optional(),
        isActive: z.boolean().optional(),
        slug: slugSchema.optional(),
    })
    .refine(
        (data) =>
            Object.entries(data).some(([key, value]) => {
                if (key === 'id') return false;

                return value !== undefined;
            }),
        {
            message: 'At least one field must be provided',
        },
    ) satisfies z.ZodType<BookingFormSettingsUpdate>;
