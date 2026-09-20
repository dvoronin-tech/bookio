import { type FC, useEffect, Suspense } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { navigateToOrganizations } from '#navigation';
import { useSession } from '#api/auth';
import { Spinner } from '@bookio/ui';
import styles from './AuthLayout.module.scss';

export const AuthLayout: FC = () => {
    const { data: session, isPending } = useSession();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isPending && session) {
            navigateToOrganizations(navigate, { replace: true });
        }
    }, [session, isPending, navigate]);

    if (isPending) {
        return null;
    }

    return (
        <div className={styles.authLayout}>
            <Suspense fallback={<Spinner />}>
                <Outlet />
            </Suspense>
        </div>
    );
};
