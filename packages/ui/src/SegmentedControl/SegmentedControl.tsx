import { clsx } from 'clsx';
import {
    createContext,
    memo,
    useContext,
    type ComponentProps,
    type ReactNode,
} from 'react';
import styles from './SegmentedControl.module.scss';

type SegmentedControlContextValue = {
    value: string;
    onValueChange: (value: string) => void;
};

const SegmentedControlContext = createContext<SegmentedControlContextValue | null>(null);

function useSegmentedControlContext() {
    const context = useContext(SegmentedControlContext);

    if (!context) {
        throw new Error('SegmentedControl.Item must be used within <SegmentedControl>');
    }

    return context;
}

export type SegmentedControlProps<Value extends string = string> = {
    value: Value;
    onValueChange: (value: Value) => void;
    children: ReactNode;
    className?: string;
} & Omit<ComponentProps<'div'>, 'children' | 'className'>;

function SegmentedControlRoot<Value extends string>({
    value,
    onValueChange,
    children,
    className,
    ...rest
}: SegmentedControlProps<Value>) {
    return (
        <SegmentedControlContext.Provider
            value={{
                value,
                onValueChange: onValueChange as (next: string) => void,
            }}
        >
            <div
                {...rest}
                className={clsx(styles.control, className)}
                role="group"
            >
                {children}
            </div>
        </SegmentedControlContext.Provider>
    );
}

export type SegmentedControlItemProps = {
    value: string;
    children: ReactNode;
} & Omit<ComponentProps<'button'>, 'value' | 'type' | 'children'>;

function SegmentedControlItem({
    value,
    children,
    className,
    onClick,
    ...buttonProps
}: SegmentedControlItemProps) {
    const { value: selectedValue, onValueChange } = useSegmentedControlContext();
    const selected = value === selectedValue;

    return (
        <button
            {...buttonProps}
            type="button"
            className={clsx(styles.segment, selected && styles.segmentSelected, className)}
            aria-pressed={selected}
            onClick={(event) => {
                onClick?.(event);
                onValueChange(value);
            }}
        >
            {children}
        </button>
    );
}

type SegmentedControlComponent = (<Value extends string>(
    props: SegmentedControlProps<Value>,
) => ReactNode) & {
    Item: typeof SegmentedControlItem;
};

const SegmentedControl = memo(SegmentedControlRoot) as unknown as SegmentedControlComponent;
SegmentedControl.Item = SegmentedControlItem;

export default SegmentedControl;
