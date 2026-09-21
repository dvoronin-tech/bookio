import { createFactory } from 'hono/factory';
import { zValidator } from '@hono/zod-validator';
import { getBookingsSchema } from '@/schemas/booking/get.schema.js';
import { db } from '@/db.js';
import { prepareError, prepareSuccess } from '@/utils/prepareResponse.js';

const factory = createFactory().createHandlers;

export const getOrganizationBookings = factory(
    zValidator('query', getBookingsSchema),
    async (c) => {
        try {
            const { organizationId } = c.req.valid('query');

            const bookingFormIdsObj = await db.query.bookingForms.findMany({
                where: (bookingForm, { eq }) =>
                    eq(bookingForm.organizationId, organizationId),
                columns: { id: true },
            });

            const bookingFormIds = bookingFormIdsObj.map(({ id }) => id);

            if (!bookingFormIds.length)
                return c.json(prepareError('No booking forms found'), 404);

            const bookings = await db.query.bookings.findMany({
                where: (booking, { inArray }) =>
                    inArray(booking.bookingFormId, bookingFormIds),
                with: {
                    bookingForm: {
                        columns: {
                            id: true,
                        },
                    },
                },
                orderBy: (bookings, { asc }) => [asc(bookings.createdAt)],
            });

            if (!bookings.length)
                return c.json(prepareError('No bookings found'), 404);

            return c.json(prepareSuccess(bookings));
        } catch (e) {
            return c.json(prepareError('Failed to get booking form'), 500);
        }
    },
);
