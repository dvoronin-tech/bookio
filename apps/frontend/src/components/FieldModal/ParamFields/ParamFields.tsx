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
import { YearRangeField } from './Fields/YearRangeField/YearRangeField';
import { m } from '#i18n/messages';

const paramFieldLabel = (formName: string, fallback: string) => {
    switch (formName) {
        case 'placeholder':
            return m.param_placeholder();
        case 'helpText':
            return m.param_help_text();
        case 'options':
            return m.param_options();
        case 'defaultValue':
            return m.param_default_value();
        case 'minYear':
        case 'maxYear':
            return m.param_year_range();
        case 'min':
            return m.param_min_time();
        case 'max':
            return m.param_max_time();
        case 'step':
            return m.param_minutes_step();
        case 'rows':
            return m.param_rows();
        case 'accept':
            return m.param_accepted_image_types();
        case 'maxSizeMb':
            return m.param_max_image_size();
        case 'description':
            return m.param_description();
        default:
            return fallback;
    }
};

export const ParamFields: FC = () => {
    const { control } = useFormContext<FieldModalFormValues>();
    const type = useWatch({ control, name: 'type' });

    if (!type || type === 'file' || !(type in paramsFieldConfig)) return null;

    const fields = [...paramsFieldConfig[type]].sort(
        (a, b) => Number(Boolean(b.required)) - Number(Boolean(a.required)),
    );

    return fields.map((field) => {
        const label = formatParamFieldLabel(
            paramFieldLabel(field.formName, field.label),
            field.required,
        );

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

        if (field.type === 'range') {
            if (field.formName !== 'minYear') {
                return null;
            }

            return <YearRangeField key={field.formName} label={label} />;
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
                        searchPlaceholder={m.param_search_types()}
                        emptyOptionsText={m.param_no_types()}
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
                    searchPlaceholder={m.param_search_types()}
                    emptyOptionsText={m.param_no_types()}
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
