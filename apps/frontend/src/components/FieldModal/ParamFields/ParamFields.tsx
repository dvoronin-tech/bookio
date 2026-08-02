import type { FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { FieldModalFormValues } from '@bookio/backend/schemas';
import { paramsFieldConfig } from '#utils/paramsFieldConfig';
import { formatParamFieldLabel } from '#utils/paramsFieldConfig/formatParamFieldLabel';
import { AcceptTypesField } from './AcceptTypesField';
import { ChoiceOptionsField } from './ChoiceOptionsField';
import { SimpleParamInput } from './SimpleParamInput';

export const ParamFields: FC = () => {
    const { control } = useFormContext<FieldModalFormValues>();
    const type = useWatch({ control, name: 'type' });

    if (!type || type === 'file' || !(type in paramsFieldConfig)) return null;

    const fields = [...paramsFieldConfig[type]].sort(
        (a, b) => Number(Boolean(b.required)) - Number(Boolean(a.required)),
    );

    return fields.map((field) => {
        const label = formatParamFieldLabel(field.label, field.required);

        if (field.type === 'number') {
            return (
                <SimpleParamInput
                    key={field.name}
                    name={field.name}
                    label={label}
                    type={field.type}
                    min={field.min}
                    max={field.max}
                />
            );
        }

        if (field.type === 'options') {
            return <ChoiceOptionsField key={field.label} label={label} />;
        }

        if (field.type === 'select') {
            return (
                <AcceptTypesField
                    key={field.label}
                    label={label}
                    options={field.options}
                />
            );
        }

        return (
            <SimpleParamInput
                key={field.name}
                name={field.name}
                label={label}
                type={field.type}
            />
        );
    });
};
