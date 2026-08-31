import { memo, type FC, useState, useRef, type AnimationEventHandler } from 'react';
import ArrowIcon from '#/assets/icons/short-arrow.svg?react';
import styles from './GreetingLayout.module.scss';

import { useSteps } from '#/store/Steps/StepsContext';
import { stepsManager } from '#/store/Steps/stepsManager';
import clsx from 'clsx';
import { useBookingFormData } from '#/store/BookingFormData/BookingFormDataContext';

export const GreetingLayout: FC = () => {
    const setStep = useSteps((s) => s.setStep);
    const [clickedGreetingButton, setClickedGreetingButton] = useState(false);

    const currentAnimations = useRef<EventTarget[]>([]);

    const handleClickGreetingButton = () => {
        setClickedGreetingButton(true);
    };

    const handleAnimationStart: AnimationEventHandler<HTMLDivElement> = (e) => {
        const animationElement = e.target;
        currentAnimations.current.push(animationElement);
    };

    const handleAnimationEnd: AnimationEventHandler<HTMLDivElement> = (e) => {
        const animationElement = e.target;
        currentAnimations.current = currentAnimations.current.filter(
            (element) => element !== animationElement,
        );

        if (clickedGreetingButton && currentAnimations.current.length === 0) {
            const next = stepsManager['Greeting'].next;
            if (!next) return;
            setStep(next());
        }
    };

    return (
        <div
            className={clsx(styles.layout, { [styles.hiddenLayout]: clickedGreetingButton })}
            onAnimationStart={handleAnimationStart}
            onAnimationEnd={handleAnimationEnd}
        >
            <GreetingHero />
            <GreetingButton onClick={handleClickGreetingButton} />
            <GreetingFooter />
        </div>
    );
};

interface GreetingButtonProps {
    onClick: () => void;
}

const GreetingButton: FC<GreetingButtonProps> = memo(({ onClick }) => {
    return (
        <button type="button" className={styles.cta} onClick={onClick}>
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
