import { useCallback, useMemo, type FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { FieldModalFormValues } from '@bookio/backend/schemas';
import { Button, ValidatableInput } from '@bookio/ui';
import TrashIcon from '#assets/icons/trash.svg?react';
import styles from '../../ParamFields.module.scss';

interface OptionItemProps {
    index: number;
    onRemove: (index: number) => void;
}

export const OptionItem: FC<OptionItemProps> = ({ index, onRemove }) => {
    const { control, register } = useFormContext<FieldModalFormValues>();
    const watchedOptions = useWatch({ control, name: 'params.options' });
    const options = useMemo(() => watchedOptions ?? [], [watchedOptions]);
    const option = options[index];

    const isLabelUnique = useMemo(() => {
        if (!option || option.label?.trim() === '') return undefined;

        const trimmed = option.label.trim();
        return options.filter((o) => o.label?.trim() === trimmed).length === 1;
    }, [options, option]);

    const handleRemoveOption = useCallback(() => {
        onRemove(index);
    }, [index, onRemove]);

    if (!option) return null;

    const errorMessage = isLabelUnique === false ? 'Option labels must be unique' : undefined;

    return (
        <div className={styles.option}>
            <div className={styles.optionHeader}>
                <span className={styles.optionIndex}>{index + 1}</span>
                <Button
                    variant="red-clean"
                    onClick={handleRemoveOption}
                    className={styles.removeOptionButton}
                    aria-label="Remove option"
                >
                    <TrashIcon />
                    <span>Remove option</span>
                </Button>
            </div>

            <ValidatableInput
                isValid={isLabelUnique}
                errorMessage={errorMessage}
                label="Label"
                type="text"
                {...register(`params.options.${index}.label`)}
            />
        </div>
    );
};
