import { db } from '@/db.js';

type IsBookingFormExistsParams = {
    organizationId: string;
    name?: string;
    slug?: string;
};

export const isBookingFormExists = async ({
    organizationId,
    name,
    slug,
}: IsBookingFormExistsParams) => {
    if (!name && !slug) {
        throw new Error('Name and slug must be a string');
    }

    const bookingForm = await db.query.bookingForms.findFirst({
        where: (bookingForms, { eq, and }) =>
            and(
                eq(bookingForms.organizationId, organizationId),
                name !== undefined ? eq(bookingForms.name, name) : eq(bookingForms.slug, slug!),
            ),
        columns: { id: true },
    });

    return !!bookingForm;
};
