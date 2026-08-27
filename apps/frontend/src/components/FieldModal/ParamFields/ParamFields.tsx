import type { FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { FieldModalFormValues } from '@bookio/backend/schemas';
import { paramsFieldConfig } from '#utils/paramsFieldConfig';
import { formatParamFieldLabel } from '#utils/paramsFieldConfig/formatParamFieldLabel';
import { AcceptTypesField } from './Fields/SelectField/AcceptTypesField';
import { ChoiceOptionsField } from './Fields/ChoiceOptionField/ChoiceOptionsField';
import { SimpleParamInput } from './Fields/SimpleParamInput/SimpleParamInput';
import { TimeParamInput } from './Fields/TimeParamInput/TimeParamInput';
import { SelectField } from './Fields/SelectField/SelectField';

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
                    key={field.formName}
                    name={field.formName}
                    label={label}
                    type={field.type}
                    min={field.min}
                    max={field.max}
                />
            );
        }

        if (field.type === 'time') {
            return <TimeParamInput key={field.formName} name={field.formName} label={label} />;
        }

        if (field.type === 'options') {
            return <ChoiceOptionsField key={field.formName} label={label} />;
        }

        if (field.type === 'select') {
            if (type === 'image') {
                return (
                    <AcceptTypesField
                        key={field.formName}
                        label={label}
                        options={field.options}
                        searchPlaceholder={field.searchPlaceholder}
                        emptyOptionsText={field.emptyOptionsText}
                        withSearch={field.withSearch}
                    />
                );
            }

            return (
                <SelectField
                    key={field.formName}
                    name={field.formName}
                    label={label}
                    options={field.options}
                    multiple={field.multiple}
                    searchPlaceholder={field.searchPlaceholder}
                    emptyOptionsText={field.emptyOptionsText}
                    withSearch={field.withSearch}
                />
            );
        }

        return (
            <SimpleParamInput
                key={field.formName}
                name={field.formName}
                label={label}
                type={field.type}
            />
        );
    });
};
