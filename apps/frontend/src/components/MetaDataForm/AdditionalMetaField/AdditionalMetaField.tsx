import { useCallback, type ChangeEvent, type FC } from 'react';
import { Button, Input, SelectDropdown, type SelectDropdownOption } from '@bookio/ui';
import TrashIcon from '#assets/icons/trash.svg?react';

import styles from './AdditionalMetaField.module.scss';

export interface AdditionalMetaFieldProps {
    id: string;
    property: string;
    value: string;
    options: string[];
    onPropertyChange: (id: string, property: string) => void;
    onValueChange: (id: string, value: string) => void;
    onRemove: (id: string) => void;
}

export const AdditionalMetaField: FC<AdditionalMetaFieldProps> = ({
    id,
    property,
    value,
    options,
    onPropertyChange,
    onValueChange,
    onRemove,
}) => {
    const handleValueChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onValueChange(id, event.target.value);
        },
        [id, onValueChange],
    );

    const handlePropertyChange = useCallback(
        (option: SelectDropdownOption) => {
            onPropertyChange(id, String(option));
        },
        [id, onPropertyChange],
    );

    const handleOnRemove = useCallback(() => {
        onRemove(id);
    }, [id, onRemove]);

    return (
        <div className={styles.additionalMetaField}>
            <SelectDropdown
                label="Property"
                options={options}
                selected={property || undefined}
                onOptionClick={handlePropertyChange}
                placeholder="Select property"
                searchPlaceholder="Search properties..."
                emptyOptionsText="No properties found"
                triggerClassName={styles.propertyTrigger}
                withSearch
            />
            <Input
                label="Content"
                className={styles.valueInput}
                value={value}
                onChange={handleValueChange}
                placeholder="Meta content"
            />
            <Button
                variant="red-clean"
                onClick={handleOnRemove}
                className={styles.removeButton}
                aria-label="Remove meta field"
            >
                <TrashIcon />
                <span>Remove</span>
            </Button>
        </div>
    );
};
