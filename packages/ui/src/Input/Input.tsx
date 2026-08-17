import { clsx } from 'clsx';
import {
    autoUpdate,
    flip,
    FloatingPortal,
    offset,
    shift,
    useDismiss,
    useFloating,
    useFocus,
    useHover,
    useInteractions,
    useRole,
} from '@floating-ui/react';
import {
    memo,
    useId,
    useState,
    type ComponentProps,
    type FocusEvent,
    type MouseEvent,
    type ReactNode,
} from 'react';
import HelpIcon from './icons/help.svg?react';
import styles from './Input.module.scss';

type LabelProps = {
    label?: ReactNode;
    helpText?: string;
};

type TextareaProps = {
    type: 'textarea';
    className?: string;
} & LabelProps &
    Omit<ComponentProps<'textarea'>, 'className'>;

type NativeInputProps = {
    type?: Exclude<ComponentProps<'input'>['type'], 'textarea'>;
    className?: string;
} & LabelProps &
    Omit<ComponentProps<'input'>, 'type' | 'className'>;

export type InputProps = TextareaProps | NativeInputProps;

export type InputFieldProps = {
    label?: ReactNode;
    htmlFor?: string;
    className?: string;
    children: ReactNode;
};

export type InputRootProps = {
    className?: string;
    children: ReactNode;
};

export type InputIconProps = {
    children: ReactNode;
    className?: string;
    position?: 'start' | 'end';
};

function getReadOnlyHandlers<T extends HTMLInputElement | HTMLTextAreaElement>(
    readOnly: boolean | undefined,
    onFocus?: (event: FocusEvent<T>) => void,
    onMouseDown?: (event: MouseEvent<T>) => void,
) {
    if (!readOnly) {
        return { onFocus, onMouseDown };
    }

    return {
        tabIndex: -1,
        onFocus: (event: FocusEvent<T>) => {
            event.currentTarget.blur();
        },
        onMouseDown: (event: MouseEvent<T>) => {
            event.preventDefault();
            onMouseDown?.(event);
        },
    };
}

function HelpHint({ message }: { message: string }) {
    const [open, setOpen] = useState(false);

    const { refs, floatingStyles, context } = useFloating({
        open,
        onOpenChange: setOpen,
        placement: 'top',
        middleware: [offset(8), flip(), shift({ padding: 8 })],
        whileElementsMounted: autoUpdate,
    });

    const hover = useHover(context, { move: false });
    const focus = useFocus(context);
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: 'tooltip' });
    const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

    return (
        <>
            <span
                ref={refs.setReference}
                className={styles.helpTrigger}
                tabIndex={0}
                aria-label={message}
                {...getReferenceProps()}
            >
                <HelpIcon className={styles.helpIcon} aria-hidden />
            </span>
            {open && (
                <FloatingPortal>
                    <div
                        ref={refs.setFloating}
                        style={floatingStyles}
                        className={styles.tooltip}
                        {...getFloatingProps()}
                    >
                        {message}
                    </div>
                </FloatingPortal>
            )}
        </>
    );
}

function withHelpText(control: ReactNode, helpText?: string) {
    if (!helpText) {
        return control;
    }

    return (
        <InputRoot>
            {control}
            <HelpHint message={helpText} />
        </InputRoot>
    );
}

function InputField({ label, htmlFor, className, children }: InputFieldProps) {
    if (label === undefined) {
        return <>{children}</>;
    }

    const classes = clsx(styles.field, className);

    return (
        <div className={classes}>
            <label className={styles.label} htmlFor={htmlFor}>
                {label}
            </label>
            {children}
        </div>
    );
}

function InputRoot({ className, children }: InputRootProps) {
    const classes = clsx(styles.root, className);

    return <div className={classes}>{children}</div>;
}

function InputIcon({ children, className, position = 'start' }: InputIconProps) {
    const classes = clsx(
        styles.icon,
        position === 'end' ? styles.iconEnd : styles.iconStart,
        className,
    );

    return (
        <span className={classes} aria-hidden>
            {children}
        </span>
    );
}

function InputControl(props: TextareaProps): React.JSX.Element;
function InputControl(props: NativeInputProps): React.JSX.Element;
function InputControl(props: InputProps): React.JSX.Element {
    const generatedId = useId();

    if (props.type === 'textarea') {
        const {
            type,
            className,
            readOnly,
            onFocus,
            onMouseDown,
            label,
            helpText,
            id,
            ...rest
        } = props as TextareaProps;
        const inputId = id ?? (label !== undefined ? generatedId : undefined);
        const classes = clsx(styles.input, readOnly && styles.readOnly, className);
        const readOnlyHandlers = getReadOnlyHandlers(readOnly, onFocus, onMouseDown);

        return (
            <InputField label={label} htmlFor={inputId}>
                {withHelpText(
                    <textarea
                        id={inputId}
                        className={classes}
                        readOnly={readOnly}
                        {...rest}
                        {...readOnlyHandlers}
                    />,
                    helpText,
                )}
            </InputField>
        );
    }

    const {
        type = 'text',
        className,
        readOnly,
        onFocus,
        onMouseDown,
        label,
        helpText,
        id,
        ...rest
    } = props as NativeInputProps;
    const inputId = id ?? (label !== undefined ? generatedId : undefined);
    const classes = clsx(styles.input, readOnly && styles.readOnly, className);
    const readOnlyHandlers = getReadOnlyHandlers(readOnly, onFocus, onMouseDown);

    return (
        <InputField label={label} htmlFor={inputId}>
            {withHelpText(
                <input
                    type={type}
                    id={inputId}
                    className={classes}
                    readOnly={readOnly}
                    {...rest}
                    {...readOnlyHandlers}
                />,
                helpText,
            )}
        </InputField>
    );
}

type InputComponent = typeof InputControl & {
    Root: typeof InputRoot;
    Icon: typeof InputIcon;
    Field: typeof InputField;
};

const Input = memo(InputControl) as unknown as InputComponent;
Input.Root = InputRoot;
Input.Icon = InputIcon;
Input.Field = InputField;

export { Input, InputField, InputRoot, InputIcon };

export default Input;
