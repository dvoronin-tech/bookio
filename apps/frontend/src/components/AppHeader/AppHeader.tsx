import { type FC, useState } from 'react';
import styles from './AppHeader.module.scss';
import Logo from '#assets/logo.svg?react';
import { useNavigate } from '@tanstack/react-router';
import { organizationRouteApi } from '#lib/routeApis';
import { Button, Dialog, Dropdown, Loader } from '@bookio/ui';

import {
    useGetOrganization,
    type OrganizationData,
} from '#api/organizations/getOrganizationData';

import ArrowIcon from '#assets/icons/short-arrow.svg?react';
import FormIcon from '#assets/icons/form.svg?react';
import TableIcon from '#assets/icons/table.svg?react';
import OrganizationIcon from '#assets/icons/organization.svg?react';
import LogOutIcon from '#assets/icons/log-out.svg?react';

import PlaceholderImage from '#assets/images/OrganizationPlaceholder.webp';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { useSession, useSignOut } from '#api/auth';

export const AppHeader: FC = () => {
    const params = organizationRouteApi.useParams({ shouldThrow: false });
    const navigate = useNavigate();

    const organizationId = params?.organizationId;

    const handleNavigateToOrganization = () => {
        if (organizationId) {
            void navigate({
                to: '/$organizationId/booking-forms',
                params: { organizationId },
            });
        } else {
            void navigate({
                to: '/organizations/list',
            });
        }
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
    const params = organizationRouteApi.useParams({ shouldThrow: false });
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

    const organizationId = params?.organizationId;

    const {
        data: organization,
        error: orgError,
        isPending: isOrgPending,
        refetch: refetchOrg,
    } = useGetOrganization(organizationId);

    const {
        data: session,
        refetch: refetchUser,
        error: userError,
        isPending: isUserPending,
    } = useSession();

    const { mutateAsync } = useSignOut();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNavigateToOrganizations = () => {
        void navigate({ to: '/organizations/list' });
    };

    const handleOpenLogoutDialog = () => {
        setIsLogoutDialogOpen(true);
    };

    const handleLogout = async () => {
        const logoutRes = mutateAsync();

        await toast.promise(logoutRes, {
            loading: 'Trying to logout',
            error: (error) =>
                `Something went wrong during logout, error: ${error}`,
            success: "You've been logged out successfully",
        });

        const logoutData = await logoutRes;
        if (logoutData.success) {
            await navigate({
                to: '/auth/sign-in',
            });
        }
    };

    if (organizationId) {
        if (isOrgPending) {
            return (
                <div className={styles.loader}>
                    <Loader />
                </div>
            );
        }

        if (!organization || orgError) {
            toast.error('Failed to fetch organization');
            return (
                <Button variant="primary-outlined" onClick={() => refetchOrg()}>
                    Retry
                </Button>
            );
        }
    } else if (isUserPending) {
        return (
            <div className={styles.loader}>
                <Loader />
            </div>
        );
    } else if (!session?.user || userError) {
        return (
            <Button variant="primary-outlined" onClick={() => refetchUser()}>
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
                {organization ? (
                    <>
                        <img
                            src={PlaceholderImage}
                            alt="Organization image"
                            className={styles.menuItemImage}
                        />
                        <div className={styles.menuItemText}>
                            {organization.name}
                        </div>
                    </>
                ) : (
                    <div className={styles.menuItemText}>
                        {session?.user.email}
                    </div>
                )}
                <ArrowIcon className={styles.arrowIcon} />
            </Dropdown.Trigger>
            <Dropdown.Content className={styles.dropdownContent}>
                {organization && (
                    <OrganizationDropdownElements {...organization} />
                )}

                <Dropdown.Item
                    className={styles.menuItem}
                    onClick={handleNavigateToOrganizations}
                >
                    <OrganizationIcon
                        className={clsx(styles.menuItemIcon, styles.orange)}
                    />
                    Organizations
                </Dropdown.Item>
                <Dropdown.Item
                    className={styles.menuItem}
                    onClick={handleOpenLogoutDialog}
                >
                    <LogOutIcon
                        className={clsx(styles.menuItemIcon, styles.pink)}
                    />
                    Logout
                </Dropdown.Item>
            </Dropdown.Content>

            <Dialog
                open={isLogoutDialogOpen}
                onOpenChange={setIsLogoutDialogOpen}
            >
                <Dialog.Title>
                    Are you sure that you want to log out?
                </Dialog.Title>
                <Dialog.Description>
                    If you continue, you will be logged out.
                </Dialog.Description>
                <Dialog.Actions>
                    <Dialog.Button
                        variant="simple-clean"
                        onClick={() => setIsLogoutDialogOpen(false)}
                    >
                        Go back
                    </Dialog.Button>
                    <Dialog.Button variant="red-filled" onClick={handleLogout}>
                        Logout
                    </Dialog.Button>
                </Dialog.Actions>
            </Dialog>
        </Dropdown>
    );
};

type OrganizationDropdownElementsProps = Pick<
    OrganizationData,
    'id' | 'slug' | 'name'
>;

const OrganizationDropdownElements: FC<OrganizationDropdownElementsProps> = ({
    id,
    slug,
    name,
}) => {
    const navigate = useNavigate();

    const handleNavigateToBookingForms = () => {
        void navigate({
            to: '/$organizationId/booking-forms',
            params: { organizationId: id },
        });
    };

    const handleNavigateToBookings = () => {
        void navigate({
            to: '/$organizationId/bookings',
            params: { organizationId: id },
        });
    };

    return (
        <>
            <Dropdown.Item className={styles.companyInfo}>
                <img
                    src={PlaceholderImage}
                    alt="Organization image"
                    className={styles.menuItemImage}
                />
                <div className={styles.menuItemText}>
                    <span className={styles.menuItemName}>{name}</span>
                    <span className={styles.menuItemSlug}>@{slug}</span>
                </div>
            </Dropdown.Item>
            <Dropdown.Item
                className={styles.menuItem}
                onClick={handleNavigateToBookingForms}
            >
                <FormIcon className={clsx(styles.menuItemIcon, styles.blue)} />
                Booking forms
            </Dropdown.Item>
            <Dropdown.Item
                className={styles.menuItem}
                onClick={handleNavigateToBookings}
            >
                <TableIcon
                    className={clsx(styles.menuItemIcon, styles.green)}
                />
                Bookings
            </Dropdown.Item>
        </>
    );
};
