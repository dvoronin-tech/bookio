import type { Placement } from '@floating-ui/react';
import { clsx } from 'clsx';
import { memo, useCallback, useMemo, useState, type ChangeEvent } from 'react';
import Checkbox from '../Checkbox/Checkbox.js';
import Dropdown from '../Dropdown/Dropdown.js';
import Input from '../Input/Input.js';
import { ArrowIcon } from './icons/ArrowIcon.js';
import styles from './SelectDropdown.module.scss';

export type SelectDropdownOption = string | number;

type SelectDropdownBaseProps = {
    label?: string;
    options: SelectDropdownOption[];
    onOptionClick: (option: SelectDropdownOption) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyOptionsText?: string;
    placement?: Placement;
    triggerClassName?: string;
    withSearch?: boolean;
    highlightSelected?: boolean;
    disabled?: boolean;
};

type SelectDropdownSingleProps = SelectDropdownBaseProps & {
    multiple?: false;
    selected: SelectDropdownOption | undefined;
};

type SelectDropdownMultipleProps = SelectDropdownBaseProps & {
    multiple: true;
    selected: SelectDropdownOption[];
    formatSelectedCount?: (count: number) => string;
};

export type SelectDropdownProps = SelectDropdownSingleProps | SelectDropdownMultipleProps;

const defaultFormatSelectedCount = (count: number) => `${count} selected`;

function assertUniqueOptions(options: SelectDropdownOption[]) {
    const seen = new Set<string>();

    for (const option of options) {
        const key = String(option);
        if (seen.has(key)) {
            throw new Error(`SelectDropdown: duplicate option "${key}". Options must be unique.`);
        }
        seen.add(key);
    }
}

function SelectDropdown(props: SelectDropdownProps) {
    const {
        label,
        options,
        onOptionClick,
        placeholder = 'Select...',
        searchPlaceholder = 'Search...',
        emptyOptionsText = 'No options found',
        placement,
        triggerClassName,
        withSearch = false,
        highlightSelected = false,
        disabled = false,
    } = props;

    assertUniqueOptions(options);

    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const selectedKeys = useMemo(() => {
        const selected = props.multiple === true ? props.selected : [props.selected];
        return new Set(selected.filter((value) => value !== undefined && value !== '').map(String));
    }, [props.multiple, props.selected]);

    const triggerText = useMemo(() => {
        if (selectedKeys.size === 0) return placeholder;
        if (selectedKeys.size === 1) {
            const [onlySelected] = selectedKeys;
            return onlySelected;
        }

        const formatSelectedCount =
            props.multiple === true ? props.formatSelectedCount : undefined;

        return (formatSelectedCount ?? defaultFormatSelectedCount)(selectedKeys.size);
    }, [selectedKeys, placeholder, props]);

    const filteredOptions = useMemo(() => {
        if (!withSearch) return options;

        const query = searchQuery.trim().toLowerCase();
        if (!query) return options;

        return options.filter((option) => String(option).toLowerCase().includes(query));
    }, [options, searchQuery, withSearch]);

    const handleOpenChange = useCallback(
        (open: boolean) => {
            if (disabled) return;
            setIsOpen(open);
            if (!open) {
                setSearchQuery('');
            }
        },
        [disabled],
    );

    const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }, []);

    const scrollSelectedIntoView = useCallback((node: HTMLButtonElement | null) => {
        node?.scrollIntoView({ block: 'center' });
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
                <Dropdown.Trigger
                    disabled={disabled}
                    className={clsx(
                        styles.selectTrigger,
                        selectedKeys.size === 0 && styles.selectTriggerPlaceholder,
                        triggerClassName,
                    )}
                >
                    {triggerText}
                    <ArrowIcon
                        className={clsx(
                            styles.selectTriggerIcon,
                            isOpen && styles.selectTriggerIconOpen,
                        )}
                    />
                </Dropdown.Trigger>
                <Dropdown.Content className={styles.dropdownContent}>
                    {withSearch && (
                        <div className={styles.dropdownSearch}>
                            <Input
                                placeholder={searchPlaceholder}
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className={styles.dropdownSearchInput}
                                autoFocus
                            />
                        </div>
                    )}
                    <div className={styles.dropdownOptions}>
                        {filteredOptions.length === 0 ? (
                            <p className={styles.dropdownEmpty}>{emptyOptionsText}</p>
                        ) : (
                            filteredOptions.map((option) => {
                                const optionKey = String(option);
                                const handleOptionClick = () => {
                                    onOptionClick(option);
                                };

                                const isSelected = selectedKeys.has(optionKey);
                                const itemClassName = clsx(
                                    highlightSelected && isSelected && styles.optionSelected,
                                );

                                if (props.multiple === true) {
                                    return (
                                        <Dropdown.Item
                                            key={optionKey}
                                            ref={isSelected ? scrollSelectedIntoView : undefined}
                                            className={itemClassName}
                                            onClick={handleOptionClick}
                                            autoClose={false}
                                        >
                                            <Checkbox
                                                label={optionKey}
                                                checked={isSelected}
                                                readOnly
                                                className={styles.optionCheckbox}
                                            />
                                        </Dropdown.Item>
                                    );
                                }

                                return (
                                    <Dropdown.Item
                                        key={optionKey}
                                        ref={isSelected ? scrollSelectedIntoView : undefined}
                                        className={itemClassName}
                                        onClick={handleOptionClick}
                                    >
                                        {optionKey}
                                    </Dropdown.Item>
                                );
                            })
                        )}
                    </div>
                </Dropdown.Content>
            </Dropdown>
        </div>
    );
}

export default memo(SelectDropdown);
