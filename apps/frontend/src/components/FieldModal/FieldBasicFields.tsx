import { type FC, useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
    Input,
    SelectDropdown,
    type SelectDropdownOption,
    ValidatableInput,
} from '@bookio/ui';
import {
    fieldKeySchema,
    type FieldModalFormValues,
} from '@bookio/backend/schemas';
import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore';
import { m } from '#i18n/messages';

interface FieldBasicFieldsProps {
    fieldId?: string | null;
}

export const FieldBasicFields: FC<FieldBasicFieldsProps> = ({ fieldId }) => {
    const { register, setValue, control } =
        useFormContext<FieldModalFormValues>();
    const watchedParentId = useWatch({ control, name: 'parentId' });
    const watchedType = useWatch({ control, name: 'type' });
    const watchedKey = useWatch({ control, name: 'key' });
    const bookingFormFields = useBookingFormConfiguratorStore(
        (s) => s.bookingFormFields,
    );
    const noGroupOption = m.field_no_group();

    const groupOptions = useMemo(
        () => [
            noGroupOption,
            ...(bookingFormFields?.fields
                .filter((field) => field.type === 'group')
                .map((field) => field.key) ?? []),
        ],
        [bookingFormFields, noGroupOption],
    );

    const selectedGroup = useMemo(() => {
        if (!watchedParentId) return noGroupOption;

        return (
            bookingFormFields?.fields.find(
                (field) => field.id === watchedParentId,
            )?.key ?? noGroupOption
        );
    }, [bookingFormFields, watchedParentId, noGroupOption]);

    const onSelectGroup = useCallback(
        (option: SelectDropdownOption) => {
            if (option === noGroupOption) {
                setValue('parentId', '');
                return;
            }

            const group = bookingFormFields?.fields.find(
                (field) => field.key === option,
            );
            setValue('parentId', group?.id ?? '');
        },
        [bookingFormFields, noGroupOption, setValue],
    );

    const { isKeyValid, keyErrorMessage } = useMemo(() => {
        if (!watchedKey) {
            return { isKeyValid: undefined, keyErrorMessage: undefined };
        }

        const formatResult = fieldKeySchema.safeParse(watchedKey);
        if (!formatResult.success) {
            return {
                isKeyValid: false,
                keyErrorMessage:
                    formatResult.error.issues[0]?.message ?? m.field_key_invalid(),
            };
        }

        const conflictingField = bookingFormFields?.fields.find(
            (field) => field.key === watchedKey && field.id !== fieldId,
        );

        if (conflictingField) {
            return {
                isKeyValid: false,
                keyErrorMessage: m.field_key_unique(),
            };
        }

        // Keep neutral while the original key is unchanged in edit mode
        if (fieldId) {
            const originalField = bookingFormFields?.fields.find(
                (field) => field.id === fieldId,
            );
            if (originalField?.key === watchedKey) {
                return { isKeyValid: undefined, keyErrorMessage: undefined };
            }
        }

        return { isKeyValid: true, keyErrorMessage: undefined };
    }, [bookingFormFields, watchedKey, fieldId]);

    return (
        <>
            <Input label={m.field_label()} {...register('name')} />
            <ValidatableInput
                label={m.field_key()}
                {...register('key')}
                disabled={!!fieldId}
                isValid={isKeyValid}
                errorMessage={keyErrorMessage}
                helpText={fieldId ? m.field_key_help_edit() : m.field_key_help()}
            />
            {watchedType !== 'group' && (
                <SelectDropdown
                    options={groupOptions}
                    selected={selectedGroup}
                    onOptionClick={onSelectGroup}
                    searchPlaceholder={m.field_search_group()}
                    placeholder={m.field_no_group_placeholder()}
                    emptyOptionsText={m.field_no_groups()}
                    label={m.field_group()}
                    withSearch
                />
            )}
        </>
    );
};
