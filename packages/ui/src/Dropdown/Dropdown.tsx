import {
    autoUpdate,
    flip,
    FloatingPortal,
    offset,
    shift,
    size,
    useClick,
    useDismiss,
    useFloating,
    useInteractions,
    useRole,
    type Placement,
} from '@floating-ui/react';
import {
    createContext,
    memo,
    useCallback,
    useContext,
    useMemo,
    type ComponentProps,
    type MouseEvent,
    type ReactNode,
} from 'react';
import Button, { type ButtonAsButtonProps } from '../Button/Button.js';
import styles from './Dropdown.module.scss';

const OUTSIDE_CLICK_IGNORE_ATTR = 'data-outside-click-ignore';

type DropdownContextValue = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    refs: ReturnType<typeof useFloating>['refs'];
    floatingStyles: ReturnType<typeof useFloating>['floatingStyles'];
    getReferenceProps: ReturnType<typeof useInteractions>['getReferenceProps'];
    getFloatingProps: ReturnType<typeof useInteractions>['getFloatingProps'];
    getItemProps: ReturnType<typeof useInteractions>['getItemProps'];
};

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
    const context = useContext(DropdownContext);

    if (!context) {
        throw new Error('Dropdown compound components must be used within <Dropdown>');
    }

    return context;
}

export type DropdownProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
    placement?: Placement;
    offset?: number;
    closeOnOutsideClick?: boolean;
    closeOnEscape?: boolean;
    matchTriggerWidth?: boolean;
};

function DropdownRoot({
    open,
    onOpenChange,
    children,
    placement = 'bottom-start',
    offset: offsetValue = 4,
    closeOnOutsideClick = true,
    closeOnEscape = true,
    matchTriggerWidth = false,
}: DropdownProps) {
    const { refs, floatingStyles, context } = useFloating({
        open,
        onOpenChange,
        placement,
        middleware: [
            offset(offsetValue),
            flip(),
            shift({ padding: 8 }),
            ...(matchTriggerWidth
                ? [
                      size({
                          apply({ rects, elements }) {
                              Object.assign(elements.floating.style, {
                                  width: `${rects.reference.width}px`,
                              });
                          },
                      }),
                  ]
                : []),
        ],
        whileElementsMounted: autoUpdate,
    });

    const click = useClick(context);
    const dismiss = useDismiss(context, {
        outsidePress: closeOnOutsideClick,
        escapeKey: closeOnEscape,
    });
    const role = useRole(context, { role: 'menu' });

    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
        click,
        dismiss,
        role,
    ]);

    const contextValue = useMemo<DropdownContextValue>(
        () => ({
            open,
            onOpenChange,
            refs,
            floatingStyles,
            getReferenceProps,
            getFloatingProps,
            getItemProps,
        }),
        [open, onOpenChange, refs, floatingStyles, getReferenceProps, getFloatingProps, getItemProps],
    );

    return <DropdownContext.Provider value={contextValue}>{children}</DropdownContext.Provider>;
}

export type DropdownTriggerProps = {
    children: ReactNode;
    className?: string;
} & Omit<ComponentProps<'button'>, 'className' | 'children'>;

function DropdownTrigger({ children, className, ...props }: DropdownTriggerProps) {
    const { refs, getReferenceProps } = useDropdownContext();

    const classes = [styles.trigger, className].filter(Boolean).join(' ');

    return (
        <button
            ref={refs.setReference}
            type="button"
            className={classes}
            {...getReferenceProps(props)}
        >
            {children}
        </button>
    );
}

export type DropdownContentProps = {
    children: ReactNode;
    className?: string;
};

function DropdownContent({ children, className }: DropdownContentProps) {
    const { open, refs, floatingStyles, getFloatingProps } = useDropdownContext();

    if (!open) return null;

    const classes = [styles.content, className].filter(Boolean).join(' ');

    return (
        <FloatingPortal>
            <div
                ref={refs.setFloating}
                style={floatingStyles}
                className={classes}
                {...getFloatingProps()}
                {...{ [OUTSIDE_CLICK_IGNORE_ATTR]: '' }}
            >
                {children}
            </div>
        </FloatingPortal>
    );
}

export type DropdownItemProps = ButtonAsButtonProps & {
    hoverable?: boolean;
};

function DropdownItem({
    children,
    className,
    variant = 'simple-clean',
    disabled = false,
    hoverable = true,
    onClick,
    ...props
}: DropdownItemProps) {
    const { onOpenChange, getItemProps } = useDropdownContext();

    const classes = [styles.item, !hoverable && styles.itemNotHoverable, className]
        .filter(Boolean)
        .join(' ') || undefined;

    const handleClick = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            if (disabled) return;
            onClick?.(event);
            if (hoverable) {
                onOpenChange(false);
            }
        },
        [disabled, hoverable, onClick, onOpenChange],
    );

    return (
        <Button
            variant={variant}
            className={classes}
            disabled={disabled}
            {...getItemProps({ onClick: handleClick, role: 'menuitem', ...props })}
        >
            {children}
        </Button>
    );
}

type DropdownComponent = typeof DropdownRoot & {
    Trigger: typeof DropdownTrigger;
    Content: typeof DropdownContent;
    Item: typeof DropdownItem;
};

const Dropdown = memo(DropdownRoot) as unknown as DropdownComponent;
Dropdown.Trigger = DropdownTrigger;
Dropdown.Content = DropdownContent;
Dropdown.Item = DropdownItem;

export default Dropdown;
