import { memo } from 'react';
import Button from '../../Button/Button.js';
import SelectDropdown, {
    type SelectDropdownOption,
} from '../../SelectDropdown/SelectDropdown.js';
import ChevronIcon from '../icons/chevron.svg?react';
import styles from './Calendar.module.scss';

export type CalendarHeaderSectionProps = {
    onPrev: () => void;
    onNext: () => void;
    selected: SelectDropdownOption;
    options: SelectDropdownOption[];
    onChange: (option: SelectDropdownOption) => void;
    prevLabel: string;
    nextLabel: string;
};

export const CalendarHeaderSection = memo(function CalendarHeaderSection({
    onPrev,
    onNext,
    selected,
    options,
    onChange,
    prevLabel,
    nextLabel,
}: CalendarHeaderSectionProps) {
    return (
        <div className={styles.selector}>
            <Button
                variant="simple-clean"
                className={styles.headerButton}
                onClick={onPrev}
                aria-label={prevLabel}
            >
                <ChevronIcon className={styles.chevronPrev} />
            </Button>
            <div className={styles.selectorDropdown}>
                <SelectDropdown
                    options={options}
                    selected={selected}
                    onOptionClick={onChange}
                    triggerClassName={styles.selectorTrigger}
                    highlightSelected
                    scrollSelectedIntoView
                />
            </div>
            <Button
                variant="simple-clean"
                className={styles.headerButton}
                onClick={onNext}
                aria-label={nextLabel}
            >
                <ChevronIcon className={styles.chevronNext} />
            </Button>
        </div>
    );
});
