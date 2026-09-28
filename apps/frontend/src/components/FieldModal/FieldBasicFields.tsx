import { type FC, useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
    Input,
    SelectDropdown,
    type SelectDropdownOption,
    ValidatableInput,
} from '@bookio/ui';
import type { FieldModalFormValues } from '@bookio/backend/schemas';
import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore';

interface FieldBasicFieldsProps {
    fieldId?: string | null;
}

// Field keys can't contain spaces (fieldKeySchema), so this sentinel never collides
const NO_GROUP_OPTION = 'No group';
const KEY_HELP_TEXT =
    "The key is used to identify the field in the booking form. It must be unique within the booking form. You won't be able to change that name in the future";
const KEY_HELP_TEXT_ON_EDIT = 'You cant change that param';

export const FieldBasicFields: FC<FieldBasicFieldsProps> = ({ fieldId }) => {
    const { register, setValue, control } =
        useFormContext<FieldModalFormValues>();
    const watchedParentId = useWatch({ control, name: 'parentId' });
    const watchedType = useWatch({ control, name: 'type' });
    const watchedKey = useWatch({ control, name: 'key' });
    const bookingFormFields = useBookingFormConfiguratorStore(
        (s) => s.bookingFormFields,
    );

    const groupOptions = useMemo(
        () => [
            NO_GROUP_OPTION,
            ...(bookingFormFields?.fields
                .filter((field) => field.type === 'group')
                .map((field) => field.key) ?? []),
        ],
        [bookingFormFields],
    );

    const selectedGroup = useMemo(() => {
        if (!watchedParentId) return NO_GROUP_OPTION;

        return (
            bookingFormFields?.fields.find(
                (field) => field.id === watchedParentId,
            )?.key ?? NO_GROUP_OPTION
        );
    }, [bookingFormFields, watchedParentId]);

    const onSelectGroup = useCallback(
        (option: SelectDropdownOption) => {
            if (option === NO_GROUP_OPTION) {
                setValue('parentId', '');
                return;
            }

            const group = bookingFormFields?.fields.find(
                (field) => field.key === option,
            );
            setValue('parentId', group?.id ?? '');
        },
        [bookingFormFields, setValue],
    );

    const isKeyValid = useMemo(() => {
        if (!watchedKey?.trim()) return undefined;

        const conflictingField = bookingFormFields?.fields.find(
            (field) => field.key === watchedKey && field.id !== fieldId,
        );

        if (conflictingField) return false;

        // Keep neutral while the original key is unchanged in edit mode
        if (fieldId) {
            const originalField = bookingFormFields?.fields.find(
                (field) => field.id === fieldId,
            );
            if (originalField?.key === watchedKey) return undefined;
        }

        return true;
    }, [bookingFormFields, watchedKey, fieldId]);

    return (
        <>
            <Input label="Label*" {...register('name')} />
            <ValidatableInput
                label="Key*"
                {...register('key')}
                disabled={!!fieldId}
                isValid={isKeyValid}
                errorMessage="Key must be unique"
                helpText={fieldId ? KEY_HELP_TEXT_ON_EDIT : KEY_HELP_TEXT}
            />
            {watchedType !== 'group' && (
                <SelectDropdown
                    options={groupOptions}
                    selected={selectedGroup}
                    onOptionClick={onSelectGroup}
                    searchPlaceholder="Search group"
                    placeholder="No group selected"
                    emptyOptionsText="No groups found"
                    label="Group"
                    withSearch
                />
            )}
        </>
    );
};
