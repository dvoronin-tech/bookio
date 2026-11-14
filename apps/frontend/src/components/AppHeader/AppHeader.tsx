import { type FC, useState } from 'react';
import styles from './AppHeader.module.scss';
import Logo from '#assets/logo.svg?react';
import { useNavigate } from '@tanstack/react-router';
import { organizationRouteApi } from '#lib/routeApis';
import { Button, Dialog, Dropdown, Loader, SegmentedControl } from '@bookio/ui';

import {
    useGetOrganization,
    type OrganizationData,
} from '#api/organizations/getOrganizationData';

import ArrowIcon from '#assets/icons/short-arrow.svg?react';
import FormIcon from '#assets/icons/form.svg?react';
import TableIcon from '#assets/icons/table.svg?react';
import OrganizationIcon from '#assets/icons/organization.svg?react';
import LogOutIcon from '#assets/icons/log-out.svg?react';
import FlagUsIcon from '#assets/icons/flag-us.svg?react';
import FlagRuIcon from '#assets/icons/flag-ru.svg?react';

import PlaceholderImage from '#assets/images/OrganizationPlaceholder.webp';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { useSession, useSignOut } from '#api/auth';
import { getLocale, m, setLocale } from '#i18n/messages';

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
            <div className={styles.headerEnd}>
                <LanguageSwitch />
                <div className={styles.dropdown}>
                    <HeaderDropdown />
                </div>
            </div>
        </div>
    );
};

const LanguageSwitch: FC = () => {
    const locale = getLocale();

    return (
        <SegmentedControl
            aria-label={m.language()}
            value={locale}
            onValueChange={setLocale}
        >
            <SegmentedControl.Item value="en" aria-label={m.language_en()}>
                <FlagUsIcon className={styles.languageFlag} />
            </SegmentedControl.Item>
            <SegmentedControl.Item value="ru" aria-label={m.language_ru()}>
                <FlagRuIcon className={styles.languageFlag} />
            </SegmentedControl.Item>
        </SegmentedControl>
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
            loading: m.header_logout_loading(),
            error: (error) => m.header_logout_error({ error: String(error) }),
            success: m.header_logout_success(),
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
            toast.error(m.header_org_fetch_failed());
            return (
                <Button variant="primary-outlined" onClick={() => refetchOrg()}>
                    {m.retry()}
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
                {m.retry()}
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
                            alt={m.header_org_image_alt()}
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
                    {m.header_organizations()}
                </Dropdown.Item>
                <Dropdown.Item
                    className={styles.menuItem}
                    onClick={handleOpenLogoutDialog}
                >
                    <LogOutIcon
                        className={clsx(styles.menuItemIcon, styles.pink)}
                    />
                    {m.logout()}
                </Dropdown.Item>
            </Dropdown.Content>

            <Dialog
                open={isLogoutDialogOpen}
                onOpenChange={setIsLogoutDialogOpen}
            >
                <Dialog.Title>
                    {m.header_logout_confirm_title()}
                </Dialog.Title>
                <Dialog.Description>
                    {m.header_logout_confirm_description()}
                </Dialog.Description>
                <Dialog.Actions>
                    <Dialog.Button
                        variant="simple-clean"
                        onClick={() => setIsLogoutDialogOpen(false)}
                    >
                        {m.go_back()}
                    </Dialog.Button>
                    <Dialog.Button variant="red-filled" onClick={handleLogout}>
                        {m.logout()}
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
                    alt={m.header_org_image_alt()}
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
                {m.header_booking_forms()}
            </Dropdown.Item>
            <Dropdown.Item
                className={styles.menuItem}
                onClick={handleNavigateToBookings}
            >
                <TableIcon
                    className={clsx(styles.menuItemIcon, styles.green)}
                />
                {m.header_bookings()}
            </Dropdown.Item>
        </>
    );
};
