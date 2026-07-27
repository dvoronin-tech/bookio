import { useEffect, useId, useState, type JSX } from 'react';
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
import { BaseInput, InputField, type InputProps } from '@bookio/ui';
import WarningIcon from '#assets/icons/warning.svg?react';
import styles from './ValidatableInput.module.scss';

type ValidatableInputBaseProps = {
    isValid?: boolean | null;
    errorMessage?: string;
};

type TextareaValidatableInputProps = ValidatableInputBaseProps &
    Extract<InputProps, { type: 'textarea' }>;
type NativeValidatableInputProps = ValidatableInputBaseProps &
    Exclude<InputProps, { type: 'textarea' }>;

export type ValidatableInputProps = TextareaValidatableInputProps | NativeValidatableInputProps;

function useShake(isValid: boolean | null | undefined) {
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        if (isValid !== false) return;

        const frame = requestAnimationFrame(() => setIsShaking(true));
        return () => {
            cancelAnimationFrame(frame);
            setIsShaking(false);
        };
    }, [isValid]);

    useEffect(() => {
        if (!isShaking) return;

        const timer = setTimeout(() => setIsShaking(false), 500);
        return () => clearTimeout(timer);
    }, [isShaking]);

    return isShaking;
}

function getValidationClasses(
    isValid: boolean | null | undefined,
    className?: string,
    hasErrorIcon?: boolean,
) {
    const validationClass =
        isValid === true ? styles.valid : isValid === false ? styles.invalid : undefined;

    return [validationClass, hasErrorIcon && styles.inputWithError, className]
        .filter(Boolean)
        .join(' ');
}

function ErrorHint({ message }: { message?: string }) {
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
    const { getReferenceProps, getFloatingProps } = useInteractions([
        hover,
        focus,
        dismiss,
        role,
    ]);

    return (
        <>
            <span
                ref={refs.setReference}
                className={styles.warningTrigger}
                tabIndex={message ? 0 : undefined}
                aria-label={message ?? 'Validation error'}
                {...(message ? getReferenceProps() : {})}
            >
                <WarningIcon className={styles.warningIcon} aria-hidden />
            </span>
            {open && message && (
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

function ValidatableTextareaInput(props: TextareaValidatableInputProps) {
    const { isValid, errorMessage, className, label, id, ...inputProps } = props;
    const generatedId = useId();
    const inputId = id ?? (label !== undefined ? generatedId : undefined);
    const isShaking = useShake(isValid);
    const showError = isValid === false;
    const classes = getValidationClasses(isValid, className, showError);
    const rootClasses = [styles.root, isShaking && styles.shake].filter(Boolean).join(' ');

    return (
        <InputField label={label} htmlFor={inputId}>
            <div className={rootClasses}>
                <BaseInput {...inputProps} id={inputId} className={classes || undefined} />
                {(showError && errorMessage) && <ErrorHint message={errorMessage} />}
            </div>
        </InputField>
    );
}

function ValidatableNativeInput(props: NativeValidatableInputProps) {
    const { isValid, errorMessage, className, label, id, ...inputProps } = props;
    const generatedId = useId();
    const inputId = id ?? (label !== undefined ? generatedId : undefined);
    const isShaking = useShake(isValid);
    const showError = isValid === false;
    const classes = getValidationClasses(isValid, className, showError);
    const rootClasses = [styles.root, isShaking && styles.shake].filter(Boolean).join(' ');

    return (
        <InputField label={label} htmlFor={inputId}>
            <div className={rootClasses}>
                <BaseInput {...inputProps} id={inputId} className={classes || undefined} />
                {(showError && errorMessage) && <ErrorHint message={errorMessage} />}
            </div>
        </InputField>
    );
}

function isTextareaValidatableInput(
    props: ValidatableInputProps,
): props is TextareaValidatableInputProps {
    return props.type === 'textarea';
}

function ValidatableInput(props: TextareaValidatableInputProps): JSX.Element;
function ValidatableInput(props: NativeValidatableInputProps): JSX.Element;
function ValidatableInput(props: ValidatableInputProps): JSX.Element {
    if (isTextareaValidatableInput(props)) {
        return <ValidatableTextareaInput {...props} />;
    }

    return <ValidatableNativeInput {...props} />;
}

export { ValidatableInput };
