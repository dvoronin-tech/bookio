import { memo, type FC } from 'react';
import { SelectDropdown, type SelectDropdownOption } from '@bookio/ui';

interface ChooseParentDropdownProps {
    options: SelectDropdownOption[];
    selected: string | undefined;
    onOptionClick: (value: string) => void;
}

export const ChooseParentDropdown: FC<ChooseParentDropdownProps> = memo(
    ({ options, selected, onOptionClick }) => {
        return (
            <SelectDropdown
                options={options}
                selected={selected}
                onOptionClick={onOptionClick}
                searchPlaceholder="Search group"
                placeholder='No group selected'
                emptyOptionsText='No groups found'
                label='Group'
                withSearch
            />
        );
    },
);
