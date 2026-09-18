import type { FC } from 'react';
import { Checkbox } from '@bookio/ui';
import { getRequiredRule } from '../../utils/rules.js';
import { useFieldError } from '../../utils/useFieldError.js';
import { FieldError } from '../FieldError.js';
import type { FieldControlProps } from '../field.types.js';
import styles from '../Fields.module.scss';

export const CheckboxField: FC<FieldControlProps<'checkbox'>> = ({
    field,
    register,
    control,
}) => {
    const { helpText } = field.params;
    const { errorMessage } = useFieldError(control, field.key);

    return (
        <div className={styles.checkboxField}>
            <Checkbox
                label={field.name}
                {...register(field.key, {
                    required: getRequiredRule(field),
                })}
            />
            {helpText && (
                <span className={styles.checkboxHelpText}>{helpText}</span>
            )}
            <FieldError message={errorMessage} />
        </div>
    );
};
