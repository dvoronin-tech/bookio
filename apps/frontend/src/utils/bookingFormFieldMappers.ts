import type { EntireBookingFormField } from '#api/bookingForms/getEntireBookingFormById';
import type { SyncBookingFormFieldRequest } from '#api/bookingForms/bookingFormFields/syncBookingFormField';

type SyncBookingFormFieldItem = SyncBookingFormFieldRequest['fields'][number];
type SyncableBookingFormField = Omit<EntireBookingFormField, 'bookingFormId' | 'childFields'>;

/** Next order among siblings sharing the same parentId (null = root level). */
export const getNextSiblingFieldOrder = (
    fields: SyncBookingFormFieldItem[],
    parentId: string | null,
) =>
    fields
        .filter((field) => field.parentId === parentId)
        .reduce((maxOrder, field) => Math.max(maxOrder, field.order), -1) + 1;

const toSyncBookingFormFieldItem = (field: SyncableBookingFormField): SyncBookingFormFieldItem =>
    field as SyncBookingFormFieldItem;

export const flattenBookingFormFields = (
    fields: EntireBookingFormField[],
): SyncBookingFormFieldItem[] =>
    fields.flatMap((field) => {
        const { bookingFormId: _, childFields, ...syncData } = field;
        const items = [toSyncBookingFormFieldItem(syncData)];

        if (field.type === 'group' && childFields?.length) {
            items.push(...childFields.map(toSyncBookingFormFieldItem));
        }

        return items;
    });

/** Maps configurator field entities to the sync-fields API payload. */
export const toSyncBookingFormFieldsRequest = (
    bookingFormId: string,
    fields: EntireBookingFormField[],
): SyncBookingFormFieldRequest => ({
    bookingFormId,
    fields: flattenBookingFormFields(fields),
});
