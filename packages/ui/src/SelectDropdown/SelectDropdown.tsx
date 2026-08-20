import type { Placement } from '@floating-ui/react';
import { clsx } from 'clsx';
import { memo, useCallback, useMemo, useState, type ChangeEvent } from 'react';
import Checkbox from '../Checkbox/Checkbox.js';
import Dropdown from '../Dropdown/Dropdown.js';
import Input from '../Input/Input.js';
import { ArrowIcon } from './icons/ArrowIcon.js';
import styles from './SelectDropdown.module.scss';

export type SelectDropdownOption = {
    label: string;
    value: string;
};

type SelectDropdownBaseProps = {
    label?: string;
    options: SelectDropdownOption[];
    onOptionClick: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyOptionsText?: string;
    placement?: Placement;
    triggerClassName?: string;
    allowInjection?: boolean;
    withSearch?: boolean;
};

type SelectDropdownSingleProps = SelectDropdownBaseProps & {
    multiple?: false;
    selected: string | undefined;
};

type SelectDropdownMultipleProps = SelectDropdownBaseProps & {
    multiple: true;
    selected: string[];
    formatSelectedCount?: (count: number) => string;
};

export type SelectDropdownProps = SelectDropdownSingleProps | SelectDropdownMultipleProps;

const defaultFormatSelectedCount = (count: number) => `${count} selected`;

function renderContent(content: string, allowInjection: boolean) {
    if (allowInjection) {
        return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }

    return content;
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
        allowInjection = false,
        withSearch = false,
    } = props;

    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const getOptionLabel = useCallback(
        (value: string) => options.find((option) => option.value === value)?.label ?? value,
        [options],
    );

    const selectedCount =
        props.multiple === true ? props.selected.length : props.selected ? 1 : 0;

    const triggerText = useMemo(() => {
        if (props.multiple === true) {
            const selected = props.selected;
            if (selected.length === 0) return placeholder;
            if (selected.length === 1) return getOptionLabel(selected[0]);
            return (props.formatSelectedCount ?? defaultFormatSelectedCount)(selected.length);
        }

        return props.selected ? getOptionLabel(props.selected) : placeholder;
    }, [props, placeholder, getOptionLabel]);

    const filteredOptions = useMemo(() => {
        if (!withSearch) return options;

        const query = searchQuery.trim().toLowerCase();
        if (!query) return options;

        return options.filter(
            (option) =>
                option.label.toLowerCase().includes(query) ||
                option.value.toLowerCase().includes(query),
        );
    }, [options, searchQuery, withSearch]);

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
                <Dropdown.Trigger
                    className={clsx(
                        styles.selectTrigger,
                        selectedCount === 0 && styles.selectTriggerPlaceholder,
                        triggerClassName,
                    )}
                >
                    {renderContent(triggerText, allowInjection)}
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
                                const handleOptionClick = () => {
                                    onOptionClick(option.value);
                                };

                                if (props.multiple === true) {
                                    return (
                                        <Dropdown.Item
                                            key={option.value}
                                            onClick={handleOptionClick}
                                            autoClose={false}
                                        >
                                            <Checkbox
                                                label={renderContent(option.label, allowInjection)}
                                                checked={props.selected.includes(option.value)}
                                                readOnly
                                                className={styles.optionCheckbox}
                                            />
                                        </Dropdown.Item>
                                    );
                                }

                                return (
                                    <Dropdown.Item
                                        key={option.value}
                                        onClick={handleOptionClick}
                                    >
                                        {renderContent(option.label, allowInjection)}
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
