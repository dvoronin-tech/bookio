import type { FieldType } from './fields.js';

export type InputFieldParams = {
    placeholder?: string;
    helpText?: string;
};

export type DateFieldParams = {
    placeholder?: string;
    minYear?: number;
    maxYear?: number;
};

export type TimeFieldParams = {
    placeholder?: string;
    /** Earliest selectable time, "HH:mm" */
    min?: string;
    /** Latest selectable time, "HH:mm" */
    max?: string;
    /** Minutes step in the picker dropdown */
    step?: number;
};

export type TextAreaFieldParams = InputFieldParams & {
    rows?: number;
};

export type FieldOption = {
    label: string;
};

export type ChoiceFieldParams = {
    options: FieldOption[];
};

export type SelectFieldParams = ChoiceFieldParams & {
    defaultValue: string;
};

export type GroupFieldParams = {
    description?: string;
};

export type CheckboxFieldParams = {
    helpText?: string;
};

export type FileFieldParams = {
    placeholder?: string;
    accept?: string[];
    maxSizeMb?: number;
};

type FieldParamsMap = {
    text: InputFieldParams;
    number: InputFieldParams;
    file: FileFieldParams;
    image: FileFieldParams;
    url: InputFieldParams;
    phone: InputFieldParams;
    date: DateFieldParams;
    time: TimeFieldParams;
    email: InputFieldParams;
    checkbox: CheckboxFieldParams;
    select: SelectFieldParams;
    radio: ChoiceFieldParams;
    textarea: TextAreaFieldParams;
    group: GroupFieldParams;
};

export type FieldParamsByType<T extends FieldType> = FieldParamsMap[T];

/** Union of all possible params shapes (used for Drizzle jsonb.$type) */
export type FieldParams = FieldParamsByType<FieldType>;

export type BookingFormFieldRowBase = {
    id: string;
    bookingFormId: string;
    key: string;
    name: string;
    order: number;
    parentId: string | null;
};

export type BookingFormFieldRow<T extends FieldType = FieldType> =
    BookingFormFieldRowBase & {
        type: T;
        params: FieldParamsByType<T>;
    } & (T extends 'group' ? { required: false } : { required: boolean });

export type BookingFormFieldRowUnion =
    | BookingFormFieldRow<'text'>
    | BookingFormFieldRow<'number'>
    | BookingFormFieldRow<'file'>
    | BookingFormFieldRow<'image'>
    | BookingFormFieldRow<'url'>
    | BookingFormFieldRow<'phone'>
    | BookingFormFieldRow<'date'>
    | BookingFormFieldRow<'time'>
    | BookingFormFieldRow<'email'>
    | BookingFormFieldRow<'checkbox'>
    | BookingFormFieldRow<'select'>
    | BookingFormFieldRow<'radio'>
    | BookingFormFieldRow<'textarea'>
    | BookingFormFieldRow<'group'>;

/** Flat field item in PUT /fields/sync payload (`bookingFormId` is on the request root). */
export type BookingFormFieldSyncItem = {
    [T in FieldType]: Omit<BookingFormFieldRow<T>, 'id' | 'bookingFormId'> & {
        id?: string;
    };
}[FieldType];
