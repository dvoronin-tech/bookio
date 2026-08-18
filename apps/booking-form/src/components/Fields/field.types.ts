import type { FieldValues, UseFormRegister } from 'react-hook-form';
import type { BookingFormBySlugsType } from '#/api/bookingForms/getBookingFormBySlugs';

export type BookingFormField = BookingFormBySlugsType['fields'][number];
export type FieldType = BookingFormField['type'];
export type LeafFieldType = Exclude<FieldType, 'group'>;

export type FieldRendererProps<T extends LeafFieldType = LeafFieldType> = {
    field: BookingFormField & { type: T };
};

export type FieldControlProps<T extends LeafFieldType = LeafFieldType> = FieldRendererProps<T> & {
    register: UseFormRegister<FieldValues>;
};

export function isGroupField(
    field: BookingFormField,
): field is BookingFormField & { type: 'group' } {
    return field.type === 'group';
}

export function isLeafField(
    field: BookingFormField,
): field is BookingFormField & { type: LeafFieldType } {
    return field.type !== 'group';
}
