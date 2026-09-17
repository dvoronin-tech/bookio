import type { FC } from 'react';
import { Input } from '@bookio/ui';
import type { FieldControlProps } from './field.types.js';
import styles from './Fields.module.scss';

export const TextInputField: FC<FieldControlProps<'text'>> = ({ field, register }) => {
    return (
        <Input
            className={styles.default}
            placeholder={field.params.placeholder}
            label={field.name}
            helpText={field.params.helpText}
            required={field.required}
            type="text"
            {...register(field.key)}
        />
    );
};
