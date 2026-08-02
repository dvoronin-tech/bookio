import { textAreaParamsSchema } from '@bookio/backend/schemas';
import type { z } from 'zod';

import type { BaseUIFieldConfig, NumberUIField } from '../paramsFieldConfig.types';

type TextAreaParamKey = keyof z.infer<typeof textAreaParamsSchema>;

export const textAreaFieldsConfig: Record<TextAreaParamKey, BaseUIFieldConfig | NumberUIField> = {
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
        required: true,
        min: 1,
    },
};
