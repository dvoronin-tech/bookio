import { createFactory } from 'hono/factory';
import { validate } from '@/utils/validate.js';
import { db } from '@/db.js';
import { prepareError, prepareSuccess } from '@/utils/prepareResponse.js';
import {
    getBookingFormBySlugsSchema,
    getBookingFormSchema,
    getBookingFormsSchema,
} from '@/schemas/bookingForms/get.schema.js';

const factory = createFactory().createHandlers;

export const getBookingFormsHandler = factory(
    validate('query', getBookingFormsSchema),
    async (c) => {
        try {
            const { organizationId } = c.req.valid('query');

            const forms = await db.query.bookingForms.findMany({
                where: (bookingForms, { eq }) =>
                    eq(bookingForms.organizationId, organizationId),
            });

            return c.json(prepareSuccess(forms));
        } catch (error) {
            return c.json(prepareError('Failed to get booking forms', 'internal'), 500);
        }
    },
);

export const getBookingFormHandler = factory(
    validate('query', getBookingFormSchema),
    async (c) => {
        try {
            const { bookingFormId } = c.req.valid('query');

            const form = await db.query.bookingForms.findFirst({
                where: (bookingForms, { eq }) =>
                    eq(bookingForms.id, bookingFormId),
                with: {
                    fields: {
                        orderBy: (field, { asc }) => [asc(field.order)],
                    },
                    metaData: true,
                    styles: true,
                },
            });

            if (!form) {
                return c.json(prepareError('Booking form not found', 'not_found'), 404);
            }

            return c.json(prepareSuccess(form));
        } catch (error) {
            return c.json(prepareError('Failed to get booking form', 'internal'), 500);
        }
    },
);

export const getBookingFromBySlugsHandler = factory(
    validate('query', getBookingFormBySlugsSchema),
    async (c) => {
        try {
            const { organizationSlug, bookingFormSlug } = c.req.valid('query');

            const organization = await db.query.organizations.findFirst({
                where: (org, { eq }) => eq(org.slug, organizationSlug),
                with: {
                    bookingForms: {
                        where: (bookingForm, { eq }) =>
                            eq(bookingForm.slug, bookingFormSlug),
                        with: {
                            fields: {
                                orderBy: (field, { asc }) => [asc(field.order)],
                            },
                            styles: true,
                            metaData: true,
                        },
                    },
                },
            });

            if (!organization) {
                return c.json(
                    prepareError('Organization not found', 'not_found'),
                    404,
                );
            }

            if (!organization.bookingForms.length) {
                return c.json(
                    prepareError('Booking form not found', 'not_found'),
                    404,
                );
            }

            const bookingForm = organization.bookingForms[0];

            if (!bookingForm.isActive) {
                return c.json(
                    prepareError('Booking form is not active', 'inactive'),
                    404,
                );
            }

            return c.json(prepareSuccess(bookingForm));
        } catch (error) {
            return c.json(
                prepareError('Failed to get booking form by slugs', 'internal'),
                500,
            );
        }
    },
);
