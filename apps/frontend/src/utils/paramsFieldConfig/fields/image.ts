import { fileParamsSchema } from '@bookio/backend/schemas';
import type { z } from 'zod';

import { imageAcceptOptions } from '../imageAcceptOptions';
import type { BaseUIFieldType, SelectUIField, NumberUIField } from '../paramsFieldConfig.types';

type FileParamKey = keyof z.infer<typeof fileParamsSchema>;

export const imageFieldsConfig: Record<
    FileParamKey,
    BaseUIFieldType | SelectUIField | NumberUIField
> = {
    placeholder: {
        formName: 'placeholder',
        label: 'Placeholder',
        type: 'text',
    },
    accept: {
        formName: 'accept',
        label: 'Accepted image types (default: All types)',
        type: 'select',
        multiple: true,
        withSearch: true,
        searchPlaceholder: 'Search types...',
        emptyOptionsText: 'No types found',
        options: Object.values(imageAcceptOptions),
    },
    maxSizeMb: {
        formName: 'maxSizeMb',
        label: 'Maximum image size (default: 5mb)',
        type: 'number',
        min: 1,
    },
};

// const fileFieldsConfig: Record<FileParamKey, BaseUIFieldConfig | FileUiField> = {
//     placeholder: {
//         label: 'Placeholder',
//         type: 'text',
//     },
//     accept: {
//         label: 'Accepted file types',
//         multiple: true,
//         type: 'select',
//         options: fileAcceptOptions,
//     },
//     maxSizeMb: {
//         label: 'Maximum file size',
//         type: 'number',
//     },
// };
