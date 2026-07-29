import { useCallback, useMemo, type FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { FieldModalFormValues } from '@bookio/backend/schemas';
import { Button } from '@bookio/ui';
import { ValidatableInput } from '#components/ValidatableInput/ValidatableInput';
import TrashIcon from '#assets/icons/trash.svg?react';
import styles from './ParamFields.module.scss';

interface OptionItemProps {
    index: number;
    onRemove: (index: number) => void;
}

export const OptionItem: FC<OptionItemProps> = ({ index, onRemove }) => {
    const { control, register } = useFormContext<FieldModalFormValues>();
    const watchedOptions = useWatch({ control, name: 'params.options' });
    const options = useMemo(() => watchedOptions ?? [], [watchedOptions]);
    const option = options[index];

    const { isLabelUnique, isValueUnique } = useMemo(() => {
        if (!option) {
            return { isLabelUnique: undefined, isValueUnique: undefined };
        }

        const isValueUnique: boolean | undefined =
            option.value === ''
                ? undefined
                : options.filter((o) => o.value === option.value).length === 1;

        const isLabelUnique: boolean | undefined =
            option.label === ''
                ? undefined
                : options.filter((o) => o.label === option.label).length === 1;

        return { isValueUnique, isLabelUnique };
    }, [options, option]);

    const handleRemoveOption = useCallback(() => {
        onRemove(index);
    }, [index, onRemove]);

    if (!option) return null;

    return (
        <div className={styles.option}>
            <input type="hidden" {...register(`params.options.${index}.id`)} />
            <ValidatableInput
                isValid={isValueUnique}
                label="Value"
                type="text"
                {...register(`params.options.${index}.value`)}
            />
            <ValidatableInput
                isValid={isLabelUnique}
                label="Label"
                type="text"
                {...register(`params.options.${index}.label`)}
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
