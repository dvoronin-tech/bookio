import { clsx } from 'clsx';
import {
    autoUpdate,
    flip,
    FloatingPortal,
    offset,
    shift,
    useDismiss,
    useFloating,
    useInteractions,
    useRole,
} from '@floating-ui/react';
import { format } from 'date-fns';
import { memo, useId, useMemo, useState, type FocusEvent } from 'react';
import { IMask, IMaskInput } from 'react-imask';
import { Calendar } from './Calendar/Calendar.js';
import {
    DATE_DISPLAY_FORMAT,
    DATE_PLACEHOLDER,
    YEAR_MASK_MAX,
    normalizeTypedDate,
    parsePickerValue,
    toIsoDateString,
} from './dateUtils.js';
import CalendarIcon from './icons/calendar.svg?react';
import styles from './DatePicker.module.scss';

const OUTSIDE_CLICK_IGNORE_ATTR = 'data-outside-click-ignore';

export type DatePickerProps = {
    value: string | Date;
    onChange: (isoDate: string) => void;
    label?: string;
    className?: string;
    triggerClassName?: string;
    disabled?: boolean;
    id?: string;
    placeholder?: string;
    minYear?: number;
    maxYear?: number;
    'aria-label'?: string;
};

function DatePicker({
    value,
    onChange,
    label,
    className,
    triggerClassName,
    disabled = false,
    id,
    placeholder: placeholderProp,
    minYear: minYearProp,
    maxYear: maxYearProp,
    'aria-label': ariaLabel = 'Choose date',
}: DatePickerProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const placeholder = placeholderProp || DATE_PLACEHOLDER;
    const minYear =
        minYearProp !== undefined && maxYearProp !== undefined
            ? Math.min(minYearProp, maxYearProp)
            : minYearProp;
    const maxYear =
        minYearProp !== undefined && maxYearProp !== undefined
            ? Math.max(minYearProp, maxYearProp)
            : maxYearProp;
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState<string | null>(null);
    const [focused, setFocused] = useState(false);
    const dateMaskBlocks = useMemo(
        () => ({
            dd: {
                mask: IMask.MaskedRange,
                from: 1,
                to: 31,
            },
            MM: {
                mask: IMask.MaskedRange,
                from: 1,
                to: 12,
            },
            yyyy: {
                mask: IMask.MaskedRange,
                from: minYear ?? 0,
                to: maxYear ?? YEAR_MASK_MAX,
            },
        }),
        [minYear, maxYear],
    );

    const { refs, floatingStyles, context } = useFloating({
        open,
        onOpenChange: setOpen,
        placement: 'bottom-end',
        middleware: [offset(4), flip(), shift({ padding: 8 })],
        whileElementsMounted: autoUpdate,
    });

    const dismiss = useDismiss(context, {
        outsidePress(event) {
            const target = event.target;
            return !(target instanceof Element && target.closest(`[${OUTSIDE_CLICK_IGNORE_ATTR}]`));
        },
    });
    const role = useRole(context, { role: 'dialog' });
    const { getFloatingProps } = useInteractions([dismiss, role]);

    const selectedDate = useMemo(() => parsePickerValue(value), [value]);
    const committedIso = selectedDate ? toIsoDateString(selectedDate) : '';
    const displayValue = draft ?? (selectedDate ? format(selectedDate, DATE_DISPLAY_FORMAT) : '');
    const showMask = focused || displayValue !== '';

    const calendarValue = useMemo(() => {
        if (draft !== null) {
            const normalized = normalizeTypedDate(draft, minYear, maxYear);

            if (normalized) {
                return normalized;
            }
        }

        return value;
    }, [draft, value, minYear, maxYear]);

    const commitDraft = () => {
        if (draft === null) {
            return;
        }

        const normalized = normalizeTypedDate(draft, minYear, maxYear);
        setDraft(null);

        if (normalized !== null && normalized !== committedIso) {
            onChange(normalized);
        }
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        setFocused(false);
        const next = event.relatedTarget;

        if (next instanceof Node && refs.floating.current?.contains(next)) {
            return;
        }

        commitDraft();
    };

    const handleSelectDate = (isoDate: string) => {
        const selected = parsePickerValue(isoDate);
        setDraft(selected ? format(selected, DATE_DISPLAY_FORMAT) : null);
        setOpen(false);

        if (isoDate !== committedIso) {
            onChange(isoDate);
        }
    };

    const handleTogglePopover = () => {
        setOpen((prev) => !prev);
    };

    const handleOnFocus = () => {
        setFocused(true);
    }

    return (
        <div className={clsx(styles.root, className)}>
            {label && (
                <label className={styles.label} htmlFor={inputId}>
                    {label}
                </label>
            )}
            <div
                ref={refs.setReference}
                className={clsx(
                    styles.trigger,
                    open && styles.triggerOpen,
                    disabled && styles.triggerDisabled,
                    triggerClassName,
                )}
                {...{ [OUTSIDE_CLICK_IGNORE_ATTR]: '' }}
            >
                {showMask ? (
                    <IMaskInput
                        mask="dd.MM.yyyy"
                        blocks={dateMaskBlocks}
                        lazy={false}
                        placeholderChar="_"
                        overwrite
                        autofix
                        type="text"
                        id={inputId}
                        className={styles.input}
                        value={displayValue}
                        placeholder={DATE_PLACEHOLDER}
                        disabled={disabled}
                        inputMode="numeric"
                        autoComplete="off"
                        autoFocus={focused}
                        aria-label={label ? undefined : ariaLabel}
                        onAccept={setDraft}
                        onFocus={handleOnFocus}
                        onBlur={handleBlur}
                    />
                ) : (
                    <input
                        type="text"
                        id={inputId}
                        className={styles.input}
                        value=""
                        readOnly
                        placeholder={placeholder}
                        disabled={disabled}
                        inputMode="numeric"
                        autoComplete="off"
                        aria-label={label ? undefined : ariaLabel}
                        onFocus={() => setFocused(true)}
                    />
                )}
                <button
                    type="button"
                    className={styles.iconButton}
                    disabled={disabled}
                    aria-label={open ? 'Close date picker' : 'Open date picker'}
                    aria-haspopup="dialog"
                    aria-expanded={open}
                    onClick={handleTogglePopover}
                >
                    <CalendarIcon className={styles.icon} aria-hidden />
                </button>
            </div>

            {open && (
                <FloatingPortal>
                    <div
                        ref={refs.setFloating}
                        style={floatingStyles}
                        className={styles.popover}
                        {...getFloatingProps()}
                        {...{ [OUTSIDE_CLICK_IGNORE_ATTR]: '' }}
                    >
                        <Calendar
                            value={calendarValue}
                            onChange={handleSelectDate}
                            minYear={minYear}
                            maxYear={maxYear}
                        />
                    </div>
                </FloatingPortal>
            )}
        </div>
    );
}

export default memo(DatePicker);
