import type { FC } from 'react';
import { Radio } from '@bookio/ui';
import { getRequiredRule } from '../../utils/rules.js';
import { useFieldError } from '../../utils/useFieldError.js';
import { FieldError } from '../FieldError.js';
import { useBookingFormContext } from '../../BookingFormContext.js';
import type { FieldRendererProps } from '../field.types.js';
import { formatLabel } from '../../utils/formatLabel.js';
import styles from '../Fields.module.scss';

export const RadioField: FC<FieldRendererProps<'radio'>> = ({ field }) => {
    const { formState, register, control, markRequiredFields } = useBookingFormContext();
    const disabled = formState === 'loading';
    const { errorMessage } = useFieldError(control, field.key);
    const label = formatLabel(markRequiredFields, field.name, field.required);

    return (
        <div className={styles.fieldStack}>
            <Radio
                {...register(field.key, {
                    required: getRequiredRule(field),
                })}
                disabled={disabled}
            >
                <Radio.Label>{label}</Radio.Label>
                {field.params.options.map((option) => (
                    <Radio.Item key={option.label} value={option.label} disabled={disabled}>
                        {option.label}
                    </Radio.Item>
                ))}
            </Radio>
            <FieldError message={errorMessage} />
        </div>
    );
};
