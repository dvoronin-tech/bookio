import { type FC, useEffect, Suspense } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSession } from '#api/auth';
import { PageLoader } from '#components/PageLoader/PageLoader';
import styles from './AuthLayout.module.scss';

export const AuthLayout: FC = () => {
    const { data: session, isPending } = useSession();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isPending && session) {
            navigate('/organizations', { replace: true });
        }
    }, [session, isPending, navigate]);

    if (isPending) {
        return null;
    }

    return (
        <div className={styles.authLayout}>
            <Suspense fallback={<PageLoader />}>
                <Outlet />
            </Suspense>
        </div>
    );
};
