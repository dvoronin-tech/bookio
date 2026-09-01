import { useEffect, type FC } from 'react';
import styles from './MainLayout.module.scss';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { navigateToAuthSignIn, navigateToOrganizations } from '#navigation';
import { useSession } from '#api/auth';
import { toast } from 'react-hot-toast';

export const MainLayout: FC = () => {
    const { data: session, isPending } = useSession();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (isPending) {
            return;
        }

        if (!session) {
            navigateToAuthSignIn(navigate);
            toast('You are not authorized to access this page', {
                icon: '❌',
                duration: 3000,
            });
            return;
        }

        if (location.pathname === '/') {
            navigateToOrganizations(navigate);
        }
    }, [session, isPending, navigate, location.pathname]);

    return (
        <div className={styles.mainLayout}>
            <Outlet />
        </div>
    );
};
