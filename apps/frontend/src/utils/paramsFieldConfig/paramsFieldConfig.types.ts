import { fieldOptionSchema } from '@bookio/backend/schemas';
import type { z } from 'zod';

export type FieldOptionKey = keyof z.infer<typeof fieldOptionSchema>;

type ParamUIFieldBase = {
    formName: string;
    label: string;
    required?: boolean;
};

export type BaseUIFieldType = ParamUIFieldBase & {
    type: 'text' | 'checkbox';
};

export type BaseUIFieldConfig = Omit<BaseUIFieldType, 'formName'>;

export type NumberUIField = ParamUIFieldBase & {
    type: 'number';
    min?: number;
    max?: number;
};

export type TimeUIField = ParamUIFieldBase & {
    type: 'time';
};

export type OptionsUIField = ParamUIFieldBase & {
    type: 'options';
    itemFields: Partial<Record<FieldOptionKey, BaseUIFieldConfig>>;
};

// export type FileUiField = ParamUIFieldBase & {
//     type: 'select';
//     options: typeof fileAcceptOptions;
// };

export type SelectUIField = ParamUIFieldBase & {
    type: 'select';
    multiple?: boolean;
    options: (string | number)[];
    searchPlaceholder?: string;
    emptyOptionsText?: string;
    withSearch?: boolean;
};

export type ChoiceUIField = BaseUIFieldType | OptionsUIField;
export type RangeUIField = ParamUIFieldBase & {
    type: 'range';
};

export type DateParamUIField = BaseUIFieldType | RangeUIField;
export type TextAreaUIField = BaseUIFieldType | NumberUIField;
export type TimeParamUIField = BaseUIFieldType | NumberUIField | TimeUIField | SelectUIField;
// export type FileUIField = BaseUIFieldType | FileUiField;
export type ImageUIField = BaseUIFieldType | NumberUIField | SelectUIField;

type SimpleFieldKind = 'text' | 'email' | 'phone' | 'url' | 'number' | 'checkbox' | 'group';

export type ParamsFieldConfig = Record<SimpleFieldKind, BaseUIFieldType[]> & {
    date: DateParamUIField[];
    time: TimeParamUIField[];
    textarea: TextAreaUIField[];
    select: ChoiceUIField[];
    radio: ChoiceUIField[];
    // file: FileUIField[];
    image: ImageUIField[];
};
