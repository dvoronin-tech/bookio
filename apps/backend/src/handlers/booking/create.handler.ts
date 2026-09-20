import { createFactory } from 'hono/factory';
import { zValidator } from '@hono/zod-validator';
import { createBookingSchema } from '@/schemas/booking/create.schema.js';
import { db } from '@/db.js';
import { bookings } from '@bookio/db';
import { prepareError, prepareSuccess } from '@/utils/prepareResponse.js';

const factory = createFactory().createHandlers;

export const createBookingHandler = factory(
    zValidator('json', createBookingSchema),
    async (c) => {
        try {
            const { bookingFormId, data } = c.req.valid('json');

            const [booking] = await db
                .insert(bookings)
                .values({ bookingFormId, data })
                .returning();

            if (!booking)
                return c.json(prepareError('Failed to create booking'), 500);

            return c.json(prepareSuccess(booking), 201);
        } catch (e) {
            console.error(e);
            return c.json(prepareError('Failed to create booking'), 500);
        }
    },
);
