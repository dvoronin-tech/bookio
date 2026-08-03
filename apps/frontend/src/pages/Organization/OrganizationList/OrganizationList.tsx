import { useCallback, type FC } from 'react';
import styles from './OrganizationList.module.scss';

import { OrganizationItem } from '#components/OrganizationItem/OrganizationItem';
import { useGetOrganizationsByUserId } from '#api/organizations/getOrganizationsByUserId';
import { Spinner } from '#components/Spinner/Spinner';

import { toast } from 'react-hot-toast';
import { Button } from '@bookio/ui';
import { useNavigate } from 'react-router-dom';
import { navigateToOrganization } from '#navigation';

export const OrganizationList: FC = () => {
    const { data, isPending, refetch, error } = useGetOrganizationsByUserId();
    const navigate = useNavigate();
    const handleRetry = useCallback(() => {
        refetch();
    }, [refetch]);

    const handleClickOnOrganization = useCallback(
        (id: string) => {
            navigateToOrganization(navigate, id);
        },
        [navigate],
    );

    if (error) {
        toast.error(error.message)

        return (
            <div className={styles.container}>
                <h2 className={styles.message}>❌ Failed to load organizations</h2>
                <Button variant="primary-filled" onClick={handleRetry}>
                    Retry
                </Button>
            </div>
        );
    }

    if (isPending)
        return (
            <div className={styles.container}>
                <Spinner size={6} />
            </div>
        );

    if (data.length === 0) {
        return (
            <div className={styles.container}>
                <h2 className={styles.message}>You haven't any Organizations yet</h2>
            </div>
        );
    }

    return (
        <div className={styles.organizationList}>
            {data.map((item) => (
                <OrganizationItem
                    key={item.id}
                    organizationName={item.name}
                    organizationId={item.id}
                    createdAt={item.createdAt}
                    role={item.role}
                    slug={item.slug}
                    onClick={handleClickOnOrganization}
                />
            ))}
        </div>
    );
};
