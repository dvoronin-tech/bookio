import { choiceParamsSchema, selectParamsSchema } from '@bookio/backend/schemas';
import type { z } from 'zod';

import type { BaseUIFieldType, OptionsUIField } from '../paramsFieldConfig.types';

type ChoiceParamKey = keyof z.infer<typeof choiceParamsSchema>;
type SelectParamKey = keyof z.infer<typeof selectParamsSchema>;

export const choiceFieldsConfig: Record<ChoiceParamKey, BaseUIFieldType | OptionsUIField> = {
    options: {
        formName: 'options',
        label: 'Options',
        type: 'options',
        required: true,
        itemFields: {
            label: { label: 'Label', type: 'text' },
        },
    },
};

export const selectFieldsConfig: Record<SelectParamKey, BaseUIFieldType | OptionsUIField> = {
    defaultValue: {
        formName: 'defaultValue',
        label: 'Default Value',
        required: true,
        type: 'text',
    },
    ...choiceFieldsConfig,
};
