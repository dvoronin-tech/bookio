import { clsx } from 'clsx';
import type { BookingFormFieldType } from '#api/bookingForms/bookingFormFields/getBookingFormField';
import { useCallback, type ChangeEvent, type FC, useMemo, useState } from 'react';
import { paramsFieldConfig, getAcceptOptionLabel, type AcceptOptions } from '#utils/paramsFieldConfig';
import { Button, Checkbox, Input } from '@bookio/ui';
import styles from './ParamFields.module.scss';
import PlusIcon from '#assets/icons/plus.svg?react';
import TrashIcon from '#assets/icons/trash.svg?react';
import ArrowIcon from '#assets/icons/short-arrow.svg?react';
import { ValidatableInput } from '#components/ValidatableInput/ValidatableInput';
import { Dropdown } from '@bookio/ui';

export interface OptionItem {
    id: string;
    value: string;
    label: string;
}

interface ParamFieldProps {
    type: BookingFormFieldType['type'] | undefined;
    options: OptionItem[];
    selectedAcceptTypes: string[];
    onAddOption: () => void;
    onRemoveOption: (id: string) => void;
    onUpdateOption: (id: string, field: 'value' | 'label', value: string) => void;
    onToggleAcceptType: (acceptType: string) => void;
}

interface OptionItemProps {
    id: string;
    options: OptionItem[];
    option: OptionItem;
    onRemoveOption: (id: string) => void;
    onUpdateOption: (id: string, field: 'value' | 'label', value: string) => void;
}

const OptionItem: FC<OptionItemProps> = ({
    id,
    options,
    option,
    onRemoveOption,
    onUpdateOption,
}) => {
    const { isLabelUnique, isValueUnique } = useMemo(() => {
        const isValueUnique: boolean | undefined =
            option.value === ''
                ? undefined
                : options.filter((o) => o.value === option.value).length === 1;

        const isLabelUnique: boolean | undefined =
            option.label === ''
                ? undefined
                : options.filter((o) => o.label === option.label).length === 1;

        return {
            isValueUnique,
            isLabelUnique,
        };
    }, [options, option.value, option.label]);

    const handleRemoveOption = useCallback(() => {
        onRemoveOption(id);
    }, [id, onRemoveOption]);

    const handleValueChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onUpdateOption(id, 'value', event.target.value);
        },
        [id, onUpdateOption],
    );

    const handleLabelChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onUpdateOption(id, 'label', event.target.value);
        },
        [id, onUpdateOption],
    );

    return (
        <div className={styles.option}>
            <ValidatableInput
                isValid={isValueUnique}
                label="Value"
                type="text"
                value={option.value}
                onChange={handleValueChange}
            />
            <ValidatableInput
                isValid={isLabelUnique}
                label="Label"
                type="text"
                value={option.label}
                onChange={handleLabelChange}
            />
            <Button
                variant="red-clean"
                onClick={handleRemoveOption}
                className={styles.removeOptionButton}
            >
                <TrashIcon />
                <span>Remove option</span>
            </Button>
        </div>
    );
};

interface SelectItemProps {
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

const SelectDropdown: FC<SelectItemProps> = ({ label, options, selectedOptions, onClickOption }) => {
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
            <Dropdown open={isOpen} onOpenChange={handleOpenChange} matchTriggerWidth placement='top'>
                <Dropdown.Trigger className={styles.selectTrigger}>
                    <span
                        className={
                            isPlaceholder ? styles.selectTriggerTextPlaceholder : styles.selectTriggerText
                        }
                    >
                        {triggerText}
                    </span>
                    <ArrowIcon
                        className={clsx(styles.selectTriggerIcon, isOpen && styles.selectTriggerIconOpen)}
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

export const ParamFields: FC<ParamFieldProps> = ({
    type,
    options,
    selectedAcceptTypes,
    onAddOption,
    onRemoveOption,
    onUpdateOption,
    onToggleAcceptType,
}) => {
    if (!type) return null;
    const fields = paramsFieldConfig[type];
    return fields.map((field) => {
        if (field.type === 'text' || field.type === 'checkbox' || field.type === 'number') {
            return <Input key={field.label} label={field.label} type={field.type} />;
        }

        if (field.type === 'options') {
            return (
                <div key={field.label} className={styles.optionsContainer}>
                    <span className={styles.optionsLabel}>{field.label}</span>
                    <div className={styles.optionsList}>
                        {options.map((option) => (
                            <OptionItem
                                key={option.id}
                                id={option.id}
                                options={options}
                                option={option}
                                onRemoveOption={onRemoveOption}
                                onUpdateOption={onUpdateOption}
                            />
                        ))}
                    </div>
                    <Button
                        variant="simple-clean"
                        className={styles.addOptionButton}
                        onClick={onAddOption}
                    >
                        <PlusIcon />
                        Add option
                    </Button>
                </div>
            );
        }

        if (field.type === 'select') {
            return (
                <SelectDropdown
                    key={field.label}
                    label={field.label}
                    options={field.options}
                    selectedOptions={selectedAcceptTypes}
                    onClickOption={onToggleAcceptType}
                />
            );
        }

        return null;
    });
};
