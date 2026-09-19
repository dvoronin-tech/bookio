import { z } from 'zod';
import type { BookingFormUpdate } from '@bookio/db';

export const updateBookingFormSchema = z
    .object({
        id: z.uuid(),
        name: z.string().min(1).max(255).optional(),
        description: z.string().optional().nullable(),
        markRequiredFields: z.boolean().optional(),
        isActive: z.boolean().optional(),
        slug: z.string().min(1).max(60).optional(),
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
    ) satisfies z.ZodType<BookingFormUpdate>;
