import { clsx } from 'clsx';
import { memo, useId, type ComponentProps, type ReactNode } from 'react';
import { CheckIcon } from './icons/CheckIcon.js';
import styles from './Checkbox.module.scss';

export type CheckboxProps = {
    label?: ReactNode;
    className?: string;
} & Omit<ComponentProps<'input'>, 'type' | 'className'>;

function Checkbox({ label, className, id, ...inputProps }: CheckboxProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const classes = clsx(styles.checkbox, className);

    return (
        <label className={classes} htmlFor={inputId}>
            <input
                {...inputProps}
                id={inputId}
                type="checkbox"
                className={styles.input}
            />
            <span className={styles.box}>
                <CheckIcon />
            </span>
            {label !== undefined && <span className={styles.label}>{label}</span>}
        </label>
    );
}

export default memo(Checkbox);
