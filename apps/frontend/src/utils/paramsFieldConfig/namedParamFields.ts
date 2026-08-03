/** Attach param key as `name` for form `register` on simple fields. */
export function namedParamFields<T extends { type: string }>(
    config: Record<string, T>,
): Array<T & { name: string }>;
export function namedParamFields<T extends { type: string }, TSkip extends T['type']>(
    config: Record<string, T>,
    skipType: TSkip,
): Array<Extract<T, { type: TSkip }> | (Exclude<T, { type: TSkip }> & { name: string })>;
export function namedParamFields<T extends { type: string }, TSkip extends T['type'] | undefined>(
    config: Record<string, T>,
    skipType?: TSkip,
): Array<T | (T & { name: string })> {
    return Object.entries(config).map(([name, field]) => {
        const shouldSkipNaming = skipType !== undefined && field.type === skipType;

        if (shouldSkipNaming) {
            return field;
        }

        return { ...field, name };
    });
}
