import { clsx } from 'clsx';
import type { FC } from 'react';

import styles from './RequiredRow.module.scss';

interface RequiredRowProps {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    className?: string;
}

export const RequiredRow: FC<RequiredRowProps> = ({
    checked = false,
    onCheckedChange,
    className,
}) => {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label="Required"
            className={clsx(styles.requiredRow, className)}
            onClick={() => onCheckedChange?.(!checked)}
        >
            <div className={styles.text}>
                <span className={styles.title}>Required</span>
                <span className={styles.hint}>Guest must fill this field</span>
            </div>
            <span className={clsx(styles.toggle, checked && styles.toggleChecked)} aria-hidden="true">
                <span className={styles.knob} />
            </span>
        </button>
    );
};
