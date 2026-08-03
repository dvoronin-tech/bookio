import type { EntireBookingFormField } from '#api/bookingForms/getEntireBookingFormById';
import type { SyncBookingFormFieldRequest } from '#api/bookingForms/bookingFormFields/syncBookingFormField';
import type { UpdateBookingFormRequest } from '#api/bookingForms/updateBookingForm';
import type { UpdateBookingFormStylesRequest } from '#api/bookingForms/bookingFormStyles/updateBookingFormStyles';

export type SyncBookingFormFieldItem = SyncBookingFormFieldRequest['fields'][number];
export type SyncBookingFormGroupFieldItem = Extract<SyncBookingFormFieldItem, { type: 'group' }>;

/** Next order among siblings sharing the same parentId (null = root level). */
export const getNextSiblingFieldOrder = (
    fields: SyncBookingFormFieldItem[],
    parentId: string | null,
) =>
    fields
        .filter((field) => field.parentId === parentId)
        .reduce((maxOrder, field) => Math.max(maxOrder, field.order), -1) + 1;

/** Reassigns sibling order (0..n-1) after drag-and-drop within one container. */
export const reorderBookingFormSiblingFields = (
    fields: SyncBookingFormFieldItem[],
    parentId: string | null,
    orderedSiblingIds: readonly (string | number)[],
): SyncBookingFormFieldItem[] => {
    const orderById = new Map(orderedSiblingIds.map((id, index) => [id, index]));

    return fields.map((field) => {
        const order = orderById.get(field.id);
        return field.parentId === parentId && order !== undefined ? { ...field, order } : field;
    });
};

/** Moves a field to another parent (null = root) and appends it after its new siblings. */
export const moveBookingFormFieldToParent = (
    fields: SyncBookingFormFieldItem[],
    fieldId: string | number,
    parentId: string | null,
): SyncBookingFormFieldItem[] => {
    const order = getNextSiblingFieldOrder(fields, parentId);
    return fields.map((field) => {
        if (field.id !== fieldId || field.type === 'group') return field;
        return { ...field, parentId, order };
    });
};

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

/**
 * Flattens nested booking-form fields into a sync payload list.
 * Root fields come first; for `group` fields, `childFields` are appended after the group itself.
 */
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

type ComparableBookingFormStylesSource = Pick<
    UpdateBookingFormStylesRequest,
    | 'bookingFormId'
    | 'primary'
    | 'bgMain'
    | 'bgSecondary'
    | 'borderColor'
    | 'textMain'
    | 'textSecondary'
>;

export const toComparableBookingFormStyles = (
    data: ComparableBookingFormStylesSource,
): UpdateBookingFormStylesRequest => ({
    bookingFormId: data.bookingFormId,
    primary: data.primary,
    bgMain: data.bgMain,
    bgSecondary: data.bgSecondary,
    borderColor: data.borderColor,
    textMain: data.textMain,
    textSecondary: data.textSecondary,
})