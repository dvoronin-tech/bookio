import { useCallback, type FC, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Input } from '@bookio/ui';
import type { FieldModalFormValues } from '@bookio/backend/schemas';
import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore';
import { ChooseParentDropdown } from './ParamFields/ChooseParentDropdown';
import type { SelectDropdownOption } from '#components/SelectDropdown/SelectDropdown';
import { ValidatableInput } from '#components/ValidatableInput/ValidatableInput';

interface FieldBasicFieldsProps {
    fieldId?: string | null;
}

export const FieldBasicFields: FC<FieldBasicFieldsProps> = ({ fieldId }) => {
    const { register, setValue, control } = useFormContext<FieldModalFormValues>();
    const watchedParentId = useWatch({ control, name: 'parentId' });
    const watchedType = useWatch({ control, name: 'type' });
    const watchedKey = useWatch({ control, name: 'key' });
    const bookingFormFields = useBookingFormConfiguratorStore((s) => s.bookingFormFields);

    const noGroupOption: SelectDropdownOption = { label: 'No group', value: '' };

    const groupFields: SelectDropdownOption[] =
        bookingFormFields?.fields
            .filter((field) => field.type === 'group')
            .map((field) => ({
                label: field.key,
                value: field.id,
            })) ?? [];

    const onSelectGroup = useCallback(
        (value: string) => {
            setValue('parentId', value);
        },
        [setValue],
    );

    const isKeyValid = useMemo(() => {
        if (!watchedKey?.trim()) return undefined;

        const conflictingField = bookingFormFields?.fields.find(
            (field) => field.key === watchedKey && field.id !== fieldId,
        );

        if (conflictingField) return false;

        // Keep neutral while the original key is unchanged in edit mode
        if (fieldId) {
            const originalField = bookingFormFields?.fields.find((field) => field.id === fieldId);
            if (originalField?.key === watchedKey) return undefined;
        }

        return true;
    }, [bookingFormFields, watchedKey, fieldId]);

    return (
        <>
            <Input label="Label*" {...register('name')} />
            <ValidatableInput label="Key*" {...register('key')} isValid={isKeyValid} errorMessage='Key must be unique' />
            {watchedType !== 'group' && (
                <ChooseParentDropdown
                    options={[noGroupOption, ...groupFields]}
                    selected={watchedParentId ?? undefined}
                    onOptionClick={onSelectGroup}
                />
            )}
        </>
    );
};
