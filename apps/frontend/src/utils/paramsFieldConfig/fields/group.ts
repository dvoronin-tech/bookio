import { groupParamsSchema } from '@bookio/backend/schemas';
import type { z } from 'zod';

import type { BaseUIFieldConfig } from '../paramsFieldConfig.types';

type GroupParamKey = keyof z.infer<typeof groupParamsSchema>;

export const groupFieldsConfig: Record<GroupParamKey, BaseUIFieldConfig> = {
    description: {
        label: 'Description',
        type: 'text',
    },
};
