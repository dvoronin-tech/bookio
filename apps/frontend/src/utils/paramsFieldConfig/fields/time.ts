import { timeParamsSchema } from '@bookio/backend/schemas';
import type { z } from 'zod';

import type { TimeParamUIField } from '../paramsFieldConfig.types';

type TimeParamKey = keyof z.infer<typeof timeParamsSchema>;

export const timeFieldsConfig: Record<TimeParamKey, TimeParamUIField> = {
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
    min: {
        formName: 'min',
        label: 'Min time',
        type: 'time',
    },
    max: {
        formName: 'max',
        label: 'Max time',
        type: 'time',
    },
    step: {
        formName: 'step',
        label: 'Minutes step',
        type: 'select',
        withSearch: false,
        multiple: false,
        options: [1, 5, 10, 15, 20, 30, 60],
    },
};
