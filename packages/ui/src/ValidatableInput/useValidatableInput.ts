import { clsx } from 'clsx';
import { useEffect, useId, useState } from 'react';
import type { InputProps } from '../Input/Input.js';
import styles from './ValidatableInput.module.scss';

type ValidatableInputBaseProps = {
    isValid?: boolean | null;
    errorMessage?: string;
    useConfirmationColor?: boolean;
};

export type TextareaValidatableInputProps = ValidatableInputBaseProps &
    Extract<InputProps, { type: 'textarea' }>;
export type NativeValidatableInputProps = ValidatableInputBaseProps &
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
    useConfirmationColor = true,
) {
    return clsx(
        isValid === false && styles.invalid,
        isValid === true && useConfirmationColor && styles.valid,
        hasErrorIcon && styles.inputWithError,
        className,
    );
}

export function useValidatableInput<T extends ValidatableInputProps>(props: T) {
    const {
        isValid,
        errorMessage,
        className,
        label,
        id,
        useConfirmationColor = true,
        helpText,
        ...inputProps
    } = props;

    const generatedId = useId();
    const inputId = id ?? (label !== undefined ? generatedId : undefined);
    const isShaking = useShake(isValid);
    const showError = isValid === false && Boolean(errorMessage);

    return {
        label,
        inputId,
        inputProps,
        className:
            getValidationClasses(isValid, className, showError, useConfirmationColor) || undefined,
        helpText: showError ? undefined : helpText,
        rootClasses: clsx(styles.root, isShaking && styles.shake),
        showError,
        errorMessage,
    };
}
