import type { BookingFormFieldType } from '@api/bookingForms/bookingFormFields/getBookingFormField';
import { useCallback, type ChangeEvent, type FC, useState, useEffect, useMemo } from 'react';
import { paramsFieldConfig } from '@utils/paramsFieldConfig';
import { Button, Input } from '@bookio/ui';
import styles from './ParamFields.module.scss';
import PlusIcon from '@assets/icons/plus.svg?react';
import TrashIcon from '@assets/icons/trash.svg?react';
import { ValidatableInput } from '@components/ValidatableInput/ValidatableInput';

interface OptionItem {
    value: string;
    label: string;
}

interface ParamFieldProps {
    type: BookingFormFieldType['type'] | undefined;
    options: OptionItem[];
    onAddOption: () => void;
    onRemoveOption: (index: string) => void;
    onUpdateOption: (index: string, field: keyof OptionItem, value: string) => void;
}

interface OptionItemProps {
    index: string;
    options: OptionItem[];
    option: OptionItem;
    onRemoveOption: (index: string) => void;
    onUpdateOption: (index: string, field: keyof OptionItem, value: string) => void;
}

const OptionItem: FC<OptionItemProps> = ({
    index,
    options,
    option,
    onRemoveOption,
    onUpdateOption,
}) => {
    const { isLabelUnique, isValueUnique } = useMemo(() => {
        if (options.length === 0) return { isValueUnique: undefined, isLabelUnique: undefined };

        return {
            isValueUnique: options.some((option) => option.value === option.value),
            isLabelUnique: options.some((option) => option.label === option.label),
        };
    }, [options]);

    const handleRemoveOption = useCallback(() => {
        onRemoveOption(index);
    }, [index, onRemoveOption]);

    const handleValueChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onUpdateOption(index, 'value', event.target.value);
        },
        [index, onUpdateOption],
    );

    const handleLabelChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onUpdateOption(index, 'label', event.target.value);
        },
        [index, onUpdateOption],
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

// interface SelectQItemProps {

// }

// const SelectItem: FC<>

export const ParamFields: FC<ParamFieldProps> = ({
    type,
    options,
    onAddOption,
    onRemoveOption,
    onUpdateOption,
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
                        {options.map((option, index) => (
                            <OptionItem
                                key={index}
                                index={option.value}
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

        // if (field.type === 'select') {

        // }

        return null;
    });
};
