import type { FC } from 'react';
import { Controller } from 'react-hook-form';
import { clsx } from 'clsx';
import { ImagePickerField } from '@bookio/ui';
import { getRequiredRule } from '../../utils/rules.js';
import { FieldError } from '../FieldError.js';
import { useBookingFormContext } from '../../BookingFormContext.js';
import type { FieldRendererProps } from '../field.types.js';
import { formatLabel } from '../../utils/formatLabel.js';
import styles from '../Fields.module.scss';

export const ImageField: FC<FieldRendererProps<'image'>> = ({ field }) => {
    const { formState, control, markRequiredFields, copy } = useBookingFormContext();
    const disabled = formState === 'loading';
    const { placeholder, accept, maxSizeMb } = field.params;
    const label = formatLabel(markRequiredFields, field.name, field.required);

    return (
        <Controller
            name={field.key}
            control={control}
            rules={{
                required: getRequiredRule(field, copy.required(field.name)),
                validate: (value: File | null) => {
                    if (!value || !maxSizeMb) {
                        return true;
                    }
                    return (
                        value.size <= maxSizeMb * 1024 * 1024 ||
                        copy.imageTooLarge(maxSizeMb)
                    );
                },
            }}
            render={({ field: { onChange }, fieldState }) => (
                <div className={styles.fieldStack}>
                    <ImagePickerField
                        className={clsx(styles.default, fieldState.error && styles.invalid)}
                        label={label}
                        placeholder={placeholder}
                        accept={accept?.join(',')}
                        onChange={onChange}
                        disabled={disabled}
                    />
                    <FieldError message={fieldState.error?.message} />
                </div>
            )}
        />
    );
};
