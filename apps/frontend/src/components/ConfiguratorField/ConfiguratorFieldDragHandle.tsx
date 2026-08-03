import { useCallback, type FC } from 'react';

import GripVerticalIcon from '#assets/icons/grip-vertical.svg?react';
import { useReorderContext } from '@bookio/ui';
import styles from './ConfiguratorField.module.scss';

export const ConfiguratorFieldDragHandle: FC<{ fieldId: string }> = ({ fieldId }) => {
    const { onDragStart } = useReorderContext();

    const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        onDragStart(fieldId, e);
    }, [fieldId, onDragStart]);

    return (
        <div className={styles.dragHandle} aria-hidden="true" onPointerDown={handlePointerDown}>
            <GripVerticalIcon />
        </div>
    );
};
