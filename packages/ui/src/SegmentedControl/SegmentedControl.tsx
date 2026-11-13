import { clsx } from 'clsx';
import { memo, type ReactNode } from 'react';
import styles from './SegmentedControl.module.scss';

type SegmentedControlOptionBase<Value extends string> = {
    value: Value;
    label: string;
};

export type SegmentedControlOption<Value extends string = string> =
    | (SegmentedControlOptionBase<Value> & {
          text: string;
          icon?: never;
      })
    | (SegmentedControlOptionBase<Value> & {
          icon: ReactNode;
          text?: never;
      });

export type SegmentedControlProps<Value extends string = string> = {
    value: Value;
    options: readonly [
        SegmentedControlOption<Value>,
        SegmentedControlOption<Value>,
    ];
    onChange: (value: Value) => void;
    className?: string;
    'aria-label'?: string;
};

function isIconOption<Value extends string>(
    option: SegmentedControlOption<Value>,
): option is SegmentedControlOption<Value> & { icon: ReactNode } {
    return option.icon !== undefined;
}

function SegmentedControl<Value extends string>({
    value,
    options,
    onChange,
    className,
    'aria-label': ariaLabel,
}: SegmentedControlProps<Value>) {
    return (
        <div
            className={clsx(styles.control, className)}
            role="group"
            aria-label={ariaLabel}
        >
            {options.map((option) => {
                const selected = option.value === value;
                const icon = isIconOption(option);

                return (
                    <button
                        key={option.value}
                        type="button"
                        className={clsx(
                            styles.segment,
                            icon ? styles.segmentIcon : styles.segmentText,
                            selected && styles.segmentSelected,
                        )}
                        aria-pressed={selected}
                        aria-label={option.label}
                        onClick={() => onChange(option.value)}
                    >
                        {icon ? option.icon : option.text}
                    </button>
                );
            })}
        </div>
    );
}

export default memo(SegmentedControl) as typeof SegmentedControl;
