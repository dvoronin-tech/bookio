import { clsx } from 'clsx';
import {
    autoUpdate,
    flip,
    offset,
    shift,
    useDismiss,
    useFloating,
    useFocus,
    useHover,
    useInteractions,
    useRole,
    type Placement,
} from '@floating-ui/react';
import { useState, type ComponentProps, type ReactNode } from 'react';
import styles from './Tooltip.module.scss';

export type TooltipProps = {
    message?: ReactNode;
    children: ReactNode;
    className?: string;
    placement?: Placement;
} & Omit<ComponentProps<'span'>, 'className' | 'children' | 'ref'>;

function hasMessage(message: ReactNode) {
    return message != null && message !== false && message !== '';
}

function Tooltip({
    message,
    children,
    className,
    placement = 'top',
    ...rest
}: TooltipProps) {
    const [open, setOpen] = useState(false);
    const visible = hasMessage(message);

    const {
        refs: { setReference, setFloating },
        floatingStyles,
        context,
    } = useFloating({
        open: open && visible,
        onOpenChange: setOpen,
        placement,
        middleware: [offset(8), flip(), shift({ padding: 8 })],
        whileElementsMounted: autoUpdate,
    });

    const hover = useHover(context, { move: false });
    const focus = useFocus(context);
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: 'tooltip' });
    const { getReferenceProps, getFloatingProps } = useInteractions([
        hover,
        focus,
        dismiss,
        role,
    ]);

    return (
        <>
            <span
                ref={setReference}
                className={clsx(styles.trigger, className)}
                {...getReferenceProps(rest)}
            >
                {children}
            </span>
            {open && visible && (
                <div
                    ref={setFloating}
                    style={floatingStyles}
                    className={styles.tooltip}
                    {...getFloatingProps()}
                >
                    {message}
                </div>
            )}
        </>
    );
}

export default Tooltip;
