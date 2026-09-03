import { useState, type FC, useCallback } from 'react';
import styles from './AppHeader.module.scss';
import Logo from '#assets/logo.svg?react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    navigateToBookingForms,
    navigateToOrganization,
    navigateToOrganizations,
} from '#navigation';
import { Dropdown } from '@bookio/ui';

import { useGetOrganization } from '#api/organizations/getOrganizationData';

import ArrowIcon from '#assets/icons/short-arrow.svg?react';
import FormIcon from '#assets/icons/form.svg?react';
import OrganizationIcon from '#assets/icons/organization.svg?react';

import PlaceholderImage from '#assets/images/OrganizationPlaceholder.webp';
import toast from 'react-hot-toast';

export const AppHeader: FC = () => {
    const navigate = useNavigate();
    const { organizationId } = useParams<{ organizationId: string }>();
    const { data: organizationData, error } = useGetOrganization(organizationId);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (error) {
        toast.error(error.message)
    }

    const handleNavigateToBookingForms = useCallback(() => {
        if (!organizationId) return;
        navigateToBookingForms(navigate, organizationId);
    }, [navigate, organizationId]);

    const handleNavigateToOrganizations = useCallback(() => {
        navigateToOrganizations(navigate);
    }, [navigate]);

    return (
        <div className={styles.appHeader}>
            <button
                className={styles.logoButton}
                onClick={() => organizationId && navigateToOrganization(navigate, organizationId)}
            >
                <Logo className={styles.logo} />
            </button>
            <div className={styles.dropdown}>
                <Dropdown open={isMenuOpen} onOpenChange={setIsMenuOpen} placement="bottom">
                    <Dropdown.Trigger className={styles.menuTrigger}>
                        <img
                            src={PlaceholderImage}
                            alt="Organization image"
                            className={styles.menuItemImage}
                        />
                        <div className={styles.menuItemText}>{organizationData?.name}</div>
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
