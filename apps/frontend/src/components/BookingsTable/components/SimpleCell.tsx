import type { FC } from 'react';
import styles from './Components.module.scss';
import { m } from '#i18n/messages';

export const SimpleCell: FC<{ data: unknown }> = ({ data }) => {
    if (!data) return <i>{m.empty()}</i>;

    return <span className={styles.simpleCell}>{String(data)}</span>;
};
