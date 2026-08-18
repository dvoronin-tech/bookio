import { useState, type FC, type ChangeEvent, useCallback } from 'react';
import * as Flags from 'country-flag-icons/react/3x2';
import { hasFlag } from 'country-flag-icons';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { Input } from '@bookio/ui';
import type { FieldControlProps } from '#/components/Fields/field.types';
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
    const placeholder = 'placeholder' in field.params ? field.params.placeholder : undefined;
    const helpText = 'helpText' in field.params ? field.params.helpText : undefined;

    const [country, setCountry] = useState(DEFAULT_COUNTRY);
    const Flag = getCountryFlag(country);

    const { onChange: registerOnChange, ...registerProps } = register(field.key);

    const handleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            registerOnChange(event);
            setCountry(parsePhoneNumberFromString(event.target.value)?.country ?? DEFAULT_COUNTRY);
        },
        [registerOnChange],
    );

    return (
        <Input.Root>
            {Flag && (
                <Input.Icon className={styles.flag} position="start">
                    <Flag className={styles.countryFlag} data-multicolor />
                </Input.Icon>
            )}
            <Input
                className={styles.default}
                type="tel"
                placeholder={placeholder}
                helpText={helpText}
                {...registerProps}
                onChange={handleChange}
            />
        </Input.Root>
    );
};
