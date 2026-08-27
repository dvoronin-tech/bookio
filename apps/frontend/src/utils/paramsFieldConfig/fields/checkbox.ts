import { checkboxParamsSchema } from '@bookio/backend/schemas';
import type { z } from 'zod';

import type { BaseUIFieldType } from '../paramsFieldConfig.types';

type CheckboxParamKey = keyof z.infer<typeof checkboxParamsSchema>;

export const checkboxFieldsConfig: Record<CheckboxParamKey, BaseUIFieldType> = {
    helpText: {
        formName: 'helpText',
        label: 'Help text',
        type: 'text',
    },
};
