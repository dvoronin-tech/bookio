import type { FC, ReactNode } from 'react';

import styles from './StyleColorGroup.module.scss';

type StyleColorGroupProps = {
    heading: string;
    children: ReactNode;
};

export const StyleColorGroup: FC<StyleColorGroupProps> = ({ heading, children }) => {
    return (
        <section className={styles.group}>
            <h3 className={styles.heading}>{heading}</h3>
            <div className={styles.fields}>{children}</div>
        </section>
    );
};
