import { z } from 'zod';

export const updateBookingFormMetaSchema = z
    .object({
        bookingFormId: z.uuid(),
        title: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        additionalMetaData: z.record(z.string(), z.string()).optional(),
    })
    .refine(
        (data) =>
            Object.entries(data).some(([key, value]) => {
                if (key === 'bookingFormId') return false;

                return value !== undefined;
            }),
        {
            message: 'At least one field must be provided',
        },
    )
    .refine((data) => {
        if (!data.additionalMetaData) return true;

        return Object.entries(data.additionalMetaData).every(([key, value]) => {
            return key.trim().length > 0 && value.trim().length > 0;
        });
    }, {
        message: 'All additional meta data fields must have a key and value, and neither can be empty',
        path: ['additionalMetaData'],
    })
