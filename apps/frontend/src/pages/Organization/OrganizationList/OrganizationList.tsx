import { type FC, useCallback, useState } from 'react';
import styles from './OrganizationList.module.scss';

import { OrganizationItem } from '#components/OrganizationItem/OrganizationItem';
import { useGetOrganizationsByUserId } from '#api/organizations/getOrganizationsByUserId';
import { toast } from 'react-hot-toast';
import { Button, Input, PageLoader } from '@bookio/ui';
import { useNavigate } from '@tanstack/react-router';
import PlusIcon from '#assets/icons/plus.svg?react';
import ConnectIcon from '#assets/icons/connect.svg?react';
import SearchIcon from '#assets/icons/search.svg?react';
import { OrganizationSearch } from '#components/OrganizationSearch/OrganizationSearch';

export const OrganizationList: FC = () => {
    const { data, isPending, refetch, error } = useGetOrganizationsByUserId();
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const handleRetry = () => {
        void refetch();
    };

    const handleClickOnOrganization = useCallback(
        (id: string) => {
            void navigate({
                to: '/$organizationId/booking-forms',
                params: { organizationId: id },
            });
        },
        [navigate],
    );

    const handleGoToCreate = () => {
        void navigate({ to: '/organizations/create' });
    };

    const handleGoToConnect = () => {
        void navigate({ to: '/organizations/connect' });
    };

    const handleOpenSearch = () => {
        setIsSearchOpen(true);
    };

    if (isPending) {
        return <PageLoader />;
    }

    if (error) {
        toast.error(error.message);

        return (
            <div className={styles.errorContainer}>
                <h2>Failed to load organizations</h2>
                <Button variant="primary-outlined" onClick={handleRetry}>
                    Retry
                </Button>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className={styles.emptyContainer}>
                <div className={styles.emptyContainerContent}>
                    <h2>You haven't any organizations yet</h2>
                    <p>Create or connect to an organization to get started</p>
                </div>
                <div className={styles.emptyActions}>
                    <Button
                        variant="primary-filled"
                        className={styles.emptyButton}
                        onClick={handleGoToCreate}
                    >
                        <PlusIcon />
                        Create organization
                    </Button>
                    <Button
                        variant="simple-filled"
                        className={styles.emptyButton}
                        onClick={handleGoToConnect}
                    >
                        <ConnectIcon />
                        Connect to organization
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h2 className={styles.pageTitle}>Organizations</h2>
                </div>

                <div className={styles.headerToolbar}>
                    <Input.Root className={styles.searchInput}>
                        <Input.Icon>
                            <SearchIcon />
                        </Input.Icon>
                        <Input
                            type="search"
                            placeholder="Search"
                            onClick={handleOpenSearch}
                            readOnly
                        />
                    </Input.Root>
                    <Button
                        variant="simple-filled"
                        className={styles.headerButton}
                        onClick={handleGoToConnect}
                    >
                        <ConnectIcon />
                        Connect
                    </Button>
                    <Button
                        variant="primary-filled"
                        className={styles.headerButton}
                        onClick={handleGoToCreate}
                    >
                        <PlusIcon />
                        Create
                    </Button>
                </div>
            </div>

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

            <OrganizationSearch
                isOpen={isSearchOpen}
                onOpenChange={setIsSearchOpen}
            />
        </div>
    );
};
