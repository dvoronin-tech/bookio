import { createFactory } from 'hono/factory';
import { zValidator } from '@hono/zod-validator';
import { db } from '@/db.js';
import { prepareError, prepareSuccess } from '@/utils/prepareResponse.js';
import {
    getBookingFormBySlugsSchema,
    getBookingFormSchema,
    getBookingFormsSchema,
} from '@/schemas/bookingForms/get.schema.js';

const factory = createFactory().createHandlers;

export const getBookingFormsHandler = factory(
    zValidator('query', getBookingFormsSchema),
    async (c) => {
        try {
            const { organizationId } = c.req.valid('query');

            const forms = await db.query.bookingForms.findMany({
                where: (bookingForms, { eq }) => eq(bookingForms.organizationId, organizationId),
            });

            return c.json(prepareSuccess(forms));
        } catch (error) {
            return c.json(prepareError('Failed to get booking forms'), 500);
        }
    },
);

export const getBookingFormHandler = factory(
    zValidator('query', getBookingFormSchema),
    async (c) => {
        try {
            const { bookingFormId } = c.req.valid('query');

            const form = await db.query.bookingForms.findFirst({
                where: (bookingForms, { eq }) => eq(bookingForms.id, bookingFormId),
            });

            return c.json(prepareSuccess(form));
        } catch (error) {
            return c.json(prepareError('Failed to get booking form'), 500);
        }
    },
);

export const getEntireBookingFormByIdHandler = factory(
    zValidator('query', getBookingFormSchema),
    async (c) => {
        try {
            const { bookingFormId } = c.req.valid('query');

            const form = await db.query.bookingForms.findFirst({
                where: (bookingForms, { eq }) => eq(bookingForms.id, bookingFormId),
                with: {
                    fields: {
                        where: (field, { isNull }) => isNull(field.parentId),
                        with: {
                            childFields: true,
                        },
                        orderBy: (field, { asc }) => [asc(field.order)],
                    },
                    metaData: true,
                    styles: true,
                },
            });

            if (!form) {
                return c.json(prepareError('Booking form not found'), 404);
            }

            return c.json(prepareSuccess(form));
        } catch (error) {
            return c.json(prepareError('Failed to get entire booking form by id'), 500);
        }
    },
);

export const getBookingFromBySlugsHandler = factory(
    zValidator('query', getBookingFormBySlugsSchema),
    async (c) => {
        try {
            const { organizationSlug, bookingFormSlug } = c.req.valid('query');

            const data = await db.query.organizations.findFirst({
                where: (org, { eq }) => eq(org.slug, organizationSlug),
                with: {
                    bookingForms: {
                        where: (bookingForm, { eq }) => eq(bookingForm.slug, bookingFormSlug),
                        with: {
                            fields: true
                        }
                    },
                }
            })

            if (!data) {
                return c.json(prepareError('Organization not found', 'ORGANIZATION_NOT_FOUND'), 404);
            }

            if (!data.bookingForms.length) {
                return c.json(prepareError('Booking form not found', 'BOOKING_FORM_NOT_FOUND'), 404);
            }

            const bookingForm = data.bookingForms[0];
            
            if (bookingForm.isActive === false) {
                return c.json(prepareError('Booking form is not active', 'BOOKING_FORM_NOT_ACTIVE'), 404);
            }

            return c.json(prepareSuccess(bookingForm));

        } catch (error) {
            return c.json(prepareError('Failed to get booking form by slugs'), 500);
        }
    },
);
