import { useMemo, type FC } from 'react';
import { Controller } from 'react-hook-form';
import { clsx } from 'clsx';
import { SelectDropdown } from '@bookio/ui';
import { getRequiredRule } from '../../utils/rules.js';
import { FieldError } from '../FieldError.js';
import { useBookingFormContext } from '../../BookingFormContext.js';
import type { FieldRendererProps } from '../field.types.js';
import { formatLabel } from '../../utils/formatLabel.js';
import styles from '../Fields.module.scss';

export const SelectField: FC<FieldRendererProps<'select'>> = ({ field }) => {
    const { formState, control, markRequiredFields } = useBookingFormContext();
    const disabled = formState === 'loading';
    const { required } = field;
    const { defaultValue, options } = field.params;
    const label = formatLabel(markRequiredFields, field.name, required);

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
                            label={label}
                            options={selectOptions}
                            selected={value ?? defaultValue}
                            onOptionClick={onChange}
                            disabled={disabled}
                        />
                        <FieldError message={fieldState.error?.message} />
                    </div>
                );
            }}
        />
    );
};
