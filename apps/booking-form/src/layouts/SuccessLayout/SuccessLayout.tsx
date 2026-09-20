import { type FC, memo } from 'react';
import CheckIcon from '#/assets/icons/check.svg?react';
import styles from './SuccessLayout.module.scss';

export const SuccessLayout: FC = () => {
    return (
        <div className={styles.layout}>
            <SuccessHero />
            <SuccessButton />
            <SuccessFooter />
        </div>
    );
};

const SuccessHero: FC = memo(() => {
    return (
        <div className={styles.hero}>
            <span className={styles.check} aria-hidden>
                <CheckIcon className={styles.checkIcon} />
            </span>
            <h1 className={styles.title}>You're booked</h1>
            <p className={styles.description}>
                Your booking has been submitted successfully. You may close this
                page via "Done" button. If additional information is needed, you
                will be contacted.
            </p>
        </div>
    );
});

const SuccessButton: FC = memo(() => {
    const handleDone = () => {
        window.close();
    };

    return (
        <button type="button" className={styles.cta} onClick={handleDone}>
            Done
        </button>
    );
});

const SuccessFooter: FC = memo(() => {
    return (
        <div className={styles.credit}>
            <span className={styles.creditMark} aria-hidden>
                B
            </span>
            <span className={styles.creditText}>Powered by Bookio</span>
        </div>
    );
});
