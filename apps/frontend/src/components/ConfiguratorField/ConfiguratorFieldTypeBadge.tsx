import type { CSSProperties, FC } from 'react';
import type { EntireBookingFormField } from '#api/bookingForms/getEntireBookingFormById';

import { fieldTypeIcons } from './fieldTypeIcons';
import styles from './ConfiguratorField.module.scss';

interface ConfiguratorFieldTypeBadgeProps {
    type: EntireBookingFormField['type'];
}

export const ConfiguratorFieldTypeBadge: FC<ConfiguratorFieldTypeBadgeProps> = ({ type }) => {
    const iconData = fieldTypeIcons[type];

    if (!iconData) return null;

    const { icon: TypeIcon, color } = iconData;

    return (
        <div
            className={styles.typeBadge}
            style={{ '--type-badge-color': color } as CSSProperties}
        >
            <TypeIcon />
        </div>
    );
};
