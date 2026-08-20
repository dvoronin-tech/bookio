import { useCallback, useState, type ChangeEvent, type FC } from 'react';
import * as Flags from 'country-flag-icons/react/3x2';
import { hasFlag } from 'country-flag-icons';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { Input, ValidatableInput } from '@bookio/ui';
import type { FieldControlProps } from '#/components/Fields/field.types';
import { useBlurValidation } from '#/components/Fields/useBlurValidation';
import styles from '../Fields.module.scss';

const DEFAULT_COUNTRY = 'BY';

function getCountryFlag(country: string | undefined) {
    if (!country || !hasFlag(country)) {
        return null;
    }

    const Flag = Flags[country as keyof typeof Flags];
    return typeof Flag === 'function' ? Flag : null;
}

export const PhoneInputField: FC<FieldControlProps<'phone'>> = ({ field, register }) => {
    const { placeholder, helpText } = field.params;

    const [country, setCountry] = useState(DEFAULT_COUNTRY);
    const Flag = getCountryFlag(country);

    const {
        onChange: registerOnChange,
        onBlur: registerOnBlur,
        ...registerProps
    } = register(field.key);

    const handleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            registerOnChange(event);
            setCountry(parsePhoneNumberFromString(event.target.value)?.country ?? DEFAULT_COUNTRY);
        },
        [registerOnChange],
    );

    const isValueValid = useCallback(
        (value: string) => {
            const phone = parsePhoneNumberFromString(value);

            // Bare dial code (e.g. the prefilled "+375") counts as empty
            if (!phone || !phone.nationalNumber) {
                return !field.required;
            }

            return phone.isValid();
        },
        [field.required],
    );

    const { isValid, handleBlur, resetValidation } = useBlurValidation(
        registerOnBlur,
        isValueValid,
    );

    return (
        <Input.Root>
            {Flag && (
                <Input.Icon className={styles.flag} position="start">
                    <Flag className={styles.countryFlag} data-multicolor />
                </Input.Icon>
            )}
            <ValidatableInput
                className={styles.default}
                type="tel"
                placeholder={placeholder}
                helpText={helpText}
                isValid={isValid}
                errorMessage="Enter a valid phone number"
                useConfirmationColor={false}
                {...registerProps}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={resetValidation}
            />
        </Input.Root>
    );
};
