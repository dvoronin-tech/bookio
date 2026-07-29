import { useCallback, useMemo, type FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { FieldModalFormValues } from '@bookio/backend/schemas';
import type { AcceptOptions } from '#utils/paramsFieldConfig';
import { SelectDropdown } from './SelectDropdown';

interface AcceptTypesFieldProps {
    label: string;
    options: AcceptOptions;
}

export const AcceptTypesField: FC<AcceptTypesFieldProps> = ({ label, options }) => {
    const { control, setValue } = useFormContext<FieldModalFormValues>();
    const watchedAccept = useWatch({ control, name: 'params.accept' });
    const selectedAcceptTypes = useMemo(() => watchedAccept ?? [], [watchedAccept]);

    const handleToggleAcceptType = useCallback(
        (acceptType: string) => {
            const nextAccept = selectedAcceptTypes.includes(acceptType)
                ? selectedAcceptTypes.filter((item) => item !== acceptType)
                : [...selectedAcceptTypes, acceptType];

            setValue('params.accept', nextAccept.length > 0 ? nextAccept : undefined);
        },
        [selectedAcceptTypes, setValue],
    );

    return (
        <SelectDropdown
            label={label}
            options={options}
            selectedOptions={selectedAcceptTypes}
            onClickOption={handleToggleAcceptType}
        />
    );
};
