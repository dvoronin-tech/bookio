import type { FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { FieldModalFormValues } from '@bookio/backend/schemas';
import { paramsFieldConfig } from '#utils/paramsFieldConfig';
import { AcceptTypesField } from './AcceptTypesField';
import { ChoiceOptionsField } from './ChoiceOptionsField';
import { SimpleParamInput } from './SimpleParamInput';

export const ParamFields: FC = () => {
    const { control } = useFormContext<FieldModalFormValues>();
    const type = useWatch({ control, name: 'type' });

    if (!type) return null;

    const fields = paramsFieldConfig[type];

    return fields.map((field) => {
        if (field.type === 'options') {
            return <ChoiceOptionsField key={field.label} label={field.label} />;
        }

        if (field.type === 'select') {
            return (
                <AcceptTypesField
                    key={field.label}
                    label={field.label}
                    options={field.options}
                />
            );
        }

        return (
            <SimpleParamInput
                key={field.name}
                name={field.name}
                label={field.label}
                type={field.type}
            />
        );
    });
};
