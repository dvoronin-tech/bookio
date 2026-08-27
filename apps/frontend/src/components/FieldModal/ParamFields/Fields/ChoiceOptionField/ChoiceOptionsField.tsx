import { useCallback, type FC } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import type { FieldModalFormValues } from '@bookio/backend/schemas';
import { Button } from '@bookio/ui';
import PlusIcon from '#assets/icons/plus.svg?react';
import { createEmptyOption } from '../../../utils/fieldModalParams';
import { OptionItem } from './OptionItem';
import styles from '../../ParamFields.module.scss';

interface ChoiceOptionsFieldProps {
    label: string;
}

export const ChoiceOptionsField: FC<ChoiceOptionsFieldProps> = ({ label }) => {
    const { control } = useFormContext<FieldModalFormValues>();
    const { fields, append, remove } = useFieldArray({
        control,
        // Partial union params — assert field-array path for RHF
        name: 'params.options' as const,
        keyName: 'fieldKey',
    });

    const handleAddOption = useCallback(() => {
        append(createEmptyOption());
    }, [append]);

    const handleRemoveOption = useCallback(
        (index: number) => {
            remove(index);
        },
        [remove],
    );

    return (
        <div className={styles.optionsContainer}>
            <div className={styles.optionsHeader}>
                <span className={styles.optionsLabel}>{label}</span>
                {fields.length > 0 && <span className={styles.optionsCount}>{fields.length}</span>}
            </div>

            <div className={styles.optionsPanel}>
                {fields.length === 0 ? (
                    <p className={styles.optionsEmpty}>No options yet. Add the first one below.</p>
                ) : (
                    <div className={styles.optionsList}>
                        {fields.map((field, index) => (
                            <OptionItem
                                key={field.fieldKey}
                                index={index}
                                onRemove={handleRemoveOption}
                            />
                        ))}
                    </div>
                )}

                <Button
                    variant="simple-outlined"
                    className={styles.addOptionButton}
                    onClick={handleAddOption}
                >
                    <PlusIcon />
                    Add option
                </Button>
            </div>
        </div>
    );
};
