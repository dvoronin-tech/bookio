import type { FC } from 'react';
import { ValidatableInput } from '@bookio/ui';
import { getRequiredRule } from '../utils/rules.js';
import { useFieldError } from '../utils/useFieldError.js';
import type { FieldControlProps } from './field.types.js';
import styles from './Fields.module.scss';

export const NumberInputField: FC<FieldControlProps<'number'>> = ({ field, register, control }) => {
    const { hasError, errorMessage } = useFieldError(control, field.key);

    return (
        <ValidatableInput
            className={styles.default}
            type="number"
            label={field.name}
            placeholder={field.params.placeholder}
            helpText={field.params.helpText}
            isValid={hasError ? false : null}
            errorMessage={errorMessage}
            useConfirmationColor={false}
            {...register(field.key, {
                valueAsNumber: true,
                required: getRequiredRule(field),
            })}
        />
    );
};
