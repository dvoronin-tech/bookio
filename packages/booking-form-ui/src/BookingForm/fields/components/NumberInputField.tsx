import type { FC } from 'react';
import { ValidatableInput } from '@bookio/ui';
import { getRequiredRule } from '../../utils/rules.js';
import { useFieldError } from '../../utils/useFieldError.js';
import { useBookingFormContext } from '../../BookingFormContext.js';
import type { FieldRendererProps } from '../field.types.js';
import { formatLabel } from '../../utils/formatLabel.js';
import styles from '../Fields.module.scss';

export const NumberInputField: FC<FieldRendererProps<'number'>> = ({
    field,
}) => {
    const { formState, register, control, markRequiredFields } = useBookingFormContext();
    const disabled = formState === 'loading';
    const { hasError, errorMessage } = useFieldError(control, field.key);
    const label = formatLabel(markRequiredFields, field.name, field.required);

    return (
        <ValidatableInput
            className={styles.default}
            type="number"
            label={label}
            placeholder={field.params.placeholder}
            helpText={field.params.helpText}
            isValid={hasError ? false : null}
            errorMessage={errorMessage}
            useConfirmationColor={false}
            {...register(field.key, {
                valueAsNumber: true,
                required: getRequiredRule(field),
            })}
            disabled={disabled}
        />
    );
};
