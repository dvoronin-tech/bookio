import type { FC } from 'react';
import { Controller } from 'react-hook-form';
import { clsx } from 'clsx';
import { TimePicker } from '@bookio/ui';
import { getRequiredRule } from '../utils/rules.js';
import { FieldError } from './FieldError.js';
import type { FieldControlProps } from './field.types.js';
import styles from './Fields.module.scss';

export const TimeInputField: FC<FieldControlProps<'time'>> = ({ field, control }) => {
    return (
        <Controller
            name={field.key}
            control={control}
            rules={{
                required: getRequiredRule(field),
            }}
            render={({ field: { value, onChange }, fieldState }) => (
                <div className={styles.fieldStack}>
                    <TimePicker
                        triggerClassName={clsx(styles.default, fieldState.error && styles.invalid)}
                        label={field.name}
                        placeholder={field.params.placeholder}
                        min={field.params.min}
                        max={field.params.max}
                        step={field.params.step}
                        value={value ?? ''}
                        onChange={onChange}
                    />
                    <FieldError message={fieldState.error?.message} />
                </div>
            )}
        />
    );
};
