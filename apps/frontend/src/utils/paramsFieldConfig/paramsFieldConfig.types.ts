import { fieldOptionSchema } from '@bookio/backend/schemas';
import type { z } from 'zod';

import type { AcceptOptions } from './imageAcceptOptions';

export type FieldOptionKey = keyof z.infer<typeof fieldOptionSchema>;

export type BaseUIFieldConfig = {
    label: string;
    type: 'text' | 'checkbox';
    required?: boolean;
};

export interface BaseUIFieldType extends BaseUIFieldConfig {
    name: string;
}

export type NumberUIField = Omit<BaseUIFieldConfig, 'type'> & {
    type: 'number';
    min?: number;
    max?: number;
};

export interface OptionsUIField {
    label: string;
    type: 'options';
    required?: boolean;
    itemFields: Partial<Record<FieldOptionKey, BaseUIFieldConfig>>;
}

// export interface FileUiField {
//     label: string;
//     type: 'select';
//     options: typeof fileAcceptOptions;
// }

export interface ImageUiField {
    label: string;
    type: 'select';
    required?: boolean;
    options: AcceptOptions;
}

export type ChoiceUIField = BaseUIFieldType | OptionsUIField;
export type NumberUIFieldType = NumberUIField & { name: string };
export type TextAreaUIField = BaseUIFieldType | NumberUIFieldType;
// export type FileUIField = BaseUIFieldType | FileUiField;
export type ImageUIField = BaseUIFieldType | NumberUIFieldType | ImageUiField;

export type ParamsFieldConfig = {
    text: BaseUIFieldType[];
    email: BaseUIFieldType[];
    phone: BaseUIFieldType[];
    url: BaseUIFieldType[];
    number: BaseUIFieldType[];
    date: BaseUIFieldType[];
    time: BaseUIFieldType[];
    textarea: TextAreaUIField[];
    select: ChoiceUIField[];
    radio: ChoiceUIField[];
    checkbox: BaseUIFieldType[];
    // file: FileUIField[];
    image: ImageUIField[];
    group: BaseUIFieldType[];
};
