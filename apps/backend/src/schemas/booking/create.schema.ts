import { z } from 'zod';
import type { BookingInsert } from '@bookio/db';

export const createBookingSchema = z.object({
    bookingFormId: z.uuid(),
    data: z.record(z.string(), z.unknown()),
}) satisfies z.ZodType<BookingInsert>;
