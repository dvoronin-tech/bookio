import type { FC, MouseEvent } from 'react';
import { Dialog } from '@bookio/ui';
import PlusIcon from '#assets/icons/plus.svg?react';
import styles from './FieldModal.module.scss';

interface FieldModalActionsProps {
    isEditMode: boolean;
    onCancel: (value: boolean | MouseEvent<HTMLButtonElement>) => void;
}

export const FieldModalActions: FC<FieldModalActionsProps> = ({ isEditMode, onCancel }) => (
    <Dialog.Actions className={styles.actions}>
        <Dialog.Button variant="simple-clean" onClick={onCancel}>
            Cancel
        </Dialog.Button>
        <Dialog.Button type="submit" variant="primary-filled" className={styles.submitButton}>
            {isEditMode ? (
                'Save changes'
            ) : (
                <>
                    <PlusIcon />
                    Create a new field
                </>
            )}
        </Dialog.Button>
    </Dialog.Actions>
);
