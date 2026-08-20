import { useMemo, type FC } from 'react';
import { Controller } from 'react-hook-form';
import { SelectDropdown } from '@bookio/ui';
import type { FieldControlProps } from '#/components/Fields/field.types';

export const SelectField: FC<FieldControlProps<'select'>> = ({ field, control }) => {
    const { required } = field;
    const { defaultValue, options } = field.params;

    const selectOptions = useMemo(() => {
        if (!required && !options.some((o) => o.value === '')) {
            return [{ value: 'DEFAULT', label: defaultValue }, ...options];
        }
        return options;
    }, [required, options, defaultValue]);

    return (
        <Controller
            name={field.key}
            control={control}
            render={({ field: { value, onChange } }) => {
                return (
                    <SelectDropdown
                        label={field.name}
                        options={selectOptions}
                        selected={value ?? defaultValue}
                        onOptionClick={onChange}
                    />
                );
            }}
        />
    );
};
