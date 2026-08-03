import { type FC, Suspense } from 'react';
import { Outlet} from 'react-router-dom';
import styles from './OrganizationLayout.module.scss';
import { OrganizationHeader } from '#components/OrganizationHeader/OrganizationHeader';
import { PageLoader } from '#components/PageLoader/PageLoader';
import { OrganizationSearch } from '#components/OrganizationSearch/OrganizationSearch';

export const OrganizationLayout: FC = () => {

    return (
        <div className={styles.organizationLayout}>
            <OrganizationHeader />
            <Suspense fallback={<PageLoader />}>
                <Outlet />
            </Suspense>
            <OrganizationSearch />
        </div>
    );
};
