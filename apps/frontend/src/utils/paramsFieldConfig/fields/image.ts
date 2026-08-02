import { fileParamsSchema } from '@bookio/backend/schemas';
import type { z } from 'zod';

import { imageAcceptOptions } from '../imageAcceptOptions';
import type { BaseUIFieldConfig, ImageUiField, NumberUIField } from '../paramsFieldConfig.types';

type FileParamKey = keyof z.infer<typeof fileParamsSchema>;

export const imageFieldsConfig: Record<FileParamKey, BaseUIFieldConfig | ImageUiField | NumberUIField> =
    {
        accept: {
            label: 'Accepted image types (default: All types)',
            type: 'select',
            options: imageAcceptOptions,
        },
        maxSizeMb: {
            label: 'Maximum image size (default: 5mb)',
            type: 'number',
            min: 1,
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
