export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileExtension(file: File): string {
    const fromName = file.name.split('.').pop();
    if (fromName && fromName !== file.name) return fromName.toUpperCase();
    return file.type.split('/')[1]?.toUpperCase() ?? '';
}
