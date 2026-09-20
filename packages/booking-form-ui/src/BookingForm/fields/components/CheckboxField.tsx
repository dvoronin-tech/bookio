import type { FC } from 'react';
import { Checkbox } from '@bookio/ui';
import { getRequiredRule } from '../../utils/rules.js';
import { useFieldError } from '../../utils/useFieldError.js';
import { FieldError } from '../FieldError.js';
import { useBookingFormContext } from '../../BookingFormContext.js';
import type { FieldRendererProps } from '../field.types.js';
import { formatLabel } from '../../utils/formatLabel.js';
import styles from '../Fields.module.scss';

export const CheckboxField: FC<FieldRendererProps<'checkbox'>> = ({
    field,
}) => {
    const { formState, register, control, markRequiredFields } = useBookingFormContext();
    const disabled = formState === 'loading';
    const { helpText } = field.params;
    const { errorMessage } = useFieldError(control, field.key);

    const label = formatLabel(markRequiredFields, field.name, field.required);

    return (
        <div className={styles.checkboxField}>
            <Checkbox
                label={label}
                {...register(field.key, {
                    required: getRequiredRule(field),
                })}
                disabled={disabled}
            />
            {helpText && (
                <span className={styles.checkboxHelpText}>{helpText}</span>
            )}
            <FieldError message={errorMessage} />
        </div>
    );
};
