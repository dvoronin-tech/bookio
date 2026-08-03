import { Fragment, useRef, type FC, type ReactNode } from 'react';
import clsx from 'clsx';
import { useEnterFieldNavigation } from '#hooks/useEnterFieldNavigation';
import { useFormWizardTotalSteps } from './FormWizardLayoutContext';
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
    const totalSteps = useFormWizardTotalSteps() ?? 1;

    const fieldsRef = useRef<HTMLDivElement>(null);
    const handleFieldsKeyDown = useEnterFieldNavigation(fieldsRef, onEnterComplete);
    const isSingleStep = totalSteps <= 1;

    return (
        <div className={styles.wrapper}>
            <div className={styles.stage}>
                <div className={styles.stageContent}>
                    <section
                        key={`hero-${stepNumber}`}
                        className={clsx(styles.hero, styles.enterHero, styles.stepEnter)}
                    >
                        <header className={clsx(styles.progress, styles.enterProgress)}>
                            {isSingleStep ? (
                                <span className={styles.heroAccent} aria-hidden>
                                    <span className={styles.heroAccentLine} />
                                    <span className={styles.heroAccentOrb} />
                                    <span className={styles.heroAccentLine} />
                                </span>
                            ) : (
                                <div className={styles.progressTrack} role="list" aria-label="Form steps">
                                    {Array.from({ length: totalSteps }, (_, index) => {
                                        const step = index + 1;

                                        return (
                                            <Fragment key={step}>
                                                {index > 0 ? (
                                                    <span className={styles.progressLine} aria-hidden />
                                                ) : null}
                                                <span
                                                    role="listitem"
                                                    className={clsx(
                                                        styles.stepDot,
                                                        step === stepNumber && styles.stepDotActive,
                                                        step < stepNumber && styles.stepDotComplete,
                                                    )}
                                                    aria-current={
                                                        step === stepNumber ? 'step' : undefined
                                                    }
                                                    aria-label={`Step ${step}${
                                                        step === stepNumber
                                                            ? ', current'
                                                            : step < stepNumber
                                                              ? ', completed'
                                                              : ''
                                                    }`}
                                                />
                                            </Fragment>
                                        );
                                    })}
                                </div>
                            )}
                        </header>
                        <h2 className={styles.title}>{title}</h2>
                        <p className={styles.description}>{description}</p>
                    </section>

                    <div
                        key={`body-${stepNumber}`}
                        className={clsx(styles.body, styles.enterBody, styles.stepEnter)}
                    >
                        <div
                            ref={fieldsRef}
                            className={styles.fields}
                            onKeyDown={onEnterComplete ? handleFieldsKeyDown : undefined}
                        >
                            {children}
                        </div>
                    </div>

                    {footer ? (
                        <footer className={clsx(styles.footer, styles.enterFooter)}>
                            {footer}
                        </footer>
                    ) : null}
                </div>
            </div>
        </div>
    );
};
