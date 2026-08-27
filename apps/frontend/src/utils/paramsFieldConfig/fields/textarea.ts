import { textAreaParamsSchema } from '@bookio/backend/schemas';
import type { z } from 'zod';

import type { BaseUIFieldType, NumberUIField } from '../paramsFieldConfig.types';

type TextAreaParamKey = keyof z.infer<typeof textAreaParamsSchema>;

export const textAreaFieldsConfig: Record<TextAreaParamKey, BaseUIFieldType | NumberUIField> = {
    placeholder: {
        formName: 'placeholder',
        label: 'Placeholder',
        type: 'text',
    },
    helpText: {
        formName: 'helpText',
        label: 'Help text',
        type: 'text',
    },
    rows: {
        formName: 'rows',
        label: 'Rows',
        type: 'number',
        required: true,
        min: 1,
    },
};
