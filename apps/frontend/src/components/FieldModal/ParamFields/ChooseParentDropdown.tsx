import { memo, type FC, useCallback } from 'react';
import {
    SelectDropdown,
    type SelectDropdownOption,
} from '#components/SelectDropdown/SelectDropdown';

interface ChooseParentDropdownProps {
    options: SelectDropdownOption[];
    selected: string | undefined;
    onOptionClick: (value: string) => void;
}

export const ChooseParentDropdown: FC<ChooseParentDropdownProps> = memo(
    ({ options, selected, onOptionClick }) => {
        const formatSelectedCount = useCallback((count: number) => `${count} groups selected`, []);

        return (
            <SelectDropdown
                options={options}
                selected={selected}
                onOptionClick={onOptionClick}
                searchPlaceholder="Search group"
                placeholder='No group selected'
                emptyOptionsText='No groups found'
                formatSelectedCount={formatSelectedCount}
                label='Group'
            />
        );
    },
);
