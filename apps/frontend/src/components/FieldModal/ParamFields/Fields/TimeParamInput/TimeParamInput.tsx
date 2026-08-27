import type { FC } from 'react';
import { Controller, useFormContext, type FieldPath } from 'react-hook-form';
import type { FieldModalFormValues } from '@bookio/backend/schemas';
import { TimePicker } from '@bookio/ui';

interface TimeParamInputProps {
    name: string;
    label: string;
}

export const TimeParamInput: FC<TimeParamInputProps> = ({ name, label }) => {
    const { control } = useFormContext<FieldModalFormValues>();
    const fieldPath = `params.${name}` as FieldPath<FieldModalFormValues>;

    return (
        <Controller
            name={fieldPath}
            control={control}
            render={({ field: { value, onChange } }) => (
                <TimePicker
                    label={label}
                    value={typeof value === 'string' ? value : ''}
                    onChange={onChange}
                />
            )}
        />
    );
};
