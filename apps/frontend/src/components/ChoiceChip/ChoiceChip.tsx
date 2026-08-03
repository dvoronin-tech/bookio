import { clsx } from 'clsx';
import type { ButtonHTMLAttributes, FC, ReactNode } from 'react';

import styles from './ChoiceChip.module.scss';

// TODO D: improve chip styles, make it bigger

interface ChoiceChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean;
    icon: ReactNode;
    children: ReactNode;
}

export const ChoiceChip: FC<ChoiceChipProps> = ({
    active = false,
    icon,
    children,
    className,
    type = 'button',
    ...props
}) => {
    return (
        <button
            type={type}
            className={clsx(styles.choiceChip, active && styles.active, className)}
            {...props}
        >
            <span className={styles.icon}>{icon}</span>
            <span className={styles.content}>{children}</span>
        </button>
    );
};
