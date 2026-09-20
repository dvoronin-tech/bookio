import { clsx } from 'clsx';
import {
    createContext,
    memo,
    useContext,
    useId,
    type ChangeEvent,
    type FocusEvent,
    type ReactNode,
    type Ref,
} from 'react';
import styles from './Radio.module.scss';

type RadioContextValue = {
    name: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    ref?: Ref<HTMLInputElement>;
    disabled?: boolean;
};

const RadioContext = createContext<RadioContextValue | null>(null);

function useRadioContext() {
    const context = useContext(RadioContext);

    if (!context) {
        throw new Error('Radio compound components must be used within <Radio>');
    }

    return context;
}

export type RadioProps = RadioContextValue & {
    className?: string;
    children: ReactNode;
    disabled?: boolean;
};

function RadioRoot({ name, onChange, onBlur, ref, disabled, className, children }: RadioProps) {
    return (
        <RadioContext.Provider value={{ name, onChange, onBlur, ref, disabled }}>
            <fieldset className={clsx(styles.group, className)} disabled={disabled}>{children}</fieldset>
        </RadioContext.Provider>
    );
}

export type RadioLabelProps = {
    className?: string;
    children: ReactNode;
};

function RadioLabel({ className, children }: RadioLabelProps) {
    return <legend className={clsx(styles.label, className)}>{children}</legend>;
}

export type RadioItemProps = {
    value: string;
    className?: string;
    disabled?: boolean;
    id?: string;
    children?: ReactNode;
};

function RadioItem({ value, className, disabled: itemDisabled, id, children }: RadioItemProps) {
    const { name, onChange, onBlur, ref, disabled: rootDisabled } = useRadioContext();
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const disabled = itemDisabled ?? rootDisabled;

    return (
        <label className={clsx(styles.item, className)} htmlFor={inputId}>
            <input
                ref={ref}
                id={inputId}
                className={styles.input}
                type="radio"
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
            />
            <span className={styles.circle} aria-hidden>
                <span className={styles.dot} />
            </span>
            {children !== undefined && <span className={styles.itemLabel}>{children}</span>}
        </label>
    );
}

type RadioComponent = typeof RadioRoot & {
    Label: typeof RadioLabel;
    Item: typeof RadioItem;
};

const Radio = memo(RadioRoot) as unknown as RadioComponent;
Radio.Label = RadioLabel;
Radio.Item = RadioItem;

export default Radio;
