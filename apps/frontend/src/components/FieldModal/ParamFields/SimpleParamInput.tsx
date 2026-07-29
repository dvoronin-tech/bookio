import type { FC } from 'react';
import { useFormContext, type FieldPath } from 'react-hook-form';
import type { FieldModalFormValues } from '@bookio/backend/schemas';
import { Input } from '@bookio/ui';

interface SimpleParamInputProps {
    name: string;
    label: string;
    type: 'text' | 'checkbox' | 'number';
}

export const SimpleParamInput: FC<SimpleParamInputProps> = ({ name, label, type }) => {
    const { register } = useFormContext<FieldModalFormValues>();
    const fieldPath = `params.${name}` as FieldPath<FieldModalFormValues>;

    if (type === 'number') {
        return (
            <Input label={label} type="number" {...register(fieldPath, { valueAsNumber: true })} />
        );
    }

    if (type === 'checkbox') {
        return <Input label={label} type="checkbox" {...register(fieldPath)} />;
    }

    return <Input label={label} type="text" {...register(fieldPath)} />;
};
