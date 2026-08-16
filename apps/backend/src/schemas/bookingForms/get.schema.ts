import { z } from 'zod';
import { slugSchema } from '../shared/slug.schema.js';

export const getBookingFormsSchema = z.object({
    organizationId: z.uuid(),
});

export const getBookingFormSchema = z.object({
    bookingFormId: z.uuid(),
});

export const getBookingFormBySlugsSchema = z.object({
    organizationSlug: slugSchema,
    bookingFormSlug: slugSchema,
});
