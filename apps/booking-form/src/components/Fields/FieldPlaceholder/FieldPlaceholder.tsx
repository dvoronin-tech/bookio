import type { FC } from 'react';
import type { FieldRendererProps } from '#/components/Fields/field.types';
import styles from './FieldPlaceholder.module.scss';

export const FieldPlaceholder: FC<FieldRendererProps> = ({ field }) => {
    return (
        <div className={styles.field}>
            <span className={styles.fieldLabel}>
                {field.name}
                {field.required ? ' *' : null}
            </span>
            <div className={styles.fieldInput}>{field.name}</div>
        </div>
    );
};
