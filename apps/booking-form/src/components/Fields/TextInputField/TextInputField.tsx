import type { ChangeEvent, FC } from 'react';
import { Input } from '@bookio/ui';

interface TextInputFieldProps {
    placeholder: string;
    label: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    helpText: string | undefined;
}

export const TextInputField: FC<TextInputFieldProps> = ({
    placeholder,
    label,
    value,
    onChange,
    helpText,
}) => {
    return (
        <Input
            placeholder={placeholder}
            label={label}
            value={value}
            onChange={onChange}
            helpText={helpText}
        />
    );
};
