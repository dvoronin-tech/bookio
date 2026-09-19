import { memo, type FC } from 'react';
import styles from './OrganizationHeader.module.scss';
import Logo from '#assets/logo.svg?react';
import { Button, Input } from '@bookio/ui';
import { clsx } from 'clsx';

import ConnectIcon from '#assets/icons/connect.svg?react';
import PlusIcon from '#assets/icons/plus.svg?react';
import SearchIcon from '#assets/icons/search.svg?react';
import { useLocation, useNavigate } from 'react-router-dom';
import { navigateToOrganizationsList } from '#navigation';

interface OrganizationHeaderProps {
    onOpenSearch: () => void;
}

export const OrganizationHeader: FC<OrganizationHeaderProps> = memo(({ onOpenSearch }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const onClickHeader = () => {
        navigateToOrganizationsList(navigate);
    };

    if (pathname === '/organizations/list') {
        return (
            <header className={styles.header}>
                <button className={styles.logoButton} onClick={onClickHeader}>
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
                <div className={styles.buttonsWrapper}>
                    <Button
                        type="link"
                        to="/organizations/connect"
                        variant="simple-clean"
                        className={styles.button}
                    >
                        <ConnectIcon />
                        Connect
                    </Button>
                    <Button
                        type="link"
                        to="/organizations/create"
                        variant="primary-filled"
                        className={clsx(styles.button, styles.addButton)}
                    >
                        <PlusIcon />
                        Create
                    </Button>
                </div>
            </header>
        );
    }

    return <DefaultOrganizationHeader onClickHeader={onClickHeader} />;
});

interface DefaultOrganizationHeaderProps {
    onClickHeader: () => void;
}

const DefaultOrganizationHeader: FC<DefaultOrganizationHeaderProps> = ({ onClickHeader }) => {
    return (
        <header className={styles.header}>
            <button className={styles.logoButton} onClick={onClickHeader}>
                <Logo className={styles.logo} />
            </button>
            <div className={styles.buttonsWrapper}>
                <Button
                    type="link"
                    to="/organizations/connect"
                    variant="simple-clean"
                    className={styles.button}
                >
                    <ConnectIcon />
                    Connect
                </Button>
                <Button
                    type="link"
                    to="/organizations/create"
                    variant="primary-filled"
                    className={clsx(styles.button, styles.addButton)}
                >
                    <PlusIcon />
                    Create
                </Button>
            </div>
        </header>
    );
};
