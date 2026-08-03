import { ColorPicker } from '@bookio/ui';
import type { FC } from 'react';

import styles from './StyleColorField.module.scss';

type StyleColorFieldProps = {
    id: string;
    label: string;
    value: string;
    onChange: (color: string) => void;
};

export const StyleColorField: FC<StyleColorFieldProps> = ({ id, label, value, onChange }) => {
    return (
        <div className={styles.field}>
            <label className={styles.label} htmlFor={id}>{label}</label>
            <ColorPicker
                id={id}
                className={styles.colorPicker}
                currentColor={value}
                setCurrentColor={onChange}
                aria-label={label}
            />
        </div>
    );
};
