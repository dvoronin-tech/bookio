import type { FC } from 'react';
import { Controller, useFormContext, type FieldPath } from 'react-hook-form';
import type { FieldModalFormValues } from '@bookio/backend/schemas';
import { SelectDropdown, type SelectDropdownOption } from '@bookio/ui';

interface SelectFieldProps {
    name: string;
    label: string;
    options: SelectDropdownOption[];
    multiple?: boolean;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyOptionsText?: string;
    withSearch?: boolean;
}

const toSelectedSingle = (value: unknown): SelectDropdownOption | undefined => {
    if (typeof value === 'string' && value !== '') return value;
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    return undefined;
};

const toSelectedMultiple = (value: unknown): SelectDropdownOption[] => {
    if (Array.isArray(value)) {
        return value.filter(
            (item): item is SelectDropdownOption =>
                (typeof item === 'string' && item !== '') ||
                (typeof item === 'number' && Number.isFinite(item)),
        );
    }
    const single = toSelectedSingle(value);
    return single === undefined ? [] : [single];
};

const toggleMultipleValue = (
    selected: SelectDropdownOption[],
    nextValue: SelectDropdownOption,
): SelectDropdownOption[] =>
    selected.includes(nextValue)
        ? selected.filter((item) => item !== nextValue)
        : [...selected, nextValue];

export const SelectField: FC<SelectFieldProps> = ({
    name,
    label,
    options,
    multiple,
    placeholder,
    searchPlaceholder,
    emptyOptionsText,
    withSearch,
}) => {
    const { control } = useFormContext<FieldModalFormValues>();
    const fieldPath = `params.${name}` as FieldPath<FieldModalFormValues>;

    return (
        <Controller
            name={fieldPath}
            control={control}
            render={({ field: { value, onChange } }) => {
                if (multiple) {
                    const selected = toSelectedMultiple(value);

                    return (
                        <SelectDropdown
                            label={label}
                            options={options}
                            selected={selected}
                            onOptionClick={(nextValue) =>
                                onChange(toggleMultipleValue(selected, nextValue))
                            }
                            placeholder={placeholder}
                            multiple
                            searchPlaceholder={searchPlaceholder}
                            emptyOptionsText={emptyOptionsText}
                            withSearch={withSearch}
                        />
                    );
                }

                return (
                    <SelectDropdown
                        label={label}
                        options={options}
                        selected={toSelectedSingle(value)}
                        onOptionClick={onChange}
                        placeholder={placeholder}
                        searchPlaceholder={searchPlaceholder}
                        emptyOptionsText={emptyOptionsText}
                        withSearch={withSearch}
                    />
                );
            }}
        />
    );
};
