import type { FC, MouseEvent } from 'react';
import { Dialog } from '@bookio/ui';
import PlusIcon from '#assets/icons/plus.svg?react';
import styles from './FieldModal.module.scss';
import { m } from '#i18n/messages';

interface FieldModalActionsProps {
    isEditMode: boolean;
    onCancel: (value: boolean | MouseEvent<HTMLButtonElement>) => void;
}

export const FieldModalActions: FC<FieldModalActionsProps> = ({ isEditMode, onCancel }) => (
    <Dialog.Actions className={styles.actions}>
        <Dialog.Button variant="simple-clean" onClick={onCancel}>
            {m.cancel()}
        </Dialog.Button>
        <Dialog.Button type="submit" variant="primary-filled" className={styles.submitButton}>
            {isEditMode ? (
                m.field_save_changes()
            ) : (
                <>
                    <PlusIcon />
                    {m.field_create_submit()}
                </>
            )}
        </Dialog.Button>
    </Dialog.Actions>
);
