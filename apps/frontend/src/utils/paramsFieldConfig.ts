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

const imageAcceptOptions = {
    'All images': 'image/*',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.avif': 'image/avif',
    '.heic': 'image/heic',
    '.heif': 'image/heif',
    '.tif': 'image/tiff',
    '.tiff': 'image/tiff',
    '.bmp': 'image/bmp',
    '.ico': 'image/x-icon',
} as const;

const fileAcceptOptions = {
    'All files': '*/*',
    ...imageAcceptOptions,
    'All videos': 'video/*',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.ogv': 'video/ogg',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.mkv': 'video/x-matroska',
    'All audio': 'audio/*',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.aac': 'audio/aac',
    '.flac': 'audio/flac',
    '.m4a': 'audio/x-m4a',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.rtf': 'application/rtf',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.zip': 'application/zip',
    '.rar': 'application/x-rar-compressed',
    '.gz': 'application/gzip',
    '.7z': 'application/x-7z-compressed',
    '.tar': 'application/x-tar',
    '.txt': 'text/plain',
    '.csv': 'text/csv',
    '.html': 'text/html',
    '.md': 'text/markdown',
    '.ics': 'text/calendar',
    '.vcf': 'text/vcard',
} as const;

export type AcceptOptions = typeof fileAcceptOptions | typeof imageAcceptOptions;

export const getAcceptOptionLabel = (
    options: AcceptOptions,
    mimeType: string,
) => Object.entries(options).find(([, value]) => value === mimeType)?.[0] ?? mimeType;

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
    },
};

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
            label: { label: 'Label', type: 'text' },
            value: { label: 'Value', type: 'text' },
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

export type UIFields = (typeof paramsFieldConfig)[keyof typeof paramsFieldConfig];
