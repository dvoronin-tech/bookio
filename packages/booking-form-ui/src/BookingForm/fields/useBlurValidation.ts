import { useCallback, useState, type FocusEvent } from 'react';

export function useBlurValidation(
    registerOnBlur: (event: FocusEvent<HTMLInputElement>) => unknown,
    isValueValid: (value: string) => boolean,
) {
    const [isValid, setIsValid] = useState<boolean | null>(null);

    const handleBlur = useCallback(
        (event: FocusEvent<HTMLInputElement>) => {
            registerOnBlur(event);
            setIsValid(isValueValid(event.target.value) ? null : false);
        },
        [registerOnBlur, isValueValid],
    );

    const resetValidation = useCallback(() => setIsValid(null), []);

    return { isValid, handleBlur, resetValidation };
}
