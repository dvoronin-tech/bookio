import { createFactory } from 'hono/factory';
import { zValidator } from '@hono/zod-validator';
import { createBookingSchema } from '@/schemas/booking/create.schema.js';

const factory = createFactory().createHandlers;

export const createBookingHandler = factory(
    zValidator('json', createBookingSchema),
    async (c) => {
        const { bookingFormId, data } = c.req.valid('json');
    },
);
