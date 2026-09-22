import { z } from 'zod';

export const getOrganizationBookingsSchema = z.object({
    organizationId: z.string(),
});

export const getBookingsByIdSchema = z.object({
    bookingFormId: z.string(),
});
