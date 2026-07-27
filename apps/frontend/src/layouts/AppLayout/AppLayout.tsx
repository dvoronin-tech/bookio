import type { FC } from 'react';
import styles from './AppLayout.module.scss';
import { Outlet } from 'react-router-dom';
import { AppHeader } from '#components/AppHeader/AppHeader';

export const AppLayout: FC = () => {

    return (
        <div className={styles.appLayout}>
            <AppHeader />
            <Outlet />
        </div>
    );
};