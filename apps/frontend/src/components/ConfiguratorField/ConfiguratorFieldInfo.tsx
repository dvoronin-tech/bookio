import type { FC } from 'react';

import styles from './ConfiguratorField.module.scss';

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
                {required ? <span className={styles.requiredDot} aria-label="Required" /> : null}
            </div>
            <span className={styles.fieldKey}>{fieldKey}</span>
        </div>
    );
};
