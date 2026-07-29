import { clsx } from 'clsx';
import { useCallback, useMemo, useState, type ChangeEvent, type FC } from 'react';
import { Checkbox, Dropdown, Input } from '@bookio/ui';
import ArrowIcon from '#assets/icons/short-arrow.svg?react';
import { getAcceptOptionLabel, type AcceptOptions } from '#utils/paramsFieldConfig';
import styles from './ParamFields.module.scss';

interface SelectDropdownProps {
    label: string;
    options: AcceptOptions;
    selectedOptions: string[];
    onClickOption: (mimeType: string) => void;
}

const getSelectTriggerText = (options: AcceptOptions, selectedOptions: string[]) => {
    if (selectedOptions.length === 0) {
        return 'Select allowed types';
    }

    if (selectedOptions.length === 1) {
        return getAcceptOptionLabel(options, selectedOptions[0]);
    }

    return `${selectedOptions.length} types selected`;
};

export const SelectDropdown: FC<SelectDropdownProps> = ({
    label,
    options,
    selectedOptions,
    onClickOption,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const acceptOptions = useMemo(
        () => Object.entries(options).map(([extension, mimeType]) => ({ extension, mimeType })),
        [options],
    );
    const triggerText = getSelectTriggerText(options, selectedOptions);
    const isPlaceholder = selectedOptions.length === 0;

    const filteredOptions = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return acceptOptions;

        return acceptOptions.filter(
            ({ extension, mimeType }) =>
                extension.toLowerCase().includes(query) || mimeType.toLowerCase().includes(query),
        );
    }, [acceptOptions, searchQuery]);

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
            <span className={styles.optionsLabel}>{label}</span>
            <Dropdown
                open={isOpen}
                onOpenChange={handleOpenChange}
                matchTriggerWidth
                placement="top"
            >
                <Dropdown.Trigger className={styles.selectTrigger}>
                    <span
                        className={
                            isPlaceholder
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
                            placeholder="Search types..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className={styles.dropdownSearchInput}
                            autoFocus
                        />
                    </div>
                    <div className={styles.dropdownOptions}>
                        {filteredOptions.length === 0 ? (
                            <p className={styles.dropdownEmpty}>No types found</p>
                        ) : (
                            filteredOptions.map(({ extension, mimeType }) => {
                                const handleClickOnOption = () => {
                                    onClickOption(mimeType);
                                };

                                return (
                                    <Dropdown.Item key={extension} hoverable={false}>
                                        <Checkbox
                                            label={extension}
                                            checked={selectedOptions.includes(mimeType)}
                                            onChange={handleClickOnOption}
                                        />
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
