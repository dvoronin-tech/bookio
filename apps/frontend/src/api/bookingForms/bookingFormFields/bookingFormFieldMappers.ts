import type { EntireBookingFormField } from '../getEntireBookingFormById';
import type { SyncBookingFormFieldRequest } from './syncBookingFormField';

type SyncBookingFormFieldItem = SyncBookingFormFieldRequest['fields'][number];
type SyncableBookingFormField = Omit<EntireBookingFormField, 'bookingFormId' | 'childFields'>;

const toSyncBookingFormFieldItem = (field: SyncableBookingFormField): SyncBookingFormFieldItem =>
    field as SyncBookingFormFieldItem;

const flattenBookingFormFields = (fields: EntireBookingFormField[]): SyncBookingFormFieldItem[] =>
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
