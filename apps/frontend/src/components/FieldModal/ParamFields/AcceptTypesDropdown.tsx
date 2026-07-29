import { useMemo, type FC, useCallback } from 'react';
import {
    SelectDropdown,
    type SelectDropdownOption,
} from '#components/SelectDropdown/SelectDropdown';
import type { AcceptOptions } from '#utils/paramsFieldConfig';

interface AcceptTypesDropdownProps {
    label: string;
    options: AcceptOptions;
    selected: string[];
    onToggleOption: (mimeType: string) => void;
}

export const AcceptTypesDropdown: FC<AcceptTypesDropdownProps> = ({
    label,
    options,
    selected,
    onToggleOption,
}) => {
    const dropdownOptions = useMemo<SelectDropdownOption[]>(
        () =>
            Object.entries(options).map(([extension, mimeType]) => ({
                label: extension,
                value: mimeType,
            })),
        [options],
    );

    const formatSelectedCount = useCallback((count: number) => `${count} types selected`, []);

    return (
        <SelectDropdown
            label={label}
            options={dropdownOptions}
            selected={selected}
            onOptionClick={onToggleOption}
            placeholder="Select allowed types"
            searchPlaceholder="Search types..."
            emptyOptionsText="No types found"
            formatSelectedCount={formatSelectedCount}
            placement="top"
        />
    );
};
