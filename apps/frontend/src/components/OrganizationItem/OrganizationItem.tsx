import { useCallback, useState, type FC } from 'react';
import styles from './OrganizationItem.module.scss';
import { format } from 'date-fns';
import { dateFnsLocale } from '#i18n/locale';
import { m } from '../../paraglide/messages.js';
import { clsx } from 'clsx';
import PlaceholderImage from '#assets/images/OrganizationPlaceholder.webp';
import { Dialog } from '@bookio/ui';

import type { OrganizationType } from '#api/organizations/getOrganizationsByUserId';
import { Button } from '@bookio/ui';
import { toast } from 'react-hot-toast';

import TrashIcon from '#assets/icons/trash.svg?react';
import { useLogoutOrganization } from '#api/organizations/logoutOgranization';
import { useOnPress } from '#hooks/useOnPress';

const roleLabel = (role: OrganizationType['role']) => {
    switch (role) {
        case 'owner':
            return m.org_role_owner();
        case 'admin':
            return m.org_role_admin();
        case 'member':
            return m.org_role_member();
    }
};

interface OrganizationItemProps {
    organizationName: OrganizationType['name'];
    organizationId: OrganizationType['id'];
    imageUrl?: string;
    createdAt: OrganizationType['createdAt'];
    role: OrganizationType['role'];
    slug: OrganizationType['slug'];
    onClick?: (id: string) => void;
    showActions?: boolean;
}

export const OrganizationItem: FC<OrganizationItemProps> = ({
    organizationName,
    createdAt,
    organizationId,
    imageUrl,
    role,
    slug,
    onClick,
    showActions = true,
}) => {
    const { mutateAsync: logoutOrganization } = useLogoutOrganization();
    const [isOpenLogoutDialog, setIsOpenLogoutDialog] = useState(false);
    const [organizationPassword, setOrganizationPassword] = useState('');

    const handleClickOnTrash = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpenLogoutDialog(true);
    };

    const handleCloseLogoutDialog = () => {
        setIsOpenLogoutDialog(false);
    };

    const handleLogoutOrganization = useCallback(async () => {
        if (role === 'owner' && organizationPassword.trim() === '') {
            toast.error(m.org_password_required());
            return;
        }

        const payload =
            role === 'owner' ? { organizationId, organizationPassword } : { organizationId };

        await toast.promise(logoutOrganization(payload), {
            loading: m.org_logging_out(),
            success: m.org_logged_out(),
            error: (error: Error) => error.message,
        });

        handleCloseLogoutDialog();
    }, [logoutOrganization, organizationId, organizationPassword, role]);

    useOnPress('Enter', handleLogoutOrganization, isOpenLogoutDialog);

    const handleChangeOrganizationPassword = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setOrganizationPassword(e.target.value);
        },
        [],
    );

    const handleClickOnOrganization = useCallback(() => {
        if (isOpenLogoutDialog) return;
        onClick?.(organizationId);
    }, [onClick, organizationId, isOpenLogoutDialog]);

    return (
        <>
            <div
                className={clsx(styles.organizationItem, { [styles.withoutActions]: !showActions })}
                onClick={handleClickOnOrganization}
            >
                <img src={imageUrl || PlaceholderImage} alt={organizationName} />
                <div className={styles.organizationInfo}>
                    <h3 className={styles.title}>
                        <span className={styles.titleName}>{organizationName}</span>
                        <span className={styles.titleSlug}>@{slug}</span>
                    </h3>
                    <div className={styles.organizationAdditionalInfo}>
                        <div className={clsx(styles.role, { [styles.owner]: role === 'owner' })}>
                            {roleLabel(role)}
                        </div>
                        <span>
                            {format(new Date(createdAt), 'dd/MM/yyyy', {
                                locale: dateFnsLocale(),
                            })}
                        </span>
                    </div>
                </div>

                {showActions && (
                    <div className={styles.actionButtons}>
                        <Button variant="red-clean" onClick={handleClickOnTrash}>
                            <TrashIcon />
                        </Button>
                    </div>
                )}
            </div>

            {showActions && (
                <Dialog
                    open={isOpenLogoutDialog}
                    onOpenChange={setIsOpenLogoutDialog}
                    closeOnEscape
                    contentClassName={styles.logoutDialog}
                >
                    <Dialog.Title>
                        {role === 'owner'
                            ? m.org_remove_title({ name: organizationName })
                            : m.org_leave_title({ name: organizationName })}
                    </Dialog.Title>
                    <Dialog.Description>
                        {role === 'owner' ? (
                            <>
                                {m.org_remove_description_lead()}
                                <br />
                                <br />
                                {m.org_remove_description_confirm()}
                            </>
                        ) : (
                            m.org_leave_description()
                        )}
                    </Dialog.Description>
                    {role === 'owner' && (
                        <Dialog.Input
                            type="password"
                            placeholder={m.org_password_confirm_placeholder()}
                            value={organizationPassword}
                            onChange={handleChangeOrganizationPassword}
                        />
                    )}
                    <Dialog.Actions>
                        <Dialog.Button variant="simple-clean" onClick={handleCloseLogoutDialog}>
                            {m.cancel()}
                        </Dialog.Button>
                        <Dialog.Button variant="red-filled" onClick={handleLogoutOrganization}>
                            {m.logout()}
                        </Dialog.Button>
                    </Dialog.Actions>
                </Dialog>
            )}
        </>
    );
};
