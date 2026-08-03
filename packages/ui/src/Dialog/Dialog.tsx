import { clsx } from 'clsx';
import {
    createContext,
    memo,
    useCallback,
    useContext,
    useEffect,
    useId,
    useRef,
    useState,
    type AnimationEvent,
    type ReactNode,
    type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import Button, { type ButtonProps } from '../Button/Button.js';
import Input, { type InputProps } from '../Input/Input.js';
import { useOutsideClick } from '../hooks/useOutsideClick.js';
import styles from './Dialog.module.scss';

type DialogContextValue = {
    isClosing: boolean;
    requestClose: () => void;
    contentRef: RefObject<HTMLDivElement | null>;
    titleId: string;
    descriptionId: string;
    hasDescription: boolean;
    setHasDescription: (value: boolean) => void;
};

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext() {
    const context = useContext(DialogContext);

    if (!context) {
        throw new Error('Dialog compound components must be used within <Dialog>');
    }

    return context;
}

export type DialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
    className?: string;
    contentClassName?: string;
    closeOnOutsideClick?: boolean;
    closeOnEscape?: boolean;
};

function DialogRoot({
    open,
    onOpenChange,
    children,
    className,
    contentClassName,
    closeOnOutsideClick = true,
    closeOnEscape = true,
}: DialogProps) {
    const [isRendered, setIsRendered] = useState(open);
    const [isClosing, setIsClosing] = useState(false);
    const [hasDescription, setHasDescription] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const titleId = useId();
    const descriptionId = useId();

    const prevOpenRef = useRef(open);

    const requestClose = useCallback(() => {
        if (!isRendered || isClosing) return;
        onOpenChange(false);
    }, [isRendered, isClosing, onOpenChange]);

    useEffect(() => {
        const wasOpen = prevOpenRef.current;
        prevOpenRef.current = open;

        if (open) {
            setIsRendered(true);
            if (!wasOpen) {
                setIsClosing(false);
            }
            return;
        }

        if (isRendered && !isClosing) {
            setIsClosing(true);
        }
    }, [open, isRendered, isClosing]);

    const handleAnimationEnd = useCallback(
        (e: AnimationEvent<HTMLDivElement>) => {
            if (e.target !== e.currentTarget || !isClosing) return;
            if (e.animationName !== styles.fadeOut) return;

            setIsClosing(false);
            setIsRendered(false);
            onOpenChange(false);
        },
        [isClosing, onOpenChange],
    );

    const handleOutsideClick = useCallback(() => {
        if (!isRendered || isClosing || !closeOnOutsideClick) return;
        requestClose();
    }, [isRendered, isClosing, closeOnOutsideClick, requestClose]);

    useOutsideClick(contentRef, handleOutsideClick);

    useEffect(() => {
        if (!isRendered || isClosing || !closeOnEscape) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                requestClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isRendered, isClosing, closeOnEscape, requestClose]);

    if (!isRendered) return null;

    const overlayClasses = clsx(styles.overlay, isClosing && styles.closing, className);

    const contentClasses = clsx(styles.content, contentClassName);

    const contextValue: DialogContextValue = {
        isClosing,
        requestClose,
        contentRef,
        titleId,
        descriptionId,
        hasDescription,
        setHasDescription,
    };

    return createPortal(
        <DialogContext.Provider value={contextValue}>
            <div className={overlayClasses} onAnimationEnd={handleAnimationEnd}>
                <div
                    ref={contentRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                    aria-describedby={hasDescription ? descriptionId : undefined}
                    className={contentClasses}
                >
                    {children}
                </div>
            </div>
        </DialogContext.Provider>,
        document.body,
    );
}

export type DialogTitleProps = {
    children: ReactNode;
    className?: string;
};

function DialogTitle({ children, className }: DialogTitleProps) {
    const { titleId } = useDialogContext();

    const classes = clsx(styles.title, className);

    return (
        <h2 id={titleId} className={classes}>
            {children}
        </h2>
    );
}

export type DialogDescriptionProps = {
    children: ReactNode;
    className?: string;
};

function DialogDescription({ children, className }: DialogDescriptionProps) {
    const { descriptionId, setHasDescription } = useDialogContext();

    useEffect(() => {
        setHasDescription(true);

        return () => {
            setHasDescription(false);
        };
    }, [setHasDescription]);

    const classes = clsx(styles.description, className);

    return (
        <p id={descriptionId} className={classes}>
            {children}
        </p>
    );
}

export type DialogActionsProps = {
    children: ReactNode;
    className?: string;
};

function DialogActions({ children, className }: DialogActionsProps) {
    const classes = clsx(styles.actions, className);

    return <div className={classes}>{children}</div>;
}

function DialogButton({ className, ...props }: ButtonProps) {
    const classes = clsx(className) || undefined;

    return <Button className={classes} {...props} />;
}

type DialogTextareaInputProps = Extract<InputProps, { type: 'textarea' }>;
type DialogNativeInputProps = Exclude<InputProps, { type: 'textarea' }>;

const DialogTextareaInputComponent = Input as React.FC<DialogTextareaInputProps>;
const DialogNativeInputComponent = Input as React.FC<DialogNativeInputProps>;

function DialogInput(props: DialogTextareaInputProps): React.JSX.Element;
function DialogInput(props: DialogNativeInputProps): React.JSX.Element;
function DialogInput(props: InputProps): React.JSX.Element {
    const classes = clsx(props.className) || undefined;

    if (props.type === 'textarea') {
        return (
            <DialogTextareaInputComponent
                {...(props as DialogTextareaInputProps)}
                className={classes}
            />
        );
    }

    return <DialogNativeInputComponent {...(props as DialogNativeInputProps)} className={classes} />;
}

type DialogComponent = typeof DialogRoot & {
    Title: typeof DialogTitle;
    Description: typeof DialogDescription;
    Actions: typeof DialogActions;
    Button: typeof DialogButton;
    Input: typeof DialogInput;
};

const Dialog = memo(DialogRoot) as unknown as DialogComponent;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Actions = DialogActions;
Dialog.Button = DialogButton;
Dialog.Input = DialogInput;

export default Dialog;
