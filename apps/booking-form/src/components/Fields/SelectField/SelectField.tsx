import { useMemo, type FC } from 'react';
import { Controller } from 'react-hook-form';
import { SelectDropdown } from '@bookio/ui';
import type { FieldControlProps } from '#/components/Fields/field.types';
import styles from '#/components/Fields/Fields.module.scss';

export const SelectField: FC<FieldControlProps<'select'>> = ({ field, control }) => {
    const { required } = field;
    const { defaultValue, options } = field.params;

    const selectOptions = useMemo(() => {
        const labels = options.map((option) => option.label);
        if (!required && !labels.includes(defaultValue)) {
            return [defaultValue, ...labels];
        }
        return labels;
    }, [required, options, defaultValue]);

    return (
        <Controller
            name={field.key}
            control={control}
            render={({ field: { value, onChange } }) => {
                return (
                    <SelectDropdown
                        triggerClassName={styles.default}
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
