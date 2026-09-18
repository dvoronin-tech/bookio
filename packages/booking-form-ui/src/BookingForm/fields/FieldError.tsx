import type { FC } from 'react';
import styles from './Fields.module.scss';

/**
 * Error text for fields that cannot host a ValidatableInput error icon
 * (checkbox, radio, select, date, time).
 */
export const FieldError: FC<{ message?: string }> = ({ message }) => {
    if (!message) {
        return null;
    }

    return (
        <span className={styles.fieldError} role="alert">
            {message}
        </span>
    );
};
