export function formatParamFieldLabel(label: string, required?: boolean): string {
    return required ? `${label}*` : label;
}
