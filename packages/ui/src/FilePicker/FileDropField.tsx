import { clsx } from 'clsx';
import { memo, useId, type ReactNode } from 'react';
import { InputField } from '../Input/Input.js';
import CloseIcon from '../icons/close.svg?react';
import { useFilePicker } from '../hooks/useFilePicker.js';
import { createClearClickHandler, createOpenOnKeyDownHandler } from '../utils/eventHandlers.js';
import { formatFileSize, getFileExtension } from '../utils/fileUtils.js';
import FileCheckIcon from './icons/file-check.svg?react';
import FileIcon from './icons/file.svg?react';
import styles from './FileDropField.module.scss';

export type FileDropFieldProps = {
    label?: ReactNode;
    placeholder?: ReactNode;
    onChange?: (file: File | null) => void;
    accept?: string;
    disabled?: boolean;
    className?: string;
    id?: string;
};

function FileDropField({
    label,
    placeholder = 'Drag & drop a file here, or click to browse',
    onChange,
    accept,
    disabled = false,
    className,
    id,
}: FileDropFieldProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const { file, isDragging, error, openFilePicker, clear, inputProps, dropProps } = useFilePicker({
        onChange,
        accept,
        disabled,
    });

    const handleKeyDown = createOpenOnKeyDownHandler(openFilePicker);
    const handleClear = createClearClickHandler(clear);

    const zoneClasses = clsx(
        styles.zone,
        isDragging && styles.dragging,
        error && styles.invalid,
        disabled && styles.disabled,
        className,
    );
    const extension = file ? getFileExtension(file) : '';

    return (
        <InputField label={label} htmlFor={inputId}>
            <div
                className={zoneClasses}
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-disabled={disabled || undefined}
                onClick={openFilePicker}
                onKeyDown={handleKeyDown}
                {...dropProps}
            >
                <input {...inputProps} id={inputId} className={styles.hiddenInput} />
                {file ? (
                    <div className={styles.preview}>
                        <span className={styles.fileTile}>
                            <FileCheckIcon className={styles.fileTileIcon} aria-hidden />
                        </span>
                        <div className={styles.fileInfo}>
                            <span className={styles.fileName}>{file.name}</span>
                            <span className={styles.fileMeta}>
                                {extension && <span className={styles.fileExt}>{extension}</span>}
                                {extension && ' · '}
                                {formatFileSize(file.size)}
                            </span>
                        </div>
                        {!disabled && (
                            <button
                                type="button"
                                className={styles.clearButton}
                                onClick={handleClear}
                                aria-label="Remove file"
                            >
                                <CloseIcon />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className={styles.placeholder}>
                        <FileIcon className={styles.placeholderIcon} aria-hidden />
                        <span className={styles.placeholderText}>{placeholder}</span>
                    </div>
                )}
            </div>
            {error && <p className={styles.error}>{error}</p>}
        </InputField>
    );
}

export default memo(FileDropField);
