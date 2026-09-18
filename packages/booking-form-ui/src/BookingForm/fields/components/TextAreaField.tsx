import type { FC } from 'react';
import { clsx } from 'clsx';
import { ValidatableInput } from '@bookio/ui';
import { getRequiredRule } from '../../utils/rules.js';
import { useFieldError } from '../../utils/useFieldError.js';
import type { FieldControlProps } from '../field.types.js';
import styles from '../Fields.module.scss';

export const TextAreaField: FC<FieldControlProps<'textarea'>> = ({ field, register, control }) => {
    const { hasError, errorMessage } = useFieldError(control, field.key);

    return (
        <ValidatableInput
            className={clsx(styles.default, styles.textarea)}
            type="textarea"
            label={field.name}
            placeholder={field.params.placeholder}
            helpText={field.params.helpText}
            rows={field.params.rows}
            isValid={hasError ? false : null}
            errorMessage={errorMessage}
            useConfirmationColor={false}
            {...register(field.key, {
                required: getRequiredRule(field),
            })}
        />
    );
};
