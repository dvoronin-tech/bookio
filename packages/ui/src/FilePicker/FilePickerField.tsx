import { clsx } from 'clsx';
import { memo, useId, type ReactNode } from 'react';
import { InputField } from '../Input/Input.js';
import CloseIcon from '../icons/close.svg?react';
import { useFilePicker } from '../hooks/useFilePicker.js';
import { createClearClickHandler } from '../utils/eventHandlers.js';
import { formatFileSize } from '../utils/fileUtils.js';
import FileCheckIcon from './icons/file-check.svg?react';
import FileIcon from './icons/file.svg?react';
import styles from './FilePickerField.module.scss';

export type FilePickerFieldProps = {
    label?: ReactNode;
    placeholder?: string;
    onChange?: (file: File | null) => void;
    accept?: string;
    disabled?: boolean;
    className?: string;
    id?: string;
};

function FilePickerField({
    label,
    placeholder = 'Select a file',
    onChange,
    accept,
    disabled = false,
    className,
    id,
}: FilePickerFieldProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const { file, error, openFilePicker, clear, inputProps } = useFilePicker({
        onChange,
        accept,
        disabled,
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
                    {file ? (
                        <FileCheckIcon className={styles.fileIcon} aria-hidden />
                    ) : (
                        <FileIcon className={styles.fileIcon} aria-hidden />
                    )}
                    <span className={file ? styles.fileName : styles.placeholder}>
                        {file?.name ?? placeholder}
                    </span>
                    {file && <span className={styles.fileSize}>{formatFileSize(file.size)}</span>}
                </button>
                {file && !disabled && (
                    <button
                        type="button"
                        className={styles.clearButton}
                        onClick={handleClear}
                        aria-label="Remove file"
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

export default memo(FilePickerField);
