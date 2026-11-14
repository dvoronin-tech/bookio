import toast from 'react-hot-toast';
import { m } from '../paraglide/messages.js';

export const copyToClipboard = (text: string, label: string) => {
    void navigator.clipboard.writeText(text);
    toast.success(m.copied({ label }));
};
