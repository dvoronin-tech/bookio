import { dateParamsSchema } from '@bookio/backend/schemas';
import type { z } from 'zod';

import type { BaseUIFieldConfig } from '../paramsFieldConfig.types';

type DateParamKey = keyof z.infer<typeof dateParamsSchema>;

export const dateFieldsConfig: Record<DateParamKey, BaseUIFieldConfig> = {
    placeholder: {
        label: 'Placeholder',
        type: 'text',
    },
};
