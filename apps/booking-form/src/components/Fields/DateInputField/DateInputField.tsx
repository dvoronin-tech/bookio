import type { FC } from 'react';
import { Controller } from 'react-hook-form';
import { DatePicker } from '@bookio/ui';
import type { FieldControlProps } from '#/components/Fields/field.types';
import styles from '#/components/Fields/Fields.module.scss';

export const DateInputField: FC<FieldControlProps<'date'>> = ({ field, control }) => {
    return (
        <Controller
            name={field.key}
            control={control}
            render={({ field: { value, onChange } }) => (
                <DatePicker
                    triggerClassName={styles.default}
                    label={field.name}
                    placeholder={field.params.placeholder}
                    value={value ?? ''}
                    onChange={onChange}
                />
            )}
        />
    );
};
