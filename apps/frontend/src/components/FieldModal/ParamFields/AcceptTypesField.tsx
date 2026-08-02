import { useCallback, useMemo, type FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { FieldModalFormValues } from '@bookio/backend/schemas';
import type { AcceptOptions } from '#utils/paramsFieldConfig';
import {
    AcceptTypesDropdown,
    getDisplayedAcceptTypes,
    toggleAcceptType,
} from './AcceptTypesDropdown';

interface AcceptTypesFieldProps {
    label: string;
    options: AcceptOptions;
}

export const AcceptTypesField: FC<AcceptTypesFieldProps> = ({ label, options }) => {
    const { control, setValue } = useFormContext<FieldModalFormValues>();
    const watchedAccept = useWatch({ control, name: 'params.accept' });
    const displayedSelected = useMemo(
        () => getDisplayedAcceptTypes(watchedAccept),
        [watchedAccept],
    );

    const handleToggleAcceptType = useCallback(
        (acceptType: string) => {
            setValue('params.accept', toggleAcceptType(watchedAccept, acceptType));
        },
        [watchedAccept, setValue],
    );

    return (
        <AcceptTypesDropdown
            label={label}
            options={options}
            selected={displayedSelected}
            onToggleOption={handleToggleAcceptType}
        />
    );
};
