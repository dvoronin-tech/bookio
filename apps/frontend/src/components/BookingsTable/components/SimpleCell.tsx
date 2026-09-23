import type { FC } from 'react';
import styles from './Components.module.scss';

export const SimpleCell: FC<{ data: unknown }> = ({ data }) => {
    if (!data) return <i>EMPTY</i>;

    return <span className={styles.simpleCell}>{String(data)}</span>;
};
