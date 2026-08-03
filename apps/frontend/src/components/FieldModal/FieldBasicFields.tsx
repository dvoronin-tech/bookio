import { useCallback, type FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Input } from '@bookio/ui';
import type { FieldModalFormValues } from '@bookio/backend/schemas';
import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore';
import { ChooseParentDropdown } from './ParamFields/ChooseParentDropdown';
import type { SelectDropdownOption } from '#components/SelectDropdown/SelectDropdown';

export const FieldBasicFields: FC = () => {
    const { register, setValue, control } = useFormContext<FieldModalFormValues>();
    const watchedParentId = useWatch({ control, name: 'parentId' });
    const watchedType = useWatch({ control, name: 'type' });
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

    return (
        <>
            <Input label="Label*" {...register('name')} />
            <Input label="Key*" {...register('key')} />
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
