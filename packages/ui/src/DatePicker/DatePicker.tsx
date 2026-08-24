import { clsx } from 'clsx';
import {
    autoUpdate,
    flip,
    FloatingPortal,
    offset,
    shift,
    useClick,
    useDismiss,
    useFloating,
    useInteractions,
    useRole,
} from '@floating-ui/react';
import { format } from 'date-fns';
import { memo, useId, useMemo, useState } from 'react';
import { Calendar } from './Calendar/Calendar.js';
import { DATE_DISPLAY_FORMAT, DATE_PLACEHOLDER, parsePickerValue } from './dateUtils.js';
import CalendarIcon from './icons/calendar.svg?react';
import styles from './DatePicker.module.scss';

const OUTSIDE_CLICK_IGNORE_ATTR = 'data-outside-click-ignore';

export type DatePickerProps = {
    value: string | Date;
    onChange: (isoDate: string) => void;
    label?: string;
    className?: string;
    disabled?: boolean;
    id?: string;
    placeholder?: string;
    'aria-label'?: string;
};

function DatePicker({
    value,
    onChange,
    label,
    className,
    disabled = false,
    id,
    placeholder = DATE_PLACEHOLDER,
    'aria-label': ariaLabel = 'Choose date',
}: DatePickerProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [open, setOpen] = useState(false);

    const { refs, floatingStyles, context } = useFloating({
        open,
        onOpenChange: setOpen,
        placement: 'bottom',
        middleware: [offset(4), flip(), shift({ padding: 8 })],
        whileElementsMounted: autoUpdate,
    });

    const click = useClick(context, { enabled: !disabled });
    const dismiss = useDismiss(context, {
        outsidePress(event) {
            const target = event.target;
            return !(target instanceof Element && target.closest('[data-outside-click-ignore]'));
        },
    });
    const role = useRole(context, { role: 'dialog' });
    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

    const selectedDate = useMemo(() => parsePickerValue(value), [value]);
    const inputValue = selectedDate ? format(selectedDate, DATE_DISPLAY_FORMAT) : '';

    const handleSelectDate = (isoDate: string) => {
        onChange(isoDate);
        setOpen(false);
    };

    return (
        <div className={clsx(styles.root, className)}>
            {label && (
                <label className={styles.label} htmlFor={inputId}>
                    {label}
                </label>
            )}
            <button
                ref={refs.setReference}
                type="button"
                id={inputId}
                className={clsx(
                    styles.trigger,
                    open && styles.triggerOpen,
                    disabled && styles.triggerDisabled,
                )}
                disabled={disabled}
                aria-label={label ? undefined : ariaLabel}
                aria-haspopup="dialog"
                aria-expanded={open}
                {...getReferenceProps()}
            >
                <span className={clsx(styles.triggerValue, !inputValue && styles.triggerPlaceholder)}>
                    {inputValue || placeholder}
                </span>
                <CalendarIcon className={styles.icon} aria-hidden />
            </button>

            {open && (
                <FloatingPortal>
                    <div
                        ref={refs.setFloating}
                        style={floatingStyles}
                        className={styles.popover}
                        {...getFloatingProps()}
                        {...{ [OUTSIDE_CLICK_IGNORE_ATTR]: '' }}
                    >
                        <Calendar value={value} onChange={handleSelectDate} />
                    </div>
                </FloatingPortal>
            )}
        </div>
    );
}

export default memo(DatePicker);
