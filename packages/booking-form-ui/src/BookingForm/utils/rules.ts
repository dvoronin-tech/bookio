export function getRequiredRule(
    field: { name: string; required?: boolean },
    message: string,
) {
    return field.required ? message : false;
}
