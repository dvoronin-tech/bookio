import { memo, type FC, useCallback, useState, useEffect } from 'react';
import ArrowIcon from '#/assets/icons/short-arrow.svg?react';
import styles from './GreetingLayout.module.scss';

import { useSteps } from '#/store/Steps/StepsContext';
import { stepsManager } from '#/store/Steps/stepsManager';
import { useShallow } from 'zustand/shallow';
import clsx from 'clsx';
import { useBookingFormData } from '#/store/BookingFormData/BookingFormDataContext';

type AnimationState = 'idle' | 'animating';

const animationContext = createContext<

export const GreetingLayout: FC = () => {
    const step = useSteps((s) => s.step);
    const isGreetingStep = step === 'Greeting';
    const [animationState, setAnimationState] = useState<AnimationState>('idle');

    useEffect(() => {
        if (animationState !== 'finishedFadeOut') return;


    }, [animationState]);

    return (
        <div className={clsx(styles.layout, { [styles.hiddenLayout]: !isGreetingStep })}>
            <GreetingHero />
            <GreetingButton  />
            <GreetingFooter />
        </div>
    );
};

interface GreetingButtonProps {
    animationState: AnimationState;
    setAnimationState: (animationState: AnimationState) => void;
}

const GreetingButton: FC<GreetingButtonProps> = memo(({ animationState, setAnimationState }) => {
    const { step, setStep } = useSteps(useShallow(({ step, setStep }) => ({ step, setStep })));

    const handleGoToNextStep = useCallback(() => {
        const next = stepsManager[step].next;
        if (!next) return;
        setStep(next());
    }, [setStep]);

    return (
        <button type="button" className={styles.cta} onClick={handleGoToNextStep}>
            Book now
            <ArrowIcon className={styles.ctaIcon} aria-hidden />
        </button>
    );
});

const GreetingHero: FC = memo(() => {
    const { name, description } = useBookingFormData();

    return (
        <div className={styles.hero}>
            <h1 className={styles.title}>{name}</h1>
            <p className={styles.description}>{description}</p>
        </div>
    );
});

const GreetingFooter: FC = memo(() => {
    return (
        <div className={styles.credit}>
            <span className={styles.creditMark} aria-hidden>
                B
            </span>
            <span className={styles.creditText}>Powered by Bookio</span>
        </div>
    );
});
