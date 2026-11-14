import { clsx } from 'clsx';
import { memo, useCallback, useState } from 'react';
import Input from '../Input/Input.js';
import { CopyIcon } from './icons/CopyIcon.js';
import { HideIcon } from './icons/HideIcon.js';
import { ShowIcon } from './icons/ShowIcon.js';
import { useUiCopy } from '../i18n/UiI18n.js';
import styles from './HiddenField.module.scss';

export type HiddenFieldProps = {
    value: string;
    className?: string;
    onCopy?: (value: string) => void;
};

function HiddenField({ value, className, onCopy }: HiddenFieldProps) {
    const copy = useUiCopy();
    const [isVisible, setIsVisible] = useState(false);

    const displayValue = isVisible ? value : '*'.repeat(value.length);

    const handleCopy = useCallback(() => {
        if (onCopy) {
            onCopy(value);
            return;
        }

        void navigator.clipboard.writeText(value);
    }, [value, onCopy]);

    const handleToggleVisibility = useCallback(() => {
        setIsVisible((prev) => !prev);
    }, []);

    const wrapperClasses = clsx(styles.wrapper, className);

    return (
        <div className={wrapperClasses}>
            <Input readOnly value={displayValue} className={styles.input} />
            <div className={styles.actions}>
                <button
                    type="button"
                    className={styles.actionButton}
                    onClick={handleCopy}
                    aria-label={copy.copy}
                >
                    <CopyIcon />
                </button>
                <button
                    type="button"
                    className={styles.actionButton}
                    onClick={handleToggleVisibility}
                    aria-label={isVisible ? copy.hide : copy.show}
                >
                    {isVisible ? <HideIcon /> : <ShowIcon />}
                </button>
            </div>
        </div>
    );
}

export default memo(HiddenField);
