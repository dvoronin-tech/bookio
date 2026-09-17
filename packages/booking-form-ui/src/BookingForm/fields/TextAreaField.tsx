import type { FC } from 'react';
import { clsx } from 'clsx';
import { Input } from '@bookio/ui';
import type { FieldControlProps } from './field.types.js';
import styles from './Fields.module.scss';

export const TextAreaField: FC<FieldControlProps<'textarea'>> = ({ field, register }) => {
    return (
        <Input
            className={clsx(styles.default, styles.textarea)}
            placeholder={field.params.placeholder}
            label={field.name}
            helpText={field.params.helpText}
            required={field.required}
            type="textarea"
            rows={field.params.rows}
            {...register(field.key)}
        />
    );
};
