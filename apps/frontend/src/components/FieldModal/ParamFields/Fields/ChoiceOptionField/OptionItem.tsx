import { useCallback, useMemo, type FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { FieldModalFormValues } from '@bookio/backend/schemas';
import { Button, ValidatableInput } from '@bookio/ui';
import TrashIcon from '#assets/icons/trash.svg?react';
import styles from '../../ParamFields.module.scss';
import { m } from '#i18n/messages';

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

    const errorMessage = isLabelUnique === false ? m.options_label_unique() : undefined;

    return (
        <div className={styles.option}>
            <div className={styles.optionHeader}>
                <span className={styles.optionIndex}>{index + 1}</span>
                <Button
                    variant="red-clean"
                    onClick={handleRemoveOption}
                    className={styles.removeOptionButton}
                    aria-label={m.options_remove()}
                >
                    <TrashIcon />
                    <span>{m.options_remove()}</span>
                </Button>
            </div>

            <ValidatableInput
                isValid={isLabelUnique}
                errorMessage={errorMessage}
                label={m.param_option_label()}
                type="text"
                {...register(`params.options.${index}.label`)}
            />
        </div>
    );
};
