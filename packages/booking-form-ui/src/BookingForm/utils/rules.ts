export function getRequiredRule(field: { name: string; required?: boolean }) {
    return field.required ? `${field.name} is required` : false;
}
