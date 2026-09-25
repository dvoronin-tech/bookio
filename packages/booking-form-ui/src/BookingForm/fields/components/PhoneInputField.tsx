import { type FC } from 'react';
import { Controller } from 'react-hook-form';
import { Input, ValidatableInput } from '@bookio/ui';
import belarusFlagUrl from './icons/belarus.svg?url';
import { useBookingFormContext } from '../../BookingFormContext.js';
import type { FieldRendererProps } from '../field.types.js';
import { formatLabel } from '../../utils/formatLabel.js';
import styles from '../Fields.module.scss';
import { clsx } from 'clsx';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const PHONE_PREFIX = '+375';

export function normalizePhoneNumber(value: string): string | null {
    const phone = parsePhoneNumberFromString(`${PHONE_PREFIX}${value}`);
    return phone?.country === 'BY' && phone.isValid() ? phone.number : null;
}

export const PhoneInputField: FC<FieldRendererProps<'phone'>> = ({ field }) => {
    const { formState, control, markRequiredFields } = useBookingFormContext();
    const disabled = formState === 'loading';
    const { placeholder, helpText } = field.params;
    const label = formatLabel(markRequiredFields, field.name, field.required);

    return (
        <Controller
            name={field.key}
            control={control}
            defaultValue=""
            rules={{
                validate: (value: string) =>
                    (!field.required && !value.trim()) ||
                    Boolean(normalizePhoneNumber(value)) ||
                    'Enter a valid phone number',
            }}
            render={({
                field: { value, onChange, onBlur, ref },
                fieldState,
            }) => (
                <Input.Field label={label} htmlFor={field.key}>
                    <Input.Root>
                        <Input.Icon className={styles.flag} position="start">
                            <img
                                className={styles.countryFlag}
                                src={belarusFlagUrl}
                                alt=""
                                draggable={false}
                            />
                            <span>{PHONE_PREFIX}</span>
                        </Input.Icon>
                        <ValidatableInput
                            id={field.key}
                            ref={ref}
                            name={field.key}
                            className={clsx(styles.default, styles.phoneInput)}
                            type="tel"
                            inputMode="numeric"
                            placeholder={placeholder}
                            helpText={helpText}
                            isValid={fieldState.error ? false : null}
                            errorMessage={fieldState.error?.message}
                            useConfirmationColor={false}
                            value={typeof value === 'string' ? value : ''}
                            onChange={onChange}
                            onBlur={onBlur}
                            disabled={disabled}
                        />
                    </Input.Root>
                </Input.Field>
            )}
        />
    );
};
