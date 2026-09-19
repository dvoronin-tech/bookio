import type { FC } from 'react';
import { Radio } from '@bookio/ui';
import { getRequiredRule } from '../../utils/rules.js';
import { useFieldError } from '../../utils/useFieldError.js';
import { FieldError } from '../FieldError.js';
import type { FieldControlProps } from '../field.types.js';
import { formatLabel } from '../../utils/formatLabel.js';
import styles from '../Fields.module.scss';

export const RadioField: FC<FieldControlProps<'radio'>> = ({
    field,
    register,
    control,
    markRequiredFields,
}) => {
    const { errorMessage } = useFieldError(control, field.key);
    const label = formatLabel(markRequiredFields, field.name, field.required);

    return (
        <div className={styles.fieldStack}>
            <Radio
                {...register(field.key, {
                    required: getRequiredRule(field),
                })}
            >
                <Radio.Label>{label}</Radio.Label>
                {field.params.options.map((option) => (
                    <Radio.Item key={option.label} value={option.label}>
                        {option.label}
                    </Radio.Item>
                ))}
            </Radio>
            <FieldError message={errorMessage} />
        </div>
    );
};
