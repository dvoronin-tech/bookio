import { choiceParamsSchema } from '@bookio/backend/schemas';
import type { z } from 'zod';

import type { BaseUIFieldConfig, OptionsUIField } from '../paramsFieldConfig.types';

type ChoiceParamKey = keyof z.infer<typeof choiceParamsSchema>;

export const choiceFieldsConfig: Record<ChoiceParamKey, BaseUIFieldConfig | OptionsUIField> = {
    placeholder: {
        label: 'Placeholder',
        type: 'text',
    },
    options: {
        label: 'Options',
        type: 'options',
        required: true,
        itemFields: {
            label: { label: 'Label', type: 'text' },
        },
    },
};
