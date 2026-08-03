import type { FC } from 'react';
import styles from './ConfiguratorField.module.scss';
import { Button } from '@bookio/ui';

import EditIcon from '#assets/icons/pen.svg?react';
import TrashIcon from '#assets/icons/trash.svg?react';

interface ConfiguratorFieldActionsProps {
    onEdit?: () => void;
    onDelete?: () => void;
}

export const ConfiguratorFieldActions: FC<ConfiguratorFieldActionsProps> = ({ onEdit, onDelete }) => {
    return (
        <div className={styles.actions}>
            <Button
                type="button"
                variant="blue-clean"
                className={styles.editButton}
                onClick={onEdit}
                aria-label={`Edit ${name}`}
            >
                <EditIcon />
            </Button>
            <Button
                type="button"
                variant="red-clean"
                className={styles.deleteButton}
                onClick={onDelete}
                aria-label={`Delete ${name}`}
            >
                <TrashIcon />
            </Button>
        </div>
    );
}