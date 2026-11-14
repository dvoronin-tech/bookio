import { type FC, memo } from 'react';
import CheckIcon from '#/assets/icons/check.svg?react';
import styles from './SuccessLayout.module.scss';
import { m } from '#/i18n/messages';

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
            <h1 className={styles.title}>{m.success_title()}</h1>
            <p className={styles.description}>{m.success_description()}</p>
        </div>
    );
});

const SuccessButton: FC = memo(() => {
    const handleDone = () => {
        window.close();
    };

    return (
        <button type="button" className={styles.cta} onClick={handleDone}>
            {m.done()}
        </button>
    );
});

const SuccessFooter: FC = memo(() => {
    return (
        <div className={styles.credit}>
            <span className={styles.creditMark} aria-hidden>
                B
            </span>
            <span className={styles.creditText}>{m.powered_by()}</span>
        </div>
    );
});
