import { type FC, Suspense } from 'react';
import { Outlet } from '@tanstack/react-router';
import styles from './OrganizationLayout.module.scss';
import { AppHeader } from '#components/AppHeader/AppHeader';
import { PageLoader } from '@bookio/ui';

export const OrganizationLayout: FC = () => {
    return (
        <div className={styles.organizationLayout}>
            <AppHeader />
            <Suspense fallback={<PageLoader />}>
                <Outlet />
            </Suspense>
        </div>
    );
};


