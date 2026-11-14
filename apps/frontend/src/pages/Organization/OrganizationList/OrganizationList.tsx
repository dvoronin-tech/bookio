import { type FC, useCallback, useEffect, useState } from 'react';
import styles from './OrganizationList.module.scss';

import { OrganizationItem } from '#components/OrganizationItem/OrganizationItem';
import { useGetOrganizationsByUserId } from '#api/organizations/getOrganizationsByUserId';
import { toast } from 'react-hot-toast';
import { Button, Input, PageLoader } from '@bookio/ui';
import { useNavigate } from '@tanstack/react-router';
import { goToOrganizationWorkspace } from '#lib/bookingFormEntry';
import PlusIcon from '#assets/icons/plus.svg?react';
import ConnectIcon from '#assets/icons/connect.svg?react';
import SearchIcon from '#assets/icons/search.svg?react';
import { OrganizationSearch } from '#components/OrganizationSearch/OrganizationSearch';
import { m } from '../../../paraglide/messages.js';

export const OrganizationList: FC = () => {
    const { data, isPending, refetch, error } = useGetOrganizationsByUserId();
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const handleRetry = () => {
        void refetch();
    };

    const handleClickOnOrganization = useCallback(
        (id: string) => {
            void goToOrganizationWorkspace(id, navigate);
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

    useEffect(() => {
        if (!error && data && data.length === 0) {
            void navigate({ to: '/organizations/create', replace: true });
        }
    }, [data, error, navigate]);

    if (isPending) {
        return <PageLoader />;
    }

    if (error) {
        toast.error(error.message);

        return (
            <div className={styles.errorContainer}>
                <h2>{m.org_list_failed()}</h2>
                <Button variant="primary-outlined" onClick={handleRetry}>
                    {m.retry()}
                </Button>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return <PageLoader />;
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h2 className={styles.pageTitle}>{m.org_list_title()}</h2>
                </div>

                <div className={styles.headerToolbar}>
                    <Input.Root className={styles.searchInput}>
                        <Input.Icon>
                            <SearchIcon />
                        </Input.Icon>
                        <Input
                            type="search"
                            placeholder={m.search()}
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
                        {m.connect()}
                    </Button>
                    <Button
                        variant="primary-filled"
                        className={styles.headerButton}
                        onClick={handleGoToCreate}
                    >
                        <PlusIcon />
                        {m.create()}
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
