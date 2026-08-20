import type { Control, FieldValues, UseFormRegister } from 'react-hook-form';
import type { BookingFormFieldRowUnion } from '@bookio/backend/schemas';
import type { BookingFormBySlugsType } from '#/api/bookingForms/getBookingFormBySlugs';

export type ApiField = BookingFormBySlugsType['fields'][number];

export type BookingFormField = Omit<ApiField, 'type' | 'params'> & BookingFormFieldRowUnion;
export type FieldType = BookingFormField['type'];
export type LeafFieldType = Exclude<FieldType, 'group'>;

export type FieldRendererProps<T extends LeafFieldType = LeafFieldType> = {
    field: Extract<BookingFormField, { type: T }>;
};

export type FieldControlProps<T extends LeafFieldType = LeafFieldType> = FieldRendererProps<T> & {
    register: UseFormRegister<FieldValues>;
    control: Control<FieldValues>;
};

export function isGroupField(
    field: ApiField,
): field is Extract<BookingFormField, { type: 'group' }> {
    return field.type === 'group';
}

export function isLeafField(
    field: ApiField,
): field is Extract<BookingFormField, { type: LeafFieldType }> {
    return field.type !== 'group';
}
