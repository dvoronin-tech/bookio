import { inputParamsSchema } from '@bookio/backend/schemas';
import type { z } from 'zod';

import type { BaseUIFieldType } from '../paramsFieldConfig.types';

type InputParamKey = keyof z.infer<typeof inputParamsSchema>;

export const inputFieldsConfig: Record<InputParamKey, BaseUIFieldType> = {
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
};
