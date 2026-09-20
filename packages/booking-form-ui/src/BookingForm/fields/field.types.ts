import type {
    BookingFormFieldRowUnion,
    FieldParams,
    FieldType,
} from '@bookio/db';

export type BookingFormFieldInput = {
    id: string;
    parentId: string | null;
    order: number;
    name: string;
    key: string;
    required?: boolean;
    type: FieldType;
    params?: FieldParams;
};

export type BookingFormField = Omit<BookingFormFieldInput, 'type' | 'params'> &
    BookingFormFieldRowUnion;
export type LeafFieldType = Exclude<FieldType, 'group'>;

export type FieldRendererProps<T extends LeafFieldType = LeafFieldType> = {
    field: Extract<BookingFormField, { type: T }>;
};

export function isGroupField(
    field: BookingFormFieldInput,
): field is Extract<BookingFormField, { type: 'group' }> {
    return field.type === 'group';
}

export function isLeafField(
    field: BookingFormFieldInput,
): field is Extract<BookingFormField, { type: LeafFieldType }> {
    return field.type !== 'group';
}
