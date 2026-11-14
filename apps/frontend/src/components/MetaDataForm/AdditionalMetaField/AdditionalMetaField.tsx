import { useCallback, type ChangeEvent, type FC } from 'react';
import { Button, Input, SelectDropdown, type SelectDropdownOption } from '@bookio/ui';
import TrashIcon from '#assets/icons/trash.svg?react';

import styles from './AdditionalMetaField.module.scss';
import { m } from '../../../paraglide/messages.js';

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
                label={m.meta_property()}
                options={options}
                selected={property || undefined}
                onOptionClick={handlePropertyChange}
                placeholder={m.meta_select_property()}
                searchPlaceholder={m.meta_search_properties()}
                emptyOptionsText={m.meta_no_properties()}
                triggerClassName={styles.propertyTrigger}
                withSearch
            />
            <Input
                label={m.meta_content()}
                className={styles.valueInput}
                value={value}
                onChange={handleValueChange}
                placeholder={m.meta_content_placeholder()}
            />
            <Button
                variant="red-clean"
                onClick={handleOnRemove}
                className={styles.removeButton}
                aria-label={m.meta_remove_aria()}
            >
                <TrashIcon />
                <span>{m.meta_remove()}</span>
            </Button>
        </div>
    );
};
