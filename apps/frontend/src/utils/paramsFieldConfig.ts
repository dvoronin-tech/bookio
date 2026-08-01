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

export const imageAcceptOptions = {
    'All images': 'image/*',
    '.jpg / .jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.avif': 'image/avif',
    '.heic': 'image/heic',
    '.heif': 'image/heif',
    '.tif / .tiff': 'image/tiff',
    '.bmp': 'image/bmp',
    '.ico': 'image/x-icon',
} as const;

// const fileAcceptOptions = {
//     'All files': '*/*',
//     ...imageAcceptOptions,
//     'All videos': 'video/*',
//     '.mp4': 'video/mp4',
//     '.webm': 'video/webm',
//     '.ogv': 'video/ogg',
//     '.mov': 'video/quicktime',
//     '.avi': 'video/x-msvideo',
//     '.mkv': 'video/x-matroska',
//     'All audio': 'audio/*',
//     '.mp3': 'audio/mpeg',
//     '.wav': 'audio/wav',
//     '.ogg': 'audio/ogg',
//     '.aac': 'audio/aac',
//     '.flac': 'audio/flac',
//     '.m4a': 'audio/x-m4a',
//     '.pdf': 'application/pdf',
//     '.doc': 'application/msword',
//     '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//     '.xls': 'application/vnd.ms-excel',
//     '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//     '.ppt': 'application/vnd.ms-powerpoint',
//     '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
//     '.rtf': 'application/rtf',
//     '.json': 'application/json',
//     '.xml': 'application/xml',
//     '.zip': 'application/zip',
//     '.rar': 'application/x-rar-compressed',
//     '.gz': 'application/gzip',
//     '.7z': 'application/x-7z-compressed',
//     '.tar': 'application/x-tar',
//     '.txt': 'text/plain',
//     '.csv': 'text/csv',
//     '.html': 'text/html',
//     '.md': 'text/markdown',
//     '.ics': 'text/calendar',
//     '.vcf': 'text/vcard',
// } as const;

export type AcceptOptions = typeof imageAcceptOptions;

type BaseUIFieldConfig = {
    label: string;
    type: 'text' | 'checkbox' | 'number';
};

export interface BaseUIFieldType extends BaseUIFieldConfig {
    name: string;
}

export interface OptionsUIField {
    label: string;
    type: 'options';
    itemFields: Record<FieldOptionKey, BaseUIFieldConfig>;
}

// export interface FileUiField {
//     label: string;
//     type: 'select';
//     options: typeof fileAcceptOptions;
// }

export interface ImageUiField {
    label: string;
    type: 'select';
    options: typeof imageAcceptOptions;
}

type ChoiceUIField = BaseUIFieldType | OptionsUIField;
// type FileUIField = BaseUIFieldType | FileUiField;
type ImageUIField = BaseUIFieldType | ImageUiField;

/** Attach param key as `name` for form `register` on simple fields. */
const namedBaseFields = (config: Record<string, BaseUIFieldConfig>): BaseUIFieldType[] =>
    Object.entries(config).map(([name, field]) => ({ ...field, name }));

const namedChoiceFields = (
    config: Record<string, BaseUIFieldConfig | OptionsUIField>,
): ChoiceUIField[] =>
    Object.entries(config).map(([name, field]): ChoiceUIField => {
        if (field.type === 'options') {
            return field;
        }

        return { ...field, name };
    });

const namedSelectParamFields = <TSelect extends { type: 'select' }>(
    config: Record<string, BaseUIFieldConfig | TSelect>,
): Array<BaseUIFieldType | TSelect> =>
    Object.entries(config).map(([name, field]): BaseUIFieldType | TSelect => {
        if (field.type === 'select') {
            return field;
        }

        return { ...field, name };
    });

const groupFieldsConfig: Record<GroupParamKey, BaseUIFieldConfig> = {
    description: {
        label: 'Description',
        type: 'text',
    },
};

const checkboxFieldsConfig: Record<CheckboxParamKey, BaseUIFieldConfig> = {
    helpText: {
        label: 'Help text',
        type: 'text',
    },
};

const choiceFieldsConfig: Record<ChoiceParamKey, BaseUIFieldConfig | OptionsUIField> = {
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

const inputFieldsConfig: Record<InputParamKey, BaseUIFieldConfig> = {
    placeholder: {
        label: 'Placeholder',
        type: 'text',
    },
    helpText: {
        label: 'Help text',
        type: 'text',
    },
};

const textAreaFieldsConfig: Record<TextAreaParamKey, BaseUIFieldConfig> = {
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

// const fileFieldsConfig: Record<FileParamKey, BaseUIFieldConfig | FileUiField> = {
//     accept: {
//         label: 'Accepted file types',
//         type: 'select',
//         options: fileAcceptOptions,
//     },
//     maxSizeMb: {
//         label: 'Maximum file size',
//         type: 'number',
//     },
// };

const imageFieldsConfig: Record<FileParamKey, BaseUIFieldConfig | ImageUiField> = {
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
    // file: FileUIField[];
    image: ImageUIField[];
    group: BaseUIFieldType[];
};

export const paramsFieldConfig: ParamsFieldConfig = {
    text: namedBaseFields(inputFieldsConfig),
    email: namedBaseFields(inputFieldsConfig),
    phone: namedBaseFields(inputFieldsConfig),
    url: namedBaseFields(inputFieldsConfig),
    number: namedBaseFields(inputFieldsConfig),
    date: namedBaseFields(inputFieldsConfig),
    time: namedBaseFields(inputFieldsConfig),
    textarea: namedBaseFields(textAreaFieldsConfig),
    select: namedChoiceFields(choiceFieldsConfig),
    radio: namedChoiceFields(choiceFieldsConfig),
    checkbox: namedBaseFields(checkboxFieldsConfig),
    // file: namedSelectParamFields(fileFieldsConfig),
    image: namedSelectParamFields(imageFieldsConfig),
    group: namedBaseFields(groupFieldsConfig),
};

export type UIFields = (typeof paramsFieldConfig)[keyof typeof paramsFieldConfig];
