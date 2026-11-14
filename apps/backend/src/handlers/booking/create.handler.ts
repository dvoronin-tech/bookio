import { createFactory } from 'hono/factory';
import { validate } from '@/utils/validate.js';
import { createBookingSchema } from '@/schemas/booking/create.schema.js';
import { db } from '@/db.js';
import { bookingForms, bookings } from '@bookio/db';
import { eq } from 'drizzle-orm';
import { prepareError } from '@/utils/prepareResponse.js';

const factory = createFactory().createHandlers;

export const createBookingHandler = factory(
    validate('json', createBookingSchema),
    async (c) => {
        try {
            const { bookingFormId, data } = c.req.valid('json');

            await db.transaction(async (tx) => {
                await tx.insert(bookings).values({ bookingFormId, data });

                const bookingForm = await tx.query.bookingForms.findFirst({
                    where: (bookingForm, { eq }) =>
                        eq(bookingForm.id, bookingFormId),
                });

                if (!bookingForm) {
                    return tx.rollback();
                }

                await tx
                    .update(bookingForms)
                    .set({ totalBookings: bookingForm.totalBookings + 1 })
                    .where(eq(bookingForms.id, bookingFormId))
                    .returning();
            });

            return c.body(null, 204);
        } catch (e) {
            console.error(e);
            return c.json(prepareError('Failed to create booking', 'internal'), 500);
        }
    },
);
