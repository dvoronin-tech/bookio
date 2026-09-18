import { useFormState, type Control, type FieldValues } from 'react-hook-form';
import { getErrorMessage } from './errors.js';

/**
 * Subscribes to react-hook-form errors for a single field and returns them
 * in a ValidatableInput-friendly shape.
 */
export function useFieldError(control: Control<FieldValues>, key: string) {
    const { errors } = useFormState({ control, name: key });

    return {
        hasError: Boolean(errors[key]),
        errorMessage: getErrorMessage(errors, key),
    };
}
