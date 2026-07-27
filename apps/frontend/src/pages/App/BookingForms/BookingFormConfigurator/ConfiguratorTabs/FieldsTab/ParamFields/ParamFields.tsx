import type { BookingFormFieldType } from '@api/bookingForms/bookingFormFields/getBookingFormField';
import { useCallback, type ChangeEvent, type FC, useMemo } from 'react';
import { paramsFieldConfig } from '@utils/paramsFieldConfig';
import { Button, Input } from '@bookio/ui';
import styles from './ParamFields.module.scss';
import PlusIcon from '@assets/icons/plus.svg?react';
import TrashIcon from '@assets/icons/trash.svg?react';
import { ValidatableInput } from '@components/ValidatableInput/ValidatableInput';

export interface OptionItem {
    id: string;
    value: string;
    label: string;
}

interface ParamFieldProps {
    type: BookingFormFieldType['type'] | undefined;
    options: OptionItem[];
    onAddOption: () => void;
    onRemoveOption: (id: string) => void;
    onUpdateOption: (id: string, field: 'value' | 'label', value: string) => void;
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

        // if (field.type === 'select') {

        // }

        return null;
    });
};
