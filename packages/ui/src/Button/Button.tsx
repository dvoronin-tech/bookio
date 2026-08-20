import { clsx } from 'clsx';
import {
    createContext,
    memo,
    useContext,
    type ComponentProps,
    type ComponentType,
    type ReactNode,
} from 'react';
import styles from './Button.module.scss';

export type ButtonColor = 'simple' | 'red' | 'green' | 'blue' | 'primary';
export type ButtonType = 'clean' | 'filled' | 'outlined';
export type ButtonVariant = 'plain' | `${ButtonColor}-${ButtonType}`;

type ButtonBaseProps = {
    variant?: ButtonVariant;
    className?: string;
};

export type ButtonAsButtonProps = ButtonBaseProps & {
    type?: 'button' | 'submit' | 'reset';
} & Omit<ComponentProps<'button'>, 'className' | 'type'>;

export type ButtonAsLinkProps = ButtonBaseProps & {
    type: 'link';
    to: string;
} & Omit<ComponentProps<'a'>, 'className' | 'type' | 'href'>;

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export type ButtonLinkComponent = ComponentType<{
    to: string;
    className?: string;
    children?: ReactNode;
}>;

function NativeLink({
    to,
    className,
    children,
    ...rest
}: {
    to: string;
    className?: string;
    children?: ReactNode;
} & Omit<ComponentProps<'a'>, 'className' | 'href'>) {
    return (
        <a href={to} className={className} {...rest}>
            {children}
        </a>
    );
}

const ButtonLinkContext = createContext<ButtonLinkComponent>(NativeLink);

export function ButtonLinkProvider({
    component,
    children,
}: {
    component: ButtonLinkComponent;
    children: ReactNode;
}) {
    return <ButtonLinkContext.Provider value={component}>{children}</ButtonLinkContext.Provider>;
}

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

function Button(props: ButtonProps) {
    const { variant = 'plain', className } = props;
    const classes = getClasses(variant, className);
    const LinkComponent = useContext(ButtonLinkContext);

    if (props.type === 'link') {
        const { variant: _variant, className: _className, type: _type, ...linkProps } = props;
        return <LinkComponent className={classes} {...linkProps} />;
    }

    const { variant: _variant, className: _className, type = 'button', ...buttonProps } = props;
    return <button type={type} className={classes} {...buttonProps} />;
}

export default memo(Button);
