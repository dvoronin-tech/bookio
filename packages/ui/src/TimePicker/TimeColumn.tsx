import { clsx } from 'clsx';
import { memo } from 'react';
import type { TimeOption } from './timeUtils.js';
import styles from './TimePicker.module.scss';

type TimeColumnProps = {
    options: TimeOption[];
    selected: number | null;
    onSelect: (value: number) => void;
    'aria-label': string;
};

function scrollSelectedIntoView(node: HTMLLIElement | null) {
    if (!node?.parentElement) {
        return;
    }

    const list = node.parentElement;
    list.scrollTop = node.offsetTop - list.clientHeight / 2;
}

function TimeColumn({ options, selected, onSelect, 'aria-label': ariaLabel }: TimeColumnProps) {
    return (
        <ul className={styles.column} role="listbox" aria-label={ariaLabel}>
            {options.map((option) => (
                <li
                    key={option.value}
                    ref={option.value === selected ? scrollSelectedIntoView : undefined}
                    role="presentation"
                >
                    <button
                        type="button"
                        role="option"
                        aria-selected={option.value === selected}
                        className={clsx(
                            styles.columnItem,
                            option.value === selected && styles.columnItemSelected,
                        )}
                        disabled={option.disabled}
                        onClick={() => onSelect(option.value)}
                    >
                        {option.label}
                    </button>
                </li>
            ))}
        </ul>
    );
}

export default memo(TimeColumn);
