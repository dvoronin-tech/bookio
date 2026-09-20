import type { FC } from 'react';
import { Outlet } from '@tanstack/react-router';
import styles from './AuthLayout.module.scss';

export const AuthLayout: FC = () => {
    return (
        <div className={styles.authLayout}>
            <Outlet />
        </div>
    );
};
