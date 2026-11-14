import type { FC } from 'react';
import { Dialog } from '@bookio/ui';
import styles from './FieldModal.module.scss';
import { m } from '../../paraglide/messages.js';

interface FieldModalHeaderProps {
    isEditMode: boolean;
}

export const FieldModalHeader: FC<FieldModalHeaderProps> = ({ isEditMode }) => (
    <div className={styles.header}>
        <Dialog.Title>{isEditMode ? m.field_edit_title() : m.field_create_title()}</Dialog.Title>
        <Dialog.Description>
            {isEditMode ? m.field_edit_description() : m.field_create_description()}
        </Dialog.Description>
    </div>
);
