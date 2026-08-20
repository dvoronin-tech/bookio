import type { FC } from 'react';
import { Checkbox } from '@bookio/ui';
import type { FieldControlProps } from '#/components/Fields/field.types';
import styles from '../Fields.module.scss';

export const CheckboxField: FC<FieldControlProps<'checkbox'>> = ({ field, register }) => {
    const { helpText } = field.params;

    return (
        <div className={styles.checkboxField}>
            <Checkbox label={field.name} {...register(field.key)} />
            {helpText && <span className={styles.checkboxHelpText}>{helpText}</span>}
        </div>
    );
};
