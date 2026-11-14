import { createFactory } from 'hono/factory';
import { validate } from '@/utils/validate.js';
import { prepareError, prepareSuccess } from '@/utils/prepareResponse.js';
import { isBookingFormExists } from '@/utils/isBookingFormExists.js';
import { isBookingFormExistsSchema } from '@/schemas/bookingForms/isExists.schema.js';

const factory = createFactory().createHandlers;

export const isBookingFormExistsHandler = factory(
    validate('json', isBookingFormExistsSchema),
    async (c) => {
        try {
            const { name, slug, organizationId } = c.req.valid('json');

            const isExists = await isBookingFormExists({ name, slug, organizationId });

            return c.json(prepareSuccess(isExists));
        } catch (error) {
            return c.json(
                prepareError('Failed to check if booking form exists', 'internal'),
                500,
            );
        }
    },
);
