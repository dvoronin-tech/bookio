import { createFactory } from 'hono/factory';
import { zValidator } from '@hono/zod-validator';
import { getBookingsByIdSchema } from '@/schemas/booking/get.schema.js';
import { db } from '@/db.js';
import { prepareError, prepareSuccess } from '@/utils/prepareResponse.js';

const factory = createFactory().createHandlers;

export const getBookingsById = factory(
    zValidator('query', getBookingsByIdSchema),
    async (c) => {
        try {
            const { bookingFormId } = c.req.valid('query');

            const bookings = await db.query.bookings.findMany({
                where: (booking, { eq }) =>
                    eq(booking.bookingFormId, bookingFormId),
                orderBy: (bookings, { desc }) => [desc(bookings.createdAt)],
            });

            if (!bookings.length)
                return c.json(prepareError('No bookings found'), 404);

            return c.json(prepareSuccess(bookings));
        } catch (e) {
            return c.json(prepareError('Failed to get bookings'));
        }
    },
);
