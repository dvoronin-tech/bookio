import type { FC } from 'react';
import { useFormContext, type FieldPath } from 'react-hook-form';
import type { FieldModalFormValues } from '@bookio/backend/schemas';
import { Input } from '@bookio/ui';

interface SimpleParamInputProps {
    name: string;
    label: string;
    type: 'text' | 'checkbox' | 'number';
    min?: number;
    max?: number;
}

export const SimpleParamInput: FC<SimpleParamInputProps> = ({ name, label, type, min, max }) => {
    const { register } = useFormContext<FieldModalFormValues>();
    const fieldPath = `params.${name}` as FieldPath<FieldModalFormValues>;

    if (type === 'number') {
        return (
            <Input
                label={label}
                type="number"
                min={min}
                max={max}
                {...register(fieldPath, {
                    valueAsNumber: true,
                    ...(min !== undefined && {
                        min: { value: min, message: `Minimum value is ${min}` },
                    }),
                    ...(max !== undefined && {
                        max: { value: max, message: `Maximum value is ${max}` },
                    }),
                })}
            />
        );
    }

    if (type === 'checkbox') {
        return <Input label={label} type="checkbox" {...register(fieldPath)} />;
    }

    return <Input label={label} type="text" {...register(fieldPath)} />;
};
