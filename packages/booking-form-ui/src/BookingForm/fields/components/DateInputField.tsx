import type { FC } from 'react';
import { Controller } from 'react-hook-form';
import { clsx } from 'clsx';
import { DatePicker } from '@bookio/ui';
import { getRequiredRule } from '../../utils/rules.js';
import { FieldError } from '../FieldError.js';
import type { FieldControlProps } from '../field.types.js';
import { formatLabel } from '../../utils/formatLabel.js';
import styles from '../Fields.module.scss';

export const DateInputField: FC<FieldControlProps<'date'>> = ({
    field,
    control,
    markRequiredFields,
}) => {
    const label = formatLabel(markRequiredFields, field.name, field.required);

    return (
        <Controller
            name={field.key}
            control={control}
            rules={{
                required: getRequiredRule(field),
            }}
            render={({ field: { value, onChange }, fieldState }) => (
                <div className={styles.fieldStack}>
                    <DatePicker
                        triggerClassName={clsx(styles.default, fieldState.error && styles.invalid)}
                        label={label}
                        placeholder={field.params.placeholder}
                        minYear={field.params.minYear}
                        maxYear={field.params.maxYear}
                        value={value ?? ''}
                        onChange={onChange}
                    />
                    <FieldError message={fieldState.error?.message} />
                </div>
            )}
        />
    );
};
