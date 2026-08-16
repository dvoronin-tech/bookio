import type { FC, PropsWithChildren } from 'react';
import { Background } from '#/components/Background/Background';
import styles from './GreetingLayout.module.scss';

export const GreetingLayout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className={styles.layout}>
            <Background />
            <div className={styles.content}>{children}</div>
        </div>
    );
};
