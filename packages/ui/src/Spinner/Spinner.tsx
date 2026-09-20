import type { CSSProperties } from 'react';
import styles from './Spinner.module.scss';

export type SpinnerProps = {
    size?: number;
};

function Spinner({ size = 3 }: SpinnerProps) {
    const style = {
        '--spinner-size': `${size}rem`,
    } as CSSProperties;

    return <span className={styles.loader} style={style} />;
}

export default Spinner;
