import { z } from 'zod';

export const getBookingsSchema = z.object({
    organizationId: z.string(),
});
