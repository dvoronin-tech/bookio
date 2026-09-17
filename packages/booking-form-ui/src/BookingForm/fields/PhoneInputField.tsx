import { useCallback, useState, type ChangeEvent, type FC } from 'react';
import { hasFlag } from 'country-flag-icons';
import * as FlagSvgs from 'country-flag-icons/string/3x2';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { Input, ValidatableInput } from '@bookio/ui';
import type { FieldControlProps } from './field.types.js';
import { useBlurValidation } from './useBlurValidation.js';
import styles from './Fields.module.scss';

const DEFAULT_COUNTRY = 'BY';

function getCountryFlagSrc(country: string | undefined) {
    if (!country || !hasFlag(country)) {
        return null;
    }

    const svg = FlagSvgs[country as keyof typeof FlagSvgs];

    if (typeof svg !== 'string') {
        return null;
    }

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const PhoneInputField: FC<FieldControlProps<'phone'>> = ({ field, register }) => {
    const { placeholder, helpText } = field.params;

    const [country, setCountry] = useState(DEFAULT_COUNTRY);
    const flagSrc = getCountryFlagSrc(country);

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
            {flagSrc && (
                <Input.Icon className={styles.flag} position="start">
                    <img className={styles.countryFlag} src={flagSrc} alt="" draggable={false} />
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
