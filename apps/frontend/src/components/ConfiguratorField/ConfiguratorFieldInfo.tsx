import type { FC } from 'react';

import styles from './ConfiguratorField.module.scss';
import { m } from '../../paraglide/messages.js';

interface ConfiguratorFieldInfoProps {
    name: string;
    fieldKey: string;
    required?: boolean;
}

export const ConfiguratorFieldInfo: FC<ConfiguratorFieldInfoProps> = ({
    name,
    fieldKey,
    required,
}) => {
    return (
        <div className={styles.info}>
            <div className={styles.nameRow}>
                <span className={styles.name}>{name}</span>
                {required ? <span className={styles.requiredDot} aria-label={m.required()} /> : null}
            </div>
            <span className={styles.fieldKey}>{fieldKey}</span>
        </div>
    );
};
