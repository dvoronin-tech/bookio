import type { FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { FieldModalFormValues } from '@bookio/backend/schemas';
import { RequiredRow } from '#components/RequiredRow/RequiredRow';

export const FieldRequiredToggle: FC = () => {
    const { control, setValue } = useFormContext<FieldModalFormValues>();
    const required = useWatch({ control, name: 'required' });

    return (
        <RequiredRow
            checked={required ?? false}
            onCheckedChange={(value) => setValue('required', value)}
        />
    );
};
