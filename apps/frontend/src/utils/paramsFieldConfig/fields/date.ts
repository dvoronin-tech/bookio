import { dateParamsSchema } from '@bookio/backend/schemas';
import type { z } from 'zod';

import type { DateParamUIField } from '../paramsFieldConfig.types';

type DateParamKey = keyof z.infer<typeof dateParamsSchema>;

export const dateFieldsConfig: Record<DateParamKey, DateParamUIField> = {
    placeholder: {
        formName: 'placeholder',
        label: 'Placeholder',
        type: 'text',
    },
    minYear: {
        formName: 'minYear',
        label: 'Year range',
        type: 'range',
    },
    maxYear: {
        formName: 'maxYear',
        label: 'Year range',
        type: 'range',
    },
};
