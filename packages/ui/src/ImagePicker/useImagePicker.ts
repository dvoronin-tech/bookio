import { useEffect, useState } from 'react';
import {
    useFilePicker,
    type UseFilePickerResult,
} from '../hooks/useFilePicker.js';

const DEFAULT_ACCEPT = 'image/*';
const INVALID_TYPE_ERROR = 'Please choose an image file';

export type UseImagePickerOptions = {
    onChange?: (file: File | null) => void;
    accept?: string;
    disabled?: boolean;
};

export type UseImagePickerResult = UseFilePickerResult & {
    previewUrl: string | null;
};

export function useImagePicker({
    onChange,
    accept = DEFAULT_ACCEPT,
    disabled = false,
}: UseImagePickerOptions): UseImagePickerResult {
    const picker = useFilePicker({
        onChange,
        accept,
        disabled,
        invalidTypeError: INVALID_TYPE_ERROR,
    });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Keep an object URL for the selected image and revoke it on change/unmount.
    useEffect(() => {
        if (!picker.file) {
            setPreviewUrl(null);
            return;
        }

        const url = URL.createObjectURL(picker.file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [picker.file]);

    return { ...picker, previewUrl };
}
