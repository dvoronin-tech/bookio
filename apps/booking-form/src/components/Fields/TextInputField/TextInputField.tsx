import type { FC } from 'react';
import { Input } from '@bookio/ui';
import type { FieldControlProps } from '#/components/Fields/field.types';
import styles from '../Fields.module.scss';

export const TextInputField: FC<FieldControlProps<'text'>> = ({ field, register }) => {
    const placeholder = 'placeholder' in field.params ? field.params.placeholder : undefined;
    const helpText = 'helpText' in field.params ? field.params.helpText : undefined;

    return (
        <Input
            className={styles.default}
            placeholder={placeholder}
            label={field.name}
            helpText={helpText}
            required={field.required}
            type="text"
            {...register(field.key)}
        />
    );
};
