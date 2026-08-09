import { useLayoutEffect } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import type { FieldModalFormValues } from '@bookio/backend/schemas';
import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore';

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

    const { reset } = methods;

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

    return methods;
};
