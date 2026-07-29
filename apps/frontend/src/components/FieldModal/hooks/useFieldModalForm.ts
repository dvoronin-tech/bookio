import { useLayoutEffect } from 'react';
import { useForm, useWatch, type UseFormReturn } from 'react-hook-form';
import type { FieldModalFormValues } from '@bookio/backend/schemas';
import type { EntireBookingFormField } from '#api/bookingForms/getEntireBookingFormById';
import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore';
import { flattenBookingFormFields } from '#utils/dataPreparers/bookingFormPreparers';
import { getChoiceOptionsFromParams } from '../utils/fieldModalParams';

interface UseFieldModalFormParams {
    open: boolean;
    fieldId?: string | null;
    existingFields: EntireBookingFormField[];
    onOpenChange: (open: boolean) => void;
}

export const useFieldModalForm = ({
    open,
    fieldId,
    existingFields,
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

        const currentFields =
            bookingFormFields?.fields ?? flattenBookingFormFields(existingFields);
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
            params: existingField.params,
        });
    }, [open, fieldId, bookingFormFields, existingFields, onOpenChange, reset]);

    useLayoutEffect(() => {
        const options = getChoiceOptionsFromParams(type, params);
        if (options.length === 0 || options.every((option) => option.id)) return;

        setValue('params.options', options);
    }, [type, params, setValue]);

    return methods;
};
