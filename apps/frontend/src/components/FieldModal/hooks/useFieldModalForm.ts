import { useLayoutEffect } from 'react';
import { useForm, useWatch, type UseFormReturn } from 'react-hook-form';
import type { FieldModalFormValues } from '@bookio/backend/schemas';
import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore';
import { getChoiceOptionsFromParams } from '../utils/fieldModalParams';

interface UseFieldModalFormParams {
    open: boolean;
    fieldId?: string | null;
    onOpenChange: (open: boolean) => void;
}

export const useFieldModalForm = ({
    open,
    fieldId,
    onOpenChange,
}: UseFieldModalFormParams): UseFormReturn<FieldModalFormValues> => {
    const bookingFormFields = useBookingFormConfiguratorStore((state) => state.bookingFormFields);

    const methods = useForm<FieldModalFormValues>({
        defaultValues: {},
    });

    const { reset, setValue, control } = methods;
    const type = useWatch({ control, name: 'type' });
    const params = useWatch({ control, name: 'params' });

    useLayoutEffect(() => {
        if (!open) return;

        if (!fieldId) {
            reset({});
            return;
        }

        const currentFields = bookingFormFields?.fields ?? [];
        const existingField = currentFields.find((field) => field.id === fieldId);

        if (!existingField) {
            onOpenChange(false);
            return;
        }

        reset({
            name: existingField.name,
            key: existingField.key,
            type: existingField.type,
            required: existingField.required,
            parentId: existingField.parentId,
            params: existingField.params,
        });
    }, [open, fieldId, bookingFormFields, onOpenChange, reset]);

    useLayoutEffect(() => {
        const options = getChoiceOptionsFromParams(type, params);
        if (options.length === 0 || options.every((option) => option.id)) return;

        setValue('params.options', options);
    }, [type, params, setValue]);

    return methods;
};
