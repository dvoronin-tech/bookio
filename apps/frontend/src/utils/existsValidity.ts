export function toExistsIsValid(
    exists: boolean | undefined,
    options?: { currentValue?: string; unchangedValue?: string },
): boolean | undefined {
    if (
        options?.unchangedValue !== undefined &&
        options?.currentValue === options.unchangedValue
    ) {
        return undefined;
    }

    return exists === undefined ? undefined : !exists;
}
