import toast from 'react-hot-toast';
import { m } from '#i18n/messages';

export const copyToClipboard = (text: string, label: string) => {
    void navigator.clipboard.writeText(text);
    toast.success(m.copied({ label }));
};
