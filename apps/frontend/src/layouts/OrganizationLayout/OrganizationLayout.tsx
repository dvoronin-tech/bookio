import { type FC, Suspense, useCallback, useState } from 'react';
import { Outlet } from '@tanstack/react-router';
import styles from './OrganizationLayout.module.scss';
import { OrganizationHeader } from '#components/OrganizationHeader/OrganizationHeader';
import { PageLoader } from '@bookio/ui';
import { OrganizationSearch } from '#components/OrganizationSearch/OrganizationSearch';

export const OrganizationLayout: FC = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const openSearch = useCallback(() => {
        setIsSearchOpen(true);
    }, []);

    return (
        <div className={styles.organizationLayout}>
            <OrganizationHeader onOpenSearch={openSearch} />
            <Suspense fallback={<PageLoader />}>
                <Outlet />
            </Suspense>
            <OrganizationSearch
                isOpen={isSearchOpen}
                onOpenChange={setIsSearchOpen}
            />
        </div>
    );
};
