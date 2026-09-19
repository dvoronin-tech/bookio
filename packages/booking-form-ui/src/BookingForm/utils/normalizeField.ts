import type { BookingFormFieldInput } from '../fields/field.types.js';

export function normalizeField(
    field: BookingFormFieldInput,
): BookingFormFieldInput {
    return {
        ...field,
        required: field.required ?? false,
        params: field.params ?? {},
    };
}
