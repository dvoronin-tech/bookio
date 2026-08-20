import { useState, type JSX } from 'react';
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
import { Input as BaseInput, InputField } from '../Input/Input.js';
import WarningIcon from './icons/warning.svg?react';
import styles from './ValidatableInput.module.scss';
import {
    useValidatableInput,
    type NativeValidatableInputProps,
    type TextareaValidatableInputProps,
    type ValidatableInputProps,
} from './useValidatableInput.js';

export type { ValidatableInputProps };

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
    const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

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

function ValidatableFieldView({
    label,
    inputId,
    rootClasses,
    showError,
    errorMessage,
    children,
}: {
    label: ReturnType<typeof useValidatableInput>['label'];
    inputId?: string;
    rootClasses: string;
    showError: boolean;
    errorMessage?: string;
    children: JSX.Element;
}) {
    return (
        <InputField label={label} htmlFor={inputId}>
            <div className={rootClasses}>
                {children}
                {showError && <ErrorHint message={errorMessage} />}
            </div>
        </InputField>
    );
}

function ValidatableTextareaInput(props: TextareaValidatableInputProps) {
    const { inputProps, className, helpText, ...layout } = useValidatableInput(props);

    return (
        <ValidatableFieldView {...layout}>
            <BaseInput
                {...inputProps}
                id={layout.inputId}
                className={className}
                helpText={helpText}
            />
        </ValidatableFieldView>
    );
}

function ValidatableNativeInput(props: NativeValidatableInputProps) {
    const { inputProps, className, helpText, ...layout } = useValidatableInput(props);

    return (
        <ValidatableFieldView {...layout}>
            <BaseInput
                {...inputProps}
                id={layout.inputId}
                className={className}
                helpText={helpText}
            />
        </ValidatableFieldView>
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

export default ValidatableInput;
