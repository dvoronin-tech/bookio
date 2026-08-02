import { useRef, type FC, type ReactNode } from 'react';
import { useEnterFieldNavigation } from '#hooks/useEnterFieldNavigation';
import styles from './FormWizardLayout.module.scss';

type FormWizardLayoutProps = {
    stepNumber: number;
    title: string;
    description: string;
    children: ReactNode;
    footer?: ReactNode;
    onEnterComplete?: () => void;
};

export const FormWizardLayout: FC<FormWizardLayoutProps> = ({
    stepNumber,
    title,
    description,
    children,
    footer,
    onEnterComplete,
}) => {
    const stepLabel = String(stepNumber).padStart(2, '0');
    const fieldsRef = useRef<HTMLDivElement>(null);
    const handleFieldsKeyDown = useEnterFieldNavigation(fieldsRef, onEnterComplete);

    return (
        <div className={styles.wrapper}>
            <div className={styles.configurator}>
                <aside className={styles.rail}>
                    <span className={styles.stepBadge}>Step {stepLabel}</span>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.description}>{description}</p>
                </aside>

                <div className={styles.stage}>
                    <div
                        ref={fieldsRef}
                        className={styles.fields}
                        onKeyDown={onEnterComplete ? handleFieldsKeyDown : undefined}
                    >
                        {children}
                    </div>
                    {footer ? <div className={styles.footer}>{footer}</div> : null}
                </div>
            </div>
        </div>
    );
};
