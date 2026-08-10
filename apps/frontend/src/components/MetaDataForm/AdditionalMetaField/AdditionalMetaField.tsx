import { useCallback, type ChangeEvent, type FC, useMemo } from 'react';
import { Button, Input } from '@bookio/ui';
import {
    SelectDropdown,
    type SelectDropdownOption,
} from '#components/SelectDropdown/SelectDropdown';
import TrashIcon from '#assets/icons/trash.svg?react';

import styles from './AdditionalMetaField.module.scss';

export interface AdditionalMetaFieldProps {
    id: string;
    property: string;
    value: string;
    options: SelectDropdownOption[];
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
        (property: string) => {
            onPropertyChange(id, property);
        },
        [id, onPropertyChange],
    );

    const handleOnRemove = useCallback(() => {
        onRemove(id);
    }, [id, onRemove]);

    const preparedOptions = useMemo(
        () => options.map((option) => ({ ...option, label: `${option.label} <i class=${styles.propertyValue}>(${option.value})</i>` })),
        [options],
    );

    return (
        <div className={styles.additionalMetaField}>
            <SelectDropdown
                label="Property"
                options={preparedOptions}
                selected={property || undefined}
                onOptionClick={handlePropertyChange}
                placeholder="Select property"
                searchPlaceholder="Search properties..."
                emptyOptionsText="No properties found"
                triggerClassName={styles.propertyTrigger}
                allowInjection
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
