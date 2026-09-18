import { clsx } from 'clsx';
import { memo, useId, useState, type ReactNode, type SyntheticEvent } from 'react';
import { InputField } from '../Input/Input.js';
import CloseIcon from '../icons/close.svg?react';
import { createClearClickHandler, createOpenOnKeyDownHandler } from '../utils/eventHandlers.js';
import { formatFileSize, getFileExtension } from '../utils/fileUtils.js';
import ImageIcon from './icons/image.svg?react';
import { useImagePicker } from './useImagePicker.js';
import styles from './ImageDropField.module.scss';

export type ImageDropFieldProps = {
    label?: ReactNode;
    placeholder?: ReactNode;
    onChange?: (file: File | null) => void;
    accept?: string;
    disabled?: boolean;
    className?: string;
    id?: string;
};

type ImageDimensions = {
    url: string;
    width: number;
    height: number;
};

function ImageDropField({
    label,
    placeholder = 'Drag & drop an image here, or click to browse',
    onChange,
    accept,
    disabled = false,
    className,
    id,
}: ImageDropFieldProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const { file, previewUrl, isDragging, error, openFilePicker, clear, inputProps, dropProps } =
        useImagePicker({ onChange, accept, disabled });
    const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);
    const currentDimensions = dimensions?.url === previewUrl ? dimensions : null;

    const handleKeyDown = createOpenOnKeyDownHandler(openFilePicker);
    const handleClear = createClearClickHandler(clear);

    const handlePreviewLoad = (event: SyntheticEvent<HTMLImageElement>) => {
        if (!previewUrl) return;
        setDimensions({
            url: previewUrl,
            width: event.currentTarget.naturalWidth,
            height: event.currentTarget.naturalHeight,
        });
    };

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
                {previewUrl && file ? (
                    <div className={styles.preview}>
                        <img
                            className={styles.previewImage}
                            src={previewUrl}
                            alt={file.name}
                            onLoad={handlePreviewLoad}
                        />
                        <div className={styles.fileInfo}>
                            <span className={styles.fileName}>{file.name}</span>
                            <span className={styles.fileMeta}>
                                {extension && <span className={styles.fileExt}>{extension}</span>}
                                {extension && ' · '}
                                {formatFileSize(file.size)}
                            </span>
                            {currentDimensions && (
                                <span className={styles.fileMeta}>
                                    {currentDimensions.width} × {currentDimensions.height}
                                </span>
                            )}
                        </div>
                        {!disabled && (
                            <button
                                type="button"
                                className={styles.clearButton}
                                onClick={handleClear}
                                aria-label="Remove image"
                            >
                                <CloseIcon />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className={styles.placeholder}>
                        <ImageIcon className={styles.placeholderIcon} aria-hidden />
                        <span className={styles.placeholderText}>{placeholder}</span>
                    </div>
                )}
            </div>
            {error && <p className={styles.error}>{error}</p>}
        </InputField>
    );
}

export default memo(ImageDropField);
