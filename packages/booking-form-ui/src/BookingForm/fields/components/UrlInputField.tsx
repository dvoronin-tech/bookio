import type { FC } from 'react';
import { ValidatableInput } from '@bookio/ui';
import { getRequiredRule } from '../../utils/rules.js';
import { useFieldError } from '../../utils/useFieldError.js';
import { useBookingFormContext } from '../../BookingFormContext.js';
import type { FieldRendererProps } from '../field.types.js';
import { formatLabel } from '../../utils/formatLabel.js';
import styles from '../Fields.module.scss';

const URL_PATTERN = /^https?:\/\/\S+$/i;

export const UrlInputField: FC<FieldRendererProps<'url'>> = ({ field }) => {
    const { formState, register, control, markRequiredFields } = useBookingFormContext();
    const disabled = formState === 'loading';
    const { hasError, errorMessage } = useFieldError(control, field.key);
    const label = formatLabel(markRequiredFields, field.name, field.required);

    return (
        <ValidatableInput
            className={styles.default}
            type="url"
            label={label}
            placeholder={field.params.placeholder}
            helpText={field.params.helpText}
            isValid={hasError ? false : null}
            errorMessage={errorMessage}
            useConfirmationColor={false}
            {...register(field.key, {
                required: getRequiredRule(field),
                pattern: {
                    value: URL_PATTERN,
                    message: 'Enter a valid URL',
                },
            })}
            disabled={disabled}
        />
    );
};
