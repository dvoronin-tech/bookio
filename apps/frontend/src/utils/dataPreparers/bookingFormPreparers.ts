import type { EntireBookingFormField } from '#api/bookingForms/getEntireBookingFormById';
import type { SyncBookingFormFieldRequest } from '#api/bookingForms/bookingFormFields/syncBookingFormField';
import type { UpdateBookingFormRequest } from '#api/bookingForms/updateBookingForm';

type SyncBookingFormFieldItem = SyncBookingFormFieldRequest['fields'][number];

/** Next order among siblings sharing the same parentId (null = root level). */
export const getNextSiblingFieldOrder = (
    fields: SyncBookingFormFieldItem[],
    parentId: string | null,
) =>
    fields
        .filter((field) => field.parentId === parentId)
        .reduce((maxOrder, field) => Math.max(maxOrder, field.order), -1) + 1;

const toSyncFieldItem = ({
    id,
    name,
    type,
    key,
    required,
    parentId,
    order,
    params,
}: Pick<
    EntireBookingFormField,
    'id' | 'name' | 'type' | 'key' | 'required' | 'parentId' | 'order' | 'params'
>): SyncBookingFormFieldItem =>
    ({ id, name, type, key, required, parentId, order, params }) as SyncBookingFormFieldItem;

export const flattenBookingFormFields = (
    fields: EntireBookingFormField[],
): SyncBookingFormFieldItem[] =>
    fields.flatMap((field) => {
        const items = [toSyncFieldItem(field)];

        if (field.type === 'group' && field.childFields?.length) {
            items.push(...field.childFields.map(toSyncFieldItem));
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

export const toComparableBookingForm = (
    data: Pick<
        UpdateBookingFormRequest,
        'bookingFormId' | 'name' | 'description' | 'isActive' | 'slug'
    >,
): UpdateBookingFormRequest => ({
    bookingFormId: data.bookingFormId,
    name: data.name?.trim() ?? '',
    description: data.description?.trim() || null,
    isActive: data.isActive ?? false,
    slug: data.slug?.trim() ?? '',
});

export const toSaveFieldsPayload = (
    bookingFormId: string,
    bookingFormFields: SyncBookingFormFieldRequest,
): SyncBookingFormFieldRequest => ({
    bookingFormId,
    fields: bookingFormFields.fields,
});
