import type { FC } from 'react';
import { Controller } from 'react-hook-form';
import { clsx } from 'clsx';
import { ImagePickerField } from '@bookio/ui';
import { getRequiredRule } from '../utils/rules.js';
import { FieldError } from './FieldError.js';
import type { FieldControlProps } from './field.types.js';
import styles from './Fields.module.scss';

export const ImageField: FC<FieldControlProps<'image'>> = ({ field, control }) => {
    const { placeholder, accept, maxSizeMb } = field.params;

    return (
        <Controller
            name={field.key}
            control={control}
            rules={{
                required: getRequiredRule(field),
                validate: (value: File | null) => {
                    if (!value || !maxSizeMb) {
                        return true;
                    }
                    return (
                        value.size <= maxSizeMb * 1024 * 1024 ||
                        `Image must be ${maxSizeMb} MB or smaller`
                    );
                },
            }}
            render={({ field: { onChange }, fieldState }) => (
                <div className={styles.fieldStack}>
                    <ImagePickerField
                        className={clsx(styles.default, fieldState.error && styles.invalid)}
                        label={field.name}
                        placeholder={placeholder}
                        accept={accept?.join(',')}
                        onChange={onChange}
                    />
                    <FieldError message={fieldState.error?.message} />
                </div>
            )}
        />
    );
};
