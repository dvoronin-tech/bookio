import { inputParamsSchema } from '@bookio/backend/schemas';
import type { z } from 'zod';

import type { BaseUIFieldConfig } from '../paramsFieldConfig.types';

type InputParamKey = keyof z.infer<typeof inputParamsSchema>;

export const inputFieldsConfig: Record<InputParamKey, BaseUIFieldConfig> = {
    placeholder: {
        label: 'Placeholder',
        type: 'text',
    },
    helpText: {
        label: 'Help text',
        type: 'text',
    },
};
