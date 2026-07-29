import type { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@bookio/ui';
import type { FieldModalFormValues } from '@bookio/backend/schemas';

export const FieldBasicFields: FC = () => {
    const { register } = useFormContext<FieldModalFormValues>();

    return (
        <>
            <Input label="Label" {...register('name')} />
            <Input label="Key" {...register('key')} />
        </>
    );
};
