import {
    useCallback,
    useRef,
    useState,
    type ChangeEvent,
    type DragEvent,
    type MouseEvent,
    type RefObject,
} from 'react';

const DEFAULT_INVALID_TYPE_ERROR = 'This file type is not supported';

function isFileAccepted(file: File, accept: string): boolean {
    return accept.split(',').some((rawToken) => {
        const token = rawToken.trim().toLowerCase();

        if (!token) return false;
        if (token.endsWith('/*'))
            return file.type.toLowerCase().startsWith(token.slice(0, -1));
        if (token.startsWith('.'))
            return file.name.toLowerCase().endsWith(token);
        return file.type.toLowerCase() === token;
    });
}

export type UseFilePickerOptions = {
    onChange?: (file: File | null) => void;
    accept?: string;
    disabled?: boolean;
    invalidTypeError?: string;
};

export type UseFilePickerResult = {
    file: File | null;
    isDragging: boolean;
    error: string | null;
    openFilePicker: () => void;
    clear: () => void;
    inputProps: {
        ref: RefObject<HTMLInputElement | null>;
        type: 'file';
        accept: string | undefined;
        disabled: boolean;
        tabIndex: number;
        onClick: (event: MouseEvent<HTMLInputElement>) => void;
        onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    };
    dropProps: {
        onDragEnter: (event: DragEvent<HTMLElement>) => void;
        onDragOver: (event: DragEvent<HTMLElement>) => void;
        onDragLeave: (event: DragEvent<HTMLElement>) => void;
        onDrop: (event: DragEvent<HTMLElement>) => void;
    };
};

export function useFilePicker({
    onChange,
    accept,
    disabled = false,
    invalidTypeError = DEFAULT_INVALID_TYPE_ERROR,
}: UseFilePickerOptions): UseFilePickerResult {
    const inputRef = useRef<HTMLInputElement>(null);
    const dragDepthRef = useRef(0);
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const selectFile = useCallback(
        (next: File | null) => {
            setFile(next);
            onChange?.(next);
        },
        [onChange],
    );

    const acceptFile = useCallback(
        (next: File | null) => {
            if (!next) return;

            if (accept && !isFileAccepted(next, accept)) {
                setError(invalidTypeError);
                return;
            }

            setError(null);
            selectFile(next);
        },
        [accept, invalidTypeError, selectFile],
    );

    const openFilePicker = useCallback(() => {
        if (disabled) return;
        inputRef.current?.click();
    }, [disabled]);

    const clear = useCallback(() => {
        if (inputRef.current) inputRef.current.value = '';
        setError(null);
        selectFile(null);
    }, [selectFile]);

    const handleInputClick = useCallback(
        (event: MouseEvent<HTMLInputElement>) => {
            // Keep the synthetic click from bubbling back to a clickable parent,
            // which would re-trigger openFilePicker() in a loop.
            event.stopPropagation();
        },
        [],
    );

    const handleInputChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const next = event.target.files?.[0] ?? null;
            // Reset the input so picking the same file again still fires change.
            event.target.value = '';
            acceptFile(next);
        },
        [acceptFile],
    );

    const handleDragEnter = useCallback(
        (event: DragEvent<HTMLElement>) => {
            event.preventDefault();
            if (disabled) return;
            dragDepthRef.current += 1;
            setIsDragging(true);
        },
        [disabled],
    );

    const handleDragOver = useCallback((event: DragEvent<HTMLElement>) => {
        // preventDefault is required to allow dropping.
        event.preventDefault();
    }, []);

    const handleDragLeave = useCallback((event: DragEvent<HTMLElement>) => {
        event.preventDefault();
        dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
        if (dragDepthRef.current === 0) setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (event: DragEvent<HTMLElement>) => {
            event.preventDefault();
            dragDepthRef.current = 0;
            setIsDragging(false);
            if (disabled) return;
            acceptFile(event.dataTransfer.files?.[0] ?? null);
        },
        [acceptFile, disabled],
    );

    return {
        file,
        isDragging,
        error,
        openFilePicker,
        clear,
        inputProps: {
            ref: inputRef,
            type: 'file',
            accept,
            disabled,
            tabIndex: -1,
            onClick: handleInputClick,
            onChange: handleInputChange,
        },
        dropProps: {
            onDragEnter: handleDragEnter,
            onDragOver: handleDragOver,
            onDragLeave: handleDragLeave,
            onDrop: handleDrop,
        },
    };
}
