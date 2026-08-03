import { checkboxParamsSchema } from '@bookio/backend/schemas';
import type { z } from 'zod';

import type { BaseUIFieldConfig } from '../paramsFieldConfig.types';

type CheckboxParamKey = keyof z.infer<typeof checkboxParamsSchema>;

export const checkboxFieldsConfig: Record<CheckboxParamKey, BaseUIFieldConfig> = {
    helpText: {
        label: 'Help text',
        type: 'text',
    },
};
