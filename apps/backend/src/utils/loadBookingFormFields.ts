import { db } from '@/db.js';

/**
 * Loads ALL fields of a booking form as a flat list (group membership via `parentId`).
 * No root-only filter, no nested `childFields` — grouping is derived by consumers.
 */
export const loadBookingFormFields = (bookingFormId: string) =>
    db.query.bookingFormFields.findMany({
        where: (field, { eq }) => eq(field.bookingFormId, bookingFormId),
        orderBy: (field, { asc }) => [asc(field.order)],
    });
