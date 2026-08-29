import { clsx } from 'clsx';
import { memo } from 'react';
import styles from './ProgressBar.module.scss';

export type ProgressBarSegment = {
    left: number;
    width: number;
    isActive: boolean;
};

const Segments = ({ segments }: { segments: ProgressBarSegment[] }) => {
    return (
        <div className={styles.trackInner}>
            {segments.map((segment, index) => (
                <div
                    key={index}
                    className={clsx(styles.segment, segment.isActive && styles.active)}
                    style={{ left: `${segment.left}%`, width: `${segment.width}%` }}
                />
            ))}
        </div>
    );
};

export default memo(Segments);
