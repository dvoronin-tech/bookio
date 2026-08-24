import { DatePicker } from '@bookio/ui';
import { useState, type FC } from 'react';
import styles from './DatePickerPreview.module.scss';

export const DatePickerPreview: FC = () => {
    const [value, setValue] = useState('');

    return (
        <div className={styles.page}>
            <div className={styles.field}>
                <DatePicker value={value} onChange={setValue} label="Date" />
            </div>
        </div>
    );
};
