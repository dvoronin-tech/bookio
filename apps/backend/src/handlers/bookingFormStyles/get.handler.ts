import { createFactory } from 'hono/factory';
import { validate } from '@/utils/validate.js';
import { db } from '@/db.js';
import { prepareError, prepareSuccess } from '@/utils/prepareResponse.js';
import { getBookingFormStylesSchema } from '@/schemas/bookingFormStyles/get.schema.js';

const factory = createFactory().createHandlers;

export const getBookingFormStylesHandler = factory(
    validate('query', getBookingFormStylesSchema),
    async (c) => {
        try {
            const { bookingFormId } = c.req.valid('query');

            const styles = await db.query.bookingFormStyles.findFirst({
                where: (styles, { eq }) => eq(styles.bookingFormId, bookingFormId),
            });

            if (!styles) {
                return c.json(prepareError('Booking form styles not found', 'not_found'), 404);
            }

            return c.json(prepareSuccess(styles));
        } catch (error) {
            return c.json(prepareError('Failed to get booking form styles', 'internal'), 500);
        }
    },
);
