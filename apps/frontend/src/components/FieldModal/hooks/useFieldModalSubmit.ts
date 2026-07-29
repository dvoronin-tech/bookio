import { v7 as uuid7 } from 'uuid';
import toast from 'react-hot-toast';
import { useShallow } from 'zustand/shallow';
import { createModalFieldSchema, type FieldModalFormValues } from '@bookio/backend/schemas';
import type { EntireBookingFormField } from '#api/bookingForms/getEntireBookingFormById';
import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore';
import {
    flattenBookingFormFields,
    getNextSiblingFieldOrder,
} from '#utils/dataPreparers/bookingFormPreparers';
import { normalizeFieldParams } from '../utils/fieldModalParams';

interface UseFieldModalSubmitParams {
    fieldId?: string | null;
    bookingFormId: string;
    existingFields: EntireBookingFormField[];
    onSuccess: () => void;
}

export const useFieldModalSubmit = ({
    fieldId,
    bookingFormId,
    existingFields,
    onSuccess,
}: UseFieldModalSubmitParams) => {
    const { setBookingFormFields, bookingFormFields } = useBookingFormConfiguratorStore(
        useShallow(({ setBookingFormFields, bookingFormFields }) => ({
            setBookingFormFields,
            bookingFormFields,
        })),
    );

    return (formData: FieldModalFormValues) => {
        const currentFields = bookingFormFields?.fields ?? flattenBookingFormFields(existingFields);

        const existingField = fieldId
            ? currentFields.find((field) => field.id === fieldId)
            : undefined;

        if (fieldId && !existingField) {
            onSuccess();
            return;
        }

        const result = createModalFieldSchema.safeParse({
            ...formData,
            id: existingField?.id ?? uuid7(),
            parentId: existingField?.parentId ?? null,
            order: existingField?.order ?? getNextSiblingFieldOrder(currentFields, null),
            required: formData.required ?? false,
            params: normalizeFieldParams(formData.type, formData.params),
        });

        if (!result.success) {
            result.error.issues.forEach((issue) => {
                toast.error(issue.message, {
                    position: 'top-right',
                    duration: 4000,
                });
            });
            return;
        }

        const nextFields = existingField
            ? currentFields.map((field) => (field.id === existingField.id ? result.data : field))
            : [...currentFields, result.data];

        setBookingFormFields({
            bookingFormId,
            fields: nextFields,
        });

        onSuccess();
    };
};
