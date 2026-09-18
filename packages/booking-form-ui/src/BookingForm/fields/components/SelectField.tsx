import { useMemo, type FC } from 'react';
import { Controller } from 'react-hook-form';
import { clsx } from 'clsx';
import { SelectDropdown } from '@bookio/ui';
import { getRequiredRule } from '../../utils/rules.js';
import { FieldError } from '../FieldError.js';
import type { FieldControlProps } from '../field.types.js';
import styles from '../Fields.module.scss';

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
            rules={{
                required: getRequiredRule(field),
            }}
            render={({ field: { value, onChange }, fieldState }) => {
                return (
                    <div className={styles.fieldStack}>
                        <SelectDropdown
                            triggerClassName={clsx(
                                styles.default,
                                fieldState.error && styles.invalid,
                            )}
                            label={field.name}
                            options={selectOptions}
                            selected={value ?? defaultValue}
                            onOptionClick={onChange}
                        />
                        <FieldError message={fieldState.error?.message} />
                    </div>
                );
            }}
        />
    );
};
