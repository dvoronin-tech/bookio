import { groupParamsSchema } from '@bookio/backend/schemas';
import type { z } from 'zod';

import type { BaseUIFieldType } from '../paramsFieldConfig.types';

type GroupParamKey = keyof z.infer<typeof groupParamsSchema>;

export const groupFieldsConfig: Record<GroupParamKey, BaseUIFieldType> = {
    description: {
        formName: 'description',
        label: 'Description',
        type: 'text',
    },
};
