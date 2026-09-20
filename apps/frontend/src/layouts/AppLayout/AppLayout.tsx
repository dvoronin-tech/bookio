import type { FC } from 'react';
import styles from './AppLayout.module.scss';
import { Outlet } from '@tanstack/react-router';
import { AppHeader } from '#components/AppHeader/AppHeader';

export const AppLayout: FC = () => {

    return (
        <div className={styles.appLayout}>
            <AppHeader />
            <Outlet />
        </div>
    );
};