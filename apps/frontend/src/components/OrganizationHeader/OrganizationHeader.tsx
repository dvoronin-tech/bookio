import { type FC, memo } from 'react';
import styles from './OrganizationHeader.module.scss';
import Logo from '#assets/logo.svg?react';
import { Button, Input } from '@bookio/ui';
import { clsx } from 'clsx';

import ConnectIcon from '#assets/icons/connect.svg?react';
import PlusIcon from '#assets/icons/plus.svg?react';
import SearchIcon from '#assets/icons/search.svg?react';
import { useMatchRoute, useNavigate } from '@tanstack/react-router';

interface OrganizationHeaderProps {
    onOpenSearch: () => void;
}

export const OrganizationHeader: FC<OrganizationHeaderProps> = memo(
    ({ onOpenSearch }) => {
        const navigate = useNavigate();
        const matchRoute = useMatchRoute();
        const isOrganizationsList = matchRoute({ to: '/organizations/list' });

        const onClickHeader = () => {
            void navigate({ to: '/organizations/list' });
        };

        const goToConnect = () => {
            void navigate({ to: '/organizations/connect' });
        };

        const goToCreate = () => {
            void navigate({ to: '/organizations/create' });
        };

        if (isOrganizationsList) {
            return (
                <header className={styles.header}>
                    <button
                        className={styles.logoButton}
                        onClick={onClickHeader}
                    >
                        <Logo className={styles.logo} />
                    </button>
                    <div className={styles.headerFilterGroup}>
                        <Input.Root className={styles.searchInput}>
                            <Input.Icon>
                                <SearchIcon />
                            </Input.Icon>
                            <Input
                                type="search"
                                placeholder="Search"
                                onClick={onOpenSearch}
                                readOnly
                            />
                        </Input.Root>
                    </div>
                    <HeaderActions onConnect={goToConnect} onCreate={goToCreate} />
                </header>
            );
        }

        return (
            <DefaultOrganizationHeader
                onClickHeader={onClickHeader}
                onConnect={goToConnect}
                onCreate={goToCreate}
            />
        );
    },
);

interface HeaderActionsProps {
    onConnect: () => void;
    onCreate: () => void;
}

const HeaderActions: FC<HeaderActionsProps> = ({ onConnect, onCreate }) => (
    <div className={styles.buttonsWrapper}>
        <Button variant="simple-clean" className={styles.button} onClick={onConnect}>
            <ConnectIcon />
            Connect
        </Button>
        <Button
            variant="primary-filled"
            className={clsx(styles.button, styles.addButton)}
            onClick={onCreate}
        >
            <PlusIcon />
            Create
        </Button>
    </div>
);

interface DefaultOrganizationHeaderProps {
    onClickHeader: () => void;
    onConnect: () => void;
    onCreate: () => void;
}

const DefaultOrganizationHeader: FC<DefaultOrganizationHeaderProps> = ({
    onClickHeader,
    onConnect,
    onCreate,
}) => {
    return (
        <header className={styles.header}>
            <button className={styles.logoButton} onClick={onClickHeader}>
                <Logo className={styles.logo} />
            </button>
            <HeaderActions onConnect={onConnect} onCreate={onCreate} />
        </header>
    );
};
