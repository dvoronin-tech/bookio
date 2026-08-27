import { FloatingPortal } from '@floating-ui/react';
import { memo, type CSSProperties, type HTMLAttributes } from 'react';
import TimeColumn from './TimeColumn.js';
import type { TimeOption } from './timeUtils.js';
import styles from './TimePicker.module.scss';

export const OUTSIDE_CLICK_IGNORE_ATTR = 'data-outside-click-ignore';

type TimePopoverProps = {
    floatingRef: (node: HTMLDivElement | null) => void;
    floatingStyles: CSSProperties;
    floatingProps: HTMLAttributes<HTMLDivElement>;
    hourOptions: TimeOption[];
    minuteOptions: TimeOption[];
    selectedHour: number | null;
    selectedMinute: number | null;
    onSelectHour: (hour: number) => void;
    onSelectMinute: (minute: number) => void;
};

function TimePopover({
    floatingRef,
    floatingStyles,
    floatingProps,
    hourOptions,
    minuteOptions,
    selectedHour,
    selectedMinute,
    onSelectHour,
    onSelectMinute,
}: TimePopoverProps) {
    return (
        <FloatingPortal>
            <div
                ref={floatingRef}
                style={floatingStyles}
                className={styles.popover}
                {...floatingProps}
                {...{ [OUTSIDE_CLICK_IGNORE_ATTR]: '' }}
            >
                <div className={styles.columns}>
                    <TimeColumn
                        options={hourOptions}
                        selected={selectedHour}
                        onSelect={onSelectHour}
                        aria-label="Hours"
                    />
                    <TimeColumn
                        options={minuteOptions}
                        selected={selectedMinute}
                        onSelect={onSelectMinute}
                        aria-label="Minutes"
                    />
                </div>
            </div>
        </FloatingPortal>
    );
}

export default memo(TimePopover);
