import type { FC } from 'react';
import { Outlet } from '@tanstack/react-router';
import styles from './MainLayout.module.scss';

export const MainLayout: FC = () => {
    return (
        <div className={styles.mainLayout}>
            <Outlet />
        </div>
    );
};
