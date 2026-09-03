import { useCallback, type FC } from 'react';
import { ValidatableInput } from '@bookio/ui';
import type { FieldControlProps } from './field.types.js';
import { useBlurValidation } from './useBlurValidation.js';
import styles from './Fields.module.scss';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EmailInputField: FC<FieldControlProps<'email'>> = ({ field, register }) => {
    const { onBlur: registerOnBlur, ...registerProps } = register(field.key);

    const isValueValid = useCallback(
        (value: string) => (value ? EMAIL_PATTERN.test(value) : !field.required),
        [field.required],
    );

    const { isValid, handleBlur, resetValidation } = useBlurValidation(
        registerOnBlur,
        isValueValid,
    );

    return (
        <ValidatableInput
            className={styles.default}
            type="email"
            label={field.name}
            placeholder={field.params.placeholder}
            helpText={field.params.helpText}
            isValid={isValid}
            errorMessage="Enter a valid email address"
            useConfirmationColor={false}
            {...registerProps}
            onBlur={handleBlur}
            onFocus={resetValidation}
        />
    );
};
