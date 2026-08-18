import { memo, type FC, useCallback } from 'react';
import { Background } from '#/components/Background/Background';
import ArrowIcon from '#/assets/icons/short-arrow.svg?react';
import styles from './GreetingLayout.module.scss';

import { useSteps } from '#/store/Steps/StepsContext';
import { stepsManager } from '#/store/Steps/stepsManager';
import { useShallow } from 'zustand/shallow';
import clsx from 'clsx';
import { useBookingFormData } from '#/store/BookingFormData/BookingFormDataContext';

export const GreetingLayout: FC = () => {
    return (
        <div className={styles.layout}>
            <GreetingHero />
            <GreetingButton />
            <GreetingFooter />
        </div>
    );
};

const GreetingButton: FC = memo(() => {
    const { step, setStep } = useSteps(useShallow(({ step, setStep }) => ({ step, setStep })));

    const handleGoToNextStep = useCallback(() => {
        const next = stepsManager[step].next;
        if (!next) return;
        setStep(next());
    }, [setStep]);

    return (
        <button
            type="button"
            className={clsx(styles.cta, { [styles.hiddenCta]: step !== 'Greeting' })}
            onClick={handleGoToNextStep}
        >
            Book now
            <ArrowIcon className={styles.ctaIcon} aria-hidden />
        </button>
    );
});

const GreetingHero: FC = memo(() => {
    const step = useSteps((s) => s.step);
    const isGreetingStep = step === 'Greeting';

    const { name, description } = useBookingFormData();

    return (
        <div className={clsx(styles.hero, { [styles.hiddenHero]: !isGreetingStep })}>
            <h1 className={styles.title}>{name}</h1>
            <p className={styles.description}>{description}</p>
        </div>
    );
});

const GreetingFooter: FC = memo(() => {
    const step = useSteps((s) => s.step);
    const isGreetingStep = step === 'Greeting';

    return (
        <div className={clsx(styles.credit, { [styles.hiddenCredit]: !isGreetingStep })}>
            <span className={styles.creditMark} aria-hidden>
                B
            </span>
            <span className={styles.creditText}>Powered by Bookio</span>
        </div>
    );
});
