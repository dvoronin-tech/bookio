import type { SyncBookingFormFieldItem } from '#utils/dataPreparers/bookingFormPreparers';

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
    const orderById = new Map(
        orderedSiblingIds.map((id, index) => [id, index]),
    );

    return fields.map((field) => {
        const order = orderById.get(field.id);
        return field.parentId === parentId && order !== undefined
            ? { ...field, order }
            : field;
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
