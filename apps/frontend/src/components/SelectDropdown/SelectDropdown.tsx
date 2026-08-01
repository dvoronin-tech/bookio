import type { Placement } from '@floating-ui/react';
import { clsx } from 'clsx';
import { useCallback, useMemo, useState, type ChangeEvent, type FC } from 'react';
import { Checkbox, Dropdown, Input } from '@bookio/ui';
import ArrowIcon from '#assets/icons/short-arrow.svg?react';
import styles from './SelectDropdown.module.scss';

export interface SelectDropdownOption {
    label: string;
    value: string;
}

interface SelectDropdownProps {
    label?: string;
    options: SelectDropdownOption[];
    /** `string[]` enables multi-select with checkboxes, `string` — single-select. */
    selected: string[] | string | undefined;
    onOptionClick: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyOptionsText?: string;
    formatSelectedCount?: (count: number) => string;
    placement?: Placement;
}

const defaultFormatSelectedCount = (count: number) => `${count} selected`;

export const SelectDropdown: FC<SelectDropdownProps> = ({
    label,
    options,
    selected,
    onOptionClick,
    placeholder = 'Select...',
    searchPlaceholder = 'Search...',
    emptyOptionsText = 'No options found',
    formatSelectedCount = defaultFormatSelectedCount,
    placement,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const getOptionLabel = useCallback(
        (value: string) => options.find((option) => option.value === value)?.label ?? value,
        [options],
    );

    const selectedCount = Array.isArray(selected) ? selected.length : selected ? 1 : 0;

    const triggerText = useMemo(() => {
        if (Array.isArray(selected)) {
            if (selected.length === 0) return placeholder;
            if (selected.length === 1) return getOptionLabel(selected[0]);
            return formatSelectedCount(selected.length);
        }

        return selected ? getOptionLabel(selected) : placeholder;
    }, [selected, placeholder, getOptionLabel, formatSelectedCount]);

    const filteredOptions = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return options;

        return options.filter(
            (option) =>
                option.label.toLowerCase().includes(query) ||
                option.value.toLowerCase().includes(query),
        );
    }, [options, searchQuery]);

    const handleOpenChange = useCallback((open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setSearchQuery('');
        }
    }, []);

    const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }, []);

    return (
        <div className={styles.selectField}>
            {label && <span className={styles.label}>{label}</span>}
            <Dropdown
                open={isOpen}
                onOpenChange={handleOpenChange}
                matchTriggerWidth
                placement={placement}
            >
                <Dropdown.Trigger className={styles.selectTrigger}>
                    <span
                        className={
                            selectedCount === 0
                                ? styles.selectTriggerTextPlaceholder
                                : styles.selectTriggerText
                        }
                    >
                        {triggerText}
                    </span>
                    <ArrowIcon
                        className={clsx(
                            styles.selectTriggerIcon,
                            isOpen && styles.selectTriggerIconOpen,
                        )}
                    />
                </Dropdown.Trigger>
                <Dropdown.Content className={styles.dropdownContent}>
                    <div className={styles.dropdownSearch}>
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className={styles.dropdownSearchInput}
                            autoFocus
                        />
                    </div>
                    <div className={styles.dropdownOptions}>
                        {filteredOptions.length === 0 ? (
                            <p className={styles.dropdownEmpty}>{emptyOptionsText}</p>
                        ) : (
                            filteredOptions.map((option) => {
                                const handleOptionClick = () => {
                                    onOptionClick(option.value);

                                };

                                return Array.isArray(selected) ? (
                                    <Dropdown.Item
                                        key={option.value}
                                        onClick={handleOptionClick}
                                        autoClose={false}
                                    >
                                        <Checkbox
                                            label={option.label}
                                            checked={selected.includes(option.value)}
                                        />
                                    </Dropdown.Item>
                                ) : (
                                    <Dropdown.Item key={option.value} onClick={handleOptionClick}>
                                        {option.label}
                                    </Dropdown.Item>
                                );
                            })
                        )}
                    </div>
                </Dropdown.Content>
            </Dropdown>
        </div>
    );
};