import { useDebounce } from 'use-debounce';

const DEFAULT_DELAY_MS = 500;

/**
 * Validates `value` after the user stops changing it for `delay` ms.
 * Returns `undefined` while the value is still settling so stale errors don't flash.
 *
 * @returns error message, or `undefined` when valid / still waiting
 */
export function useDebouncedValidation<T>(
    value: T,
    validate: (value: T) => string | undefined,
    delay = DEFAULT_DELAY_MS,
): string | undefined {
    const [debouncedValue] = useDebounce(value, delay);
    const isSettled = value === debouncedValue;

    if (!isSettled) {
        return undefined;
    }

    return validate(debouncedValue);
}
