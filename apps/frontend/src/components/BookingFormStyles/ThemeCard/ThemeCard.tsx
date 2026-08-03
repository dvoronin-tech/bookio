import CheckIcon from '#assets/icons/check.svg?react';
import { clsx } from 'clsx';
import { useCallback, type FC } from 'react';

import styles from './ThemeCard.module.scss';

export type ThemeVariant = 'dark' | 'light' | 'custom';

type ThemeCardProps = {
    name: string;
    variant: ThemeVariant;
    selected?: ThemeVariant;
    onClick: (variant: ThemeVariant) => void;
};

export const ThemeCard: FC<ThemeCardProps> = ({ name, variant, selected, onClick }) => {
    const handleClick = useCallback(() => {
        onClick(variant);
    }, [variant, onClick]);

    return (
        <button
            className={clsx(styles.themeCard, { [styles.themeCardSelected]: selected === variant })}
            onClick={handleClick}
            type="button"
        >
            <div className={clsx(styles.preview, styles[`preview_${variant}`])}>
                {variant === 'custom' ? (
                    <span className={styles.customMark}>?</span>
                ) : (
                    <>
                        <div className={styles.bar} />
                        <div className={styles.lines}>
                            <div className={styles.line1} />
                            <div className={styles.line2} />
                        </div>
                    </>
                )}
            </div>
            <div className={styles.meta}>
                <span className={styles.name}>{name}</span>
                {selected === variant && <CheckIcon className={styles.checkIcon} aria-hidden="true" />}
            </div>
        </button>
    );
};
