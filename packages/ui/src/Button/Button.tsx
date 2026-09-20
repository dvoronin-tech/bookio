import { clsx } from 'clsx';
import { memo, type ComponentProps } from 'react';
import styles from './Button.module.scss';

export type ButtonColor = 'simple' | 'red' | 'green' | 'blue' | 'primary';
export type ButtonType = 'clean' | 'filled' | 'outlined';
export type ButtonVariant = 'plain' | `${ButtonColor}-${ButtonType}`;

export type ButtonProps = {
    variant?: ButtonVariant;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
} & Omit<ComponentProps<'button'>, 'className' | 'type'>;

const VARIANT_CLASS: Record<Exclude<ButtonVariant, 'plain'>, string> = {
    'simple-clean': styles.simpleClean,
    'simple-filled': styles.simpleFilled,
    'simple-outlined': styles.simpleOutlined,
    'red-clean': styles.redClean,
    'red-filled': styles.redFilled,
    'red-outlined': styles.redOutlined,
    'green-clean': styles.greenClean,
    'green-filled': styles.greenFilled,
    'green-outlined': styles.greenOutlined,
    'blue-clean': styles.blueClean,
    'blue-filled': styles.blueFilled,
    'blue-outlined': styles.blueOutlined,
    'primary-clean': styles.primaryClean,
    'primary-filled': styles.primaryFilled,
    'primary-outlined': styles.primaryOutlined,
};

function getClasses(variant: ButtonVariant, className?: string) {
    return clsx(styles.button, variant !== 'plain' && VARIANT_CLASS[variant], className);
}

function Button({ variant = 'plain', className, type = 'button', ...buttonProps }: ButtonProps) {
    return <button type={type} className={getClasses(variant, className)} {...buttonProps} />;
}

export default memo(Button);
