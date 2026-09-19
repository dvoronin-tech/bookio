import { useCallback, useState, type ChangeEvent, type FC } from 'react';
import { hasFlag } from 'country-flag-icons';
import * as FlagSvgs from 'country-flag-icons/string/3x2';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { Input, ValidatableInput } from '@bookio/ui';
import { getRequiredRule } from '../../utils/rules.js';
import { useFieldError } from '../../utils/useFieldError.js';
import type { FieldControlProps } from '../field.types.js';
import { formatLabel } from '../../utils/formatLabel.js';
import styles from '../Fields.module.scss';

const DEFAULT_COUNTRY = 'BY';
const INVALID_PHONE_MESSAGE = 'Enter a valid phone number';

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

export const PhoneInputField: FC<FieldControlProps<'phone'>> = ({
    field,
    register,
    control,
    markRequiredFields,
}) => {
    const { placeholder, helpText } = field.params;
    const label = formatLabel(markRequiredFields, field.name, field.required);

    const [country, setCountry] = useState(DEFAULT_COUNTRY);
    const flagSrc = getCountryFlagSrc(country);

    const { hasError, errorMessage } = useFieldError(control, field.key);

    const { onChange: registerOnChange, ...registerProps } = register(field.key, {
        required: getRequiredRule(field),
        validate: (value: string) => {
            const phone = parsePhoneNumberFromString(value);

            // Empty value or bare country code (e.g. the "+375" default) counts
            // as "not filled" — only acceptable when the field is optional.
            if (!phone || !phone.nationalNumber) {
                return !field.required || INVALID_PHONE_MESSAGE;
            }

            return phone.isValid() || INVALID_PHONE_MESSAGE;
        },
    });

    const handleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            registerOnChange(event);
            setCountry(parsePhoneNumberFromString(event.target.value)?.country ?? DEFAULT_COUNTRY);
        },
        [registerOnChange],
    );

    return (
        <Input.Field label={label}>
            <Input.Root>
                {flagSrc && (
                    <Input.Icon className={styles.flag} position="start">
                        <img
                            className={styles.countryFlag}
                            src={flagSrc}
                            alt=""
                            draggable={false}
                        />
                    </Input.Icon>
                )}
                <ValidatableInput
                    className={styles.default}
                    type="tel"
                    placeholder={placeholder}
                    helpText={helpText}
                    isValid={hasError ? false : null}
                    errorMessage={errorMessage}
                    useConfirmationColor={false}
                    {...registerProps}
                    onChange={handleChange}
                />
            </Input.Root>
        </Input.Field>
    );
};
