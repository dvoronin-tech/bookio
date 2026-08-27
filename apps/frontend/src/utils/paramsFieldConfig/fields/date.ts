import { dateParamsSchema } from '@bookio/backend/schemas';
import type { z } from 'zod';

import type { BaseUIFieldType } from '../paramsFieldConfig.types';

type DateParamKey = keyof z.infer<typeof dateParamsSchema>;

export const dateFieldsConfig: Record<DateParamKey, BaseUIFieldType> = {
    placeholder: {
        formName: 'placeholder',
        label: 'Placeholder',
        type: 'text',
    },
};
