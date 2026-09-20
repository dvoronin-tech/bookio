import type { CSSProperties } from 'react';
import styles from './Mark.module.scss';

type MarkProps = {
    size?: number;
};

export function Mark({ size = 3 }: MarkProps) {
    const style = {
        '--spinner-size': `${size}rem`,
    } as CSSProperties;

    return <span className={styles.mark} style={style} />;
}
