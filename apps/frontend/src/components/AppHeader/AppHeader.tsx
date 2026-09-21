import { type FC, useState } from 'react';
import styles from './AppHeader.module.scss';
import Logo from '#assets/logo.svg?react';
import { useNavigate } from '@tanstack/react-router';
import { organizationRouteApi } from '#lib/routeApis';
import { Button, Dropdown, Loader } from '@bookio/ui';

import { useGetOrganization } from '#api/organizations/getOrganizationData';

import ArrowIcon from '#assets/icons/short-arrow.svg?react';
import FormIcon from '#assets/icons/form.svg?react';
import OrganizationIcon from '#assets/icons/organization.svg?react';
import TableIcon from '#assets/icons/table.svg?react';

import PlaceholderImage from '#assets/images/OrganizationPlaceholder.webp';
import toast from 'react-hot-toast';
import clsx from 'clsx';

export const AppHeader: FC = () => {
    const { organizationId } = organizationRouteApi.useParams();
    const navigate = useNavigate();

    const handleNavigateToOrganization = () => {
        void navigate({
            to: '/$organizationId/booking-forms',
            params: { organizationId },
        });
    };

    return (
        <div className={styles.appHeader}>
            <button
                className={styles.logoButton}
                onClick={handleNavigateToOrganization}
            >
                <Logo className={styles.logo} />
            </button>
            <div className={styles.dropdown}>
                <HeaderDropdown />
            </div>
        </div>
    );
};

const HeaderDropdown: FC = () => {
    const navigate = useNavigate();
    const { organizationId } = organizationRouteApi.useParams();

    const {
        data: organization,
        error,
        isPending,
        refetch,
    } = useGetOrganization(organizationId);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNavigateToBookings = () => {
        void navigate({
            to: '/$organizationId/analytics',
            params: { organizationId },
        });
    };

    const handleNavigateToBookingForms = () => {
        void navigate({
            to: '/$organizationId/booking-forms',
            params: { organizationId },
        });
    };

    const handleNavigateToOrganizations = () => {
        void navigate({ to: '/organizations/list' });
    };

    if (error) {
        toast.error(error.message);
    }

    if (isPending) {
        return (
            <div className={styles.loader}>
                <Loader />
            </div>
        );
    }

    if (!organization) {
        toast.error('Failed to fetch organization');
        return (
            <Button variant="primary-outlined" onClick={() => refetch()}>
                Retry
            </Button>
        );
    }

    return (
        <Dropdown
            open={isMenuOpen}
            onOpenChange={setIsMenuOpen}
            placement="bottom"
        >
            <Dropdown.Trigger className={styles.menuTrigger}>
                <img
                    src={PlaceholderImage}
                    alt="Organization image"
                    className={styles.menuItemImage}
                />
                <div className={styles.menuItemText}>{organization.name}</div>
                <ArrowIcon className={styles.arrowIcon} />
            </Dropdown.Trigger>
            <Dropdown.Content className={styles.dropdownContent}>
                <Dropdown.Item className={styles.companyInfo}>
                    <img
                        src={PlaceholderImage}
                        alt="Organization image"
                        className={styles.menuItemImage}
                    />
                    <div className={styles.menuItemText}>
                        <span className={styles.menuItemName}>
                            {organization.name}
                        </span>
                        <span className={styles.menuItemSlug}>
                            @{organization.slug}
                        </span>
                    </div>
                </Dropdown.Item>
                <Dropdown.Item
                    className={styles.menuItem}
                    onClick={handleNavigateToBookings}
                >
                    <TableIcon
                        className={clsx(styles.menuItemIcon, styles.pink)}
                    />
                    Bookings
                </Dropdown.Item>
                <Dropdown.Item
                    className={styles.menuItem}
                    onClick={handleNavigateToBookingForms}
                >
                    <FormIcon
                        className={clsx(styles.menuItemIcon, styles.blue)}
                    />
                    Booking forms
                </Dropdown.Item>
                <Dropdown.Item
                    className={styles.menuItem}
                    onClick={handleNavigateToOrganizations}
                >
                    <OrganizationIcon
                        className={clsx(styles.menuItemIcon, styles.orange)}
                    />
                    Organizations
                </Dropdown.Item>
            </Dropdown.Content>
        </Dropdown>
    );
};
