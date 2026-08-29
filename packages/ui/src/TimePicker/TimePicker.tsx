import { clsx } from 'clsx';
import {
    autoUpdate,
    flip,
    offset,
    shift,
    useDismiss,
    useFloating,
    useInteractions,
    useRole,
} from '@floating-ui/react';
import { memo, useId, useMemo, useState, type FocusEvent } from 'react';
import { IMask, IMaskInput } from 'react-imask';
import ClockIcon from './icons/clock.svg?react';
import TimePopover, { OUTSIDE_CLICK_IGNORE_ATTR } from './TimePopover.js';
import {
    buildHourOptions,
    buildMinuteOptions,
    clampTime,
    formatTime,
    normalizeTypedTime,
    parseTime,
    TIME_PLACEHOLDER,
} from './timeUtils.js';
import styles from './TimePicker.module.scss';
const DEFAULT_STEP = 1;

const TIME_MASK_BLOCKS = {
    HH: {
        mask: IMask.MaskedRange,
        from: 0,
        to: 23,
    },
    mm: {
        mask: IMask.MaskedRange,
        from: 0,
        to: 59,
    },
};

export type TimePickerProps = {
    value: string;
    onChange: (time: string) => void;
    label?: string;
    className?: string;
    triggerClassName?: string;
    disabled?: boolean;
    id?: string;
    placeholder?: string;
    min?: string;
    max?: string;
    step?: number;
    'aria-label'?: string;
};

function TimePicker({
    value,
    onChange,
    label,
    className,
    triggerClassName,
    disabled = false,
    id,
    placeholder: placeholderProp,
    min,
    max,
    step = DEFAULT_STEP,
    'aria-label': ariaLabel = 'Choose time',
}: TimePickerProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const placeholder = placeholderProp || TIME_PLACEHOLDER;
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState<string | null>(null);
    const [focused, setFocused] = useState(false);

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

    const displayValue = draft ?? value;
    const showMask = focused || displayValue !== '';
    const selectedTime = useMemo(
        () => parseTime(displayValue) ?? parseTime(normalizeTypedTime(displayValue) || ''),
        [displayValue],
    );
    const selectedHour = selectedTime?.hours ?? null;
    const hourOptions = useMemo(() => buildHourOptions(min, max), [min, max]);
    const minuteOptions = useMemo(
        () => buildMinuteOptions(step, min, max, selectedHour),
        [step, min, max, selectedHour],
    );

    const commitDraft = () => {
        if (draft === null) {
            return;
        }

        setDraft(null);
        const normalized = normalizeTypedTime(draft, min, max, step);

        if (normalized !== null && normalized !== value) {
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

    const handleSelectHour = (hour: number) => {
        const next = clampTime(formatTime(hour, selectedTime?.minutes ?? 0), { min, max });
        setDraft(next);

        if (next !== value) {
            onChange(next);
        }
    };

    const handleSelectMinute = (minute: number) => {
        const next = clampTime(formatTime(selectedTime?.hours ?? 0, minute), { min, max });
        setDraft(next);
        setOpen(false);

        if (next !== value) {
            onChange(next);
        }
    };

    const handleTogglePopover = () => {
        setOpen((prev) => !prev);
    };

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
                        mask="HH:mm"
                        blocks={TIME_MASK_BLOCKS}
                        lazy={false}
                        placeholderChar="-"
                        overwrite
                        autofix
                        type="text"
                        id={inputId}
                        className={styles.input}
                        value={displayValue}
                        placeholder={TIME_PLACEHOLDER}
                        disabled={disabled}
                        inputMode="numeric"
                        autoComplete="off"
                        autoFocus={focused}
                        aria-label={label ? undefined : ariaLabel}
                        onAccept={(next: string) => setDraft(next)}
                        onFocus={() => setFocused(true)}
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
                    aria-label={open ? 'Close time picker' : 'Open time picker'}
                    aria-haspopup="dialog"
                    aria-expanded={open}
                    onClick={handleTogglePopover}
                >
                    <ClockIcon className={styles.icon} aria-hidden />
                </button>
            </div>

            {open && (
                <TimePopover
                    floatingRef={refs.setFloating}
                    floatingStyles={floatingStyles}
                    floatingProps={getFloatingProps()}
                    hourOptions={hourOptions}
                    minuteOptions={minuteOptions}
                    selectedHour={selectedHour}
                    selectedMinute={selectedTime?.minutes ?? null}
                    onSelectHour={handleSelectHour}
                    onSelectMinute={handleSelectMinute}
                />
            )}
        </div>
    );
}

export default memo(TimePicker);
