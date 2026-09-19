export const formatLabel = (
    markRequiredFields: boolean,
    label: string,
    required: boolean,
) => {
    if (!markRequiredFields) return label;
    return `${label}${required ? ' *' : ''}`;
};
