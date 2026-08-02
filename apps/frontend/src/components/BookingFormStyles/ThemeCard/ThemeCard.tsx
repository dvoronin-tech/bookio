import CheckIcon from '#assets/icons/check.svg?react';
import { clsx } from 'clsx';
import type { FC } from 'react';

import styles from './ThemeCard.module.scss';

type ThemeVariant = 'dark' | 'light';

type ThemeCardProps = {
    name: string;
    variant: ThemeVariant;
    selected?: boolean;
};

export const ThemeCard: FC<ThemeCardProps> = ({ name, variant, selected = false }) => {
    return (
        <div className={clsx(styles.themeCard, selected && styles.themeCardSelected)}>
            <div className={clsx(styles.preview, styles[`preview_${variant}`])}>
                <div className={styles.bar} />
                <div className={styles.lines}>
                    <div className={styles.line1} />
                    <div className={styles.line2} />
                </div>
            </div>
            <div className={styles.meta}>
                <span className={styles.name}>{name}</span>
                {selected && <CheckIcon className={styles.checkIcon} aria-hidden="true" />}
            </div>
        </div>
    );
};
