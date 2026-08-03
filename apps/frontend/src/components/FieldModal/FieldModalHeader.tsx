import type { FC } from 'react';
import { Dialog } from '@bookio/ui';
import styles from './FieldModal.module.scss';

interface FieldModalHeaderProps {
    isEditMode: boolean;
}

export const FieldModalHeader: FC<FieldModalHeaderProps> = ({ isEditMode }) => (
    <div className={styles.header}>
        <Dialog.Title>{isEditMode ? 'Edit field' : 'Create new field'}</Dialog.Title>
        <Dialog.Description>
            {isEditMode
                ? 'Update field settings'
                : 'Configure a new field for your booking form'}
        </Dialog.Description>
    </div>
);
