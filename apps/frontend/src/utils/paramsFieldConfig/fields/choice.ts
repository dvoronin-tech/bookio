import { choiceParamsSchema, selectParamsSchema } from '@bookio/backend/schemas';
import type { z } from 'zod';

import type { BaseUIFieldConfig, OptionsUIField } from '../paramsFieldConfig.types';

type ChoiceParamKey = keyof z.infer<typeof choiceParamsSchema>;
type SelectParamKey = keyof z.infer<typeof selectParamsSchema>;

export const choiceFieldsConfig: Record<ChoiceParamKey, BaseUIFieldConfig | OptionsUIField> = {
    options: {
        label: 'Options',
        type: 'options',
        required: true,
        itemFields: {
            label: { label: 'Label', type: 'text' },
        },
    },
};

export const selectFieldsConfig: Record<SelectParamKey, BaseUIFieldConfig | OptionsUIField> = {
    defaultValue: {
        label: 'Default Value',
        required: true,
        type: 'text',
    },
    ...choiceFieldsConfig,
};
