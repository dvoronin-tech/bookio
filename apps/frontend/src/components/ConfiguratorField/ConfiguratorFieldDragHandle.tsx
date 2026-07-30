import type { FC, PointerEvent } from 'react';

import GripVerticalIcon from '#assets/icons/grip-vertical.svg?react';

import styles from './ConfiguratorField.module.scss';

interface ConfiguratorFieldDragHandleProps {
    onPointerDown: (e: PointerEvent<HTMLDivElement>) => void;
}

export const ConfiguratorFieldDragHandle: FC<ConfiguratorFieldDragHandleProps> = ({
    onPointerDown,
}) => {
    return (
        <div className={styles.dragHandle} aria-hidden="true" onPointerDown={onPointerDown}>
            <GripVerticalIcon />
        </div>
    );
};
