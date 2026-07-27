import {
    checkboxParamsSchema,
    choiceParamsSchema,
    fieldOptionSchema,
    fileParamsSchema,
    groupParamsSchema,
    inputParamsSchema,
    textAreaParamsSchema,
} from '@bookio/backend/schemas';
import type { z } from 'zod';

type InputParamKey = keyof z.infer<typeof inputParamsSchema>;
type ChoiceParamKey = keyof z.infer<typeof choiceParamsSchema>;
type FieldOptionKey = Exclude<keyof z.infer<typeof fieldOptionSchema>, 'id'>;
type GroupParamKey = keyof z.infer<typeof groupParamsSchema>;
type FileParamKey = keyof z.infer<typeof fileParamsSchema>;
type TextAreaParamKey = keyof z.infer<typeof textAreaParamsSchema>;
type CheckboxParamKey = keyof z.infer<typeof checkboxParamsSchema>;

const imageAcceptOptions = [
    'image/*',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/avif',
    'image/heic',
    'image/heif',
    'image/tiff',
    'image/bmp',
    'image/x-icon',
    'image/vnd.microsoft.icon',
] as const;

const fileAcceptOptions = [
    '*/*',
    ...imageAcceptOptions,
    'video/*',
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska',
    'audio/*',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/webm',
    'audio/aac',
    'audio/flac',
    'audio/x-m4a',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/rtf',
    'application/json',
    'application/xml',
    'application/zip',
    'application/x-rar-compressed',
    'application/gzip',
    'application/x-7z-compressed',
    'application/x-tar',
    'application/octet-stream',
    'text/plain',
    'text/csv',
    'text/html',
    'text/markdown',
    'text/calendar',
    'text/vcard',
] as const;

export interface BaseUIFieldType {
    label: string;
    type: 'text' | 'checkbox' | 'number';
}

export interface OptionsUIField {
    label: string;
    type: 'options';
    itemFields: Record<FieldOptionKey, BaseUIFieldType>;
}

export interface FileUiField {
    label: string;
    type: 'select';
    options: typeof fileAcceptOptions;
}

export interface ImageUiField {
    label: string;
    type: 'select';
    options: typeof imageAcceptOptions;
}

type ChoiceUIField = BaseUIFieldType | OptionsUIField;

const groupFieldsConfig: Record<GroupParamKey, BaseUIFieldType> = {
    description: {
        label: 'Description',
        type: 'text',
    }
}

const checkboxFieldsConfig: Record<CheckboxParamKey, BaseUIFieldType> = {
    helpText: {
        label: 'Help text',
        type: 'text',
    },
};

const choiceFieldsConfig: Record<ChoiceParamKey, ChoiceUIField> = {
    placeholder: {
        label: 'Placeholder',
        type: 'text',
    },
    options: {
        label: 'Options',
        type: 'options',
        itemFields: {
            value: { label: 'Value', type: 'text' },
            label: { label: 'Label', type: 'text' },
        },
    },
};

const inputFieldsConfig: Record<InputParamKey, BaseUIFieldType> = {
    placeholder: {
        label: 'Placeholder',
        type: 'text',
    },
    helpText: {
        label: 'Help text',
        type: 'text',
    },
};

const textAreaFieldsConfig: Record<TextAreaParamKey, BaseUIFieldType> = {
    placeholder: {
        label: 'Placeholder',
        type: 'text',
    },
    helpText: {
        label: 'Help text',
        type: 'text',
    },
    rows: {
        label: 'Rows',
        type: 'number',
    },
};

const fileFieldsConfig: Record<FileParamKey, BaseUIFieldType | FileUiField> = {
    accept: {
        label: 'Accepted file types',
        type: 'select',
        options: fileAcceptOptions,
    },
    maxSizeMb: {
        label: 'Maximum file size',
        type: 'number',
    },
};

const imageFieldsConfig: Record<FileParamKey, BaseUIFieldType | ImageUiField> = {
    accept: {
        label: 'Accepted image types',
        type: 'select',
        options: imageAcceptOptions,
    },
    maxSizeMb: {
        label: 'Maximum image size',
        type: 'number',
    },
};

export type ParamsFieldConfig = {
    text: BaseUIFieldType[];
    email: BaseUIFieldType[];
    phone: BaseUIFieldType[];
    url: BaseUIFieldType[];
    number: BaseUIFieldType[];
    date: BaseUIFieldType[];
    time: BaseUIFieldType[];
    textarea: BaseUIFieldType[];
    select: ChoiceUIField[];
    radio: ChoiceUIField[];
    checkbox: BaseUIFieldType[];
    file: (BaseUIFieldType | FileUiField)[];
    image: (BaseUIFieldType | ImageUiField)[];
    group: BaseUIFieldType[];
};


export const paramsFieldConfig: ParamsFieldConfig = {
    text: Object.values(inputFieldsConfig),
    email: Object.values(inputFieldsConfig),
    phone: Object.values(inputFieldsConfig),
    url: Object.values(inputFieldsConfig),
    number: Object.values(inputFieldsConfig),
    date: Object.values(inputFieldsConfig),
    time: Object.values(inputFieldsConfig),
    textarea: Object.values(textAreaFieldsConfig),
    select: Object.values(choiceFieldsConfig),
    radio: Object.values(choiceFieldsConfig),
    checkbox: Object.values(checkboxFieldsConfig),
    file: Object.values(fileFieldsConfig),
    image: Object.values(imageFieldsConfig),
    group: Object.values(groupFieldsConfig),
};

export type UIFields = typeof paramsFieldConfig[keyof typeof paramsFieldConfig];