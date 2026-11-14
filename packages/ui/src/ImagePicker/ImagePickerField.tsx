import { clsx } from 'clsx';
import { memo, useId, type ReactNode } from 'react';
import { InputField } from '../Input/Input.js';
import CloseIcon from '../icons/close.svg?react';
import { createClearClickHandler } from '../utils/eventHandlers.js';
import { useImagePicker } from './useImagePicker.js';
import { m } from '../paraglide/messages.js';
import styles from './ImagePickerField.module.scss';

export type ImagePickerFieldProps = {
    label?: ReactNode;
    placeholder?: string;
    onChange?: (file: File | null) => void;
    accept?: string;
    disabled?: boolean;
    className?: string;
    id?: string;
};

function ImagePickerField({
    label,
    placeholder,
    onChange,
    accept,
    disabled = false,
    className,
    id,
}: ImagePickerFieldProps) {
    const resolvedPlaceholder = placeholder ?? m.image_select();
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const { file, previewUrl, error, openFilePicker, clear, inputProps } = useImagePicker({
        onChange,
        accept,
        disabled,
        invalidTypeError: m.image_file(),
    });

    const handleClear = createClearClickHandler(clear);

    const fieldClasses = clsx(
        styles.field,
        error && styles.invalid,
        file && !disabled && styles.withClear,
        className,
    );

    return (
        <InputField label={label} htmlFor={inputId}>
            <div className={styles.wrapper}>
                <button
                    type="button"
                    className={fieldClasses}
                    onClick={openFilePicker}
                    disabled={disabled}
                >
                    {previewUrl && (
                        <img className={styles.preview} src={previewUrl} alt="" aria-hidden />
                    )}
                    <span className={file ? styles.fileName : styles.placeholder}>
                        {file?.name ?? resolvedPlaceholder}
                    </span>
                </button>
                {file && !disabled && (
                    <button
                        type="button"
                        className={styles.clearButton}
                        onClick={handleClear}
                        aria-label={m.remove_image()}
                    >
                        <CloseIcon />
                    </button>
                )}
                <input {...inputProps} id={inputId} className={styles.hiddenInput} />
            </div>
            {error && <p className={styles.error}>{error}</p>}
        </InputField>
    );
}

export default memo(ImagePickerField);
