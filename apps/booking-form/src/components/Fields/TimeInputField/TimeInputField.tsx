import type { FC } from 'react';
import { Controller } from 'react-hook-form';
import { TimePicker } from '@bookio/ui';
import type { FieldControlProps } from '#/components/Fields/field.types';
import styles from '#/components/Fields/Fields.module.scss';

export const TimeInputField: FC<FieldControlProps<'time'>> = ({ field, control }) => {
    return (
        <Controller
            name={field.key}
            control={control}
            render={({ field: { value, onChange } }) => (
                <TimePicker
                    triggerClassName={styles.default}
                    label={field.name}
                    placeholder={field.params.placeholder}
                    min={field.params.min}
                    max={field.params.max}
                    step={field.params.step}
                    value={value ?? ''}
                    onChange={onChange}
                />
            )}
        />
    );
};
