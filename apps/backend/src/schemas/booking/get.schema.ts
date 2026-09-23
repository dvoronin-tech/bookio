import { z } from 'zod';

export const getBookingsByIdSchema = z.object({
    bookingFormId: z.string(),
});
