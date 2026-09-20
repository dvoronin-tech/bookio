import { type FC, useCallback, useState } from 'react';
import styles from './AppHeader.module.scss';
import Logo from '#assets/logo.svg?react';
import { useNavigate } from '@tanstack/react-router';
import { organizationRouteApi } from '#lib/routeApis';
import { Dropdown } from '@bookio/ui';

import { useGetOrganization } from '#api/organizations/getOrganizationData';

import ArrowIcon from '#assets/icons/short-arrow.svg?react';
import FormIcon from '#assets/icons/form.svg?react';
import OrganizationIcon from '#assets/icons/organization.svg?react';

import PlaceholderImage from '#assets/images/OrganizationPlaceholder.webp';
import toast from 'react-hot-toast';

export const AppHeader: FC = () => {
    const navigate = useNavigate();
    const { organizationId } = organizationRouteApi.useParams();
    const { data: organizationData, error } =
        useGetOrganization(organizationId);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (error) {
        toast.error(error.message);
    }

    const handleNavigateToBookingForms = useCallback(() => {
        void navigate({
            to: '/$organizationId/booking-forms',
            params: { organizationId },
        });
    }, [navigate, organizationId]);

    const handleNavigateToOrganizations = useCallback(() => {
        void navigate({ to: '/organizations/list' });
    }, [navigate]);

    const handleNavigateToOrganization = useCallback(() => {
        void navigate({
            to: '/$organizationId/booking-forms',
            params: { organizationId },
        });
    }, [navigate, organizationId]);

    return (
        <div className={styles.appHeader}>
            <button
                className={styles.logoButton}
                onClick={handleNavigateToOrganization}
            >
                <Logo className={styles.logo} />
            </button>
            <div className={styles.dropdown}>
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
                        <div className={styles.menuItemText}>
                            {organizationData?.name}
                        </div>
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
                                    {organizationData?.name}
                                </span>
                                <span className={styles.menuItemSlug}>
                                    @{organizationData?.slug}
                                </span>
                            </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                            className={styles.menuItem}
                            onClick={handleNavigateToBookingForms}
                        >
                            <FormIcon className={styles.menuItemIcon} />
                            Booking forms
                        </Dropdown.Item>
                        <Dropdown.Item
                            className={styles.menuItem}
                            onClick={handleNavigateToOrganizations}
                        >
                            <OrganizationIcon className={styles.menuItemIcon} />
                            Organizations
                        </Dropdown.Item>
                    </Dropdown.Content>
                </Dropdown>
            </div>
        </div>
    );
};
